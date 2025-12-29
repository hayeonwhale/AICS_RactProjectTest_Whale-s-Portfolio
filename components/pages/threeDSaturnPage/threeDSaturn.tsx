
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../BackButton';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import SilverSaturn from './components/GoldenSaturn';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-[#000000] relative overflow-hidden">
      {/* 뒤로가기 버튼 */}
      {/* 뒤로가기 버튼 */}
      <BackButton />
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
