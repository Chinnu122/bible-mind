import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
    const sizes = {
        sm: { icon: 24, text: 'text-lg' },
        md: { icon: 32, text: 'text-2xl' },
        lg: { icon: 48, text: 'text-4xl' },
        xl: { icon: 64, text: 'text-6xl' }
    };

    const { icon: iconSize, text: textSize } = sizes[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Glow behind */}
                <motion.div
                    className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    {/* Path 1: The Book / Wings Left */}
                    <motion.path
                        d="M50 85C50 85 30 80 15 65C5 55 5 35 15 25C25 15 45 20 50 40"
                        stroke="url(#goldGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Path 2: The Book / Wings Right */}
                    <motion.path
                        d="M50 85C50 85 70 80 85 65C95 55 95 35 85 25C75 15 55 20 50 40"
                        stroke="url(#goldGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Path 3: The Center Light / Mind Spine */}
                    <motion.path
                        d="M50 90V30"
                        stroke="url(#shineGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ y2: 90, opacity: 0 }}
                        animate={{ y2: 30, opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    />

                    {/* Path 4: The Halo / Rays */}
                    <motion.circle
                        cx="50"
                        cy="25"
                        r="8"
                        fill="url(#shineGradient)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5, type: 'spring' }}
                    />

                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#FCD34D" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                        <linearGradient id="shineGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#FCD34D" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <motion.h1
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-400 ${textSize}`}
                    >
                        BIBLE MIND
                    </motion.h1>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-[10px] tracking-[0.3em] text-gold-500/60 uppercase ml-1"
                    >
                        Divine Intelligence
                    </motion.span>
                </div>
            )}
        </div>
    );
}
