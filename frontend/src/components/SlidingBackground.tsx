import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

const backgrounds = {
    divine: '/bg-divine.png',
    midnight: '/bg-midnight.png',
    parchment: '/bg-parchment.png',
    christmas: '/bg-christmas.png', // Generated Winter Background
    ethereal: '/bg-glass.png'    // Fallback
};

export default function SlidingBackground() {
    const { theme } = useSettings();
    const currentBg = backgrounds[theme as keyof typeof backgrounds] || backgrounds.divine;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base layer - Solid color backup */}
            <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out
                ${theme === 'divine' ? 'bg-slate-900' : ''}
                ${theme === 'midnight' ? 'bg-black' : ''}
                ${theme === 'parchment' ? 'bg-[#f4e4bc]' : ''}
            `} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        backgroundPosition: ['0% 0%', '0% 100%']
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 1.5 },
                        scale: { duration: 10, ease: "linear" },
                        backgroundPosition: { duration: 60, repeat: Infinity, repeatType: "reverse", ease: "linear" }
                    }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${currentBg}')`,
                    }}
                />
            </AnimatePresence>

            {/* Overlay for readability */}
            <div className={`absolute inset-0 transition-opacity duration-1000
                ${theme === 'parchment' ? 'bg-amber-900/10 mix-blend-multiply' : 'bg-black/40 backdrop-blur-[1px]'}
            `} />

            {/* Animated Particles / ambient noise overlay could go here */}
            {theme !== 'parchment' && (
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
            )}
        </div>
    );
}
