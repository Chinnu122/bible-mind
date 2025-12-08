import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Menu, StickyNote, Globe, X, User } from 'lucide-react';
import Hero from './components/Hero';
import BibleReaderNew from './components/BibleReaderNew';
import IntroAnimation from './components/IntroAnimation';
import PremiumLogo from './components/PremiumLogo';
import NotesPage from './components/NotesPage';
import TeluguPage from './components/TeluguPage';
import AuthPage from './components/AuthPage';

type ViewState = 'hero' | 'reader' | 'notes' | 'telugu' | 'auth';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStart = () => setView('reader');

  const navigateTo = (target: ViewState) => {
    setView(target);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white overflow-x-hidden">
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          {/* Desktop & Mobile Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
            {/* Logo */}
            <div
              className="flex items-center gap-2 md:gap-4 cursor-pointer group"
              onClick={() => navigateTo('hero')}
            >
              <PremiumLogo className="w-10 h-10 md:w-12 md:h-12" />
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-cinzel font-bold tracking-wider md:tracking-[0.15em] text-white group-hover:text-gold-300 transition-colors">BIBLE MIND</span>
                <span className="hidden md:block text-[0.6rem] font-lato tracking-[0.3em] text-gold-500 uppercase">Wisdom & Understanding</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigateTo('reader')} className={`text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'reader' ? 'text-gold-400' : 'text-gray-400'}`}>READ</button>
              <button onClick={() => navigateTo('telugu')} className={`flex items-center gap-2 text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'telugu' ? 'text-gold-400' : 'text-gray-400'}`}><Globe className="w-4 h-4" />TELUGU</button>
              <button onClick={() => navigateTo('notes')} className={`flex items-center gap-2 text-sm font-medium tracking-widest hover:text-gold-300 transition-colors ${view === 'notes' ? 'text-gold-400' : 'text-gray-400'}`}><StickyNote className="w-4 h-4" />NOTES</button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button className="p-2 hover:text-gold-400 transition-colors"><Search className="w-6 h-6" /></button>
              <button onClick={() => navigateTo('auth')} className="p-2 hover:text-gold-400 transition-colors"><User className="w-6 h-6" /></button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:text-gold-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-white/10 md:hidden"
              >
                <div className="flex flex-col p-4 gap-2">
                  <button onClick={() => navigateTo('reader')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'reader' ? 'bg-gold-500/20 text-gold-300' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Search className="w-5 h-5" /> Read Bible
                  </button>
                  <button onClick={() => navigateTo('telugu')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'telugu' ? 'bg-gold-500/20 text-gold-300' : 'text-gray-300 hover:bg-white/5'}`}>
                    <Globe className="w-5 h-5" /> Telugu Bible
                  </button>
                  <button onClick={() => navigateTo('notes')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'notes' ? 'bg-gold-500/20 text-gold-300' : 'text-gray-300 hover:bg-white/5'}`}>
                    <StickyNote className="w-5 h-5" /> My Notes
                  </button>
                  <div className="h-px bg-white/10 my-2" />
                  <button onClick={() => navigateTo('auth')} className="flex items-center gap-3 p-3 rounded-lg text-gold-400 hover:bg-gold-500/10 transition-colors">
                    <User className="w-5 h-5" /> Sign In / Sign Up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            {view === 'auth' && (
              <AuthPage key="auth" onBack={() => setView('hero')} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default App;
