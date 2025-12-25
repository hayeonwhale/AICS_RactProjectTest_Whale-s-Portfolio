
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A component that renders a single "Star Flare" - a glowing core with diffraction spikes.
 * Refined to look more natural with varying spike lengths and softer transparency.
 */
const StarFlare: React.FC<{ color: string; scale: number; speed: number; offset: number }> = ({ color, scale, speed, offset }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const spikesRef = useRef<THREE.Group>(null);

  // Randomize spike ratio for a more organic, lens-captured look
  const spikeRatio = useMemo(() => 0.8 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    
    // Smooth twinkling effect
    const pulse = Math.sin(t * 2.5) * 0.4 + 0.6;
    groupRef.current.scale.setScalar(scale * pulse);
    
    if (spikesRef.current) {
      // Very slow rotation for a shimmering effect
      spikesRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Glow Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Secondary Soft Halo */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Refined Diffraction Spikes */}
      <group ref={spikesRef}>
        <mesh>
          <planeGeometry args={[1.2 * spikeRatio, 0.015]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.2 / spikeRatio, 0.015]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * CosmicFireflies creates a field of wandering, twinkling star-like entities.
 * Updated to a White/Silver/Icy-Blue palette for a more natural deep-space look.
 */
const CosmicFireflies: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Natural deep-space colors: Whites, Silvers, and subtle Icy Blues/Purples
  const colors = ['#ffffff', '#e0e0e0', '#b3e5fc', '#f5f5f5', '#d1d9ff', '#ffffff'];

  const fireflies = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      color: colors[i % colors.length],
      scale: 0.05 + Math.random() * 0.35,
      speed: 0.3 + Math.random() * 1.2,
      offset: Math.random() * 1000,
      orbitRadius: 5 + Math.random() * 10,
      orbitSpeed: 0.01 + Math.random() * 0.03,
      yOffset: (Math.random() - 0.5) * 12,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  const fireflyRefs = useRef<Array<THREE.Group | null>>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    fireflies.forEach((data, i) => {
      const ref = fireflyRefs.current[i];
      if (ref) {
        const angle = t * data.orbitSpeed + data.phase;
        // Natural wandering movement
        ref.position.x = Math.cos(angle) * data.orbitRadius + Math.sin(t * 0.15 + data.offset) * 3;
        ref.position.z = Math.sin(angle) * data.orbitRadius + Math.cos(t * 0.15 + data.offset) * 3;
        ref.position.y = data.yOffset + Math.sin(t * 0.25 + data.offset) * 2;
        
        // Face the camera
        ref.quaternion.copy(state.camera.quaternion);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((data, i) => (
        <group key={i} ref={(el) => (fireflyRefs.current[i] = el)}>
          <StarFlare {...data} />
        </group>
      ))}
    </group>
  );
};

const SilverSaturn: React.FC = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.04;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y = t * 0.01;
    }
  });

  // Silver/White ring system
  const ringSystem = useMemo(() => {
    return [
      { inner: 1.4, outer: 1.8, opacity: 0.3, color: "#ffffff" },
      { inner: 1.82, outer: 2.1, opacity: 0.5, color: "#f0f0f0" },
      { inner: 2.12, outer: 2.2, opacity: 0.1, color: "#e0e0e0" },
      { inner: 2.24, outer: 2.7, opacity: 0.25, color: "#ffffff" },
    ];
  }, []);

  return (
    <group>
      {/* Dense Background Stars */}
      <Stars radius={150} depth={50} count={3000} factor={1.5} saturation={0} fade speed={0.5} />
      
      {/* Star Field Entities */}
      <CosmicFireflies count={60} />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Main Silver/White Planet */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#ffffff"
            roughness={0.05}
            metalness={0.9}
            distort={0.02}
            speed={1.2}
            emissive="#111111"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Crystalline atmospheric glow */}
        <mesh scale={[1.1, 1.1, 1.1]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Silver Rings */}
        <group ref={ringGroupRef} rotation={[Math.PI / 2.5, 0, 0]}>
          {ringSystem.map((ring, i) => (
            <mesh key={i}>
              <ringGeometry args={[ring.inner, ring.outer, 128]} />
              <meshStandardMaterial
                color={ring.color}
                transparent
                opacity={ring.opacity}
                side={THREE.DoubleSide}
                metalness={0.8}
                roughness={0.1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Lighting - Neutral White */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={1.2} color="#ffffff" />
    </group>
  );
};

export default SilverSaturn;
