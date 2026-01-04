import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LogoIntro.css';
import { Volume2, VolumeX, SkipForward, Play, Pause, Book, Brain, Heart } from 'lucide-react';

interface LogoIntroProps {
    onComplete: () => void;
}

const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
    const [currentScene, setCurrentScene] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Scene durations in milliseconds
    const durations = [5000, 5000, 4000, 6000, 5000, 6000, 5000];
    // const totalTime = durations.reduce((a, b) => a + b, 0);

    useEffect(() => {
        if (isPaused) return;

        const timer = setTimeout(() => {
            if (currentScene < 6) {
                setCurrentScene(prev => prev + 1);
            } else {
                onComplete();
            }
        }, durations[currentScene]);

        return () => {
            clearTimeout(timer);
        };
    }, [currentScene, isPaused, onComplete]);

    // Handle skip
    const handleSkip = () => {
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white font-sans overflow-hidden cursor-none">
            {/* Background Grain & Effects */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] grain-overlay"></div>
            <div className="scanline"></div>

            {/* Cinematic Bars */}
            <div className="fixed top-0 left-0 right-0 h-[60px] bg-black z-50"></div>
            <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-black z-50"></div>

            {/* Skip Button */}
            <button
                onClick={handleSkip}
                className="fixed top-[80px] right-[40px] z-[60] flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
                Skip Intro <SkipForward size={14} />
            </button>

            {/* Stage */}
            <AnimatePresence mode="wait">
                {currentScene === 0 && <SceneIntro key="scene0" />}
                {currentScene === 1 && <SceneProblem key="scene1" />}
                {currentScene === 2 && <SceneSolution key="scene2" />}
                {currentScene === 3 && <SceneFeatures key="scene3" />}
                {currentScene === 4 && <SceneProcess key="scene4" />}
                {currentScene === 5 && <SceneDemo key="scene5" />}
                {currentScene === 6 && <SceneCTA key="scene6" />}
            </AnimatePresence>

            {/* Custom Controls */}
            <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <button onClick={() => setIsPaused(!isPaused)} className="hover:scale-110 transition-transform cursor-pointer">
                    {isPaused ? <Play size={20} fill="white" /> : <Pause size={20} fill="white" />}
                </button>

                <div className="w-[200px] h-[2px] bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: durations[currentScene] / 1000, ease: "linear" }}
                        key={currentScene}
                    />
                </div>

                <div className="text-xs font-mono opacity-70">
                    SCENE 0{currentScene + 1} / 07
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-[2px] h-3 items-end">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-[2px] bg-white_80"
                                animate={{ height: isPaused || isMuted ? "2px" : ["20%", "100%", "20%"] }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:opacity-80 cursor-pointer">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Scene 1: Intro
const SceneIntro = () => (
    <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[#050505] nebula-bg-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <div className="text-center z-20">
            <motion.h1
                className="text-7xl md:text-9xl font-serif font-bold tracking-tighter mb-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                Bible Mind
            </motion.h1>
            <motion.div
                className="h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"
                initial={{ width: 0 }} animate={{ width: "200px" }} transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.p
                className="mt-6 text-sm uppercase tracking-[0.3em] opacity-70"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1 }}
            >
                Transform Your Spiritual Journey
            </motion.p>
        </div>
        <div className="absolute inset-0 animate-zoom-pulse opacity-50 bg-[url('/img/nebula-bg.svg')] bg-cover bg-center" />
    </motion.div>
);

// Scene 2: Problem
const SceneProblem = () => (
    <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[#080808]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <div className="max-w-3xl px-8 text-center relative z-20">
            <motion.div
                className="text-6xl font-serif text-white/20 absolute -top-12 -left-4"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.2, scale: 1 }}
            >
                "
            </motion.div>
            <motion.p
                className="text-2xl md:text-4xl font-light leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            >
                In a world of endless distractions,<br />
                <span className="font-semibold text-white">finding spiritual clarity</span> has never been harder.
            </motion.p>
            <motion.p
                className="mt-8 text-sm uppercase tracking-widest opacity-50"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 1 }}
            >
                — The Modern Challenge
            </motion.p>
        </div>
    </motion.div>
);

// Scene 3: Solution
const SceneSolution = () => (
    <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <p className="tracking-[0.5em] text-xs uppercase opacity-50 mb-4">Introducing</p>
        <div className="relative">
            <h2
                className="text-6xl md:text-9xl font-black tracking-tighter glitch-text text-white relative z-10"
                data-text="THE SOLUTION"
            >
                THE SOLUTION
            </h2>
        </div>
    </motion.div>
);

// Scene 4: Features
const SceneFeatures = () => {
    const features = [
        { icon: <Book size={32} />, title: "Daily Verses", desc: "AI-curated scripture tailored to your needs." },
        { icon: <Brain size={32} />, title: "Mind Mapping", desc: "Connect biblical concepts visually." },
        { icon: <Heart size={32} />, title: "Prayer Journal", desc: "Track your spiritual growth journey." }
    ];

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl w-full">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div className="text-gold-400 mb-6">{f.icon}</div>
                        <h3 className="text-xl font-serif font-bold mb-3">{f.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Scene 5: Process
const SceneProcess = () => {
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center bg-[#050505]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <div className="process-container">
                <ProcessStep number="01" title="DISCOVER" delay={0} />
                <div className="process-line"></div>
                <ProcessStep number="02" title="CONNECT" delay={0.5} />
                <div className="process-line"></div>
                <ProcessStep number="03" title="TRANSFORM" delay={1} />
            </div>
        </motion.div>
    );
};

const ProcessStep = ({ number, title, delay }: { number: string, title: string, delay: number }) => (
    <motion.div
        className="process-step"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.6 }}
    >
        <div className="process-number">{number}</div>
        <div className="process-title">{title}</div>
    </motion.div>
);

// Scene 6: App Demo
const SceneDemo = () => (
    <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[#080808]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <div className="phone-mockup animate-float">
            <div className="phone-screen bg-slate-900">
                <div className="phone-notch"></div>
                <div className="mt-8 px-4">
                    <h2 className="text-xl font-serif mb-4">Today's Verse</h2>
                    <motion.div
                        className="verse-card"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="verse-text">"For I know the plans I have for you..."</p>
                        <p className="verse-ref">Jeremiah 29:11</p>
                    </motion.div>
                    <motion.div
                        className="verse-card"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <p className="verse-text">"Trust in the Lord with all your heart..."</p>
                        <p className="verse-ref">Proverbs 3:5</p>
                    </motion.div>
                </div>
            </div>
        </div>
    </motion.div>
);

// Scene 7: CTA
const SceneCTA = () => (
    <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <motion.h2
            className="title-main mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
        >
            Begin Your Journey
        </motion.h2>
        <motion.p
            className="title-sub mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.5 }}
        >
            Transform Your Faith Today
        </motion.p>
        <motion.button
            className="px-12 py-4 bg-white text-black rounded-full font-bold tracking-wider hover:scale-105 transition-transform"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
        >
            ENTER THE APP
        </motion.button>
    </motion.div>
);

export default LogoIntro;
