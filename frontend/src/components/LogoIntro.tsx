import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LogoIntro.css';
import { SkipForward } from 'lucide-react';

interface LogoIntroProps {
    onComplete: () => void;
}

const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
    // Only one scene: The Logo Intro
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 1000); // Wait a bit before unmounting
        }, 4000); // 4 seconds total duration

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white font-sans overflow-hidden cursor-none">
            {/* Background Grain & Effects */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] grain-overlay"></div>
            <div className="scanline"></div>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="fixed top-[40px] right-[40px] z-[60] flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
                Skip <SkipForward size={14} />
            </button>

            {/* Stage */}
            <AnimatePresence>
                {!isComplete && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-[#050505] nebula-bg-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="text-center z-20">
                            <motion.h1
                                className="text-7xl md:text-9xl font-serif font-bold tracking-tighter mb-4"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                                Bible Mind
                            </motion.h1>
                            <motion.div
                                className="h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto"
                                initial={{ width: 0 }}
                                animate={{ width: "200px" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                            <motion.p
                                className="mt-6 text-sm uppercase tracking-[0.3em] opacity-70 text-gold-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 1 }}
                            >
                                Divine Wisdom
                            </motion.p>
                        </div>
                        <div className="absolute inset-0 animate-pulse opacity-30 bg-[url('/img/nebula-bg.svg')] bg-cover bg-center" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LogoIntro;
