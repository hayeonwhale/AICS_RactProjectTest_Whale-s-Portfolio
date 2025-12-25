
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, OrbitControls } from '@react-three/drei';

// --- GLSL 쉐이더 코드 (빗방울 효과의 핵심) ---

// 1. Vertex Shader: 평면의 기본 위치와 UV 좌표를 계산
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 2. Fragment Shader: 빗방울을 그리고 배경을 왜곡시킴
const fragmentShader = `
  uniform float uTime;
  uniform sampler2D uEnvMap; 
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uClick; // 클릭 강도 (0.0 ~ 1.0)
  varying vec2 vUv;

  // --- Noise functions ---
  vec3 N13(float p) {
     vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
     p3 += dot(p3, p3.yzx + 19.19);
     return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
  }
  float N(float t) { return fract(sin(t*12345.564)*7658.76); }
  float Saw(float b, float t) { return smoothstep(0., b, t)*smoothstep(1., b, t); }

  // --- Rain Drops function ---
  vec2 DropLayer2(vec2 uv, float t, vec2 m, float click) {
      vec2 UV = uv;
      
      // 마우스와의 거리 계산 (비율 보정)
      float dist = distance(uv, m);
      // 클릭 시 해당 영역의 시간(흐름)을 가속시킴
      float localT = t + (click * 5.0 * smoothstep(0.3, 0.0, dist));
      
      uv.y += localT * 0.75;
      
      vec2 a = vec2(4., 2.); 
      vec2 grid = a * 1.8; 
      vec2 id = floor(uv*grid);
      
      float colShift = N(id.x); 
      uv.y += colShift;
      
      id = floor(uv*grid);
      vec3 n = N13(id.x*35.2+id.y*2376.1);
      vec2 st = fract(uv*grid)-vec2(.5, 0);
      
      float x = n.x-.5;
      float y = UV.y*20.;
      float wiggle = sin(y+sin(y));
      x += wiggle*(.5-abs(x))*(n.z-.5);
      x *= .7;
      float ti = fract(localT + n.z);
      y = (Saw(.85, ti)-.5)*.9+.5;
      vec2 p = vec2(x, y);
      
      float d = length((st-p)*a.yx);
      float mainDrop = smoothstep(.4, .0, d);
      
      // 물방울 생성 확률
      mainDrop *= smoothstep(0.3, 0.4, n.y);
      
      float r = sqrt(smoothstep(1., y, st.y));
      float cd = abs(st.x-x);
      float trail = smoothstep(.23*r, .15*r*r, cd);
      float trailFront = smoothstep(-.02, .02, st.y-y);
      trail *= trailFront*r*r;
      
      y = UV.y;
      float trail2 = smoothstep(.2*r, .0, cd);
      float droplet = max(0., (sin(y*(1.-y)*120.)-st.y)*trail2*trailFront*n.z);
      y = fract(y*10.)+(st.y-.5);
      float dd = length(st-vec2(x, y));
      droplet = smoothstep(.3, .0, dd);
      float mDrop = mainDrop+droplet*r*trailFront;
      
      return vec2(mDrop, trail);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;
    
    // 마우스 좌표 비율 보정
    vec2 m = uMouse;
    m.x *= aspect;
    
    float t = uTime * 0.12; 

    // 빗방울 레이어 (마우스 및 클릭 변수 전달)
    vec2 drops = DropLayer2(uv, t, m, uClick);
    drops += DropLayer2(uv*1.35+1.54, t, m, uClick);
    
    float rainAmount = drops.x; 

    // 굴절 효과
    vec2 normal = vec2(dFdx(rainAmount), dFdy(rainAmount));
    vec2 distortion = normal * 3.0; 
    
    vec4 bgColor = texture2D(uEnvMap, vUv + distortion);
    
    // 최종 색상에 약간의 클릭 하이라이트 추가
    float clickCircle = smoothstep(0.05, 0.0, distance(uv, m)) * uClick;
    gl_FragColor = bgColor + vec4(rainAmount * 0.1) + vec4(clickCircle * 0.05);
  }
`;

const RainPlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, scene, viewport } = useThree();
  const [isClicking, setIsClicking] = useState(false);
  const clickIntensity = useRef(0);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uEnvMap: { value: null as THREE.Texture | null }, 
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uClick: { value: 0.0 }
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uResolution.value.set(state.size.width, state.size.height);
      
      // 마우스 위치 업데이트 (0~1 범위로 변환)
      material.uniforms.uMouse.value.set(
        (state.pointer.x + 1) / 2,
        (state.pointer.y + 1) / 2
      );

      // 클릭 강도 애니메이션 (부드럽게 lerp)
      const targetIntensity = isClicking ? 1.0 : 0.0;
      clickIntensity.current = THREE.MathUtils.lerp(clickIntensity.current, targetIntensity, 0.1);
      material.uniforms.uClick.value = clickIntensity.current;
      
      if (scene.environment && material.uniforms.uEnvMap.value !== scene.environment) {
         material.uniforms.uEnvMap.value = scene.environment;
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      scale={[viewport.width, viewport.height, 1]}
      onPointerDown={() => setIsClicking(true)}
      onPointerUp={() => setIsClicking(false)}
      onPointerLeave={() => setIsClicking(false)}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

const RainyWindowPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <RainPlane />
        <Environment preset="city" background blur={1} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2 - 0.05} 
          maxPolarAngle={Math.PI / 2 + 0.05}
          minAzimuthAngle={-0.05}
          maxAzimuthAngle={0.05}
        />
      </Canvas>

      <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: 'rgba(255,255,255,0.8)', fontFamily: 'serif', textAlign: 'center', pointerEvents: 'none',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)', mixBlendMode: 'overlay'
      }}>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'normal' }}>Rainy Day</h1>
          <p style={{ letterSpacing: '0.2em', marginTop: '10px' }}>Seoul, 24°C</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '20px' }}>Click to speed up the rain</p>
      </div>
    </div>
  );
};

export default RainyWindowPage;
