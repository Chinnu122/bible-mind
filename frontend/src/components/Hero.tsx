import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-[#0f0f11] to-[#0f0f11] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-600 mb-8"
        >
          The Living Word
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 font-light leading-relaxed"
        >
          Experience scripture like never before. Dive deep into the original Hebrew and Greek meanings with a single touch.
        </motion.p>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.6 }}
          onClick={onStart}
          className="group relative px-8 py-4 bg-transparent border border-gold-500/30 rounded-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors" />
          <div className="relative flex items-center gap-3 text-gold-100 font-medium tracking-wide">
            START READING
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
