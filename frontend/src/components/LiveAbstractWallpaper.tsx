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
    theme?: 'live-abstract' | 'divine' | 'midnight' | 'ethereal' | string;
    isConcentrated?: boolean;
}

const LiveAbstractWallpaper: React.FC<LiveWallpaperProps> = ({ theme = 'live-abstract', isConcentrated = false }) => {
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
                case 'divine':
                    return ['#FFD700', '#FFF8DC', '#FFA500', '#ffffff', '#FFFAF0']; // Gold/Cream/Orange/White
                case 'midnight':
                    return ['#1E90FF', '#4169E1', '#000080', '#87CEFA', '#ffffff']; // Blue/Navy/White
                case 'ethereal':
                    return ['#E0FFFF', '#B0C4DE', '#F0F8FF', '#ffffff', '#AFEEEE']; // Cyans/Light Blues
                default: // live-abstract
                    return ['#C48E2F', '#7C3AED', '#ffffff', '#DAA520', '#4B0082']; // Original Gold/Purple
            }
        };

        const getBgColors = () => {
            switch (theme) {
                case 'divine': return ['#2a1a00', '#000000'];
                case 'midnight': return ['#000010', '#0a0a2a'];
                case 'ethereal': return ['#0a1a2a', '#102030'];
                default: return ['#020202', '#08080a'];
            }
        };

        const initParticles = () => {
            particles = [];
            const particleCount = isConcentrated ? 60 : 100;
            const colors = getThemeColors();

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * (isConcentrated ? 2 : 3) + 0.5,
                    speedX: (Math.random() - 0.5) * (isConcentrated ? 0.3 : 0.5),
                    speedY: (Math.random() - 0.5) * (isConcentrated ? 0.3 : 0.5),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.5 + 0.2,
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() > 0.98 && shootingStars.length < 2) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    speed: Math.random() * 10 + 10,
                    length: Math.random() * 80 + 50,
                    angle: Math.PI / 4,
                    opacity: 1
                });
            }
        };

        const drawNebula = (t: number) => {
            if (theme === 'live-abstract' || theme === 'midnight') {
                const gradient1 = ctx.createRadialGradient(
                    canvas.width * 0.2 + Math.sin(t * 0.001) * 100,
                    canvas.height * 0.3 + Math.cos(t * 0.002) * 50,
                    0,
                    canvas.width * 0.4,
                    canvas.height * 0.5,
                    600
                );

                if (theme === 'midnight') {
                    gradient1.addColorStop(0, 'rgba(30, 144, 255, 0.05)');
                } else {
                    gradient1.addColorStop(0, 'rgba(76, 29, 149, 0.05)');
                }
                gradient1.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = gradient1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (theme === 'divine') {
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, 'rgba(255, 215, 0, 0.05)'); // Low gold haze
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };

        const draw = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            const bgCols = getBgColors();
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, bgCols[0]);
            bgGradient.addColorStop(1, bgCols[1]);
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawNebula(time);

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
                ctx.globalAlpha = p.alpha * (isConcentrated ? 0.3 : 0.7);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                p.x += p.speedX + Math.sin(time * 0.01 + p.y * 0.01) * 0.1;
                p.y += p.speedY + Math.cos(time * 0.01 + p.x * 0.01) * 0.1;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            if (!isConcentrated && theme !== 'ethereal') {
                ctx.strokeStyle = theme === 'divine' ? 'rgba(255, 215, 0, 0.08)' : 'rgba(196, 142, 47, 0.08)';
                ctx.lineWidth = 0.5;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 120) {
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
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-1000"
            style={{ opacity: 1 }}
        />
    );
};

export default LiveAbstractWallpaper;
