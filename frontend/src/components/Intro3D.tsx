import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Stars, float, Sparkles, MeshDistortMaterial, MeshWobbleMaterial, Environment, CameraShake } from '@react-three/drei'
import * as THREE from 'three'
import { Group, Vector3, MathUtils } from 'three'

interface Intro3DProps {
    onComplete: () => void
}

// Cinematic Verse Sequence
// We use 'z' to position them deep in space
const VERSES = [
    { text: "IN THE BEGINNING...", sub: "(Water)", time: 0, duration: 5, z: 0, material: "water" },
    { text: "...WAS THE WORD", sub: "(Spirit)", time: 5, duration: 5, z: -20, material: "spirit" },
    { text: "AND THE WORD\nWAS GOD", sub: "(Light)", time: 10, duration: 5, z: -40, material: "gold" },
    { text: "BIBLE MIND", sub: "WISDOM & UNDERSTANDING", time: 15, duration: 5, z: -60, material: "logo" }
]

function FastCamera() {
    const { camera } = useThree()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()

        // Logic: 
        // Each verse lasts 5s.
        // 0-4s: Slow drift (Reading time).
        // 4-5s: HYPER ZOOM to next position.

        const phase = Math.floor(t / 5)
        const localT = t % 5

        // Base targets based on phase
        const targetZ = -(phase * 20) + 10 // Start 10 units in front

        let zPos = targetZ

        // Hyper Zoom effect (last 1s of each phase)
        if (localT > 4 && phase < 3) {
            const zoomT = localT - 4 // 0 to 1
            // Ease in expo
            const ease = zoomT * zoomT * zoomT * 20
            zPos -= ease
        } else {
            // Slow drift forward during reading
            zPos -= localT * 0.5
        }

        // Warp speed at end (19s+)
        if (t > 19) {
            zPos -= (t - 19) * 100
        }

        // Smooth lerp camera
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.1)

        // Action cam shake logic
        camera.position.x = Math.sin(t * 0.5) * 0.5
        camera.position.y = Math.cos(t * 0.3) * 0.5

        camera.lookAt(0, 0, targetZ - 20) // Always look ahead
    })

    return null
}

function VerseTyping({ verse, time }: { verse: any, time: number }) {
    const isVisible = time >= verse.time && time < verse.time + verse.duration
    const localTime = time - verse.time

    // Typing math
    const fullText = verse.text
    // Type entire string over 2 seconds
    const typeProgress = Math.min(localTime / 2.5, 1)
    const charCount = Math.floor(fullText.length * typeProgress)
    const displayText = fullText.slice(0, charCount)

    if (!isVisible && localTime < 5) return null // Hide if not current, but keep if passed (camera flies past it)

    return (
        <group position={[0, 0, verse.z]}>

            {/* Main Text */}
            <Text
                fontSize={verse.material === "logo" ? 3 : 1.5}
                maxWidth={10}
                lineHeight={1}
                letterSpacing={0.05}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
            >
                {displayText}

                {/* MATERIAL SWITCHING */}
                {verse.material === "water" && (
                    <MeshDistortMaterial
                        speed={3}
                        distort={0.4}
                        color="#4aa8ff"
                        roughness={0}
                        metalness={0.8}
                    />
                )}

                {verse.material === "spirit" && (
                    <MeshWobbleMaterial
                        factor={1}
                        speed={2}
                        color="#e2e8f0"
                        transparent
                        opacity={0.9}
                    />
                )}

                {(verse.material === "gold" || verse.material === "logo") && (
                    <meshStandardMaterial
                        color="#ffd700"
                        roughness={0.1}
                        metalness={1}
                        emissive="#b8860b"
                        emissiveIntensity={0.2}
                    />
                )}
            </Text>

            {/* Subtext (always full, fades in) */}
            {verse.sub && localTime > 1 && (
                <Text
                    position={[0, verse.material === "logo" ? -2.5 : -1.5, 0]}
                    fontSize={0.5}
                    color={verse.material === "gold" || verse.material === "logo" ? "#bfa37c" : "#88ccff"}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={Math.min(localTime - 1, 1)}
                >
                    {verse.sub}
                </Text>
            )}

            {/* Explosion Particles for Logo */}
            {verse.material === "logo" && localTime > 0.5 && (
                <Sparkles
                    count={200}
                    scale={15}
                    size={4}
                    speed={0.2}
                    opacity={1}
                    color="#ffd700"
                    noise={1}
                />
            )}

        </group>
    )
}

function Scene({ onComplete }: { onComplete: () => void }) {
    const [time, setTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Attempt audio
        const audio = new Audio('/intro.mp3')
        audio.volume = 0.6
        audio.play().catch(e => { })
        audioRef.current = audio
        return () => audio.pause()
    }, [])

    useFrame((state, delta) => {
        const newTime = time + delta
        setTime(newTime)
        if (newTime > 20) onComplete()
    })

    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 10, 50]} />

            <FastCamera />

            {/* Stunning Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4aa8ff" />
            <pointLight position={[-10, 0, -10]} intensity={1.5} color="#ff4d4d" />
            <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffd700" />

            {/* Realistic Reflections */}
            <Environment preset="city" />

            {/* Universe */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
            <Sparkles count={500} scale={50} size={2} opacity={0.5} speed={0.5} color="#ffffff" />

            {/* Verses */}
            {VERSES.map((v, i) => (
                <VerseTyping key={i} verse={v} time={time} />
            ))}

            {/* Camera Shake Impact */}
            <CameraShake
                maxYaw={0.05}
                maxPitch={0.05}
                maxRoll={0.05}
                yawFrequency={0.1}
                pitchFrequency={0.1}
                rollFrequency={0.1}
            />
        </>
    )
}

export function Intro3D({ onComplete }: Intro3DProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <Scene onComplete={onComplete} />
                </Suspense>
            </Canvas>

            {/* Overlay */}
            <div className="absolute top-8 left-8 text-white/20 text-[10px] font-mono tracking-[0.2em]">
                EXPERIENCE MODE: FLUID REALITY
            </div>

            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 text-white/50 hover:text-white text-xs font-bold tracking-widest uppercase border-b border-white/20 hover:border-white transition-colors pb-1"
            >
                Skip Checksum
            </button>
        </div>
    )
}
