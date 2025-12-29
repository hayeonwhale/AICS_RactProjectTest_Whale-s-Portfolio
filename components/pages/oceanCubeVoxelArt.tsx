import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 추가됨
import BackButton from '../BackButton';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Types ---
interface Animatable {
  mesh: THREE.Group | THREE.Mesh;
  type: 'float' | 'swim' | 'hover';
  speed: number;
  dist: number;
  offset: number;
}

// --- Configuration (Palette) ---
const PALETTE = {
  bg: 0x78D6F0,
  water: 0x8FD3FE,
  sand: 0xDBC393,
  sandDark: 0xC4AB7E,
  blueBlock: 0x3355D0,
  blueBlockLight: 0x4B6FE3,
  spongePurple: 0xA864D8,
  spongePink: 0xE87EA1,
  spongeDark: 0x8040A0,
  seagrass: 0x2E8B57,
  coralPink: 0xDB7093,
  dolphin: 0xDAE3E8,
  fishYellow: 0xE6C045,
  fishBlue: 0x488BD4,
  axolotlPink: 0xE68AFF,
  axolotlBlue: 0x55AADD
};

const VoxelOceanScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 추가됨

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene & Camera Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.bg);
    scene.fog = new THREE.Fog(PALETTE.bg, 20, 60);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 카메라 위치 조정
    camera.position.set(24, 22, 24);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clean and append
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 10;
    controls.maxDistance = 60;

    // 컨트롤 타겟 조정
    controls.target.set(0, 8, 0);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 25, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(dirLight);

    // --- 3. Helpers & Materials ---
    const matCache: { [key: string]: THREE.MeshLambertMaterial } = {};

    const getMat = (color: number, transparent = false, opacity = 1.0) => {
      const key = `${color}-${opacity}`;
      if (!matCache[key]) {
        matCache[key] = new THREE.MeshLambertMaterial({
          color: color,
          transparent: transparent,
          opacity: opacity
        });
      }
      return matCache[key];
    };

    const createVoxel = (
      color: number,
      x: number, y: number, z: number,
      sx = 1, sy = 1, sz = 1,
      parent: THREE.Object3D = scene
    ) => {
      const geo = new THREE.BoxGeometry(sx, sy, sz);
      const mesh = new THREE.Mesh(geo, getMat(color));
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // --- 4. Building the World ---
    const world = new THREE.Group();
    scene.add(world);

    // [Sand Base]
    const sandGroup = new THREE.Group();
    world.add(sandGroup);
    createVoxel(PALETTE.sand, 0, -1, 0, 14, 2, 14, sandGroup);
    createVoxel(PALETTE.sand, -3.5, 0.5, -3.5, 7, 1, 7, sandGroup);

    // Sand speckles
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() * 12) - 6;
      const z = (Math.random() * 12) - 6;
      const y = (x < 0 && z < 0) ? 1.05 : 0.05;
      createVoxel(PALETTE.sandDark, x, y, z, 0.2, 0.1, 0.2, sandGroup);
    }

    // [Big Blue Block]
    const blueBlock = new THREE.Group();
    blueBlock.position.set(-3, 3.5, -3);
    world.add(blueBlock);
    createVoxel(PALETTE.blueBlock, 0, 0, 0, 5, 5, 5, blueBlock);
    createVoxel(PALETTE.blueBlockLight, 2, 1, 1, 1, 1, 0.5, blueBlock);
    createVoxel(PALETTE.blueBlockLight, -1, 2, 2.6, 1, 1, 0.2, blueBlock);

    // [Purple Sponge Tower]
    const spongeGroup = new THREE.Group();
    spongeGroup.position.set(4, 0, -1);
    world.add(spongeGroup);
    const spongeBottom = createVoxel(PALETTE.spongePink, 0, 3, 2, 3, 6, 3, spongeGroup);
    const spongeTop = createVoxel(PALETTE.spongePurple, 0, 7.5, -1, 3, 3, 3, spongeGroup);

    const addPores = (parentMesh: THREE.Mesh, color: number, count: number) => {
      const tempGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);
      const tempMat = getMat(color);
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(tempGeo, tempMat);
        mesh.position.set((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, 1.51);
        parentMesh.add(mesh);
        const meshSide = mesh.clone();
        meshSide.rotation.y = Math.PI / 2;
        meshSide.position.set(1.51, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5);
        parentMesh.add(meshSide);
      }
    };
    addPores(spongeBottom, 0xC75E81, 6);
    addPores(spongeTop, 0x8040A0, 4);

    // [Vegetation]
    const seaGrasses: THREE.Group[] = [];
    const createSeagrass = (x: number, z: number, h: number, color: number) => {
      const grass = new THREE.Group();
      grass.position.set(x, 0, z);
      grass.userData = { offset: Math.random() * 10, speed: 1 + Math.random() };
      for (let i = 0; i < 3; i++) {
        const bladeH = h * (0.8 + Math.random() * 0.4);
        createVoxel(color, (i * 0.2) - 0.2, bladeH / 2, 0, 0.1, bladeH, 0.1, grass);
      }
      world.add(grass);
      return grass;
    };

    for (let i = 0; i < 8; i++) {
      const x = -2 + Math.random() * 2;
      const z = 2 + Math.random() * 2;
      seaGrasses.push(createSeagrass(x, z, 3 + Math.random() * 2, PALETTE.seagrass));
    }
    for (let i = 0; i < 5; i++) {
      const x = 2 + Math.random() * 1.5;
      const z = 2 + Math.random() * 1.5;
      seaGrasses.push(createSeagrass(x, z, 2 + Math.random(), PALETTE.seagrass));
    }

    // Coral
    const coral = new THREE.Group();
    coral.position.set(-1.5, 6, -1.5);
    world.add(coral);
    createVoxel(PALETTE.coralPink, 0, 0, 0, 1.5, 0.5, 1.5, coral);
    const coralMat = getMat(PALETTE.coralPink);
    const coralGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    for (let i = 0; i < 8; i++) {
      const branch = new THREE.Mesh(coralGeo, coralMat);
      branch.position.set((Math.random() - 0.5), 0.6, (Math.random() - 0.5));
      branch.rotation.x = (Math.random() - 0.5);
      branch.rotation.z = (Math.random() - 0.5);
      coral.add(branch);
    }

    // Sea Pickles
    const pickles = new THREE.Group();
    pickles.position.set(0, 0, 4);
    world.add(pickles);
    createVoxel(0x8FBC8F, 0, 0.4, 0, 0.5, 0.8, 0.5, pickles);
    createVoxel(0x8FBC8F, 0.6, 0.3, 0.2, 0.5, 0.6, 0.5, pickles);
    createVoxel(0x8FBC8F, -0.5, 0.3, 0.2, 0.5, 0.6, 0.5, pickles);

    // [Creatures]
    const animatables: Animatable[] = [];

    // Dolphin
    const dolphinGroup = new THREE.Group();
    dolphinGroup.position.set(0, 10, -2);
    dolphinGroup.rotation.z = -Math.PI / 8;
    dolphinGroup.rotation.y = -Math.PI / 8;
    world.add(dolphinGroup);

    createVoxel(PALETTE.dolphin, 0, 0, 0, 4, 1.8, 1.8, dolphinGroup);
    createVoxel(PALETTE.dolphin, -2.2, -0.2, 0, 0.8, 0.8, 1, dolphinGroup);
    createVoxel(PALETTE.dolphin, 2.2, 0, 0, 1.5, 1.2, 1.2, dolphinGroup);
    createVoxel(PALETTE.dolphin, 3.2, 0, 0, 0.5, 0.2, 2.5, dolphinGroup);
    const dorsal = createVoxel(PALETTE.dolphin, -0.5, 1, 0, 1, 1, 0.2, dolphinGroup);
    dorsal.rotation.z = -0.5;
    const finL = createVoxel(PALETTE.dolphin, -1, -0.5, 1, 1, 0.2, 0.8, dolphinGroup);
    finL.rotation.x = 0.5; finL.rotation.z = 0.5;
    const finR = createVoxel(PALETTE.dolphin, -1, -0.5, -1, 1, 0.2, 0.8, dolphinGroup);
    finR.rotation.x = -0.5; finR.rotation.z = 0.5;
    createVoxel(0x000000, -1.8, -0.2, 0.91, 0.1, 0.2, 0.1, dolphinGroup); // Eyes
    createVoxel(0x000000, -1.8, -0.2, -0.91, 0.1, 0.2, 0.1, dolphinGroup);

    animatables.push({ mesh: dolphinGroup, type: 'float', speed: 1, dist: 0.5, offset: 0 });

    // Fish
    const createFish = (x: number, y: number, z: number, scale = 1) => {
      const fish = new THREE.Group();
      fish.position.set(x, y, z);
      fish.scale.set(scale, scale, scale);
      createVoxel(PALETTE.fishYellow, 0, 0, 0, 1.2, 0.8, 0.4, fish);
      createVoxel(PALETTE.fishBlue, -0.2, 0, 0.01, 0.2, 0.82, 0.42, fish);
      createVoxel(PALETTE.fishBlue, 0.3, 0, 0.01, 0.2, 0.82, 0.42, fish);
      createVoxel(PALETTE.fishYellow, 0.8, 0, 0, 0.4, 0.6, 0.1, fish);
      createVoxel(0x000000, -0.4, 0.1, 0.21, 0.1, 0.1, 0.1, fish);
      createVoxel(0x000000, -0.4, 0.1, -0.21, 0.1, 0.1, 0.1, fish);
      world.add(fish);
      animatables.push({ mesh: fish, type: 'swim', speed: 2 + Math.random(), dist: 0.2, offset: Math.random() * 10 });
    };
    createFish(2, 4, 3, 1);
    createFish(-1, 3, 4, 0.8);
    createFish(3, 2, 2, 0.7);

    // Tiny Fish
    const createTinyFish = (x: number, y: number, z: number) => {
      const f = new THREE.Group();
      f.position.set(x, y, z);
      createVoxel(0x7CFC00, 0, 0, 0, 0.4, 0.4, 0.4, f);
      createVoxel(0x32CD32, 0.3, 0, 0, 0.2, 0.2, 0.1, f);
      createVoxel(0x000000, -0.1, 0.1, 0.21, 0.1, 0.1, 0.1, f);
      world.add(f);
      animatables.push({ mesh: f, type: 'swim', speed: 4, dist: 0.1, offset: Math.random() * 10 });
    };
    createTinyFish(-1.5, 4.5, -2);
    createTinyFish(0.5, 1.5, 4);

    // Axolotl
    const axolotl = new THREE.Group();
    axolotl.position.set(3, 0.5, 4);
    world.add(axolotl);
    createVoxel(PALETTE.axolotlPink, 0, 0, 0, 1.2, 0.5, 0.5, axolotl);
    createVoxel(PALETTE.axolotlPink, -0.8, 0.1, 0, 0.6, 0.6, 0.7, axolotl);
    createVoxel(PALETTE.axolotlBlue, -0.8, 0.1, 0.4, 0.1, 0.3, 0.2, axolotl);
    createVoxel(PALETTE.axolotlBlue, -0.8, 0.1, -0.4, 0.1, 0.3, 0.2, axolotl);
    createVoxel(PALETTE.axolotlBlue, 0.8, 0, 0, 0.6, 0.3, 0.1, axolotl);
    createVoxel(0x000000, -1.11, 0.2, 0.15, 0.05, 0.1, 0.1, axolotl);
    createVoxel(0x000000, -1.11, 0.2, -0.15, 0.05, 0.1, 0.1, axolotl);
    animatables.push({ mesh: axolotl, type: 'hover', speed: 2, dist: 0.05, offset: 0 });

    // [Water Volume]
    const waterGeo = new THREE.BoxGeometry(14, 14, 14);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: PALETTE.water,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.1,
      side: THREE.DoubleSide
    });
    const waterVolume = new THREE.Mesh(waterGeo, waterMat);
    waterVolume.position.set(0, 5, 0);
    world.add(waterVolume);

    // --- 5. Animation Loop ---
    const clock = new THREE.Clock();
    setLoading(false);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Animate Seagrass
      seaGrasses.forEach(grass => {
        const sway = Math.sin(time * grass.userData.speed + grass.userData.offset) * 0.05;
        grass.rotation.z = sway;
        grass.rotation.x = sway * 0.5;
      });

      // Animate Mobs
      animatables.forEach(obj => {
        if (obj.type === 'float') {
          obj.mesh.position.y = 10 + Math.sin(time * obj.speed) * obj.dist;
          obj.mesh.rotation.z = -Math.PI / 8 + Math.cos(time * obj.speed) * 0.05;
        } else if (obj.type === 'swim') {
          obj.mesh.position.y = obj.mesh.position.y + Math.sin(time * obj.speed + obj.offset) * 0.002;
          obj.mesh.position.x += Math.sin(time * 0.5 + obj.offset) * 0.005;
        } else if (obj.type === 'hover') {
          obj.mesh.position.y = 0.5 + Math.sin(time * obj.speed) * obj.dist;
        }
      });

      // Gentle world rotation
      world.rotation.y = Math.sin(time * 0.1) * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      renderer.dispose();
    };

  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#78D6F0' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'sans-serif',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Loading Voxel World...
        </div>
      )}

      {/* 🔙 뒤로가기 버튼 */}
      {/* 🔙 뒤로가기 버튼 */}
      <BackButton />

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default VoxelOceanScene;