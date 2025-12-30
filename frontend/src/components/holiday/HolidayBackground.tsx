import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '../../contexts/PerformanceContext';
import LiveAbstractWallpaper from '../LiveAbstractWallpaper';

type HolidayMode = 'none' | 'christmas-eve' | 'christmas-day' | 'new-year-countdown' | 'new-year-day';

interface HolidayBackgroundProps {
    mode: HolidayMode;
}

export default function HolidayBackground({ mode }: HolidayBackgroundProps) {
    const { level, enableBlur, enableEffects } = usePerformance();

    if (mode === 'none') return null;

    const isChristmas = mode.includes('christmas');

    // Reduce element count based on performance level
    const bokehCount = level === 'high' ? 12 : level === 'medium' ? 6 : 3;
    const sparkleCount = level === 'high' ? 30 : level === 'medium' ? 15 : 5;

    // Memoize random positions to avoid recalculating on every render
    const bokehPositions = useMemo(() =>
        [...Array(bokehCount)].map(() => ({
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            top: Math.random() * 100,
            left: Math.random() * 100,
            duration: Math.random() * 5 + 8,
        })),
        [bokehCount]);

    const sparklePositions = useMemo(() =>
        [...Array(sparkleCount)].map(() => ({
            size: Math.random() * 3 + 1,
            top: Math.random() * 100,
            left: Math.random() * 100,
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 5,
        })),
        [sparkleCount]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Live Abstract Wallpaper (Black/White) as Base Layer */}
            <LiveAbstractWallpaper theme="dark" isConcentrated={level !== 'high'} />

            {/* Semi-transparent overlay to keep content readable */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/40"
            />

            {/* Christmas Tree Abstract Silhouette (Only for Xmas, high perf only) */}
            {isChristmas && level === 'high' && (
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div
                        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[150vw] h-[120vh]"
                        style={{
                            background: 'conic-gradient(from 180deg at 50% 10%, transparent 150deg, rgba(255,255,255,0.10) 180deg, transparent 210deg)',
                            filter: enableBlur ? 'blur(60px)' : 'none'
                        }}
                    />
                </div>
            )}

            {/* Glowing Bokeh Lights - Reduced count */}
            {enableEffects && (
                <div className="absolute inset-0">
                    {bokehPositions.map((pos, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full ${enableBlur ? 'blur-2xl' : 'blur-md'} ${i % 3 === 0 ? 'bg-white/10' : i % 3 === 1 ? 'bg-slate-200/10' : 'bg-zinc-200/10'}`}
                            style={{
                                width: pos.width,
                                height: pos.height,
                                top: `${pos.top}%`,
                                left: `${pos.left}%`,
                                willChange: 'transform, opacity',
                            }}
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: pos.duration,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Sparkles / Twinkle Layer - Reduced count */}
            {enableEffects && (
                <div className="absolute inset-0">
                    {sparklePositions.map((pos, i) => (
                        <motion.div
                            key={`star-${i}`}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: pos.size,
                                height: pos.size,
                                top: `${pos.top}%`,
                                left: `${pos.left}%`,
                                willChange: 'opacity',
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: pos.duration,
                                repeat: Infinity,
                                delay: pos.delay,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Dark Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
        </div>
    );
}
