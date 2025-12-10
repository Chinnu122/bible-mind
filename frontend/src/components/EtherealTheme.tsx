import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AuroraMesh() {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.z = time * 0.05;
            mesh.current.rotation.y = Math.sin(time * 0.1) * 0.2;
        }
    });

    return (
        <mesh ref={mesh} position={[0, 0, -5]} scale={[2, 2, 2]}>
            <planeGeometry args={[20, 20, 64, 64]} />
            <shaderMaterial
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                uniforms={{
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color('#4f46e5') }, // Indigo
                    uColor2: { value: new THREE.Color('#06b6d4') }, // Cyan
                    uColor3: { value: new THREE.Color('#ec4899') }, // Pink
                }}
                vertexShader={`
            varying vec2 vUv;
            varying float vElevation;
            uniform float uTime;

            void main() {
                vUv = uv;
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                float elevation = sin(modelPosition.x * 0.5 + uTime * 0.2) * 
                                  sin(modelPosition.y * 0.3 + uTime * 0.1) * 1.5;
                
                modelPosition.z += elevation;
                vElevation = elevation;

                gl_Position = projectionMatrix * viewMatrix * modelPosition;
            }
        `}
                fragmentShader={`
            varying vec2 vUv;
            varying float vElevation;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;

            void main() {
                vec3 color = mix(uColor1, uColor2, vUv.x + vElevation * 0.2);
                color = mix(color, uColor3, vUv.y);
                
                float alpha = smoothstep(0.0, 0.5, abs(vElevation));
                
                gl_FragColor = vec4(color, 0.4);
            }
        `}
            />
        </mesh>
    );
}

// Updating the shader uniforms with time
function Scene() {
    useFrame(() => {
        // Shader updates handled inside AuroraMesh
    });
    return <AuroraMesh />;
}

export default function EtherealTheme() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black z-0" />
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Scene />
                <ambientLight intensity={0.5} />
                {/* Floating particles to add depth */}
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            </Canvas>
        </div>
    );
}
