import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FastForward } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<'void' | 'genesis1' | 'john1a' | 'john1b' | 'light' | 'flesh' | 'flash'>('void');
  const [showSkip, setShowSkip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax Mouse Effect (Performance optimized: only 2 layers)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-500, 500], [5, -5]);
  const rotateY = useTransform(x, [-1000, 1000], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX - window.innerWidth / 2);
    y.set(e.clientY - window.innerHeight / 2);
  };

  useEffect(() => {
    audioRef.current = new Audio('/intro.mp3');
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => { });

    // TIMELINE (Smoother transitions)
    const t1 = setTimeout(() => setStage('genesis1'), 1000);
    const t2 = setTimeout(() => setStage('john1a'), 5500);
    const t3 = setTimeout(() => setStage('john1b'), 10000);
    const t4 = setTimeout(() => setStage('light'), 14500);
    const t5 = setTimeout(() => setStage('flesh'), 17000);

    const flash = setTimeout(() => setStage('flash'), 21000);
    const end = setTimeout(() => finish(), 22000);

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      [t1, t2, t3, t4, t5, flash, end, skipTimer].forEach(clearTimeout);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const finish = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.volume = 0;
    }
    onComplete();
  };

  // Font consistency: All texts use 'font-chancery' (MedievalSharp)

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden perspective-1000"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      onMouseMove={handleMouseMove}
    >
      {/* Layer 1: Galaxy (Scaled to safe 1.25) */}
      <motion.div
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: 0.6, scale: 1.25 }}
        transition={{ duration: 20, ease: "linear" }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen opacity-50 will-change-transform"
      />

      {/* Layer 2: Noise Texture */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none"
      />

      {/* SKIP BUTTON */}
      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={finish}
            className="absolute bottom-10 right-10 z-[200] flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white/30 hover:text-white transition-all uppercase text-xs tracking-widest border border-white/5"
          >
            <FastForward className="w-3 h-3" /> Skip
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* 1. GENESIS 1:1 */}
        {stage === 'genesis1' && (
          <motion.div
            key="genesis1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            className="text-center z-10 will-change-transform"
          >
            <h1 className="text-4xl md:text-7xl font-chancery text-transparent bg-clip-text bg-gradient-to-br from-gray-100 to-gray-500 tracking-widest drop-shadow-2xl">
              IN THE BEGINNING
            </h1>
            <p className="text-blue-200/50 mt-4 tracking-[0.5em] text-xs md:text-sm font-lato">GENESIS 1:1</p>
          </motion.div>
        )}

        {/* 2. JOHN 1:1 A */}
        {stage === 'john1a' && (
          <motion.div
            key="john1a"
            initial={{ opacity: 0, rotateX: 45 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.5 }}
            className="text-center z-10 perspective-1000 will-change-transform"
          >
            <h1 className="text-5xl md:text-8xl font-chancery text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-700 tracking-wide drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              ...Was The Word
            </h1>
            <p className="text-amber-200/50 mt-6 tracking-[0.5em] text-xs md:text-sm font-lato">JOHN 1:1</p>
          </motion.div>
        )}

        {/* 3. JOHN 1:1 B (GOD) */}
        {stage === 'john1b' && (
          <motion.div
            key="john1b"
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10 will-change-transform"
          >
            <h1 className="text-6xl md:text-9xl font-chancery text-white tracking-widest drop-shadow-2xl">
              AND THE WORD<br />WAS <span className="text-gold-400 drop-shadow-[0_0_50px_rgba(255,215,0,0.8)]">GOD</span>
            </h1>
          </motion.div>
        )}

        {/* 4. GENESIS 1:3 (LIGHT) */}
        {stage === 'light' && (
          <motion.div
            key="light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-white"
          >
            <h1 className="text-5xl md:text-8xl font-chancery text-black tracking-[0.2em] animate-pulse">
              LET THERE BE LIGHT
            </h1>
          </motion.div>
        )}

        {/* 5. JOHN 1:14 (FLESH) */}
        {stage === 'flesh' && (
          <motion.div
            key="flesh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl md:text-7xl font-chancery text-amber-100 drop-shadow-2xl">
              And The Word Was Made Flesh
            </h1>
            <p className="text-amber-300/60 mt-4 text-xl font-chancery">
              And dwelt among us...
            </p>
          </motion.div>
        )}

        {/* FINAL FLASH */}
        {stage === 'flash' && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-white z-[200]"
          />
        )}

      </AnimatePresence>
    </motion.div>
  );
}
