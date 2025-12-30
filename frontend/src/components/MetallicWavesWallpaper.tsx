import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * MetallicWavesWallpaper - 3D Metallic flowing waves background
 * Uses Three.js with custom shaders for smooth metallic wave effect
 */
export default function MetallicWavesWallpaper() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Geometry - High density for smooth waves
        const geometry = new THREE.PlaneGeometry(15, 10, 128, 128);

        // Shader Material for the metallic/dark look
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x111111) },
                uLightColor: { value: new THREE.Color(0x334455) }
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    vUv = uv;
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    
                    // Create complex wave pattern
                    float elevation = sin(modelPosition.x * 0.5 + modelPosition.y * 0.3 + uTime * 0.8) * 0.4;
                    elevation += sin(modelPosition.x * 1.2 - modelPosition.y * 0.8 + uTime * 1.2) * 0.15;
                    elevation += cos(modelPosition.y * 2.0 + uTime) * 0.1;

                    modelPosition.z += elevation;
                    vElevation = elevation;

                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    gl_Position = projectedPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                uniform vec3 uLightColor;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    float mixStrength = (vElevation + 0.5) * 0.8;
                    float shine = step(0.98, sin(vUv.x * 2.0 + vUv.y * 2.0 - uTime * 0.5));
                    
                    vec3 color = mix(uColor, uLightColor, mixStrength);
                    color += shine * 0.05;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 4;
        scene.add(plane);

        // Mouse movement handler
        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        };

        // Resize handler
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        // Animation loop
        const animate = () => {
            const time = performance.now() * 0.001;
            material.uniforms.uTime.value = time;

            // Subtle parallax effect based on mouse
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            plane.rotation.z = targetX * 0.1;
            plane.rotation.x = -Math.PI / 4 + (targetY * 0.1);

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', onResize);
        document.addEventListener('mousemove', onMouseMove);

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationRef.current);

            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0"
            style={{ backgroundColor: '#050505' }}
        />
    );
}
