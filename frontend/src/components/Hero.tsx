import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, Sparkles, Search, BookOpen } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeroProps {
  onStart: () => void;
  onSearch: () => void;
  onStudy: () => void;
}

const translations = {
  english: {
    start: "Start Reading",
    search: "Search",
    study: "Study",
    title: "The Living Word",
    subtitle: "Original Hebrew • Meaningful Translations • Multilingual Search",
    desc: "Experience scripture like never before. Dive deep into the original Hebrew and Greek meanings with a single touch."
  },
  telugu: {
    start: "చదవండి",
    search: "శోధించండి",
    study: "ధ్యానించండి",
    title: "జీవ వాక్యం",
    subtitle: "అసలైన హీబ్రూ • అర్థవంతమైన అనువాదాలు • బహుభాషా శోధన",
    desc: "లేఖనాలను మునుపెన్నడూ లేని విధంగా అనుభవించండి. ఒక్క స్పర్శతో అసలైన హీబ్రూ మరియు గ్రీకు అర్థాలను తెలుసుకోండి."
  },
  hindi: {
    start: "पढ़ना शुरू करें",
    search: "खोजें",
    study: "अध्ययन करें",
    title: "जीवित वचन",
    subtitle: "मूल हिब्रू • सार्थक अनुवाद • बहुभाषी खोज",
    desc: "शास्त्रों का ऐसा अनुभव पहले कभी नहीं किया। एक स्पर्श के साथ मूल हिब्रू और ग्रीक अर्थों में गहराई से उतरें।"
  }
};

export default function Hero({ onStart, onSearch, onStudy }: HeroProps) {
  const { language } = useSettings();
  const t = translations[language] || translations.english;

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);

  // Spring physics for smooth tilt
  const springConfig = { damping: 30, stiffness: 200 };
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
  // Use Intl.Segmenter for correct grapheme splitting (fixes Telugu "dotted circle" issues)
  const segmenter = new Intl.Segmenter(language === 'telugu' ? 'te' : language === 'hindi' ? 'hi' : 'en', { granularity: 'grapheme' });
  const sentence = Array.from(segmenter.segment(t.title)).map(s => s.segment);
  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glassmorphism Card Container */}
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
        className="relative z-10 w-full max-w-4xl mx-4 sm:mx-6 md:mx-auto"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Gradient Overlay inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-gradient-to-b from-gold-500/10 to-transparent blur-2xl pointer-events-none" />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Decorative Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/30"
            >
              <Sparkles className="w-8 h-8 text-black" />
            </motion.div>

            <motion.h1
              key={language} // Re-animate on language change
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.08, delayChildren: 0.5 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-crema-100 via-gold-300 to-crema-100"
            >
              {sentence.map((char, index) => (
                <motion.span key={index} variants={letter} className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              key={`sub-${language}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-gold-400 font-medium tracking-widest uppercase text-xs sm:text-sm mb-6"
            >
              {t.subtitle}
            </motion.p>

            <motion.p
              key={`desc-${language}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-xl mx-auto"
            >
              {t.desc}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative px-8 py-4 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full overflow-hidden shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-shadow min-w-[180px]"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3 text-black font-semibold tracking-wide">
                  <span>{t.start}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSearch}
                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:bg-white/10 transition-colors min-w-[140px]"
              >
                <div className="relative flex items-center justify-center gap-3 text-crema-100 font-medium tracking-wide">
                  <Search className="w-4 h-4 text-gold-400" />
                  <span>{t.search}</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStudy}
                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:bg-white/10 transition-colors min-w-[140px]"
              >
                <div className="relative flex items-center justify-center gap-3 text-crema-100 font-medium tracking-wide">
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>{t.study}</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

