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
                    return ['#FFD700', '#FFF8DC', '#FFA500', '#ffffff', '#FFFAF0'];
                case 'midnight':
                    return ['#1E90FF', '#4169E1', '#9370DB', '#87CEFA', '#ffffff'];
                case 'ethereal':
                    return ['#E0FFFF', '#B0C4DE', '#F0F8FF', '#ffffff', '#AFEEEE'];
                default:
                    return ['#C48E2F', '#7C3AED', '#ffffff', '#DAA520', '#4B0082'];
            }
        };

        const getBgColors = () => {
            switch (theme) {
                case 'divine': return ['#2a1a00', '#000000'];
                case 'midnight': return ['#050510', '#0a0a25'];
                case 'ethereal': return ['#0a1520', '#102035'];
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
            if (Math.random() > 0.99 && shootingStars.length < 3) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height / 2),
                    speed: Math.random() * 15 + 10,
                    length: Math.random() * 80 + 50,
                    angle: Math.PI / 4,
                    opacity: 1
                });
            }
        };

        // Advanced Nebula & Cloud Painting
        const drawNebula = (t: number) => {
            // MIDNIGHT: Rich, Multi-layered Galaxy
            if (theme === 'midnight') {
                // Layer 1: Deep Purple Cloud moving slow
                const g1 = ctx.createRadialGradient(
                    canvas.width * 0.3 + Math.sin(t * 0.001) * 200,
                    canvas.height * 0.4 + Math.cos(t * 0.001) * 100,
                    0,
                    canvas.width * 0.5,
                    canvas.height * 0.5,
                    canvas.width * 0.6
                );
                g1.addColorStop(0, 'rgba(76, 29, 149, 0.15)');
                g1.addColorStop(0.6, 'rgba(30, 27, 75, 0.05)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Layer 2: Blue/Cyan Cloud moving opposite
                const g2 = ctx.createRadialGradient(
                    canvas.width * 0.7 - Math.sin(t * 0.0015) * 150,
                    canvas.height * 0.6 - Math.cos(t * 0.0015) * 100,
                    0,
                    canvas.width * 0.4,
                    canvas.height * 0.5,
                    canvas.width * 0.5
                );
                g2.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Layer 3: Pink/Magenta Highlights
                const g3 = ctx.createRadialGradient(
                    canvas.width * 0.5 + Math.cos(t * 0.002) * 300,
                    canvas.height * 0.8 + Math.sin(t * 0.002) * 100,
                    0,
                    canvas.width * 0.2,
                    canvas.height * 0.3,
                    400
                );
                g3.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
                g3.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g3;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // DIVINE: Golden Haze & Clouds
            if (theme === 'divine') {
                const g1 = ctx.createRadialGradient(
                    canvas.width * 0.5,
                    0,
                    100,
                    canvas.width * 0.5,
                    canvas.height * 0.4,
                    canvas.height
                );
                g1.addColorStop(0, 'rgba(255, 215, 0, 0.15)'); // Bright Gold top
                g1.addColorStop(0.5, 'rgba(218, 165, 32, 0.05)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // ETHEREAL: Northern Lights / Soft Waves
            if (theme === 'ethereal') {
                const g1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                g1.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
                g1.addColorStop(0.5, 'rgba(167, 139, 250, 0.05)');
                g1.addColorStop(1, 'rgba(34, 211, 238, 0.05)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Moving "Wave"
                const waveY = canvas.height * 0.8 + Math.sin(t * 0.005) * 50;
                const g2 = ctx.createRadialGradient(
                    canvas.width * 0.5, waveY, 0,
                    canvas.width * 0.5, waveY, canvas.width
                );
                g2.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            // LIVE ABSTRACT: Standard subtle gradient
            if (theme === 'live-abstract') {
                const g = ctx.createRadialGradient(
                    canvas.width * 0.5, canvas.height * 0.5, 0,
                    canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
                );
                g.addColorStop(0, 'rgba(124, 58, 237, 0.05)');
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
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
            ctx.globalCompositeOperation = 'screen'; // Additive blending for glow
            drawNebula(time);
            ctx.globalCompositeOperation = 'source-over'; // Restore normal blending

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

            // Lines (only for default/midnight)
            if (!isConcentrated && (theme === 'live-abstract' || theme === 'midnight')) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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
