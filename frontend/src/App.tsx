import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Menu, StickyNote, Globe } from 'lucide-react';
import Hero from './components/Hero';
import BibleReaderNew from './components/BibleReaderNew';
import IntroAnimation from './components/IntroAnimation';
import PremiumLogo from './components/PremiumLogo';
import NotesPage from './components/NotesPage';
import TeluguPage from './components/TeluguPage';

type ViewState = 'hero' | 'reader' | 'notes' | 'telugu';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('hero');

  const handleStart = () => setView('reader');

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white overflow-x-hidden">
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setView('hero')}
            >
              <PremiumLogo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-cinzel font-bold tracking-[0.15em] text-white group-hover:text-gold-300 transition-colors">BIBLE MIND</span>
                <span className="text-[0.6rem] font-lato tracking-[0.3em] text-gold-500 uppercase">Wisdom & Understanding</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setView('reader')}
                className={`text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'reader' ? 'text-gold-400' : 'text-gray-400'}`}
              >
                READ
              </button>
              <button
                onClick={() => setView('telugu')}
                className={`flex items-center gap-2 text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'telugu' ? 'text-gold-400' : 'text-gray-400'}`}
              >
                <Globe className="w-4 h-4" />
                TELUGU
              </button>
              <button
                onClick={() => setView('notes')}
                className={`flex items-center gap-2 text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'notes' ? 'text-gold-400' : 'text-gray-400'}`}
              >
                <StickyNote className="w-4 h-4" />
                NOTES
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button className="p-2 hover:text-gold-400 transition-colors"><Search className="w-6 h-6" /></button>
              <button className="p-2 hover:text-gold-400 transition-colors"><Menu className="w-6 h-6" /></button>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            {view === 'hero' && (
              <Hero key="hero" onStart={handleStart} />
            )}
            {view === 'reader' && (
              <BibleReaderNew key="reader" />
            )}
            {view === 'notes' && (
              <NotesPage key="notes" onBack={() => setView('reader')} />
            )}
            {view === 'telugu' && (
              <TeluguPage key="telugu" onBack={() => setView('reader')} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default App;
