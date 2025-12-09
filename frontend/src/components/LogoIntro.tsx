import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoIntroProps {
    onComplete: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
    const [phase, setPhase] = useState<'start' | 'reveal' | 'zoom' | 'done'>('start');

    // Sequence orchestration
    useEffect(() => {
        // Phase 1: Logo Emerges (0s)

        // Phase 2: Text Reveal (1.5s)
        const timer1 = setTimeout(() => setPhase('reveal'), 1500);

        // Phase 3: The Warp Zoom (3.5s)
        const timer2 = setTimeout(() => setPhase('zoom'), 3500);

        // Phase 4: Complete/Done (4.5s - quicker exit for snap feel)
        const timer3 = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 4500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    key="intro-container"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    exit={{ opacity: 0, transition: { duration: 1 } }} // Smooth fade out of black canvas
                >
                    {/* Ambient Glow */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'zoom' ? 0.8 : 0.3 }}
                        className="absolute inset-0 bg-gold-900/20"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, rgba(0, 0, 0, 1) 70%)',
                        }}
                    />

                    {/* Main Logo Container */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={
                            phase === 'start' ? { scale: 1, opacity: 1 } :
                                phase === 'reveal' ? { scale: 1, opacity: 1 } :
                                    phase === 'zoom' ? { scale: 20, opacity: 0 } : {}
                        }
                        transition={
                            phase === 'zoom'
                                ? { duration: 1.2, ease: [0.7, 0, 0.84, 0] } // Accelerating zoom
                                : { duration: 1.5, ease: "easeOut" } // Gentle entry
                        }
                    >
                        {/* The Logo */}
                        <motion.div
                            className="relative w-32 h-32 md:w-48 md:h-48 mb-8"
                            animate={phase === 'zoom' ? { filter: 'blur(10px)' } : { filter: 'blur(0px)' }}
                        >
                            <img
                                src="/logo-intro.png"
                                alt="Bible Mind Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                            />
                            {/* Particle Shine Effect */}
                            <motion.div
                                className="absolute inset-0 bg-white/20 rounded-full"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        </motion.div>

                        {/* Text Container - Masked Reveal */}
                        <div className="overflow-hidden h-20 md:h-24 flex items-center justify-center">
                            <motion.h1
                                initial={{ y: 100 }}
                                animate={
                                    phase === 'start' ? { y: 100 } :
                                        phase === 'reveal' ? { y: 0 } :
                                            phase === 'zoom' ? { y: 50, opacity: 0 } : {}
                                }
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="text-4xl md:text-6xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-600 tracking-[0.2em]"
                            >
                                BIBLE MIND
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={
                                phase === 'reveal' ? { opacity: 0.6 } :
                                    phase === 'zoom' ? { opacity: 0 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-gold-200/60 font-serif tracking-widest text-sm mt-4 uppercase"
                        >
                            Explore the Word
                        </motion.p>
                    </motion.div>

                    {/* Zoom Flash Effect */}
                    {phase === 'zoom' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                            className="absolute inset-0 bg-white z-50 pointer-events-none"
                        />
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
}
