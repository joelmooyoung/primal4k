import { Canvas } from '@react-three/fiber';
import { Text3D, Center, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PrimalText3DProps {
  size?: 'large' | 'small';
  animate?: boolean;
}

const AnimatedText = ({ size, animate }: { size: 'large' | 'small'; animate: boolean }) => {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (textRef.current && animate) {
      textRef.current.rotation.y += delta * 0.2;
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const fontSize = size === 'large' ? 1 : 0.3;
  
  return (
    <Center>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={fontSize}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        PRIMAL
        <meshStandardMaterial 
          attach="material" 
          color="#FFFF00"
          emissive="#228B22"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Text3D>
    </Center>
  );
};

const PrimalText3D = ({ size = 'large', animate = true }: PrimalText3DProps) => {
  const height = size === 'large' ? '150px' : '60px';
  
  return (
    <div style={{ height, width: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, size === 'large' ? 5 : 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, 5]} intensity={0.5} />
        <AnimatedText size={size} animate={animate} />
        {!animate && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
    </div>
  );
};

export default PrimalText3D;