import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function RotatingScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.05; // Slow rotation
            groupRef.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

            {/* Golden Nebula */}
            <Cloud
                opacity={0.3}
                speed={0.2}
                width={20}
                depth={1.5}
                segments={20}
                position={[10, 0, -20]}
                color="#ffd700"
            />
            {/* Deep Blue/Purple Ambience */}
            <Cloud
                opacity={0.3}
                speed={0.2}
                width={20}
                depth={1.5}
                segments={20}
                position={[-10, 5, -25]}
                color="#1a1a2e"
            />

            <Sparkles count={300} scale={25} size={3} speed={0.4} opacity={0.5} />
        </group>
    );
}

export default function StarfieldBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
                <RotatingScene />
            </Canvas>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
    );
}
