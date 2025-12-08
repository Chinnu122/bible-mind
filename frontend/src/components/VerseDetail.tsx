import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Verse } from '../data/mockData';

interface VerseDetailProps {
  verse: Verse;
  onClose: () => void;
}

export default function VerseDetail({ verse, onClose }: VerseDetailProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#141416] border-l border-gold-500/20 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-gold-300">{verse.reference}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="mb-10">
          <p className="text-xl leading-relaxed text-gray-200 font-serif">
            {verse.text}
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4">
            Original Language Breakdown
          </h3>
          
          {verse.words.map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-gold-500/30 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-medium text-gold-100">{word.text}</span>
                <span className="text-xs text-gray-500 font-mono">{word.strongs}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <span className={`text-2xl font-serif ${word.language === 'hebrew' ? 'font-bold' : ''} text-gold-400`}>
                  {word.original}
                </span>
                <span className="text-sm text-gray-400 italic">
                  {word.transliteration}
                </span>
              </div>
              
              <div className="text-sm text-gray-300 border-t border-white/10 pt-2 mt-2">
                {word.meaning}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
