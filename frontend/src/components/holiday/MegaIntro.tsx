import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

interface MegaIntroProps {
    onComplete: () => void;
    texts: string[];
    subtexts?: string[];
    theme: 'christmas' | 'newyear';
}

export default function MegaIntro({ onComplete, texts, subtexts, theme }: MegaIntroProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step >= texts.length) {
            setTimeout(onComplete, 2000);
            return;
        }

        const timer = setTimeout(() => {
            setStep(prev => prev + 1);
        }, 4000); // 4 seconds per slide

        return () => clearTimeout(timer);
    }, [step, texts, onComplete]);

    const bgGradient = theme === 'christmas'
        ? 'from-red-900 via-green-900 to-black'
        : 'from-black via-slate-900 to-indigo-950';

    const accentColor = theme === 'christmas' ? 'text-gold-400' : 'text-cyan-400';

    return (
        <motion.div
            className={`fixed inset-0 z-[100] bg-gradient-to-br ${bgGradient} flex items-center justify-center overflow-hidden`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
        >
            {/* Background Particles */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full blur-xl"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step < texts.length && (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-center z-10 px-4"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="mb-6 flex justify-center"
                        >
                            {theme === 'christmas' ?
                                <Star size={64} className="text-gold-300 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" /> :
                                <Sparkles size={64} className="text-cyan-300 drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]" />
                            }
                        </motion.div>

                        <h1 className={`text-4xl md:text-7xl font-serif font-bold mb-4 ${accentColor} drop-shadow-lg`}>
                            {texts[step]}
                        </h1>

                        {subtexts && subtexts[step] && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/80 text-xl font-light font-sans max-w-2xl mx-auto leading-relaxed"
                            >
                                {subtexts[step]}
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
