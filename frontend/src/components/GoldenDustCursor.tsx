import React, { useEffect, useRef, useCallback } from 'react';
import { usePerformance } from '../contexts/PerformanceContext';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    life: number;
}

const GoldenDustCursor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const positionRef = useRef({ x: -100, y: -100 });
    const lastPositionRef = useRef({ x: -100, y: -100 });
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef(0);

    const { enableEffects, level } = usePerformance();

    // Only show on desktop
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isEnabled = enableEffects && !isTouchDevice && level !== 'low';

    const handleMouseMove = useCallback((e: MouseEvent) => {
        positionRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isEnabled, handleMouseMove]);

    useEffect(() => {
        if (!isEnabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        const maxParticles = level === 'high' ? 50 : 25;
        const targetFps = 30;
        const frameInterval = 1000 / targetFps;

        const render = (timestamp: number) => {
            const elapsed = timestamp - lastTimeRef.current;

            if (elapsed >= frameInterval) {
                lastTimeRef.current = timestamp - (elapsed % frameInterval);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Add new particles based on movement
                const dx = positionRef.current.x - lastPositionRef.current.x;
                const dy = positionRef.current.y - lastPositionRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 2 && particlesRef.current.length < maxParticles) {
                    particlesRef.current.push({
                        x: positionRef.current.x + (Math.random() - 0.5) * 10,
                        y: positionRef.current.y + (Math.random() - 0.5) * 10,
                        size: Math.random() * 2 + 0.5,
                        speedX: (Math.random() - 0.5) * 0.5,
                        speedY: (Math.random() - 0.5) * 0.5,
                        life: 1.0,
                    });
                }

                lastPositionRef.current = { ...positionRef.current };

                // Update and draw particles
                for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                    const p = particlesRef.current[i];
                    p.life -= 0.03;
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.size *= 0.96;

                    if (p.life <= 0) {
                        particlesRef.current.splice(i, 1);
                        continue;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 215, 0, ${p.life})`;
                    ctx.fill();
                }
            }

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isEnabled, level]);

    if (!isEnabled) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[1000]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default GoldenDustCursor;
