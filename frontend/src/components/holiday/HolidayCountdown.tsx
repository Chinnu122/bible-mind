import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
    targetDate: Date;
    onComplete: () => void;
    label: string;
}

/**
 * Enhanced HolidayCountdown with circular ring design
 */
export default function HolidayCountdown({ targetDate, onComplete, label }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setIsCompleted(true);
                onComplete();
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft || isCompleted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-4 md:right-8 z-40"
        >
            {/* Glass container */}
            <div className="bg-black/50 backdrop-blur-xl p-5 rounded-2xl border border-gold-500/20 shadow-2xl shadow-black/50">
                {/* Label */}
                <div className="text-center mb-4">
                    <span className="text-gold-400 text-xs font-serif uppercase tracking-[0.3em]">
                        {label}
                    </span>
                </div>

                {/* Countdown rings */}
                <div className="flex gap-3 items-center justify-center">
                    <TimeRing value={timeLeft.d} max={31} label="DAYS" color="#FFD700" />
                    <span className="text-2xl text-gold-400/30 font-light">:</span>
                    <TimeRing value={timeLeft.h} max={24} label="HRS" color="#FFA500" />
                    <span className="text-2xl text-gold-400/30 font-light">:</span>
                    <TimeRing value={timeLeft.m} max={60} label="MIN" color="#FF8C00" />
                    <span className="text-2xl text-gold-400/30 font-light">:</span>
                    <TimeRing value={timeLeft.s} max={60} label="SEC" color="#FF6B35" />
                </div>

                {/* Sparkle decoration */}
                <div className="absolute -top-2 -right-2">
                    <motion.span
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-2xl"
                    >
                        ✨
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
}

interface TimeRingProps {
    value: number;
    max: number;
    label: string;
    color: string;
}

function TimeRing({ value, max, label, color }: TimeRingProps) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;
    const offset = circumference - progress;

    return (
        <div className="relative flex flex-col items-center">
            {/* SVG Ring */}
            <svg width="70" height="70" className="transform -rotate-90">
                {/* Background ring */}
                <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                />
                {/* Progress ring */}
                <motion.circle
                    cx="35"
                    cy="35"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color})`
                    }}
                />
            </svg>

            {/* Value display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 10, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -10, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="text-xl font-bold text-white font-mono"
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Label */}
            <span className="text-[8px] text-gold-400/60 tracking-widest mt-1 font-medium">
                {label}
            </span>
        </div>
    );
}
