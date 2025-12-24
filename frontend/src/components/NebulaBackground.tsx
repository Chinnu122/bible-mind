import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    radius: number;
    rgb: string;
    opacity: number;
    vx: number;
    vy: number;
    pulseSpeed: number;
    pulseOffset: number;
    isStar: boolean;
}

const NebulaBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    // "Bible Mind" Reading Palette: Deep, Muted, Calming
    const colors = [
        { r: 20, g: 30, b: 60 },    // Deep Midnight Blue
        { r: 40, g: 40, b: 60 },    // Dark Slate
        { r: 80, g: 60, b: 100 },   // Deep Muted Purple
        { r: 180, g: 140, b: 60 },  // Old Gold (Low Intensity)
        { r: 30, g: 50, b: 70 }     // Dark Teal
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const createParticle = (): Particle => {
            const isStar = Math.random() > 0.9;
            const color = colors[Math.floor(random(0, colors.length))];

            return {
                x: random(0, width),
                y: random(0, height),
                isStar,
                radius: isStar ? random(0.5, 1.5) : random(200, 500),
                rgb: `${color.r},${color.g},${color.b}`,
                opacity: isStar ? random(0.3, 0.6) : random(0.03, 0.08),
                vx: random(-0.05, 0.05),
                vy: random(-0.05, 0.05),
                pulseSpeed: random(0.0005, 0.002),
                pulseOffset: random(0, Math.PI * 2)
            };
        };

        const initParticles = () => {
            particlesRef.current = [];
            // Fewer particles for performance on mobile
            const count = window.innerWidth < 768 ? 20 : 40;
            for (let i = 0; i < count; i++) {
                particlesRef.current.push(createParticle());
            }
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);
            initParticles();
        };

        const drawParticle = (p: Particle, time: number) => {
            ctx.beginPath();

            let currentOpacity = p.opacity;
            if (!p.isStar) {
                currentOpacity += Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.01;
                currentOpacity = Math.max(0.02, Math.min(0.1, currentOpacity));
            } else {
                currentOpacity = p.opacity + Math.sin(time * 0.001 + p.pulseOffset) * 0.1;
                currentOpacity = Math.max(0.1, currentOpacity);
            }

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            grad.addColorStop(0, `rgba(${p.rgb}, ${currentOpacity})`);
            grad.addColorStop(1, `rgba(${p.rgb}, 0)`);

            ctx.fillStyle = grad;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        };

        const updateParticle = (p: Particle) => {
            p.x += p.vx;
            p.y += p.vy;

            const buffer = 500;
            if (p.x < -buffer) p.x = width + buffer;
            if (p.x > width + buffer) p.x = -buffer;
            if (p.y < -buffer) p.y = height + buffer;
            if (p.y > height + buffer) p.y = -buffer;
        };

        const animate = (time: number) => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'screen';

            for (const p of particlesRef.current) {
                updateParticle(p);
                drawParticle(p, time);
            }

            ctx.globalCompositeOperation = 'source-over';
            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize, { passive: true });
        resize();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
                background: 'linear-gradient(to bottom, #050810 0%, #0a0f1c 100%)'
            }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
};

export default NebulaBackground;
