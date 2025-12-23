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
    theme?: 'nebula' | 'abstract' | 'cosmic' | string;
    isConcentrated?: boolean;
}

const LiveAbstractWallpaper: React.FC<LiveWallpaperProps> = ({ theme = 'nebula', isConcentrated = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let shootingStars: { x: number; y: number; speed: number; length: number; angle: number; opacity: number }[] = [];
        let animationFrameId: number;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const getThemeColors = () => {
            switch (theme) {
                case 'nebula':
                    return ['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#ffffff'];
                case 'abstract':
                    return ['#f59e0b', '#fbbf24', '#c48e2f', '#ffffff', '#fcd34d'];
                case 'cosmic':
                    return ['#06b6d4', '#3b82f6', '#6366f1', '#ffffff', '#22d3ee'];
                default:
                    return ['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#ffffff'];
            }
        };

        const getBgColors = () => {
            switch (theme) {
                case 'nebula': return ['#0f0520', '#1a0a30'];
                case 'abstract': return ['#0a0805', '#121008'];
                case 'cosmic': return ['#020815', '#0a1525'];
                default: return ['#0f0520', '#1a0a30'];
            }
        };

        const initParticles = () => {
            particles = [];
            const particleCount = isConcentrated ? 80 : 150;
            const colors = getThemeColors();

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.6 + 0.2,
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() > 0.99 && shootingStars.length < 3) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    speed: Math.random() * 15 + 10,
                    length: Math.random() * 100 + 60,
                    angle: Math.PI / 4,
                    opacity: 1
                });
            }
        };

        // Rich Nebula & Cloud Effects
        const drawNebula = (t: number) => {
            // NEBULA THEME: Deep Space Galaxy
            if (theme === 'nebula') {
                // Purple Core
                const g1 = ctx.createRadialGradient(
                    canvas.width * 0.3 + Math.sin(t * 0.001) * 200,
                    canvas.height * 0.4 + Math.cos(t * 0.001) * 100,
                    0,
                    canvas.width * 0.5,
                    canvas.height * 0.5,
                    canvas.width * 0.7
                );
                g1.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
                g1.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Pink Cloud
                const g2 = ctx.createRadialGradient(
                    canvas.width * 0.7 - Math.sin(t * 0.0015) * 150,
                    canvas.height * 0.6 - Math.cos(t * 0.0015) * 100,
                    0,
                    canvas.width * 0.4,
                    canvas.height * 0.5,
                    canvas.width * 0.5
                );
                g2.addColorStop(0, 'rgba(236, 72, 153, 0.15)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Blue Accent
                const g3 = ctx.createRadialGradient(
                    canvas.width * 0.5 + Math.cos(t * 0.002) * 300,
                    canvas.height * 0.8 + Math.sin(t * 0.002) * 100,
                    0,
                    canvas.width * 0.2,
                    canvas.height * 0.3,
                    400
                );
                g3.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
                g3.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g3;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // ABSTRACT THEME: Golden Particles
            if (theme === 'abstract') {
                // Central Gold Glow
                const g1 = ctx.createRadialGradient(
                    canvas.width * 0.5, canvas.height * 0.5, 0,
                    canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
                );
                g1.addColorStop(0, 'rgba(196, 142, 47, 0.2)');
                g1.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Moving Warm Cloud
                const cloudX = canvas.width * 0.5 + Math.sin(t * 0.002) * 200;
                const cloudY = canvas.height * 0.4 + Math.cos(t * 0.003) * 100;
                const g2 = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, 500);
                g2.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // COSMIC THEME: Celestial Waves
            if (theme === 'cosmic') {
                // Cyan Core
                const g1 = ctx.createRadialGradient(
                    canvas.width * 0.5,
                    canvas.height * 0.3 + Math.sin(t * 0.001) * 50,
                    0,
                    canvas.width * 0.5,
                    canvas.height * 0.5,
                    canvas.width * 0.7
                );
                g1.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Blue Wave
                const waveY = canvas.height * 0.7 + Math.sin(t * 0.005) * 80;
                const g2 = ctx.createRadialGradient(
                    canvas.width * 0.5, waveY, 0,
                    canvas.width * 0.5, waveY, canvas.width
                );
                g2.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Indigo Accent
                const g3 = ctx.createRadialGradient(
                    canvas.width * 0.2 + Math.cos(t * 0.001) * 200,
                    canvas.height * 0.5,
                    0,
                    canvas.width * 0.2,
                    canvas.height * 0.5,
                    400
                );
                g3.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
                g3.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g3;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };

        const draw = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Base Background
            const bgCols = getBgColors();
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, bgCols[0]);
            bgGradient.addColorStop(1, bgCols[1]);
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Layer: Artistic Nebula/Clouds
            ctx.globalCompositeOperation = 'screen';
            drawNebula(time);
            ctx.globalCompositeOperation = 'source-over';

            // Shooting Stars
            createShootingStar();
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                const endX = s.x - s.length * Math.cos(s.angle);
                const endY = s.y - s.length * Math.sin(s.angle);

                const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
                grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
                grad.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                s.x += s.speed * Math.cos(s.angle);
                s.y += s.speed * Math.sin(s.angle);
                s.opacity -= 0.02;

                if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
                    shootingStars.splice(i, 1);
                }
            }

            // Particles
            particles.forEach((p) => {
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * 1;
                    p.y -= Math.sin(angle) * force * 1;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha * (isConcentrated ? 0.4 : 0.8);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                p.x += p.speedX + Math.sin(time * 0.01 + p.y * 0.01) * 0.1;
                p.y += p.speedY + Math.cos(time * 0.01 + p.x * 0.01) * 0.1;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // Connection Lines
            if (!isConcentrated) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
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
    }, [isConcentrated, theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{ opacity: 1 }}
        />
    );
};

export default LiveAbstractWallpaper;
