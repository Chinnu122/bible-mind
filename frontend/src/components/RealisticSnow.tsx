import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SnowParticles({ count = 2000 }) {
    const mesh = useRef<THREE.Points>(null!);

    // Generate particles with position, velocity, and size
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 30; // Depth
            const speed = 0.05 + Math.random() * 0.1;
            const size = 0.1 + Math.random() * 0.2;
            const windOffset = Math.random();
            temp.push({ x, y, z, speed, size, windOffset });
        }
        return temp;
    }, [count]);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        particles.forEach((p, i) => {
            pos[i * 3] = p.x;
            pos[i * 3 + 1] = p.y;
            pos[i * 3 + 2] = p.z;
        });
        return pos;
    }, [count, particles]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;

        // Wind effect - changes over time
        const windX = Math.sin(time * 0.5) * 0.05 + 0.02; // General rightward drift with wave
        const windZ = Math.cos(time * 0.3) * 0.02;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update Y (falling)
            positions[i3 + 1] -= particles[i].speed;

            // Apply wind
            positions[i3] += windX + (Math.sin(time + particles[i].windOffset * 10) * 0.01);
            positions[i3 + 2] += windZ;

            // Reset if below view or too far
            if (positions[i3 + 1] < -25) {
                positions[i3 + 1] = 25;
                positions[i3] = (Math.random() - 0.5) * 50;
                positions[i3 + 2] = (Math.random() - 0.5) * 30;
            }
            // Wrap X 
            if (positions[i3] > 25) positions[i3] = -25;
            if (positions[i3] < -25) positions[i3] = 25;
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

export default function RealisticSnow() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <fog attach="fog" args={['#0f172a', 10, 40]} />
                <ambientLight intensity={0.5} />
                <SnowParticles count={3000} />
            </Canvas>
        </div>
    );
}
