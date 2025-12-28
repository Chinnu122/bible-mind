import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LivingPrismIntroProps {
    onComplete: () => void;
}

const LivingPrismIntro: React.FC<LivingPrismIntroProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let rafId = 0;

        type Particle = {
            x: number;
            y: number;
            radius: number;
            rgb: string;
            opacity: number;
            vx: number;
            vy: number;
            pulseSpeed: number;
            pulseOffset: number;
            isStar: boolean;
        };

        const colors = [
            { r: 140, g: 90, b: 255 },
            { r: 70, g: 120, b: 255 },
            { r: 255, g: 90, b: 190 },
            { r: 180, g: 120, b: 255 },
        ];

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        let particles: Particle[] = [];

        const createParticle = (): Particle => {
            const isStar = Math.random() > 0.9;
            const color = colors[Math.floor(random(0, colors.length))];
            return {
                x: random(0, width),
                y: random(0, height),
                isStar,
                radius: isStar ? random(0.5, 1.6) : random(180, 520),
                rgb: `${color.r},${color.g},${color.b}`,
                opacity: isStar ? random(0.2, 0.55) : random(0.02, 0.07),
                vx: random(-0.05, 0.05),
                vy: random(-0.05, 0.05),
                pulseSpeed: random(0.0006, 0.0022),
                pulseOffset: random(0, Math.PI * 2),
            };
        };

        const initParticles = () => {
            particles = [];
            const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
            const count = isMobile ? 22 : 46;
            for (let i = 0; i < count; i++) particles.push(createParticle());
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'screen';

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                const buffer = 520;
                if (p.x < -buffer) p.x = width + buffer;
                if (p.x > width + buffer) p.x = -buffer;
                if (p.y < -buffer) p.y = height + buffer;
                if (p.y > height + buffer) p.y = -buffer;

                let currentOpacity = p.opacity;
                if (!p.isStar) {
                    currentOpacity += Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.01;
                    currentOpacity = Math.max(0.01, Math.min(0.09, currentOpacity));
                } else {
                    currentOpacity = p.opacity + Math.sin(time * 0.001 + p.pulseOffset) * 0.1;
                    currentOpacity = Math.max(0.08, currentOpacity);
                }

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `rgba(${p.rgb}, ${currentOpacity})`);
                grad.addColorStop(1, `rgba(${p.rgb}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
            rafId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize, { passive: true });
        resize();
        rafId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    useEffect(() => {
        const TOTAL_MS = 2800;
        let done = false;

        const finish = () => {
            if (done) return;
            done = true;
            onCompleteRef.current();
        };

        const timer = window.setTimeout(finish, TOTAL_MS);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
        };
        const onPointerDown = () => finish();

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointerdown', onPointerDown);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pointerdown', onPointerDown);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">
            <div className="absolute inset-0">
                <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
                <div className="absolute inset-0 bg-black/55" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.9, 1.0, 18],
                        filter: ['blur(10px)', 'blur(0px)', 'blur(12px)'],
                    }}
                    transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1], times: [0, 0.35, 1] }}
                    className="flex items-center justify-center"
                >
                    <img
                        src="/logo-v2.png"
                        alt="Bible Mind"
                        className="w-28 h-28 md:w-44 md:h-44 object-contain"
                        draggable={false}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default LivingPrismIntro;

