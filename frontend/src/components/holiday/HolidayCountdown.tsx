import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
    targetDate: Date;
    onComplete: () => void;
    label: string;
}

export default function HolidayCountdown({ targetDate, onComplete, label }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
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

    if (!timeLeft) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-4 md:right-8 z-40 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl"
        >
            <div className="text-white/70 text-xs font-serif uppercase tracking-wider mb-2 text-center border-b border-white/10 pb-1">
                {label}
            </div>
            <div className="flex gap-3 text-center">
                <TimeUnit value={timeLeft.d} label="DAYS" />
                <div className="text-2xl font-light text-white/30">:</div>
                <TimeUnit value={timeLeft.h} label="HRS" />
                <div className="text-2xl font-light text-white/30">:</div>
                <TimeUnit value={timeLeft.m} label="MIN" />
                <div className="text-2xl font-light text-white/30">:</div>
                <TimeUnit value={timeLeft.s} label="SEC" />
            </div>
        </motion.div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gold-300 to-amber-500 font-mono"
                >
                    {value.toString().padStart(2, '0')}
                </motion.span>
            </AnimatePresence>
            <span className="text-[8px] text-white/50 tracking-widest">{label}</span>
        </div>
    );
}
