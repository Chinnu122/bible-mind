import { useState, useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';
import LogoSVG from './LogoSVG';

// --- Constants ---

const SEQUENCES = [
    {
        text: "In the beginning God created the heavens and the earth.",
        ref: "Genesis 1:1",
        duration: 7000,
        theme: "void" // Floating particles
    },
    {
        text: "In the beginning was the Word, and the Word was God.",
        ref: "John 1:1",
        duration: 7000,
        theme: "light" // Radiating rays
    },
    {
        text: "Be transformed by the renewing of your mind.",
        ref: "Romans 12:2",
        duration: 8000,
        theme: "mind" // Connected network
    }
];

// --- Generative Canvas Component ---

const LivingBackground = ({ theme }: { theme: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        const particles: { x: number; y: number; vx: number; vy: number; size: number; life: number }[] = [];

        // Particle Config
        const PARTICLE_COUNT = 80;
        const CONNECTION_DIST = 120; // For "mind" theme

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize Particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                life: Math.random() // For twinkling
            });
        }

        const draw = () => {
            // Clear with trail effect for "Light" theme, opaque for others
            ctx.fillStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(5, 5, 5, 1)';
            ctx.fillRect(0, 0, width, height);

            // Theme-based Colors
            let color = '255, 255, 255'; // White default
            if (theme === 'light') color = '255, 215, 0'; // Gold
            if (theme === 'mind') color = '168, 85, 247'; // Purple/Platinum

            particles.forEach((p, i) => {
                // --- BEHAVIOR ---

                if (theme === 'void') {
                    // Slow floating
                    p.x += p.vx;
                    p.y += p.vy;
                } else if (theme === 'light') {
                    // Radiate from center
                    const dx = p.x - width / 2;
                    const dy = p.y - height / 2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Move away from center
                    p.x += (dx / dist) * 2;
                    p.y += (dy / dist) * 2;

                    // Reset if out of bounds
                    if (dist > Math.max(width, height) / 1.5) {
                        p.x = width / 2 + (Math.random() - 0.5) * 10;
                        p.y = height / 2 + (Math.random() - 0.5) * 10;
                    }
                } else if (theme === 'mind') {
                    // Network floating
                    p.x += p.vx * 1.5;
                    p.y += p.vy * 1.5;
                }

                // Boundary Wrap
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Twinkle
                p.life += 0.02;
                const opacity = (Math.sin(p.life) + 1) / 2 * 0.5 + 0.2;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${opacity})`;
                ctx.fill();

                // --- CONNECTIONS (For "Mind" Theme) ---
                if (theme === 'mind') {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < CONNECTION_DIST) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(${color}, ${1 - dist / CONNECTION_DIST})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            });

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        };
    }, [theme]);

    // @ts-ignore
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 transition-opacity duration-1000" />;
};

interface ImmersiveIntroProps {
    onComplete: () => void;
}

export default function ImmersiveIntro({ onComplete }: ImmersiveIntroProps) {
    const [started, setStarted] = useState(false);
    const [sequenceIndex, setSequenceIndex] = useState(-1);
    const [showLogo, setShowLogo] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('void');

    const handleStart = () => {
        setStarted(true);
        runSequence(0);
    };

    const handleSkip = () => {
        // Skip to the end sequence
        setSequenceIndex(SEQUENCES.length);
        setShowLogo(true);
        setCurrentTheme('mind');
        setTimeout(finish, 2000); // Allow logo to be seen briefly before transition
    };

    const finish = () => {
        onComplete(); // Trigger exit and layoutID transition
    };

    const runSequence = (index: number) => {
        if (index >= SEQUENCES.length) {
            setTimeout(() => {
                setShowLogo(true);
                // Wait a bit then finish
                setTimeout(finish, 3000);
            }, 1000);
            return;
        }

        setSequenceIndex(index);
        setCurrentTheme(SEQUENCES[index].theme);

        setTimeout(() => {
            runSequence(index + 1);
        }, SEQUENCES[index].duration + 1000);
    };

    const currentData = sequenceIndex >= 0 && sequenceIndex < SEQUENCES.length ? SEQUENCES[sequenceIndex] : null;

    return (
        <div className="fixed inset-0 z-[100] w-full h-screen overflow-hidden flex flex-col items-center justify-center font-serif text-[#e0e0e0] bg-black">

            {/* Background Music */}
            {started && (
                <audio
                    src="/intro-music.mp3"
                    autoPlay
                    loop
                    style={{ display: 'none' }}
                />
            )}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        /* Film Grain */
        .film-grain {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.3;
            pointer-events: none;
            z-index: 10;
        }

        /* Vignette */
        .vignette {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, transparent 50%, black 140%);
            z-index: 10;
            pointer-events: none;
        }

        /* Ambient Glow based on Theme */
        .ambient-light {
            position: absolute;
            inset: 0;
            z-index: 1;
            transition: background 3s ease;
        }
        .bg-void { background: radial-gradient(circle at 50% 120%, #1e3a8a 0%, transparent 50%); }
        .bg-light { background: radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 70%); }
        .bg-mind { background: radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.15) 0%, transparent 70%); }

        /* Text Animations */
        .reveal-up {
            animation: slide-up-fade 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-up-fade {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        /* Cinematic Bars */
        .letterbox {
          position: absolute;
          left: 0;
          width: 100%;
          height: 12vh;
          background: black;
          z-index: 50;
          transition: transform 1.5s ease-out;
        }
        .letterbox-top { top: 0; transform: translateY(-100%); }
        .letterbox-bottom { bottom: 0; transform: translateY(100%); }
        .cinematic-mode .letterbox-top { transform: translateY(0); }
        .cinematic-mode .letterbox-bottom { transform: translateY(0); }

        /* Text Shines */
        .shine-gold { background: linear-gradient(to right, #b45309, #fcd34d, #b45309); -webkit-background-clip: text; color: transparent; background-size: 200%; animation: shine 6s linear infinite; }
        .shine-blue { background: linear-gradient(to right, #1e40af, #93c5fd, #1e40af); -webkit-background-clip: text; color: transparent; background-size: 200%; animation: shine 6s linear infinite; }
        .shine-purple { background: linear-gradient(to right, #6b21a8, #d8b4fe, #6b21a8); -webkit-background-clip: text; color: transparent; background-size: 200%; animation: shine 6s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
      `}</style>

            {/* --- LAYERS --- */}

            {/* 1. Living Canvas Background */}
            <LivingBackground theme={currentTheme} />

            {/* 2. Ambient Color Glow */}
            <div className={`ambient-light bg-${currentTheme}`}></div>

            {/* 3. Texture Overlays */}
            <div className="film-grain"></div>
            <div className="vignette"></div>

            {/* 4. Cinematic Bars */}
            <div className={`letterbox letterbox-top ${started ? 'cinematic-mode' : ''}`}></div>
            <div className={`letterbox letterbox-bottom ${started ? 'cinematic-mode' : ''}`}></div>

            {/* --- UI --- */}

            {!started && (
                <div className="z-50 animate-in fade-in duration-1000 flex flex-col items-center">
                    <div className="mb-6 text-[#d4af37] font-['Cinzel'] tracking-[0.4em] uppercase text-xs opacity-60">Immersive Experience</div>
                    <button
                        onClick={handleStart}
                        className="group relative px-14 py-5 bg-transparent border border-[#d4af37]/30 text-[#d4af37] font-['Playfair_Display'] text-xl hover:bg-[#d4af37]/5 transition-all duration-700 backdrop-blur-sm"
                    >
                        <span className="relative z-10 group-hover:tracking-widest transition-all duration-500">Begin</span>
                    </button>
                </div>
            )}

            {started && !showLogo && (
                <button onClick={handleSkip} className="absolute bottom-10 right-10 text-white/20 hover:text-white/80 transition-colors z-[60] flex items-center gap-2 font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase">
                    Skip <SkipForward className="w-3 h-3" />
                </button>
            )}

            {/* --- TEXT CONTENT --- */}

            {started && !showLogo && currentData && (
                <div className="z-40 w-[85%] max-w-6xl text-center flex flex-col items-center justify-center min-h-[400px]">

                    <div key={sequenceIndex} className="reveal-up">

                        {/* Main Verse */}
                        <div
                            className={`text-4xl md:text-6xl lg:text-7xl leading-tight font-['Playfair_Display'] font-medium tracking-tight drop-shadow-2xl
                ${currentTheme === 'void' ? 'shine-blue' : ''}
                ${currentTheme === 'light' ? 'shine-gold' : ''}
                ${currentTheme === 'mind' ? 'shine-purple' : ''}
              `}
                        >
                            {currentData.text}
                        </div>

                        {/* Divider */}
                        <div className="w-16 h-[1px] bg-white/20 mx-auto my-10"></div>

                        {/* Reference */}
                        <div className="font-['Cinzel'] text-xl md:text-2xl tracking-[0.6em] uppercase text-white/80">
                            {currentData.ref}
                        </div>
                    </div>

                </div>
            )}

            {/* --- LOGO --- */}

            {showLogo && (
                <div className="z-50 flex flex-col items-center reveal-up">
                    <div className="mb-10 hover:scale-105 transition-transform duration-[2000ms] cursor-pointer drop-shadow-2xl">
                        {/* The Logo with layoutId for transition */}
                        <LogoSVG className="w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_0_60px_rgba(255,255,255,0.6)] relative z-20" layoutId="main-logo-transition" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold font-['Playfair_Display'] shine-purple tracking-tighter drop-shadow-2xl">
                        Bible mind
                    </h1>
                    <div className="mt-8 font-['Cinzel'] text-white/60 text-sm md:text-lg tracking-[0.8em] uppercase border-t border-white/10 pt-4">
                        Wisdom Transcending Time
                    </div>
                </div>
            )}

        </div>
    );
}
