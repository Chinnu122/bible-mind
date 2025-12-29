import { useEffect, useRef } from 'react';

/**
 * AbstractLinesWallpaper - Flowing lines background like motionbgs.com
 * Canvas-based animated abstract lines with gradient colors
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
        canvas.width = width;
        canvas.height = height;

        // Line configuration
        const lineCount = 50;
        const lines: Line[] = [];

        interface Line {
            x: number;
            y: number;
            length: number;
            speed: number;
            angle: number;
            angleSpeed: number;
            width: number;
            hue: number;
            opacity: number;
            points: { x: number; y: number }[];
        }

        // Initialize lines
        for (let i = 0; i < lineCount; i++) {
            lines.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: 50 + Math.random() * 150,
                speed: 0.3 + Math.random() * 0.7,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.02,
                width: 1 + Math.random() * 2,
                hue: 200 + Math.random() * 60, // Blue to purple range
                opacity: 0.1 + Math.random() * 0.3,
                points: []
            });
        }

        // Initialize point trails
        lines.forEach(line => {
            for (let j = 0; j < 20; j++) {
                line.points.push({ x: line.x, y: line.y });
            }
        });

        function animate() {
            if (!ctx) return;

            // Fade effect for trails
            ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            ctx.fillRect(0, 0, width, height);

            lines.forEach(line => {
                // Update position
                line.angle += line.angleSpeed;
                line.x += Math.cos(line.angle) * line.speed;
                line.y += Math.sin(line.angle) * line.speed;

                // Wrap around screen
                if (line.x < -50) line.x = width + 50;
                if (line.x > width + 50) line.x = -50;
                if (line.y < -50) line.y = height + 50;
                if (line.y > height + 50) line.y = -50;

                // Update point trail
                line.points.pop();
                line.points.unshift({ x: line.x, y: line.y });

                // Draw line with gradient
                ctx.beginPath();
                ctx.moveTo(line.points[0].x, line.points[0].y);

                for (let i = 1; i < line.points.length; i++) {
                    const point = line.points[i];
                    ctx.lineTo(point.x, point.y);
                }

                const gradient = ctx.createLinearGradient(
                    line.points[0].x, line.points[0].y,
                    line.points[line.points.length - 1].x, line.points[line.points.length - 1].y
                );
                gradient.addColorStop(0, `hsla(${line.hue}, 80%, 60%, ${line.opacity})`);
                gradient.addColorStop(0.5, `hsla(${line.hue + 30}, 70%, 50%, ${line.opacity * 0.7})`);
                gradient.addColorStop(1, `hsla(${line.hue + 60}, 60%, 40%, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = line.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();

                // Add glow effect
                ctx.shadowColor = `hsla(${line.hue}, 100%, 70%, 0.5)`;
                ctx.shadowBlur = 10;
            });

            // Draw connecting lines between nearby points
            ctx.shadowBlur = 0;
            for (let i = 0; i < lines.length; i++) {
                for (let j = i + 1; j < lines.length; j++) {
                    const dx = lines[i].x - lines[j].x;
                    const dy = lines[i].y - lines[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(lines[i].x, lines[i].y);
                        ctx.lineTo(lines[j].x, lines[j].y);
                        ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        }

        // Handle resize
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);
        };

        window.addEventListener('resize', handleResize);

        // Initial clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Start animation
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0"
            style={{
                background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0a1a 100%)'
            }}
        />
    );
}
