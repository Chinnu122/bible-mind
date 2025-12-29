import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Play, Pause, X, Sparkles, Heart } from 'lucide-react';

interface NewYearSurprisesProps {
    isActive: boolean;
    onClose: () => void;
}

/**
 * NewYearSurprises - Celebration screen after New Year countdown
 * Shows blessing video/animation with audio, "Thank God for another year" message
 */
export default function NewYearSurprises({ isActive, onClose }: NewYearSurprisesProps) {
    const [stage, setStage] = useState<'gift' | 'blessing' | 'message'>('gift');
    const [audioPlaying, setAudioPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Blessing messages in multiple languages
    const blessings = [
        { lang: 'English', text: 'God has given us another year! Thank You Lord for all the blessings!' },
        { lang: 'Telugu', text: 'దేవుడు మనకు మరో సంవత్సరాన్ని ఇచ్చారు! అన్ని ఆశీర్వాదాలకు ప్రభూ కృతజ్ఞతలు!' },
        { lang: 'Hindi', text: 'भगवान ने हमें एक और साल दिया है! सभी आशीर्वादों के लिए प्रभु का धन्यवाद!' }
    ];

    const [currentBlessing, setCurrentBlessing] = useState(0);

    // Cycle through blessings
    useEffect(() => {
        if (stage === 'message') {
            const interval = setInterval(() => {
                setCurrentBlessing(prev => (prev + 1) % blessings.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [stage]);

    // Auto-progress through stages
    useEffect(() => {
        if (isActive) {
            setStage('gift');
            const timer1 = setTimeout(() => setStage('blessing'), 3000);
            const timer2 = setTimeout(() => setStage('message'), 8000);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isActive]);

    const playBlessing = () => {
        if (audioRef.current) {
            if (audioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setAudioPlaying(!audioPlaying);
        }
    };

    if (!isActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center"
            >
                {/* Close Button */}
                <motion.button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={24} />
                </motion.button>

                {/* Confetti particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: -20,
                                rotate: 0,
                                opacity: 1
                            }}
                            animate={{
                                y: window.innerHeight + 100,
                                rotate: Math.random() * 720 - 360,
                                opacity: [1, 1, 0]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{
                                width: 8 + Math.random() * 8,
                                height: 8 + Math.random() * 8,
                                background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'][Math.floor(Math.random() * 5)],
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>

                {/* Stage: Gift Box */}
                {stage === 'gift' && (
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, y: -100 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [-2, 2, -2]
                            }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="relative"
                        >
                            <Gift
                                size={200}
                                className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                                strokeWidth={1}
                            />
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Sparkles size={100} className="text-yellow-300/50" />
                            </motion.div>
                        </motion.div>
                        <p className="text-white/60 text-center mt-6 text-lg">Opening your blessing...</p>
                    </motion.div>
                )}

                {/* Stage: Blessing Animation */}
                {stage === 'blessing' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center relative"
                    >
                        {/* Golden cross with rays */}
                        <motion.div
                            className="relative mx-auto mb-8"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-[0_0_40px_rgba(251,191,36,0.8)]">
                                {/* Rays */}
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <motion.line
                                        key={i}
                                        x1="50"
                                        y1="50"
                                        x2="50"
                                        y2="5"
                                        stroke="url(#goldGradient)"
                                        strokeWidth="1"
                                        transform={`rotate(${i * 30} 50 50)`}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                                    />
                                ))}
                                {/* Cross */}
                                <rect x="45" y="20" width="10" height="60" rx="2" fill="#FFD700" />
                                <rect x="25" y="35" width="50" height="10" rx="2" fill="#FFD700" />
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl md:text-6xl font-serif font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            HAPPY NEW YEAR 2025!
                        </motion.h1>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex items-center justify-center gap-2 mt-4 text-pink-400"
                        >
                            <Heart className="fill-current animate-pulse" size={24} />
                            <span className="text-xl">God Bless You</span>
                            <Heart className="fill-current animate-pulse" size={24} />
                        </motion.div>
                    </motion.div>
                )}

                {/* Stage: Blessing Message */}
                {stage === 'message' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center max-w-2xl mx-auto px-6"
                    >
                        {/* Audio player button */}
                        <motion.button
                            onClick={playBlessing}
                            className="mx-auto mb-8 p-6 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 text-black shadow-lg shadow-amber-500/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {audioPlaying ? <Pause size={40} /> : <Play size={40} />}
                        </motion.button>
                        <p className="text-white/60 text-sm mb-8">Play New Year Blessing</p>

                        {/* Audio element */}
                        <audio
                            ref={audioRef}
                            src="/audio/new-year-blessing.mp3"
                            onEnded={() => setAudioPlaying(false)}
                        />

                        {/* Rotating blessings */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentBlessing}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-8"
                            >
                                <p className="text-sm text-gold-400 uppercase tracking-widest mb-3">
                                    {blessings[currentBlessing].lang}
                                </p>
                                <p className="text-2xl md:text-3xl text-white font-serif leading-relaxed">
                                    "{blessings[currentBlessing].text}"
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Thank God message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12 p-6 rounded-2xl bg-white/5 border border-gold-500/20"
                        >
                            <p className="text-lg text-white/80">
                                Thank You Lord for guiding us through {new Date().getFullYear() - 1}.
                                <br />
                                May this new year bring blessings, peace, and wisdom.
                            </p>
                        </motion.div>

                        {/* Continue button */}
                        <motion.button
                            onClick={onClose}
                            className="mt-8 px-8 py-3 rounded-full bg-gold-500 text-black font-medium hover:bg-gold-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Continue to Bible Mind
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
