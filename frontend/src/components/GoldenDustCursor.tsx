import React, { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    life: number;
    maxLife: number;
}

const GoldenDustCursor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const lastPosition = useRef({ x: -100, y: -100 });
    const particles = useRef<Particle[]>([]);

    // Only show on desktop for performance and ux
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            setIsVisible(true);
        }

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const addParticles = () => {
            // Calculate distance moved
            const dx = position.x - lastPosition.current.x;
            const dy = position.y - lastPosition.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Interpolate particles between last pos and current pos for smooth trail
            const steps = Math.min(dist, 20); // Cap steps to avoid explosion on fast move

            for (let i = 0; i < steps; i += 2) { // Add particle every 2 pixels of movement
                const t = i / steps;
                const x = lastPosition.current.x + dx * t;
                const y = lastPosition.current.y + dy * t;

                // Add random spread
                if (Math.random() > 0.5) {
                    particles.current.push({
                        x: x + (Math.random() - 0.5) * 10,
                        y: y + (Math.random() - 0.5) * 10,
                        size: Math.random() * 2 + 0.5,
                        speedX: (Math.random() - 0.5) * 0.5,
                        speedY: (Math.random() - 0.5) * 0.5,
                        life: 1.0,
                        maxLife: Math.random() * 0.5 + 0.5
                    });
                }
            }

            lastPosition.current = { x: position.x, y: position.y };
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            addParticles();

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.life -= 0.02;
                p.x += p.speedX;
                p.y += p.speedY;
                p.size *= 0.95; // Shrink

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${p.life})`; // Gold
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(218, 165, 32, 0.8)';
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [position, isVisible]);

    if (!isVisible) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[1000]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default GoldenDustCursor;
