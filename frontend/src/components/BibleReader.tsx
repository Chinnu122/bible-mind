import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockVerses, Verse } from '../data/mockData';
import VerseDetail from './VerseDetail';

export default function BibleReader() {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Text Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-gold-200 mb-4">Genesis 1</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto opacity-50" />
          </div>

          <div className="space-y-6 font-serif text-xl md:text-2xl leading-loose text-gray-300">
            {mockVerses.map((verse, index) => (
              <motion.div
                key={verse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedVerse(verse)}
                className={`
                  relative p-6 rounded-xl cursor-pointer transition-all duration-300
                  ${selectedVerse?.id === verse.id 
                    ? 'bg-gold-900/20 border-gold-500/30 shadow-[0_0_30px_-10px_rgba(196,142,47,0.3)]' 
                    : 'hover:bg-white/5 border-transparent hover:border-white/10'}
                  border
                `}
              >
                <span className="absolute top-6 left-2 text-xs font-sans text-gold-500/50 font-bold -translate-x-full pr-4">
                  {verse.reference.split(':')[1]}
                </span>
                {verse.text}
              </motion.div>
            ))}
            
            {/* Placeholder for more text to show scrolling */}
            <div className="opacity-30 space-y-6 select-none pointer-events-none blur-[1px]">
              <p>And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.</p>
              <p>And God said, Let there be light: and there was light.</p>
              <p>And God saw the light, that it was good: and God divided the light from the darkness.</p>
            </div>
          </div>
        </div>

        {/* Sidebar / Detail View */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-32">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
              <h3 className="text-gold-400 font-medium mb-4">Study Notes</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select a verse to view the original Hebrew or Greek text, transliteration, and Strong's definitions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Overlay Detail View */}
      <AnimatePresence>
        {selectedVerse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVerse(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <VerseDetail 
              verse={selectedVerse} 
              onClose={() => setSelectedVerse(null)} 
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
