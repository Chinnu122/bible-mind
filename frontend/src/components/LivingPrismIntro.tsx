import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivingPrismIntroProps {
    onComplete: () => void;
}

const LivingPrismIntro: React.FC<LivingPrismIntroProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [step, setStep] = useState(3); // Start directly at Logo step

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
            hueBase: 45, // Gold/Logo base
            hueRange: 15,
            sat: 100,
            light: 60,
            contrast: 1.2
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

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Sequencing
    useEffect(() => {
        const sequence = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.5;
                    audioRef.current.play();
                } catch (e) { console.log('Audio autoplay blocked'); }
            }

            // Directly show Logo (step 3 set initially)
            // Wait for logo presentation then complete
            await new Promise(r => setTimeout(r, 6000)); // 6 seconds for logo soak

            onComplete();
        };

        sequence();
    }, [onComplete]);

    const skipIntro = () => {
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black font-serif text-white overflow-hidden cursor-none">
            <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/24/audio_30704c7c64.mp3" />

            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" /> {/* Dimmed background for blackshaded feel */}

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    {step === 3 && (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1.2, filter: 'blur(0px)' }}
                            exit={{ scale: 20, opacity: 0 }} // Zoom in finish
                            transition={{ duration: 4, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-6xl md:text-9xl text-gold-500 mb-8 animate-pulse drop-shadow-[0_0_50px_rgba(255,215,0,0.6)] shadow-black">
                                ◈
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-400 to-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-serif border-black">
                                Bible Mind
                            </h1>
                            <p className="mt-8 text-sm md:text-xl tracking-[1em] uppercase text-gray-400 drop-shadow-md">
                                Wisdom • Truth • Life
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Line */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gold-500/50 z-50 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 6, ease: "linear" }}
            />

            <button
                onClick={skipIntro}
                className="absolute bottom-10 right-10 z-[60] px-6 py-3 bg-black/50 border border-white/10 text-white/50 hover:text-white font-serif text-xs uppercase tracking-[0.1em] hover:bg-black/80 backdrop-blur-sm transition-all cursor-pointer pointer-events-auto rounded-full"
            >
                Start Now
            </button>
        </div>
    );
};

export default LivingPrismIntro;

