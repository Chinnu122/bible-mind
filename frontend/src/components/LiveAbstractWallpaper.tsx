import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
}

interface LiveWallpaperProps {
    isConcentrated?: boolean;
}

const LiveAbstractWallpaper: React.FC<LiveWallpaperProps> = ({ isConcentrated = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = isConcentrated ? 40 : 80; // Fewer particles in concentrated mode

            const colors = isConcentrated
                ? ['#C48E2F', '#5A371E'] // Muted Gold/Brown
                : ['#C48E2F', '#7C3AED', '#ffffff', '#D6A942']; // Vibrant Gold/Purple/White

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * (isConcentrated ? 2 : 4) + 1,
                    speedX: (Math.random() - 0.5) * (isConcentrated ? 0.2 : 0.8),
                    speedY: (Math.random() - 0.5) * (isConcentrated ? 0.2 : 0.8),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.5 + 0.1,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#050505'); // Luxury Black
            gradient.addColorStop(1, '#0f0f12');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha * (isConcentrated ? 0.3 : 0.6); // Dimmer in concentrated mode
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Update Position
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // Connecting lines if close enough (only in normal mode for "Abstract" feel)
            if (!isConcentrated) {
                ctx.strokeStyle = 'rgba(196, 142, 47, 0.1)'; // Gold faint lines
                ctx.lineWidth = 0.5;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isConcentrated]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-1000"
            style={{ opacity: 1 }}
        />
    );
};

export default LiveAbstractWallpaper;
