
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import SilverSaturn from './components/GoldenSaturn';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-[#000000] relative overflow-hidden">
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-10 left-10 z-[60] w-14 h-14 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Back to home"
      >
        <svg 
          className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      {/* 3D Scene */}
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={40} />
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={15} 
          autoRotate 
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
        
        <color attach="background" args={['#000000']} />
        
        <React.Suspense fallback={null}>
          <Environment preset="night" />
          <SilverSaturn />
        </React.Suspense>
      </Canvas>

      {/* Minimal Overlay */}
      <Overlay />

      {/* Cosmic Ambiance - Neutral White/Grey Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      </div>
    </div>
  );
};

export default App;
