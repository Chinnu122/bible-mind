import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

export default function DivineRays() {
    const { theme } = useSettings();

    // Only show rays on divine or christmas themes
    if (theme !== 'divine' && theme !== 'christmas') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ray Container */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[200vw] h-[200vh] opacity-30">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[10vw] h-[150vh] bg-gradient-to-b from-gold-100/20 via-gold-200/5 to-transparent blur-3xl transform-gpu"
                        style={{
                            transformOrigin: 'top center',
                            rotate: `${(i - 2) * 15}deg`,
                        }}
                        animate={{
                            rotate: [`${(i - 2) * 15 - 5}deg`, `${(i - 2) * 15 + 5}deg`],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Dust Motes */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`mote-${i}`}
                        className="absolute bg-gold-200 rounded-full blur-[1px]"
                        style={{
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
