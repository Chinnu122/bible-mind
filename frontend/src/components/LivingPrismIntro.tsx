import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivingPrismIntroProps {
    onComplete: () => void;
}

const LivingPrismIntro: React.FC<LivingPrismIntroProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [step, setStep] = useState(0); // 0: v1, 1: v2, 2: v3, 3: Logo, 4: Done

    useEffect(() => {
        // --- 1. The Living Prism Engine (Low Poly) ---
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        // Point Class
        class Point {
            xOrigin: number;
            yOrigin: number;
            x: number;
            y: number;
            phaseX: number;
            phaseY: number;
            speed: number;

            constructor(x: number, y: number) {
                this.xOrigin = x;
                this.yOrigin = y;
                this.x = x;
                this.y = y;
                this.phaseX = Math.random() * Math.PI * 2;
                this.phaseY = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.5 + 0.5;
            }

            update(t: number) {
                const radius = 30;
                this.x = this.xOrigin + Math.sin(t * this.speed + this.phaseX) * radius;
                this.y = this.yOrigin + Math.cos(t * this.speed + this.phaseY) * radius;
            }
        }

        let points: Point[] = [];
        let triangles: any[] = [];
        let time = 0;

        // Config
        const config = {
            gridSize: 100,
            speed: 0.005,
            hueBase: 200,
            hueRange: 60,
            sat: 50,
            light: 50,
            contrast: 1.0
        };
        const targetConfig = { ...config };

        const initMesh = () => {
            points = [];
            triangles = [];
            canvas.width = width;
            canvas.height = height;

            const cols = Math.ceil(width / config.gridSize) + 2;
            const rows = Math.ceil(height / config.gridSize) + 2;

            for (let y = -1; y < rows; y++) {
                for (let x = -1; x < cols; x++) {
                    const px = x * config.gridSize + (Math.random() - 0.5) * (config.gridSize * 0.5);
                    const py = y * config.gridSize + (Math.random() - 0.5) * (config.gridSize * 0.5);
                    points.push(new Point(px, py));
                }
            }

            for (let y = 0; y < rows - 1; y++) {
                for (let x = 0; x < cols - 1; x++) {
                    const i = (y + 1) * cols + x;
                    const topLeft = i;
                    const topRight = i + 1;
                    const bottomLeft = i + cols;
                    const bottomRight = i + cols + 1;

                    if (points[topLeft] && points[bottomRight] && points[bottomLeft])
                        triangles.push([points[topLeft], points[bottomRight], points[bottomLeft]]);

                    if (points[topLeft] && points[topRight] && points[bottomRight])
                        triangles.push([points[topLeft], points[topRight], points[bottomRight]]);
                }
            }
        };

        const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

        const drawPrism = () => {
            // Update config values
            config.hueBase = lerp(config.hueBase, targetConfig.hueBase, 0.05);
            config.hueRange = lerp(config.hueRange, targetConfig.hueRange, 0.05);
            config.sat = lerp(config.sat, targetConfig.sat, 0.05);
            config.light = lerp(config.light, targetConfig.light, 0.05);
            config.speed = lerp(config.speed, targetConfig.speed, 0.05);

            // Update Points
            points.forEach(p => p.update(time));

            const lx = width * (0.5 + Math.sin(time * 0.5) * 0.3);
            const ly = height * (0.5 + Math.cos(time * 0.3) * 0.3);

            ctx.clearRect(0, 0, width, height);

            triangles.forEach(tri => {
                const p0 = tri[0];
                const p1 = tri[1];
                const p2 = tri[2];

                const cx = (p0.x + p1.x + p2.x) / 3;
                const cy = (p0.y + p1.y + p2.y) / 3;

                const dx = cx - lx;
                const dy = cy - ly;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = Math.sqrt(width * width + height * height);

                let brightness = 1 - (dist / maxDist);
                const sparkle = Math.sin(time * 2 + cx * 0.01 + cy * 0.01);
                brightness += sparkle * 0.1;

                const hue = config.hueBase + (brightness * config.hueRange);
                const sat = config.sat;
                const lit = config.light + (brightness * 20 * config.contrast);

                ctx.fillStyle = `hsl(${hue}, ${sat}%, ${lit}%)`;
                ctx.strokeStyle = `hsl(${hue}, ${sat}%, ${lit}%)`;
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });

            time += config.speed;
            animationFrameId = requestAnimationFrame(drawPrism);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            initMesh();
        };

        window.addEventListener('resize', handleResize);
        initMesh();
        drawPrism();

        // --- Mood Director exposure ---
        // We'll expose a function to change mood based on step
        const updateMood = (moodIdx: number) => {
            switch (moodIdx) {
                case 1: // Lamp
                    targetConfig.hueBase = 200; targetConfig.hueRange = 10; targetConfig.sat = 0;
                    targetConfig.light = 92; targetConfig.contrast = 0.3; targetConfig.speed = 0.008;
                    break;
                case 2: // Sword
                    targetConfig.hueBase = 350; targetConfig.hueRange = 40; targetConfig.sat = 80;
                    targetConfig.light = 20; targetConfig.contrast = 2.0; targetConfig.speed = 0.02;
                    break;
                case 3: // Eternal
                    targetConfig.hueBase = 210; targetConfig.hueRange = 50; targetConfig.sat = 60;
                    targetConfig.light = 40; targetConfig.contrast = 1.0; targetConfig.speed = 0.003;
                    break;
                case 4: // Logo
                    targetConfig.hueBase = 45; targetConfig.hueRange = 15; targetConfig.sat = 100;
                    targetConfig.light = 60; targetConfig.contrast = 1.2; targetConfig.speed = 0.002;
                    break;
            }
        };

        // --- Timeline Logic ---
        // React-controlled based on `step` state, but we need to sync the mood
        if (step === 0) updateMood(1);
        if (step === 1) updateMood(2);
        if (step === 2) updateMood(3);
        if (step === 3) updateMood(4);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [step]); // Re-run mood update when step changes (optimized to not re-init mesh if possible, but simpler here)

    // Sequencing
    useEffect(() => {
        // v1 (0s) -> v2 (7s) -> v3 (14s) -> Logo (21s) -> Done
        // Based on user request timeline:
        // 0-6.5s: v1
        // 7.5-13.5s: v2
        // 14.5-21.5s: v3
        // 22.5s: Logo

        const sequence = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.5;
                    audioRef.current.play();
                } catch (e) { console.log('Audio autoplay blocked'); }
            }

            setStep(0); // Mood 1
            await new Promise(r => setTimeout(r, 7000));

            setStep(1); // Mood 2
            await new Promise(r => setTimeout(r, 7000));

            setStep(2); // Mood 3
            await new Promise(r => setTimeout(r, 7000));

            setStep(3); // Mood 4 (Logo)
            // Wait for logo to be seen
            await new Promise(r => setTimeout(r, 5000));

            onComplete();
        };

        sequence();
    }, [onComplete]);

    const skipIntro = () => {
        setStep(3);
        setTimeout(onComplete, 2000); // Quick logo flash then done
    };

    return (
        <div className="fixed inset-0 z-50 bg-black font-serif text-white overflow-hidden cursor-none">
            <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/24/audio_30704c7c64.mp3" />

            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="v1"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-center p-8 rounded-sm border border-white/10 bg-white/20 backdrop-blur-md shadow-2xl max-w-4xl"
                        >
                            <p className="text-3xl md:text-5xl mb-4 font-normal text-black drop-shadow-md">
                                "Your word is a lamp for my feet,<br />a light on my path."
                            </p>
                            <span className="inline-block border-b border-black/30 pb-1 text-sm md:text-base tracking-[0.3em] uppercase text-black/80 font-bold">
                                Psalm 119:105
                            </span>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="v2"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-center p-8 rounded-sm border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl max-w-4xl"
                        >
                            <p className="text-3xl md:text-5xl mb-4 font-normal text-white drop-shadow-lg">
                                "For the word of God is alive and active.<br />Sharper than any double-edged sword."
                            </p>
                            <span className="inline-block border-b border-white/30 pb-1 text-sm md:text-base tracking-[0.3em] uppercase text-white/90 font-bold">
                                Hebrews 4:12
                            </span>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="v3"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-center p-8 rounded-sm border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl max-w-4xl"
                        >
                            <p className="text-3xl md:text-5xl mb-4 font-normal text-white drop-shadow-lg">
                                "The grass withers and the flowers fall,<br />but the word of our God endures forever."
                            </p>
                            <span className="inline-block border-b border-white/30 pb-1 text-sm md:text-base tracking-[0.3em] uppercase text-white/90 font-bold">
                                Isaiah 40:8
                            </span>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-6xl md:text-8xl text-white mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                                ◈
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-2xl font-serif">
                                Bible Mind
                            </h1>
                            <p className="mt-6 text-sm md:text-lg tracking-[0.8em] uppercase text-white/70">
                                Wisdom • Truth • Life
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Line */}
            <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-white z-50 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 28, ease: "linear" }}
            />

            <button
                onClick={skipIntro}
                className="absolute bottom-10 right-10 z-[60] px-6 py-3 bg-white/10 border border-white/20 text-white font-serif text-xs uppercase tracking-[0.1em] hover:bg-white/20 backdrop-blur-sm transition-all cursor-pointer pointer-events-auto"
            >
                Skip Intro
            </button>
        </div>
    );
};

export default LivingPrismIntro;
