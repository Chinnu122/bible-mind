import { useEffect, useRef } from 'react';
import { usePerformance } from '../../contexts/PerformanceContext';

export default function SnowEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { particleCount, enableEffects, targetFps } = usePerformance();

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

        // Use adaptive particle count from context
        const particles: { x: number; y: number; radius: number; speed: number; wind: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
            });
        }

        let animationId: number;
        let lastTime = 0;
        const frameInterval = 1000 / targetFps; // Use targetFps from context (120fps)

        const draw = (timestamp: number) => {
            const elapsed = timestamp - lastTime;

            if (elapsed >= frameInterval) {
                lastTime = timestamp - (elapsed % frameInterval);

                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    ctx.moveTo(p.x, p.y);
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                    // Update position
                    p.y += p.speed;
                    p.x += p.wind;

                    if (p.y > height) {
                        p.y = -10;
                        p.x = Math.random() * width;
                    }
                    if (p.x > width) p.x = 0;
                    if (p.x < 0) p.x = width;
                }

                ctx.fill();
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
    }, [particleCount, enableEffects, targetFps]);

    if (!enableEffects) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
