import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Sparkles, BookOpen, Search, Heart, Globe, Share2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeroProps {
  onStart: () => void;
  onSearch: () => void;
  onStudy: () => void;
}

const translations = {
  english: {
    title: "Bible-Mind — A Simple & Powerful Bible Study Platform",
    subtitle: "Read, explore, and understand Scripture with clarity — in English and Telugu.",
    start: "Start Reading",
    highlights: [
      "Easy verse navigation",
      "Word meanings for better understanding",
      "Cross-references for deeper study"
    ]
  },
  telugu: {
    title: "బైబిల్ మైండ్ — ఒక సరళమైన మరియు శక్తివంతమైన బైబిల్ ధ్యాన వేదిక",
    subtitle: "లేఖనాలను స్పష్టతతో మరియు లోతుగా చదవండి, పరిశోధించండి — తెలుగులో మరియు ఆంగ్లంలో.",
    start: "చదవండి",
    highlights: [
      "సులభమైన వచన నావిగేషన్",
      "మెరుగైన అవగాహన కోసం పదాల అర్థాలు",
      "లోతైన అధ్యయనం కోసం క్రాస్-రిఫరెన్స్"
    ]
  },
  hindi: {
    title: "बाइबल माइंड — एक सरल और शक्तिशाली बाइबल अध्ययन मंच",
    subtitle: "स्पष्टता के साथ शास्त्रों को पढ़ें, खोजें और समझें — अंग्रेजी और तेलुगु में।",
    start: "पढ़ना शुरू करें",
    highlights: [
      "आसान कविता नेविगेशन",
      "बेहतर समझ के लिए शब्द अर्थ",
      "गहन अध्ययन के लिए क्रॉस-संदर्भ"
    ]
  }
};

export default function Hero({ onStart }: HeroProps) {
  const { language } = useSettings();
  const t = translations[language as keyof typeof translations] || translations.english;
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-20 overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white via-ivory-100 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-navy-400/5 rounded-full blur-3xl -z-10" />

      {/* Main Hero Section */}
      <motion.div
        style={{ y: titleY, opacity }}
        className="text-center max-w-4xl px-6 mb-20 z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gold-200 shadow-sm text-gold-600 text-sm font-medium mb-8"
        >
          <Sparkles size={16} />
          <span>The Word of God, Simplified</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl font-serif font-bold text-charcoal-900 leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-charcoal-800 to-charcoal-600"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-xl md:text-2xl text-charcoal-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t.subtitle}
        </motion.p>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-sm md:text-base text-charcoal-500"
        >
          {t.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>{highlight}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative px-10 py-5 bg-charcoal-900 text-ivory-50 rounded-full font-semibold text-lg hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/30 transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          <span>{t.start}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Feature Showcase (Visual) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="w-full max-w-6xl px-4 relative z-0"
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-charcoal-100 overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <div className="absolute inset-0 bg-ivory-50 flex items-center justify-center">
            {/* Abstract Representation of Interface */}
            <div className="text-center space-y-4">
              <BookOpen size={64} className="mx-auto text-gold-300" />
              <p className="text-charcoal-300 text-lg font-serif italic">Distraction-free Reading Environment</p>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <FeatureBadge icon={<Search size={18} />} text="Verse Search" position="top-10 left-10" delay={1.2} />
          <FeatureBadge icon={<Heart size={18} />} text="Save Favorites" position="bottom-10 right-10" delay={1.4} />
          <FeatureBadge icon={<Globe size={18} />} text="English & Telugu" position="bottom-20 left-20" delay={1.6} />
          <FeatureBadge icon={<Share2 size={18} />} text="Share Verses" position="top-20 right-20" delay={1.8} />
        </div>
      </motion.div>

    </div>
  );
}

function FeatureBadge({ icon, text, position, delay }: { icon: React.ReactNode, text: string, position: string, delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      className={`absolute ${position} flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 text-charcoal-800 font-medium text-sm`}
    >
      <span className="text-gold-500">{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}
