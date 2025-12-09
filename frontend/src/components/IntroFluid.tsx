import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface IntroFluidProps {
    onComplete: () => void;
}

export const IntroFluid: React.FC<IntroFluidProps> = ({ onComplete }) => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Disable scrolling during intro
        document.body.style.overflow = 'hidden';

        // Start text animation
        const timer1 = setTimeout(() => setShowText(true), 500);

        // Complete intro
        const timer2 = setTimeout(() => {
            onComplete();
            document.body.style.overflow = 'unset';
        }, 4500); // 4.5s total duration

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            document.body.style.overflow = 'unset';
        };
    }, [onComplete]);

    const letterContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5,
            },
        },
        exit: {
            opacity: 0,
            scale: 1.5,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    const letter: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            scale: 3
        },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1] as any // Custom cubic bezier
            }
        },
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            <div className="relative z-10 overflow-hidden px-4">
                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white/90"
                    variants={letterContainer}
                    initial="hidden"
                    animate={showText ? "show" : "hidden"}
                    exit="exit"
                    style={{
                        textShadow: "0 0 40px rgba(255,255,255,0.4)"
                    }}
                >
                    {Array.from("BIBLE MIND").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letter}
                            className="inline-block"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Cinematographic light leak / flare effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent blur-3xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.2, 1.5],
                        rotate: [0, 15, 30]
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                />
            </div>

            {/* Background stars/particles */}
            <div className="absolute inset-0 z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: Math.random() * 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100], // Float up
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: Math.random() * 2 + 1 + "px",
                            height: Math.random() * 2 + 1 + "px",
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
