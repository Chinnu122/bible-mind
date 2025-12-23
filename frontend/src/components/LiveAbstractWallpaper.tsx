import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
}

interface ShootingStar {
    x: number;
    y: number;
    speed: number;
    length: number;
    angle: number;
    opacity: number;
}

interface LiveWallpaperProps {
    theme?: 'nebula' | 'abstract' | 'cosmic' | string;
    isConcentrated?: boolean;
}

const LiveAbstractWallpaper: React.FC<LiveWallpaperProps> = ({ theme = 'nebula', isConcentrated = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animationRef = useRef<number>(0);
    const timeRef = useRef(0);
    const lastFrameTimeRef = useRef(0);

    // Memoized theme colors - each theme has unique colors
    const getThemeColors = useCallback(() => {
        switch (theme) {
            case 'nebula':
                return ['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#f472b6', '#c084fc'];
            case 'abstract':
                return ['#f59e0b', '#fbbf24', '#c48e2f', '#fcd34d', '#f97316', '#eab308'];
            case 'cosmic':
                return ['#06b6d4', '#3b82f6', '#6366f1', '#22d3ee', '#0ea5e9', '#818cf8'];
            case 'aurora':
                return ['#10b981', '#14b8a6', '#06b6d4', '#22d3ee', '#34d399', '#2dd4bf'];
            default:
                return ['#a855f7', '#ec4899', '#3b82f6', '#8b5cf6', '#ffffff'];
        }
    }, [theme]);

    const getBgColors = useCallback(() => {
        switch (theme) {
            case 'nebula': return ['#0d0015', '#1a0530', '#0f0020'];
            case 'abstract': return ['#0a0604', '#150d08', '#0f0906'];
            case 'cosmic': return ['#010812', '#051525', '#020c18'];
            case 'aurora': return ['#021210', '#041a18', '#031512'];
            default: return ['#0d0015', '#1a0530'];
        }
    }, [theme]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Responsive particle count
        const getParticleCount = () => {
            const area = window.innerWidth * window.innerHeight;
            const baseCount = isConcentrated ? 50 : 100;
            if (area < 500000) return Math.floor(baseCount * 0.5);
            if (area < 1000000) return Math.floor(baseCount * 0.7);
            return baseCount;
        };

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            const colors = getThemeColors();
            const count = getParticleCount();

            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 2.5 + 0.8,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.5 + 0.3,
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() > 0.997 && shootingStarsRef.current.length < 2) {
                shootingStarsRef.current.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * (window.innerHeight / 3),
                    speed: Math.random() * 10 + 6,
                    length: Math.random() * 70 + 40,
                    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                    opacity: 1
                });
            }
        };

        // NEBULA - Deep Space Galaxy with swirling purple/pink clouds
        const drawNebulaTheme = (t: number, w: number, h: number) => {
            // Main purple nebula core
            const g1 = ctx.createRadialGradient(
                w * 0.35 + Math.sin(t * 0.0006) * 120,
                h * 0.4 + Math.cos(t * 0.0008) * 80,
                0,
                w * 0.5, h * 0.5, w * 0.65
            );
            g1.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
            g1.addColorStop(0.4, 'rgba(139, 92, 246, 0.15)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);

            // Pink nebula cloud
            const g2 = ctx.createRadialGradient(
                w * 0.7 - Math.sin(t * 0.0007) * 100,
                h * 0.55 - Math.cos(t * 0.0009) * 60,
                0,
                w * 0.4, h * 0.5, w * 0.45
            );
            g2.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
            g2.addColorStop(0.5, 'rgba(244, 114, 182, 0.08)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);

            // Blue accent mist
            const g3 = ctx.createRadialGradient(
                w * 0.2 + Math.cos(t * 0.001) * 150,
                h * 0.75 + Math.sin(t * 0.001) * 50,
                0,
                w * 0.15, h * 0.3, 350
            );
            g3.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
            g3.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, w, h);

            // Secondary swirl
            const g4 = ctx.createRadialGradient(
                w * 0.8 + Math.sin(t * 0.0005) * 80,
                h * 0.2 + Math.cos(t * 0.0005) * 40,
                0,
                w * 0.8, h * 0.2, 300
            );
            g4.addColorStop(0, 'rgba(192, 132, 252, 0.12)');
            g4.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g4;
            ctx.fillRect(0, 0, w, h);
        };

        // ABSTRACT - Warm golden flowing particles
        const drawAbstractTheme = (t: number, w: number, h: number) => {
            // Central warm glow
            const g1 = ctx.createRadialGradient(
                w * 0.5 + Math.sin(t * 0.0004) * 50,
                h * 0.45,
                0,
                w * 0.5, h * 0.45, w * 0.6
            );
            g1.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
            g1.addColorStop(0.5, 'rgba(196, 142, 47, 0.12)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);

            // Flowing amber stream
            const streamX = w * 0.3 + Math.sin(t * 0.0008) * 180;
            const streamY = h * 0.5 + Math.cos(t * 0.001) * 100;
            const g2 = ctx.createRadialGradient(streamX, streamY, 0, streamX, streamY, 400);
            g2.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
            g2.addColorStop(0.6, 'rgba(234, 179, 8, 0.08)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);

            // Orange accent
            const g3 = ctx.createRadialGradient(
                w * 0.75 - Math.sin(t * 0.0006) * 100,
                h * 0.3 + Math.cos(t * 0.0006) * 60,
                0,
                w * 0.75, h * 0.3, 250
            );
            g3.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
            g3.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, w, h);

            // Bottom warmth
            const g4 = ctx.createRadialGradient(
                w * 0.5, h * 0.9, 0,
                w * 0.5, h * 0.9, w * 0.7
            );
            g4.addColorStop(0, 'rgba(252, 211, 77, 0.1)');
            g4.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g4;
            ctx.fillRect(0, 0, w, h);
        };

        // COSMIC - Celestial waves and aurora-like effects
        const drawCosmicTheme = (t: number, w: number, h: number) => {
            // Top cyan aurora
            const g1 = ctx.createRadialGradient(
                w * 0.5,
                h * 0.2 + Math.sin(t * 0.0005) * 30,
                0,
                w * 0.5, h * 0.3, w * 0.55
            );
            g1.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
            g1.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);

            // Central blue wave
            const waveY = h * 0.55 + Math.sin(t * 0.0008) * 60;
            const g2 = ctx.createRadialGradient(
                w * 0.5 + Math.cos(t * 0.0005) * 100,
                waveY, 0,
                w * 0.5, waveY, w * 0.65
            );
            g2.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
            g2.addColorStop(0.6, 'rgba(14, 165, 233, 0.08)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);

            // Indigo depth
            const g3 = ctx.createRadialGradient(
                w * 0.25 + Math.sin(t * 0.0004) * 80,
                h * 0.7,
                0,
                w * 0.25, h * 0.7, 350
            );
            g3.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
            g3.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, w, h);

            // Right side shimmer
            const g4 = ctx.createRadialGradient(
                w * 0.85 - Math.cos(t * 0.0006) * 60,
                h * 0.4 + Math.sin(t * 0.0006) * 40,
                0,
                w * 0.85, h * 0.4, 280
            );
            g4.addColorStop(0, 'rgba(129, 140, 248, 0.12)');
            g4.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g4;
            ctx.fillRect(0, 0, w, h);
        };

        // AURORA - Northern Lights flowing effect
        const drawAuroraTheme = (t: number, w: number, h: number) => {
            // Main emerald curtain
            const curtainY = h * 0.3 + Math.sin(t * 0.0004) * 40;
            const g1 = ctx.createRadialGradient(
                w * 0.5, curtainY, 0,
                w * 0.5, curtainY, w * 0.7
            );
            g1.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            g1.addColorStop(0.5, 'rgba(5, 150, 105, 0.12)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);

            // Teal wave
            const waveX = w * 0.3 + Math.sin(t * 0.0006) * 150;
            const g2 = ctx.createRadialGradient(
                waveX, h * 0.45, 0,
                waveX, h * 0.45, 400
            );
            g2.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);

            // Cyan shimmer
            const shimmerX = w * 0.7 - Math.cos(t * 0.0005) * 100;
            const shimmerY = h * 0.55 + Math.sin(t * 0.0007) * 80;
            const g3 = ctx.createRadialGradient(
                shimmerX, shimmerY, 0,
                shimmerX, shimmerY, 350
            );
            g3.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
            g3.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, w, h);

            // Bottom glow
            const g4 = ctx.createRadialGradient(
                w * 0.5, h * 0.85, 0,
                w * 0.5, h * 0.85, w * 0.6
            );
            g4.addColorStop(0, 'rgba(52, 211, 153, 0.15)');
            g4.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g4;
            ctx.fillRect(0, 0, w, h);
        };

        const draw = (timestamp: number) => {
            const deltaTime = timestamp - lastFrameTimeRef.current;
            if (deltaTime < 16) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }
            lastFrameTimeRef.current = timestamp;
            timeRef.current += deltaTime * 0.06;

            const w = window.innerWidth;
            const h = window.innerHeight;
            const t = timeRef.current;

            // Base background gradient
            const bgCols = getBgColors();
            const bgGradient = ctx.createLinearGradient(0, 0, w * 0.3, h);
            bgGradient.addColorStop(0, bgCols[0]);
            bgGradient.addColorStop(0.5, bgCols[1]);
            bgGradient.addColorStop(1, bgCols[2] || bgCols[0]);
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, w, h);

            // Theme-specific nebula effects
            ctx.globalCompositeOperation = 'screen';

            if (theme === 'nebula') {
                drawNebulaTheme(t, w, h);
            } else if (theme === 'abstract') {
                drawAbstractTheme(t, w, h);
            } else if (theme === 'cosmic') {
                drawCosmicTheme(t, w, h);
            } else if (theme === 'aurora') {
                drawAuroraTheme(t, w, h);
            }

            ctx.globalCompositeOperation = 'source-over';

            // Shooting Stars
            createShootingStar();
            const stars = shootingStarsRef.current;
            for (let i = stars.length - 1; i >= 0; i--) {
                const s = stars[i];
                const endX = s.x - s.length * Math.cos(s.angle);
                const endY = s.y - s.length * Math.sin(s.angle);

                const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
                grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
                grad.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                s.x += s.speed * Math.cos(s.angle);
                s.y += s.speed * Math.sin(s.angle);
                s.opacity -= 0.012;

                if (s.opacity <= 0 || s.x > w || s.y > h) {
                    stars.splice(i, 1);
                }
            }

            // Particles
            const particles = particlesRef.current;
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            for (const p of particles) {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 40000) {
                    const dist = Math.sqrt(distSq);
                    const force = (200 - dist) / 200;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * 0.6;
                    p.y -= Math.sin(angle) * force * 0.6;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha * (isConcentrated ? 0.4 : 0.85);
                ctx.fill();

                p.x += p.speedX + Math.sin(t * 0.012 + p.y * 0.006) * 0.06;
                p.y += p.speedY + Math.cos(t * 0.012 + p.x * 0.006) * 0.06;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
            }
            ctx.globalAlpha = 1.0;

            // Connection Lines (desktop only)
            if (!isConcentrated && w > 768) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.lineWidth = 0.4;
                const len = particles.length;
                for (let i = 0; i < len; i++) {
                    for (let j = i + 1; j < len; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < 6400) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isConcentrated, theme, getThemeColors, getBgColors]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        />
    );
};

export default LiveAbstractWallpaper;
