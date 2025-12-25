// import React, { useRef, useState } from 'react';
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
// import * as THREE from 'three';

// // 둥둥 떠다니며 회전하는 도형 컴포넌트
// function SpinningShape(props: ThreeElements['mesh']) {
//   const meshRef = useRef<THREE.Mesh>(null!);
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       // 부드러운 회전 애니메이션
//       meshRef.current.rotation.x += delta * 0.4;
//       meshRef.current.rotation.y += delta * 0.3;
//     }
//   });

//   return (
//     <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
//       <mesh
//         {...props}
//         ref={meshRef}
//         scale={active ? 1.3 : 1}
//         onClick={(e) => {
//           e.stopPropagation();
//           setActive(!active);
//         }}
//         onPointerOver={(e) => {
//           e.stopPropagation();
//           setHover(true);
//           document.body.style.cursor = 'pointer';
//         }}
//         onPointerOut={(e) => {
//           setHover(false);
//           document.body.style.cursor = 'auto';
//         }}
//       >
//         {/* 디테일한 토러스 매듭 기하학 */}
//         <torusKnotGeometry args={[0.5, 0.18, 128, 32]} />
        
//         {/* 파스텔톤 재질 설정 */}
//         <meshPhysicalMaterial 
//           color={hovered ? '#fda4af' : '#a5b4fc'} // 호버 시 로즈 핑크, 평소엔 연보라
//           roughness={0.2}
//           metalness={0.1}
//           clearcoat={0.8}
//           clearcoatRoughness={0.2}
//           reflectivity={0.5}
//         />
//       </mesh>
//     </Float>
//   );
// }

// const ThreeScene: React.FC = () => {
//   return (
//     // 부모 div가 flex-grow로 크기를 잡고 있으므로, 여기서는 w-full h-full로 꽉 채웁니다.
//     <div className="w-full h-full">
//       {/* HTML 배경이 보이도록 alpha: true 설정 */}
//       <Canvas shadows gl={{ alpha: true }}>
//         <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

//         {/* 부드럽고 따뜻한 조명 */}
//         <ambientLight intensity={1.5} />
//         <spotLight 
//           position={[10, 10, 10]} 
//           angle={0.3} 
//           penumbra={1} 
//           intensity={1.2} 
//           color="#fff1f2" 
//           castShadow 
//         />
//         <pointLight position={[-10, -5, -10]} intensity={0.8} color="#e0f2fe" />

//         <Environment preset="city" />

//         {/* 도형 그룹 */}
//         <group position={[0, 0, 0]}>
//             <SpinningShape position={[-1.8, 0, 0]} />
//             <SpinningShape position={[1.8, 0, 0]} />
//         </group>

//         {/* 바닥 그림자 */}
//         <ContactShadows 
//             position={[0, -2, 0]} 
//             opacity={0.3} 
//             scale={12} 
//             blur={2} 
//             far={4} 
//             color="#888888"
//         />

//         <OrbitControls 
//             enablePan={false} 
//             minPolarAngle={Math.PI / 4} 
//             maxPolarAngle={Math.PI / 1.5}
//             enableZoom={true}
//             minDistance={3}
//             maxDistance={10}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default ThreeScene;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 components 폴더 안에 ThreeScene.tsx 파일이 꼭 있어야 합니다!
import ThreeScene from './components/ThreeScene'; 

const ThreeDInteractiveArt: React.FC = () => {
  const navigate = useNavigate();

  // 페이지 진입 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full h-screen pt-20 bg-gradient-to-br from-rose-50 via-white to-blue-50 text-slate-700 overflow-hidden flex flex-col">
      
      {/* 🔙 뒤로가기 버튼 */}
      <button 
          onClick={() => navigate('/')}
          className="fixed bottom-10 left-10 w-14 h-14 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-2xl z-[9999] text-slate-600 hover:text-black hover:scale-110 transition-all cursor-pointer"
          aria-label="Back to home"
      >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
      </button>

      {/* 👇 [수정됨] mt-16 -> mt-40 으로 변경하여 텍스트를 훨씬 더 아래로 내렸습니다 */}
      <header className="absolute top-0 left-0 w-full p-8 mt-40 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-3">
          <h1 className="text-5xl tracking-tight text-slate-800 drop-shadow-sm font-serif italic">
            Dreamy Shapes
          </h1>
        </div>
      </header>

      {/* Main 3D Canvas Area */}
      <main className="flex-grow w-full h-full relative z-0">
        <ThreeScene />
      </main>

      {/* Instructions Overlay */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/60 backdrop-blur-md border border-white/60 px-6 py-3 rounded-2xl shadow-lg shadow-slate-200/50">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Click to expand • Hover to interact • Drag to rotate
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDInteractiveArt;