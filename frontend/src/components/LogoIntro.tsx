import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoIntroProps {
    onComplete: () => void;
    skipDelay?: number; // Time before skip button appears (ms)
}

export default function LogoIntro({ onComplete, skipDelay = 2000 }: LogoIntroProps) {
    const [phase, setPhase] = useState<'initial' | 'zoom' | 'glow' | 'title' | 'complete'>('initial');
    const [showSkip, setShowSkip] = useState(false);

    useEffect(() => {
        // Show skip button after delay
        const skipTimer = setTimeout(() => setShowSkip(true), skipDelay);

        // Animation sequence
        const phaseTimers = [
            setTimeout(() => setPhase('zoom'), 500),
            setTimeout(() => setPhase('glow'), 2000),
            setTimeout(() => setPhase('title'), 3500),
            setTimeout(() => setPhase('complete'), 5500),
            setTimeout(() => onComplete(), 6500),
        ];

        return () => {
            clearTimeout(skipTimer);
            phaseTimers.forEach(clearTimeout);
        };
    }, [onComplete, skipDelay]);

    const handleSkip = () => {
        onComplete();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Nebula Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Stars */}
                    {[...Array(100)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}

                    {/* Nebula Gradients */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: [
                                'radial-gradient(ellipse at 30% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%)',
                                'radial-gradient(ellipse at 70% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%)',
                                'radial-gradient(ellipse at 30% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%)',
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: [
                                'radial-gradient(ellipse at 70% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 40%)',
                                'radial-gradient(ellipse at 30% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 40%)',
                                'radial-gradient(ellipse at 70% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 40%)',
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                </div>

                {/* Animated Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3].map((ring) => (
                        <motion.div
                            key={ring}
                            className="absolute border-2 border-gold-500/20 rounded-full"
                            style={{
                                width: `${ring * 200}px`,
                                height: `${ring * 200}px`,
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.5, 0.2],
                                rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
                            }}
                            transition={{
                                duration: 10 + ring * 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    ))}
                </div>

                {/* Main Logo Container */}
                <div className="relative z-10 flex flex-col items-center">

                    {/* Cross/Bible Icon with Zoom Effect */}
                    <motion.div
                        className="relative"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={
                            phase === 'initial' ? { scale: 0, opacity: 0 } :
                                phase === 'zoom' ? { scale: [0, 1.5, 1], opacity: 1 } :
                                    phase === 'glow' ? { scale: 1, opacity: 1 } :
                                        { scale: 1, opacity: 1 }
                        }
                        transition={{
                            duration: phase === 'zoom' ? 1.5 : 0.5,
                            ease: 'easeOut'
                        }}
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className="absolute inset-0 blur-3xl"
                            animate={
                                phase === 'glow' || phase === 'title' || phase === 'complete'
                                    ? { opacity: [0, 0.8, 0.4], scale: [1, 1.5, 1.2] }
                                    : { opacity: 0, scale: 1 }
                            }
                            transition={{ duration: 1.5 }}
                        >
                            <div className="w-40 h-40 bg-gold-500 rounded-full" />
                        </motion.div>

                        {/* Cross Symbol */}
                        <motion.div
                            className="relative w-40 h-40 flex items-center justify-center"
                            animate={
                                phase === 'glow' || phase === 'title' || phase === 'complete'
                                    ? { filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))' }
                                    : { filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0))' }
                            }
                        >
                            <svg viewBox="0 0 100 100" className="w-32 h-32">
                                {/* Vertical beam */}
                                <motion.rect
                                    x="42"
                                    y="10"
                                    width="16"
                                    height="80"
                                    rx="2"
                                    fill="url(#crossGradient)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                                {/* Horizontal beam */}
                                <motion.rect
                                    x="20"
                                    y="30"
                                    width="60"
                                    height="16"
                                    rx="2"
                                    fill="url(#crossGradient)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                />
                                {/* Gradient definition */}
                                <defs>
                                    <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FFD700" />
                                        <stop offset="50%" stopColor="#FFA500" />
                                        <stop offset="100%" stopColor="#FFD700" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    </motion.div>

                    {/* Title Text */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                            phase === 'title' || phase === 'complete'
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 30 }
                        }
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-main bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Bible Mind
                        </motion.h1>
                        <motion.p
                            className="text-lg text-slate-400 mt-2 font-serif italic"
                            initial={{ opacity: 0 }}
                            animate={phase === 'complete' ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            "Thy word is a lamp unto my feet"
                        </motion.p>
                    </motion.div>

                    {/* Loading indicator */}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={phase === 'complete' ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-gold-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Skip Button */}
                <AnimatePresence>
                    {showSkip && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-8 right-8 px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors border border-slate-700 hover:border-gold-500/50 rounded-full"
                            onClick={handleSkip}
                        >
                            Skip →
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Particle effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {phase !== 'initial' && [...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-gold-400 rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                            animate={{
                                x: [0, (Math.random() - 0.5) * 400],
                                y: [0, (Math.random() - 0.5) * 400],
                                opacity: [1, 0],
                                scale: [1, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: 1.5 + i * 0.1,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
