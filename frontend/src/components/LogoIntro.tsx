import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoIntroProps {
    onComplete: () => void;
}

/**
 * Bible Mind Logo Intro Animation - Nebula Genesis
 * Converted from the user's HTML/CSS/JS design
 */
export default function LogoIntro({ onComplete }: LogoIntroProps) {
    const [isVisible, setIsVisible] = useState(true);
    const stageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    // Create title characters on mount
    useEffect(() => {
        if (!titleRef.current) return;

        const text = "BIBLE MIND";
        titleRef.current.innerHTML = '';

        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.animationDelay = `${2.0 + (i * 0.05)}s`; // Faster: start at 2s, 0.05s per char
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            titleRef.current?.appendChild(span);
        });
    }, []);

    // Mouse parallax effect
    useEffect(() => {
        let request: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (request) cancelAnimationFrame(request);

            request = requestAnimationFrame(() => {
                if (!stageRef.current) return;
                const rotY = (window.innerWidth / 2 - e.pageX) / 60;
                const rotX = (window.innerHeight / 2 - e.pageY) / 60;
                stageRef.current.style.transform = `rotateY(${-rotY}deg) rotateX(${rotX}deg)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (request) cancelAnimationFrame(request);
        };
    }, []);

    // Auto-complete after animation - FASTER: 5 seconds total
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
        }, 5000); // 5 seconds total animation (was 10)

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[1000] overflow-hidden"
                    style={{
                        perspective: '2000px',
                        fontFamily: "'Lato', sans-serif"
                    }}
                >
                    {/* CSS Styles */}
                    <style>{`
                        :root {
                            --navy: #1a3c5a;
                            --gold: #bfa37c;
                            --gold-bright: #fff9ed;
                            --void: #000000;
                            --nebula-1: rgba(26, 60, 90, 0.4);
                            --nebula-2: rgba(76, 29, 149, 0.25);
                            --nebula-3: rgba(191, 163, 124, 0.15);
                            --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
                            --transition-epic: cubic-bezier(0.7, 0, 0.1, 1);
                        }

                        .nebula-cloud {
                            position: absolute;
                            width: 140%;
                            height: 140%;
                            border-radius: 50%;
                            filter: blur(80px);
                            mix-blend-mode: screen;
                            will-change: transform, opacity;
                        }

                        .cloud-1 {
                            background: radial-gradient(circle, var(--nebula-1) 0%, transparent 70%);
                            top: -20%;
                            left: -20%;
                            animation: nebulaMove 30s infinite alternate linear;
                        }

                        .cloud-2 {
                            background: radial-gradient(circle, var(--nebula-2) 0%, transparent 70%);
                            bottom: -20%;
                            right: -20%;
                            animation: nebulaMove 25s infinite alternate-reverse linear;
                        }

                        .cloud-3 {
                            background: radial-gradient(circle, var(--nebula-3) 0%, transparent 60%);
                            top: 30%;
                            left: 30%;
                            width: 100%;
                            height: 100%;
                            animation: nebulaMove 40s infinite alternate ease-in-out;
                            opacity: 0.5;
                        }

                        @keyframes nebulaMove {
                            0% { transform: translate(-10%, -10%) rotate(0deg) scale(1); }
                            50% { transform: translate(5%, 5%) rotate(10deg) scale(1.1); }
                            100% { transform: translate(10%, 10%) rotate(-10deg) scale(1); }
                        }

                        .intro-stage {
                            position: relative;
                            z-index: 10;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            transform-style: preserve-3d;
                            will-change: transform, opacity;
                            animation: finalWarp 1.5s 3.5s var(--transition-epic) forwards;
                        }

                        @keyframes finalWarp {
                            0% { transform: scale(1) translateZ(0); filter: blur(0); }
                            30% { transform: scale(0.9) translateZ(-100px); }
                            100% { transform: scale(100) translateZ(3000px); opacity: 0; filter: blur(30px) brightness(5); }
                        }

                        .badge-main {
                            width: 100%;
                            height: 100%;
                            background: radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e5e5 100%);
                            border-radius: 50%;
                            border: 14px solid var(--navy);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            box-shadow: 0 60px 100px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.1);
                            opacity: 0;
                            transform: scale(0.2) rotateX(-60deg);
                            animation: badgeRise 1.0s var(--transition-smooth) forwards;
                            will-change: transform, opacity;
                        }

                        @keyframes badgeRise {
                            to { opacity: 1; transform: scale(1) rotateX(0deg); }
                        }

                        .badge-main::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(135deg, transparent 45%, rgba(255, 255, 255, 0.7) 50%, transparent 55%);
                            border-radius: 50%;
                            background-size: 400% 400%;
                            animation: surfaceSweep 8s infinite linear;
                        }

                        @keyframes surfaceSweep {
                            0% { background-position: -200% -200%; }
                            100% { background-position: 200% 200%; }
                        }

                        .svg-part {
                            fill: none;
                            stroke: var(--navy);
                            stroke-width: 3.5;
                            stroke-dasharray: 1000;
                            stroke-dashoffset: 1000;
                            animation: drawSvg 1.2s 0.6s var(--transition-smooth) forwards;
                        }

                        .svg-cross {
                            fill: var(--gold);
                            opacity: 0;
                            transform-origin: center;
                            animation: crossLand 0.8s 1.5s var(--transition-epic) forwards;
                        }

                        @keyframes drawSvg {
                            to { stroke-dashoffset: 0; }
                        }

                        @keyframes crossLand {
                            0% { opacity: 0; transform: scale(4); filter: blur(20px); }
                            70% { opacity: 1; transform: scale(0.9); }
                            100% { opacity: 1; transform: scale(1); filter: blur(0); }
                        }

                        .book-reveal {
                            position: absolute;
                            bottom: 55px;
                            width: 170px;
                            opacity: 0;
                            transform: translateY(30px) rotateX(-90deg);
                            animation: bookOpen 0.8s 1.0s var(--transition-smooth) forwards;
                        }

                        @keyframes bookOpen {
                            to { opacity: 1; transform: translateY(0) rotateX(0deg); }
                        }

                        .char {
                            font-family: 'Cinzel', serif;
                            font-size: 64px;
                            font-weight: 900;
                            color: #fff;
                            opacity: 0;
                            transform: translateY(30px);
                            filter: blur(10px);
                            animation: charEnter 0.8s var(--transition-smooth) forwards;
                            will-change: transform, opacity, filter;
                            display: inline-block;
                        }

                        @keyframes charEnter {
                            to { opacity: 1; transform: translateY(0); filter: blur(0); }
                        }

                        .light-hit {
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            background: white;
                            border-radius: 50%;
                            box-shadow: 0 0 100px 40px white;
                            opacity: 0;
                            pointer-events: none;
                            z-index: 20;
                            animation: hitTrigger 0.6s 1.5s var(--transition-epic);
                        }

                        @keyframes hitTrigger {
                            0% { transform: scale(0); opacity: 1; }
                            100% { transform: scale(50); opacity: 0; }
                        }
                    `}</style>

                    {/* Nebula Background */}
                    <div
                        className="absolute inset-0 z-[1] overflow-hidden bg-black"
                        style={{
                            background: 'black'
                        }}
                    >
                        {/* Noise overlay */}
                        <div
                            className="absolute"
                            style={{
                                inset: '-100%',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                opacity: 0.08,
                                pointerEvents: 'none',
                                mixBlendMode: 'overlay'
                            }}
                        />
                        <div className="nebula-cloud cloud-1" />
                        <div className="nebula-cloud cloud-2" />
                        <div className="nebula-cloud cloud-3" />
                    </div>

                    {/* Light Hit Effect */}
                    <div className="light-hit" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

                    {/* Main Stage */}
                    <div
                        ref={stageRef}
                        className="intro-stage fixed inset-0 flex items-center justify-center"
                    >
                        {/* Artifact Wrap */}
                        <div
                            className="relative"
                            style={{
                                width: '320px',
                                height: '320px',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Badge Main */}
                            <div className="badge-main">
                                {/* Logo SVG */}
                                <svg className="w-[200px] h-[200px] z-[5]" viewBox="0 0 100 100">
                                    <path className="svg-part" d="M35,30 Q20,30 20,50 Q20,70 35,70" />
                                    <path className="svg-part" d="M65,30 Q80,30 80,50 Q80,70 65,70" />
                                    <path className="svg-part" style={{ animationDelay: '1.8s' }} d="M32,45 Q26,45 26,55" />
                                    <path className="svg-part" style={{ animationDelay: '2.0s' }} d="M68,45 Q74,45 74,55" />

                                    <g className="svg-cross">
                                        <rect x="46" y="22" width="8" height="44" rx="1.5" />
                                        <rect x="36" y="34" width="28" height="8" rx="1.5" />
                                    </g>
                                </svg>

                                {/* Book Reveal */}
                                <svg className="book-reveal" viewBox="0 0 100 40">
                                    <path fill="#bfa37c" d="M50,35 L10,30 L10,12 L50,18 Z" />
                                    <path fill="#bfa37c" d="M50,35 L90,30 L90,12 L50,18 Z" opacity="0.8" />
                                </svg>
                            </div>
                        </div>

                        {/* Text Wrap - Directly BELOW the logo badge */}
                        <div className="mt-8 text-center">
                            <div ref={titleRef} className="flex gap-[10px] justify-center" />
                            <p
                                className="text-[14px] tracking-[16px] text-[#bfa37c] uppercase mt-[15px] opacity-0"
                                style={{ animation: 'fadeIn 1s 2.8s ease forwards' }}
                            >
                                Wisdom & Understanding
                            </p>
                        </div>
                    </div>

                    {/* Skip Button */}
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onComplete, 300);
                        }}
                        className="absolute bottom-8 right-8 z-[100] px-5 py-2.5 rounded-full text-[10px] tracking-[3px] uppercase cursor-pointer transition-all duration-300"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(5px)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#bfa37c';
                            e.currentTarget.style.borderColor = '#bfa37c';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        Skip Intro
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
