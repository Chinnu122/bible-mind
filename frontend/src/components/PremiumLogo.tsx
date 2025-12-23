import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PremiumLogoProps {
    className?: string;
    animate?: boolean;
    onAnimationComplete?: () => void;
}

const PremiumLogo: React.FC<PremiumLogoProps> = ({ className = "", animate = false, onAnimationComplete }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (animate && audioRef.current) {
            audioRef.current.volume = 0.4;
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
    }, [animate]);

    return (
        <motion.div
            className={`relative flex flex-col items-center justify-center ${className}`}
            variants={{
                hidden: { opacity: 0, scale: 0.5 },
                intro: {
                    opacity: 1,
                    scale: [0.5, 0.8, 1.2, 1],
                    transition: { duration: 6, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }
                },
                static: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0 }
                },
                exit: {
                    scale: 0.5,
                    x: -window.innerWidth / 3,
                    y: -window.innerHeight / 3,
                    opacity: 0,
                    transition: { duration: 1.5, ease: "easeInOut" }
                }
            }}
            initial={animate ? "hidden" : "static"}
            animate={animate ? "intro" : "static"}
            onAnimationComplete={() => {
                if (onAnimationComplete) onAnimationComplete();
            }}
        >
            {/* Intro Audio - using a cinematic sound effect URL */}
            {animate && (
                <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/24/audio_30704c7c64.mp3" />
            )}

            <div className="relative group cursor-pointer">
                {/* Logo Icon */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold-600 to-amber-300 rounded-xl rotate-45 shadow-lg shadow-gold-500/20 group-hover:rotate-90 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-2 bg-black rounded-lg rotate-45 flex items-center justify-center border border-gold-500/30">
                        <span className="font-main text-3xl text-gold-400 font-bold">BM</span>
                    </div>
                </div>

                {/* Text Logo */}
                <div className="text-center">
                    <h1 className="font-main text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-crema-100 via-gold-300 to-crema-100 tracking-wider">
                        BIBLE MIND
                    </h1>
                    {animate && (
                        <motion.div
                            className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent w-full mt-2"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PremiumLogo;
