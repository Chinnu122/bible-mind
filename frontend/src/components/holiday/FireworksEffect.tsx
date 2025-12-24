import { useEffect, useRef } from 'react';
import { usePerformance } from '../../contexts/PerformanceContext';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
}

export default function FireworksEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { enableEffects, level, targetFps } = usePerformance();

    useEffect(() => {
        if (!enableEffects) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Pool to reuse particle objects
        const particlePool: Particle[] = [];
        const activeParticles: Particle[] = [];
        const maxParticles = level === 'high' ? 800 : level === 'medium' ? 400 : 200;
        const particlesPerBurst = level === 'high' ? 80 : level === 'medium' ? 40 : 20;

        const colors = ['#FFD700', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500'];

        const getParticle = (x: number, y: number, color: string): Particle => {
            let particle = particlePool.pop();
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;

            if (particle) {
                particle.x = x;
                particle.y = y;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed;
                particle.alpha = 1;
                particle.color = color;
            } else {
                particle = { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color };
            }
            return particle;
        };

        const createFirework = () => {
            if (activeParticles.length > maxParticles) return;

            const x = Math.random() * width;
            const y = Math.random() * (height / 2);
            const color = colors[Math.floor(Math.random() * colors.length)];

            for (let i = 0; i < particlesPerBurst; i++) {
                activeParticles.push(getParticle(x, y, color));
            }
        };

        let animationId: number;
        let lastTime = 0;
        const frameInterval = 1000 / targetFps; // Use 120fps from context

        const draw = (timestamp: number) => {
            const elapsed = timestamp - lastTime;

            if (elapsed >= frameInterval) {
                lastTime = timestamp - (elapsed % frameInterval);

                // Trail effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, width, height);

                if (Math.random() < 0.05) {
                    createFirework();
                }

                for (let i = activeParticles.length - 1; i >= 0; i--) {
                    const p = activeParticles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05;
                    p.alpha -= 0.012;

                    if (p.alpha <= 0) {
                        particlePool.push(activeParticles.splice(i, 1)[0]);
                        continue;
                    }

                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }

            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [enableEffects, level, targetFps]);

    if (!enableEffects) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
        />
    );
}
