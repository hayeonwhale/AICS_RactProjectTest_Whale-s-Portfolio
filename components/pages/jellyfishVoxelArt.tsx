import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// -----------------------------------------------------------------------------
// [1] 설정값 및 클래스 정의 (컴포넌트 밖으로 뺐습니다 - 안전함!)
// -----------------------------------------------------------------------------
const PALETTE = {
  bg: 0x000510,
  jellyOuter: 0x00aaff,
  jellyInner: 0xccffff,
  tentacle: 0x0088cc,
  sand: 0x001122,
  sandHigh: 0x002233
};

const VOXEL_SIZE = 0.5;

// Voxel Geometry Helper
function createVoxelGeometry(voxels: { x: number, y: number, z: number }[]) {
  const geometries: THREE.BufferGeometry[] = [];
  const baseGeo = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);

  voxels.forEach(v => {
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(v.x * VOXEL_SIZE, v.y * VOXEL_SIZE, v.z * VOXEL_SIZE);
    const geom = baseGeo.clone();
    geom.applyMatrix4(matrix);
    geometries.push(geom);
  });

  if (geometries.length === 0) return baseGeo;
  return BufferGeometryUtils.mergeGeometries(geometries);
}

// 젤리피쉬 클래스 (원본 로직 그대로 유지)
class VoxelJellyfish {
  mesh: THREE.Group;
  tentacles: THREE.InstancedMesh[];
  timeOffset: number;
  radius: number;

  constructor(radius: number, tentacleLength: number) {
    this.mesh = new THREE.Group();
    this.radius = radius;
    this.timeOffset = Math.random() * 100;
    this.tentacles = [];

    // 1. Dome (Body)
    const domeVoxels = [];
    const innerVoxels = [];
    const rSq = radius * radius;
    const innerR = radius - 1;

    for (let x = -radius; x <= radius; x++) {
      for (let y = 0; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          const distSq = x * x + y * y * 2 + z * z;
          if (distSq <= rSq) {
            if (distSq > (innerR * innerR) || y === 0) {
              domeVoxels.push({ x, y, z });
            } else if (y > radius / 3 && x % 2 === 0 && z % 2 === 0) {
              innerVoxels.push({ x, y, z });
            }
          }
        }
      }
    }

    const domeGeo = createVoxelGeometry(domeVoxels);
    const innerGeo = createVoxelGeometry(innerVoxels);

    const domeMat = new THREE.MeshStandardMaterial({
      color: PALETTE.jellyOuter, roughness: 0.2, transparent: true, opacity: 0.8,
      emissive: PALETTE.jellyOuter, emissiveIntensity: 0.2
    });
    const innerMat = new THREE.MeshBasicMaterial({ color: PALETTE.jellyInner });

    this.mesh.add(new THREE.Mesh(domeGeo, domeMat));
    this.mesh.add(new THREE.Mesh(innerGeo, innerMat));

    // 2. Tentacles
    const tentacleCount = radius * 4;
    const segGeo = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
    const segMat = new THREE.MeshStandardMaterial({
      color: PALETTE.tentacle, emissive: PALETTE.tentacle, emissiveIntensity: 0.5
    });

    for (let i = 0; i < tentacleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = (radius - 1) * VOXEL_SIZE;
      const startX = Math.cos(angle) * r;
      const startZ = Math.sin(angle) * r;
      const numSegments = tentacleLength + Math.floor(Math.random() * 5);

      const tentacleMesh = new THREE.InstancedMesh(segGeo, segMat, numSegments);
      tentacleMesh.userData = {
        startX, startZ, segments: numSegments,
        noiseOffset: Math.random() * 100
      };

      const dummy = new THREE.Object3D();
      for (let j = 0; j < numSegments; j++) {
        dummy.position.set(startX, -j * VOXEL_SIZE, startZ);
        dummy.updateMatrix();
        tentacleMesh.setMatrixAt(j, dummy.matrix);
      }
      tentacleMesh.instanceMatrix.needsUpdate = true;
      this.mesh.add(tentacleMesh);
      this.tentacles.push(tentacleMesh);
    }

    // 3. Light
    const light = new THREE.PointLight(PALETTE.jellyInner, 1, 15);
    light.position.set(0, radius / 2 * VOXEL_SIZE, 0);
    this.mesh.add(light);
  }

  update(time: number) {
    const t = time + this.timeOffset;

    // 몸통 움직임
    this.mesh.position.y += Math.sin(t * 1.5) * 0.02;
    this.mesh.rotation.z = Math.sin(t * 0.5) * 0.05;
    this.mesh.rotation.x = Math.cos(t * 0.5) * 0.05;

    // 촉수 움직임
    const dummy = new THREE.Object3D();
    this.tentacles.forEach(tentacle => {
      const data = tentacle.userData;
      for (let i = 0; i < data.segments; i++) {
        const wave = Math.sin(t * 2 - (i * 0.3) + data.noiseOffset);
        const wave2 = Math.cos(t * 1.5 - (i * 0.3) + data.noiseOffset);

        const x = data.startX + (wave * i * 0.05);
        const z = data.startZ + (wave2 * i * 0.05);
        const y = -(i * VOXEL_SIZE);

        dummy.position.set(x, y, z);
        const scale = 1 - (i / data.segments) * 0.6;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        tentacle.setMatrixAt(i, dummy.matrix);
      }
      tentacle.instanceMatrix.needsUpdate = true;
    });
  }
}

// -----------------------------------------------------------------------------
// [2] React 컴포넌트 (실제 화면 출력 부분)
// -----------------------------------------------------------------------------
const VoxelJellyfishScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Init ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.bg);
    scene.fog = new THREE.FogExp2(PALETTE.bg, 0.025);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 4, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;

    // DOM에 캔버스 추가 (중요: 기존 것 싹 비우고 추가)
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // --- Post Processing ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Objects ---
    const ambientLight = new THREE.AmbientLight(0x001133, 1.5);
    scene.add(ambientLight);

    // Floor
    const floorSize = 60;
    const floorGeo = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
    const floorMat = new THREE.MeshStandardMaterial({ color: PALETTE.sand, roughness: 0.9 });
    const floorMesh = new THREE.InstancedMesh(floorGeo, floorMat, floorSize * floorSize);

    let idx = 0;
    const dummy = new THREE.Object3D();
    for (let x = -floorSize / 2; x < floorSize / 2; x++) {
      for (let z = -floorSize / 2; z < floorSize / 2; z++) {
        const h = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + Math.sin(x * 0.3 + z * 0.2);
        dummy.position.set(x * VOXEL_SIZE * 1.5, -12 + (h * VOXEL_SIZE), z * VOXEL_SIZE * 1.5);
        dummy.rotation.set(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1);
        floorMesh.setColorAt(idx, new THREE.Color(PALETTE.sand).multiplyScalar(0.5 + Math.random() * 0.5));
        dummy.updateMatrix();
        floorMesh.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = [];
    for (let i = 0; i < 1000; i++) pPos.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40);
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1, transparent: true, opacity: 0.6 }));
    scene.add(particles);

    // Jellyfish Group
    const jellies: VoxelJellyfish[] = [];
    const addJelly = (x: number, y: number, z: number, r: number, len: number, s: number) => {
      const j = new VoxelJellyfish(r, len);
      j.mesh.position.set(x, y, z);
      j.mesh.scale.set(s, s, s);
      scene.add(j.mesh);
      jellies.push(j);
    };

    addJelly(4, 2, 2, 7, 25, 1);
    addJelly(-4, 6, -5, 5, 20, 0.8);
    addJelly(-3, -3, -2, 5, 18, 0.6);
    addJelly(2, 8, -10, 4, 15, 0.5);
    addJelly(-6, 0, -8, 4, 15, 0.4);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // 업데이트 실행 (여기서 움직임 발생!)
      jellies.forEach(j => j.update(time));

      particles.rotation.y = time * 0.02;
      particles.position.y = Math.sin(time * 0.2) * 0.5;

      controls.update();
      composer.render();
    };

    animate(); // 애니메이션 시작!

    // --- Resize & Cleanup ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) mountRef.current.innerHTML = ''; // 깔끔하게 비우기
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000510' }}>
      {/* 뒤로가기 버튼 */}
      {/* 뒤로가기 버튼 */}
      <BackButton />
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default VoxelJellyfishScene;