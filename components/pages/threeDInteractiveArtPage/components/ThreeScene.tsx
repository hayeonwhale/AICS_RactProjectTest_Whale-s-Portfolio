import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// 둥둥 떠다니며 회전하는 도형 컴포넌트
function SpinningShape(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 부드러운 회전 애니메이션
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.3 : 1}
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* 디테일한 토러스 매듭 기하학 */}
        <torusKnotGeometry args={[0.5, 0.18, 128, 32]} />
        
        {/* 파스텔톤 재질 설정 */}
        <meshPhysicalMaterial 
          color={hovered ? '#fda4af' : '#a5b4fc'} // 호버 시 로즈 핑크, 평소엔 연보라
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </mesh>
    </Float>
  );
}

const ThreeScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      {/* HTML 배경이 보이도록 alpha: true 설정 */}
      <Canvas shadows gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

        {/* 부드럽고 따뜻한 조명 */}
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1.2} 
          color="#fff1f2" 
          castShadow 
        />
        <pointLight position={[-10, -5, -10]} intensity={0.8} color="#e0f2fe" />

        <Environment preset="city" />

        {/* 도형 그룹 */}
        <group position={[0, 0, 0]}>
            <SpinningShape position={[-1.8, 0, 0]} />
            <SpinningShape position={[1.8, 0, 0]} />
        </group>

        {/* 바닥 그림자 */}
        <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.3} 
            scale={12} 
            blur={2} 
            far={4} 
            color="#888888"
        />

        <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;