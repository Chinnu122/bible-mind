import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  // Spring physics for smooth tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Typewriter Variance
  const sentence = "The Living Word".split("");
  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-[#0f0f11] to-[#0f0f11] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl animate-pulse" />

      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
        className="relative z-10 text-center max-w-4xl px-6 transform-style-3d"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="text-6xl md:text-8xl font-serif font-bold text-gold-gradient mb-8 drop-shadow-2xl"
        >
          {sentence.map((char, index) => (
            <motion.span key={index} variants={letter} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 font-light leading-relaxed"
        >
          Experience scripture like never before. Dive deep into the original Hebrew and Greek meanings with a single touch.
        </motion.p>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 1.8 }}
          onClick={onStart}
          className="group relative px-8 py-4 bg-transparent border border-gold-500/30 rounded-full overflow-hidden btn-3d shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)]"
        >
          <div className="absolute inset-0 bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors" />
          <div className="relative flex items-center gap-3 text-gold-100 font-medium tracking-wide">
            START READING
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
