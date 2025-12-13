import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SkipForward } from 'lucide-react';

// --- Constants ---

const SEQUENCES = [
    {
        text: "In the beginning God created the heavens and the earth.",
        ref: "Genesis 1:1",
        duration: 7000,
        theme: "void"
    },
    {
        text: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
        ref: "Psalm 19:1",
        duration: 6500,
        theme: "celestial"
    },
    {
        text: "In the beginning was the Word, and the Word was God.",
        ref: "John 1:1",
        duration: 7000,
        theme: "light"
    },
    {
        text: "Trust in the LORD with all your heart and lean not on your own understanding.",
        ref: "Proverbs 3:5",
        duration: 6000,
        theme: "wisdom"
    },
    {
        text: "Be transformed by the renewing of your mind.",
        ref: "Romans 12:2",
        duration: 8000,
        theme: "mind"
    },
    {
        text: "I am the Alpha and the Omega, the First and the Last, the Beginning and the End.",
        ref: "Revelation 22:13",
        duration: 7500,
        theme: "omega"
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

        // Track mouse for interaction
        const handleMouseMove = (e: MouseEvent) => {
            (window as any).mouseX = e.clientX;
            (window as any).mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

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

            // Mouse interaction
            const mouseX = ((window as any).mouseX || 0);
            const mouseY = ((window as any).mouseY || 0);

            particles.forEach((p, i) => {
                // --- BEHAVIOR ---

                // Mouse Repulsion (Surprise 3)
                const dxMouse = p.x - mouseX;
                const dyMouse = p.y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 150) {
                    const angle = Math.atan2(dyMouse, dxMouse);
                    p.vx += Math.cos(angle) * 0.5;
                    p.vy += Math.sin(angle) * 0.5;
                }

                if (theme === 'void') {
                    // Slow floating
                    p.x += p.vx;
                    p.y += p.vy;
                    // Friction
                    p.vx *= 0.99;
                    p.vy *= 0.99;
                } else if (theme === 'light' || theme === 'celestial') {
                    // Radiate from center
                    const dx = p.x - width / 2;
                    const dy = p.y - height / 2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Move away from center
                    p.x += (dx / dist) * 2 + p.vx;
                    p.y += (dy / dist) * 2 + p.vy;

                    p.vx *= 0.95;
                    p.vy *= 0.95;

                    // Reset if out of bounds
                    if (dist > Math.max(width, height) / 1.5) {
                        p.x = width / 2 + (Math.random() - 0.5) * 10;
                        p.y = height / 2 + (Math.random() - 0.5) * 10;
                    }
                } else if (theme === 'mind' || theme === 'wisdom' || theme === 'omega') {
                    // Network floating
                    p.x += p.vx * 1.5;
                    p.y += p.vy * 1.5;
                    // Bounce off walls
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                }

                // Boundary Wrap (except mind theme which bounces)
                if (theme !== 'mind' && theme !== 'wisdom' && theme !== 'omega') {
                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;
                }

                // Twinkle
                p.life += 0.02;
                const opacity = (Math.sin(p.life) + 1) / 2 * 0.5 + 0.2;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${opacity})`;
                ctx.fill();

                // --- CONNECTIONS (For "Mind" Theme) ---
                if (theme === 'mind' || theme === 'wisdom') {
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
    const [isFinishing, setIsFinishing] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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
        setIsFinishing(true);
        setTimeout(() => {
            const audio = audioRef.current;
            if (audio) {
                // Smooth fade out
                const fadeOutDuration = 2000;
                const intervalTime = 50;
                const steps = fadeOutDuration / intervalTime;
                const volumeStep = audio.volume / steps;

                const fadeInterval = setInterval(() => {
                    if (audio.volume > volumeStep) {
                        audio.volume = Math.max(0, audio.volume - volumeStep);
                    } else {
                        audio.volume = 0;
                        clearInterval(fadeInterval);
                        onComplete();
                    }
                }, intervalTime);
            } else {
                onComplete();
            }
        }, 800);
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
        <div className={`fixed inset-0 z-[100] w-full h-screen overflow-hidden flex flex-col items-center justify-center font-serif text-[#e0e0e0] bg-black transition-transform duration-1000 ${isFinishing ? 'scale-[20] opacity-0 blur-xl' : ''}`}>

            {/* Surprise 1: Nebula Background */}
            <div className="absolute inset-0 z-0 opacity-60">
                <img src="/bg-intro-nebula.png" alt="Nebula" className="w-full h-full object-cover" />
            </div>

            {/* Background Music */}
            {started && (
                <audio
                    ref={audioRef}
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
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    onClick={handleSkip}
                    className="absolute bottom-8 right-8 md:bottom-10 md:right-10 text-white/40 hover:text-white/90 hover:bg-white/10 px-4 py-2 rounded-full transition-all z-[60] flex items-center gap-2 font-['Cinzel'] text-[10px] tracking-[0.3em] uppercase backdrop-blur-sm border border-white/5"
                >
                    Skip <SkipForward className="w-3 h-3" />
                </motion.button>
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

            {/* --- LOGO --- */}

            {showLogo && (
                <div className="z-50 flex flex-col items-center reveal-up relative">
                    {/* Surprise 5: Cinematic Flash */}
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-white z-[100] pointer-events-none scale-[5]"
                    />
                    <div className="mb-10 hover:scale-105 transition-transform duration-[2000ms] cursor-pointer drop-shadow-2xl">
                        {/* The Logo with layoutId for transition */}
                        <motion.img
                            src="/logo-v2.png"
                            alt="Bible Mind Logo"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_60px_rgba(255,215,0,0.4)] relative z-20"
                            layoutId="main-logo-transition"
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.5, type: "spring" }}
                        />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold font-['Playfair_Display'] shine-gold tracking-tighter drop-shadow-2xl relative group">
                        <span className="relative z-10">Bible Mind</span>
                        {/* Surprise 7: Glitch Effect Layers */}
                        <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 animate-pulse mix-blend-screen select-none pointer-events-none">Bible Mind</span>
                        <span className="absolute top-0 left-0 ml-[2px] text-blue-500 opacity-70 animate-pulse mix-blend-screen select-none pointer-events-none" style={{ animationDelay: '0.1s' }}>Bible Mind</span>
                    </h1>
                    <div className="mt-8 font-['Cinzel'] text-white/60 text-sm md:text-lg tracking-[0.8em] uppercase border-t border-white/10 pt-4">
                        Wisdom Transcending Time
                    </div>
                </div>
            )}

        </div>
    );

}

