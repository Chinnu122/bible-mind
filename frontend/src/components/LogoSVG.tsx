import { motion } from 'framer-motion';

export default function LogoSVG({ className, layoutId }: { className?: string; layoutId?: string }) {
    return (
        <motion.svg
            layoutId={layoutId}
            viewBox="0 0 200 200"
            className={className}
        >
            <defs>
                <linearGradient id="platinum-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="20%" stopColor="#e0e0e0" />
                    <stop offset="40%" stopColor="#d4af37" />
                    <stop offset="60%" stopColor="#c5a028" />
                    <stop offset="80%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#fff" />
                </linearGradient>
            </defs>
            <path fill="url(#platinum-gold)" d="M100 160 C 80 170, 40 170, 20 150 V 50 C 40 70, 80 70, 100 60 Z" />
            <path fill="url(#platinum-gold)" d="M100 160 C 120 170, 160 170, 180 150 V 50 C 160 70, 120 70, 100 60 Z" />
            <path className="animate-pulse-slow" fill="url(#platinum-gold)" filter="drop-shadow(0 0 20px #fff)"
                d="M100 30 L115 90 L100 150 L85 90 Z" />
            <path fill="none" stroke="#8a6e2f" strokeWidth="2" d="M30 65 C 50 80, 80 80, 90 70" />
            <path fill="none" stroke="#8a6e2f" strokeWidth="2" d="M170 65 C 150 80, 120 80, 110 70" />
        </motion.svg>
    );
}
