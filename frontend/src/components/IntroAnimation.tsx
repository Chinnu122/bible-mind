import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<'void' | 'verse1' | 'verse2' | 'verse3' | 'surprise' | 'flash' | 'reveal'>('void');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/intro.mp3');
    audioRef.current.volume = 0.5;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio play failed (browser policy):", error);
      });
    }

    // Timeline
    const verse1Timer = setTimeout(() => setStage('verse1'), 2000);
    const verse2Timer = setTimeout(() => setStage('verse2'), 6000); // "And the Word was with God"
    const verse3Timer = setTimeout(() => setStage('verse3'), 10000); // "AND THE WORD WAS GOD"
    const surpriseTimer = setTimeout(() => setStage('surprise'), 15000); // Creation context
    const flashTimer = setTimeout(() => setStage('flash'), 21000); // The Big Bang
    const revealTimer = setTimeout(() => setStage('reveal'), 21500); // Logo drawing
    const completeTimer = setTimeout(() => {
      // Fade out
      if (audioRef.current) {
        const fadeAudio = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeAudio);
            audioRef.current?.pause();
            onComplete();
          }
        }, 100);
      } else {
        onComplete();
      }
    }, 28000);

    return () => {
      [verse1Timer, verse2Timer, verse3Timer, surpriseTimer, flashTimer, revealTimer, completeTimer].forEach(clearTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  // SVG Paths for "Drawing" the Logo
  // Brain Lobe Left
  const brainLeftPath = "M 40 30 C 20 30, 10 50, 10 70 C 10 100, 30 110, 40 110";
  const brainLeftInner = "M 20 50 C 15 60, 25 70, 20 80";

  // Brain Lobe Right
  const brainRightPath = "M 80 30 C 100 30, 110 50, 110 70 C 110 100, 90 110, 80 110";
  const brainRightInner = "M 100 50 C 105 60, 95 70, 100 80";

  // Cross
  const crossVertical = "M 60 40 L 60 100";
  const crossHorizontal = "M 45 55 L 75 55";

  // Book Pages
  const bookBase = "M 20 120 L 60 130 L 100 120"; // Bottom curve
  const bookLeftPage = "M 20 120 Q 40 110 60 130 L 60 90 Q 40 80 20 90 Z"; // Left page volume (simplified)
  const bookRightPage = "M 100 120 Q 80 110 60 130 L 60 90 Q 80 80 100 90 Z"; // Right page volume

  const drawTransition = { duration: 2.5, ease: "easeInOut" };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="absolute inset-0 stars opacity-40" />
      <div className="absolute inset-0 nebula-bg" />

      <AnimatePresence mode="wait">

        {/* Stage 1: In the beginning... */}
        {stage === 'verse1' && (
          <motion.div
            key="verse1"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
            transition={{ duration: 1.5 }}
            className="text-center z-10"
          >
            <p className="text-3xl md:text-5xl font-cinzel text-gray-300 tracking-[0.2em]">
              IN THE BEGINNING...
            </p>
          </motion.div>
        )}

        {/* Stage 2: ...was the Word */}
        {stage === 'verse2' && (
          <motion.div
            key="verse2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            className="text-center z-10"
          >
            <p className="text-3xl md:text-5xl font-cinzel text-gray-200 tracking-[0.2em] leading-relaxed">
              ...WAS THE WORD
            </p>
          </motion.div>
        )}

        {/* Stage 3: AND THE WORD WAS GOD */}
        {stage === 'verse3' && (
          <motion.div
            key="verse3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center z-10"
          >
            <motion.p
              animate={{ textShadow: ["0 0 10px #bfa37c", "0 0 30px #bfa37c", "0 0 10px #bfa37c"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl md:text-7xl font-cinzel font-bold text-[#bfa37c] tracking-[0.15em]"
            >
              AND THE WORD
              <br />
              <span className="text-white">WAS GOD</span>
            </motion.p>
          </motion.div>
        )}

        {/* Stage 4: Surprise / Creation */}
        {stage === 'surprise' && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-center z-10 relative"
          >
            {/* Rotating Galaxy Effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-900/20 to-transparent rounded-full blur-3xl -z-10"
            />

            <p className="text-xl md:text-3xl font-lato text-gray-300 italic tracking-widest max-w-4xl mx-auto leading-loose px-4">
              "All things were made by him; and without him was not any thing made that was made."
            </p>
          </motion.div>
        )}

        {/* Stage 5: The Flash (Big Bang) */}
        {stage === 'flash' && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }} // Instant flash
            className="absolute inset-0 bg-white z-[200]"
          />
        )}

        {/* Stage 6: The Reveal (Logo Drawing) */}
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            className="relative z-10 flex flex-col items-center justify-center p-8"
          >
            {/* God Rays / Glow Background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1.2, rotate: 10 }}
              transition={{ duration: 4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#bfa37c]/30 to-transparent blur-3xl -z-10"
            />

            {/* SVG Logo Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
              <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_0_15px_rgba(191,163,124,0.3)]">

                {/* Brain Left */}
                <motion.path
                  d={brainLeftPath}
                  fill="transparent"
                  stroke="#1a3c5a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 0.2 }}
                />
                <motion.path
                  d={brainLeftInner}
                  fill="transparent"
                  stroke="#1a3c5a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 0.5 }}
                />

                {/* Brain Right */}
                <motion.path
                  d={brainRightPath}
                  fill="transparent"
                  stroke="#1a3c5a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 0.2 }}
                />
                <motion.path
                  d={brainRightInner}
                  fill="transparent"
                  stroke="#1a3c5a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 0.5 }}
                />

                {/* Cross (Gold) */}
                <motion.path
                  d={crossVertical}
                  fill="transparent"
                  stroke="#bfa37c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 1 }}
                />
                <motion.path
                  d={crossHorizontal}
                  fill="transparent"
                  stroke="#bfa37c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...drawTransition, delay: 1.2 }}
                />

                {/* Book (Gold Pages) */}
                {/* Since it's hard to draw filled shapes with pathLength, we outline then fill */}
                <motion.path
                  d={bookLeftPage}
                  fill="#bfa37c" // Initial fill
                  fillOpacity={0}
                  stroke="#bfa37c"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1, fillOpacity: 0.1 }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
                <motion.path
                  d={bookRightPage}
                  fill="#bfa37c"
                  fillOpacity={0}
                  stroke="#bfa37c"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1, fillOpacity: 0.1 }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
              </svg>
            </div>

            {/* Typography Reveal */}
            <div className="text-center overflow-hidden">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 1, type: "spring" }}
                className="text-4xl md:text-6xl font-cinzel font-black text-[#1a3c5a] tracking-[0.1em] mb-2 drop-shadow-[0_2px_0_rgba(255,255,255,0.1)]"
                style={{
                  background: 'linear-gradient(to bottom, #2a4c6a, #1a3c5a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0px 0px 20px rgba(255,255,255,0.2)'
                }}
              >
                BIBLE MIND
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 3, duration: 1 }}
                className="h-[2px] bg-[#bfa37c] mx-auto mb-3"
              />

              <motion.p
                initial={{ opacity: 0, letterSpacing: "0em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ delay: 3.5, duration: 1.5 }}
                className="text-sm md:text-lg font-lato font-bold text-[#bfa37c] uppercase"
              >
                Wisdom & Understanding
              </motion.p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
