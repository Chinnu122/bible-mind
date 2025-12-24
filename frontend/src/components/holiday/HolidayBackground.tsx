import { motion } from 'framer-motion';

type HolidayMode = 'none' | 'christmas-eve' | 'christmas-day' | 'new-year-countdown' | 'new-year-day';

interface HolidayBackgroundProps {
    mode: HolidayMode;
}

export default function HolidayBackground({ mode }: HolidayBackgroundProps) {
    if (mode === 'none') return null;

    const isChristmas = mode.includes('christmas');

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Base Background Layer */}
            <div
                className={`absolute inset-0 transition-colors duration-2000 ease-in-out ${isChristmas
                    ? 'bg-gradient-to-b from-[#0f2e1c] via-[#1a472a] to-[#05100a]' // Deep Forest Green
                    : 'bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#000000]' // Midnight Blue/Black
                    }`}
            />

            {/* Christmas Tree Abstract Silhouette (Only for Xmas) */}
            {isChristmas && (
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div
                        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[150vw] h-[120vh]"
                        style={{
                            background: 'conic-gradient(from 180deg at 50% 10%, transparent 150deg, #14532d 180deg, transparent 210deg)',
                            filter: 'blur(60px)'
                        }}
                    />
                </div>
            )}

            {/* Glowing Bokeh Lights */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full blur-2xl ${isChristmas
                            ? (i % 3 === 0 ? 'bg-red-500/20' : i % 3 === 1 ? 'bg-amber-400/20' : 'bg-emerald-400/20')
                            : (i % 2 === 0 ? 'bg-blue-500/10' : 'bg-gold-400/10')
                            }`}
                        style={{
                            width: Math.random() * 300 + 100,
                            height: Math.random() * 300 + 100,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Sparkles / Twinkle Layer */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className={`absolute rounded-full ${isChristmas ? 'bg-amber-200' : 'bg-white'}`}
                        style={{
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            boxShadow: isChristmas ? '0 0 4px #FCD34D' : '0 0 4px #FFFFFF'
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Overlay Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />

            {/* Dark Vignette */}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/60" />
        </div>
    );
}
