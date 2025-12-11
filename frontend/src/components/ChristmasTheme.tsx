import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SnowParticles({ count = 2500 }) {
    const mesh = useRef<THREE.Points>(null!);

    // Generate particles with position, velocity, and size
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 30; // Depth
            const speed = 0.04 + Math.random() * 0.08;
            const size = 0.1 + Math.random() * 0.3;
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

        // Gentle Christmas wind effect
        const windX = Math.sin(time * 0.3) * 0.03 + 0.01;
        const windZ = Math.cos(time * 0.2) * 0.01;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update Y (falling)
            positions[i3 + 1] -= particles[i].speed;

            // Apply wind with gentle sway
            positions[i3] += windX + (Math.sin(time + particles[i].windOffset * 10) * 0.008);
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
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.25}
                color="#ffffff"
                transparent
                opacity={0.9}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

// Christmas lights effect
function ChristmasLights({ count = 100 }) {
    const mesh = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40 + 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
        }
        return pos;
    }, [count]);

    const colors = useMemo(() => {
        const col = new Float32Array(count * 3);
        const christmasColors = [
            [1, 0, 0],       // Red
            [0, 1, 0],       // Green
            [1, 0.84, 0],    // Gold
            [1, 1, 1],       // White
            [0, 0.5, 1],     // Blue
        ];
        for (let i = 0; i < count; i++) {
            const c = christmasColors[Math.floor(Math.random() * christmasColors.length)];
            col[i * 3] = c[0];
            col[i * 3 + 1] = c[1];
            col[i * 3 + 2] = c[2];
        }
        return col;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Twinkling effect
        if (mesh.current) {
            (mesh.current.material as THREE.PointsMaterial).opacity = 0.5 + Math.sin(time * 3) * 0.3;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

export default function ChristmasTheme() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Dark Christmas gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#112240] to-[#0d1a2d]" />

            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.1)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(22,163,74,0.1)_0%,transparent_50%)]" />

            {/* 3D Snow and Lights */}
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <fog attach="fog" args={['#0d1a2d', 10, 50]} />
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} color="#ff4444" intensity={0.5} />
                <pointLight position={[-10, -10, 10]} color="#44ff44" intensity={0.5} />
                <SnowParticles count={3000} />
                <ChristmasLights count={150} />
            </Canvas>

            {/* Christmas decorative elements */}
            <div className="absolute top-4 left-4 text-4xl opacity-20 animate-pulse">🎄</div>
            <div className="absolute top-4 right-4 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>🎁</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>🔔</div>
        </div>
    );
}
