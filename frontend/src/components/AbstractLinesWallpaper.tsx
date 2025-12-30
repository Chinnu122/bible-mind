import { useEffect, useRef } from 'react';

/**
 * AbstractLinesWallpaper - Smooth flowing neon curves
 * Replicates the "Abstract Lines" style from motionbgs.com
 */
export default function AbstractLinesWallpaper() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resize();
        window.addEventListener('resize', resize);

        // Curve configuration
        const curves: Curve[] = [];
        const curveCount = 30;

        interface Curve {
            y: number;
            amplitude: number;
            frequency: number;
            phase: number;
            speed: number;
            color: string;
            width: number;
        }

        // Initialize curves
        for (let i = 0; i < curveCount; i++) {
            const hue = 220 + Math.random() * 100; // Blue to Pink/Purple range (220-320)
            curves.push({
                y: height * 0.1 + Math.random() * height * 0.8,
                amplitude: 20 + Math.random() * 100,
                frequency: 0.002 + Math.random() * 0.005,
                phase: Math.random() * Math.PI * 2,
                speed: 0.005 + Math.random() * 0.015,
                color: `hsla(${hue}, 70%, 60%, 0.5)`,
                width: 1 + Math.random() * 3
            });
        }

        function animate() {
            if (!ctx) return;

            // Clear with slight trail effect
            ctx.fillStyle = 'rgba(10, 10, 20, 0.1)'; // Dark background with trail
            ctx.fillRect(0, 0, width, height);

            // Global composite for glowing effect
            ctx.globalCompositeOperation = 'lighter';

            curves.forEach(curve => {
                curve.phase += curve.speed;

                ctx.beginPath();
                ctx.strokeStyle = curve.color;
                ctx.lineWidth = curve.width;

                // Draw sine wave
                for (let x = 0; x < width; x += 5) {
                    // Combine multiple sine waves for more organic feel
                    const y = curve.y +
                        Math.sin(x * curve.frequency + curve.phase) * curve.amplitude +
                        Math.sin(x * curve.frequency * 2 + curve.phase * 1.5) * (curve.amplitude * 0.5);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                // Add Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = curve.color;

                ctx.stroke();

                // Reset shadow for next operations
                ctx.shadowBlur = 0;
            });

            ctx.globalCompositeOperation = 'source-over';
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 bg-slate-950"
            style={{
                background: 'linear-gradient(to bottom right, #050510, #100520)'
            }}
        />
    );
}
