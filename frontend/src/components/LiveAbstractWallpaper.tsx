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

    // Memoized theme colors
    const getThemeColors = useCallback(() => {
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
    }, [theme]);

    const getBgColors = useCallback(() => {
        switch (theme) {
            case 'nebula': return ['#0f0520', '#1a0a30'];
            case 'abstract': return ['#0a0805', '#121008'];
            case 'cosmic': return ['#020815', '#0a1525'];
            default: return ['#0f0520', '#1a0a30'];
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

        // Responsive particle count based on screen size
        const getParticleCount = () => {
            const area = window.innerWidth * window.innerHeight;
            const baseCount = isConcentrated ? 40 : 80;
            if (area < 500000) return Math.floor(baseCount * 0.5); // Mobile
            if (area < 1000000) return Math.floor(baseCount * 0.75); // Tablet
            return baseCount; // Desktop
        };

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
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
                    size: Math.random() * 2.5 + 1,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.5 + 0.3,
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() > 0.995 && shootingStarsRef.current.length < 2) {
                shootingStarsRef.current.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * (window.innerHeight / 3),
                    speed: Math.random() * 12 + 8,
                    length: Math.random() * 80 + 50,
                    angle: Math.PI / 4,
                    opacity: 1
                });
            }
        };

        const drawNebula = (t: number, w: number, h: number) => {
            ctx.globalCompositeOperation = 'screen';

            if (theme === 'nebula') {
                // Purple Core
                const g1 = ctx.createRadialGradient(
                    w * 0.3 + Math.sin(t * 0.0008) * 150, h * 0.4 + Math.cos(t * 0.0008) * 80,
                    0, w * 0.5, h * 0.5, w * 0.6
                );
                g1.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
                g1.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, w, h);

                // Pink Cloud
                const g2 = ctx.createRadialGradient(
                    w * 0.7 - Math.sin(t * 0.001) * 120, h * 0.6 - Math.cos(t * 0.001) * 80,
                    0, w * 0.4, h * 0.5, w * 0.5
                );
                g2.addColorStop(0, 'rgba(236, 72, 153, 0.18)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, w, h);

                // Blue Accent
                const g3 = ctx.createRadialGradient(
                    w * 0.5 + Math.cos(t * 0.0015) * 200, h * 0.75,
                    0, w * 0.2, h * 0.3, 350
                );
                g3.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
                g3.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g3;
                ctx.fillRect(0, 0, w, h);
            }

            if (theme === 'abstract') {
                const g1 = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.7);
                g1.addColorStop(0, 'rgba(196, 142, 47, 0.22)');
                g1.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, w, h);

                const cloudX = w * 0.5 + Math.sin(t * 0.0015) * 180;
                const cloudY = h * 0.4 + Math.cos(t * 0.002) * 80;
                const g2 = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, 400);
                g2.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, w, h);
            }

            if (theme === 'cosmic') {
                const g1 = ctx.createRadialGradient(
                    w * 0.5, h * 0.3 + Math.sin(t * 0.0008) * 40,
                    0, w * 0.5, h * 0.5, w * 0.6
                );
                g1.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
                g1.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g1;
                ctx.fillRect(0, 0, w, h);

                const waveY = h * 0.7 + Math.sin(t * 0.004) * 60;
                const g2 = ctx.createRadialGradient(w * 0.5, waveY, 0, w * 0.5, waveY, w * 0.8);
                g2.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
                g2.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g2;
                ctx.fillRect(0, 0, w, h);
            }

            ctx.globalCompositeOperation = 'source-over';
        };

        const draw = (timestamp: number) => {
            // Target 60fps (16.67ms per frame)
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

            // Background
            const bgCols = getBgColors();
            const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
            bgGradient.addColorStop(0, bgCols[0]);
            bgGradient.addColorStop(1, bgCols[1]);
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, w, h);

            // Nebula Clouds
            drawNebula(t, w, h);

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
                s.opacity -= 0.015;

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

                if (distSq < 40000) { // 200^2
                    const dist = Math.sqrt(distSq);
                    const force = (200 - dist) / 200;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * 0.8;
                    p.y -= Math.sin(angle) * force * 0.8;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha * (isConcentrated ? 0.5 : 0.9);
                ctx.fill();

                p.x += p.speedX + Math.sin(t * 0.015 + p.y * 0.008) * 0.08;
                p.y += p.speedY + Math.cos(t * 0.015 + p.x * 0.008) * 0.08;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
            }
            ctx.globalAlpha = 1.0;

            // Connection Lines (only on desktop and not concentrated)
            if (!isConcentrated && w > 768) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.lineWidth = 0.5;
                const len = particles.length;
                for (let i = 0; i < len; i++) {
                    for (let j = i + 1; j < len; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < 8100) { // 90^2
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
