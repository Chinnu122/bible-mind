import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Search, Menu, StickyNote, Globe, X, User, Settings, Calendar, BookOpen } from 'lucide-react';
import Hero from './components/Hero';
import BibleReaderNew from './components/BibleReaderNew';
import LogoIntro from './components/LogoIntro';
import PremiumLogo from './components/PremiumLogo';
import NotesPage from './components/NotesPage';
import TeluguPage from './components/TeluguPage';
import AuthPage from './components/AuthPage';
import ClickSound from './components/ClickSound';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import SettingsModal from './components/SettingsModal';
import StarfieldBackground from './components/StarfieldBackground';
import DynamicTitle from './components/DynamicTitle';
import DailyVersePage from './components/DailyVersePage';
import SlidingBackground from './components/SlidingBackground';
import AmbientParticles from './components/AmbientParticles';
import BibleStudyPage from './components/BibleStudyPage';

type ViewState = 'hero' | 'reader' | 'notes' | 'telugu' | 'auth' | 'daily' | 'study';

function AppLayout() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, setTheme, isSettingsOpen, setIsSettingsOpen, particles } = useSettings();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Konami Code Easter Egg
  useEffect(() => {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === konami[cursor]) {
        cursor++;
        if (cursor === konami.length) {
          setTheme('midnight');
          alert('🕵️ SECRET UNLOCKED: Midnight Protocol Activated');
          cursor = 0;
        }
      } else {
        cursor = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTheme]);

  const handleStart = () => setView('reader');

  const navigateTo = (target: ViewState) => {
    setView(target);
    setMobileMenuOpen(false);
  };

  // Theme Configs
  const styles = {
    divine: {
      bg: 'bg-[#0f0f11]',
      text: 'text-white',
      navBg: 'bg-gradient-to-b from-black/90 to-transparent',
      accent: 'text-gold-400',
      hover: 'hover:text-gold-300'
    },
    midnight: {
      bg: 'bg-slate-900',
      text: 'text-blue-100',
      navBg: 'bg-slate-900/80',
      accent: 'text-cyan-400',
      hover: 'hover:text-cyan-300'
    },
    parchment: {
      bg: 'bg-[#f4e4bc]',
      text: 'text-[#3d2b1f]',
      navBg: 'bg-[#e3d5b0]/90',
      accent: 'text-[#8b4513]',
      hover: 'hover:text-[#5c3a21]'
    }
  };

  const currentStyle = styles[theme];

  return (
    <div className={`min-h-screen overflow-x-hidden perspective-1000 ${currentStyle.bg} ${currentStyle.text} transition-colors duration-700`}>
      <ClickSound />
      <DynamicTitle />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Backgrounds */}
      {theme === 'divine' && (
        <>
          <SlidingBackground />
          <AmbientParticles />
        </>
      )}
      {theme === 'midnight' && particles && (
        <div className="fixed inset-0 z-0 opacity-50">
          <StarfieldBackground />
        </div>
      )}
      {theme === 'parchment' && (
        <div className="fixed inset-0 z-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none" />
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal />}
      </AnimatePresence>

      {/* Main Content Transformation Container */}
      <motion.div
        animate={isSettingsOpen ? { scale: 0.92, borderRadius: 20, rotateX: 5, y: 40, opacity: 0.5 } : { scale: 1, borderRadius: 0, rotateX: 0, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative z-10 min-h-screen origin-top transition-all duration-500 ${isSettingsOpen ? 'overflow-hidden shadow-2xl ring-1 ring-white/10' : ''}`}
      >
        <AnimatePresence mode="wait">
          {showIntro && (
            <LogoIntro onComplete={() => setShowIntro(false)} />
          )}
        </AnimatePresence>

        {!showIntro && (
          <div className="animate-warp-in origin-center">
            {/* Desktop & Mobile Navbar */}
            <nav className={`fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50 flex items-center justify-between px-6 py-4 rounded-full backdrop-blur-md border border-white/5 shadow-lg transition-all duration-500 ${currentStyle.navBg}`}>

              {/* Logo */}
              <div
                className="flex items-center gap-2 md:gap-4 cursor-pointer group"
                onClick={() => navigateTo('hero')}
              >
                <PremiumLogo className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${theme === 'parchment' ? 'text-[#8b4513]' : ''}`} />
                <div className="flex flex-col">
                  <span className={`text-lg md:text-xl font-cinzel font-bold tracking-wider md:tracking-[0.15em] transition-colors ${currentStyle.hover} ${theme === 'parchment' ? 'text-[#3d2b1f]' : 'text-white'}`}>BIBLE MIND</span>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => navigateTo('daily')} className={`flex items-center gap-2 text-sm font-medium tracking-widest transition-colors ${view === 'daily' ? currentStyle.accent : 'opacity-60 hover:opacity-100'}`}><Calendar className="w-4 h-4" />DAILY</button>
                <button onClick={() => navigateTo('study')} className={`flex items-center gap-2 text-sm font-medium tracking-widest transition-colors ${view === 'study' ? currentStyle.accent : 'opacity-60 hover:opacity-100'}`}><BookOpen className="w-4 h-4" />STUDY</button>
                <button onClick={() => navigateTo('reader')} className={`text-sm font-medium tracking-widest transition-colors ${view === 'reader' ? currentStyle.accent : 'opacity-60 hover:opacity-100'}`}>READ</button>
                <button onClick={() => navigateTo('telugu')} className={`flex items-center gap-2 text-sm font-medium tracking-widest transition-colors ${view === 'telugu' ? currentStyle.accent : 'opacity-60 hover:opacity-100'}`}><Globe className="w-4 h-4" />TELUGU</button>
                <button onClick={() => navigateTo('notes')} className={`flex items-center gap-2 text-sm font-medium tracking-widest transition-colors ${view === 'notes' ? currentStyle.accent : 'opacity-60 hover:opacity-100'}`}><StickyNote className="w-4 h-4" />NOTES</button>
                <div className={`w-px h-4 mx-2 ${theme === 'parchment' ? 'bg-[#3d2b1f]/20' : 'bg-white/20'}`} />
                <button className={`p-2 transition-colors ${currentStyle.hover}`}><Search className="w-5 h-5" /></button>
                <button onClick={() => setIsSettingsOpen(true)} className={`p-2 transition-colors ${currentStyle.hover}`}><Settings className="w-5 h-5" /></button>
                <button onClick={() => navigateTo('auth')} className={`p-2 transition-colors ${currentStyle.hover}`}><User className="w-5 h-5" /></button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden gap-4">
                <button onClick={() => setIsSettingsOpen(true)} className={`transition-colors ${currentStyle.hover}`}><Settings className="w-5 h-5" /></button>
                <button
                  className={`transition-colors ${currentStyle.hover}`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`fixed top-24 left-4 right-4 z-40 rounded-2xl backdrop-blur-lg border border-white/10 md:hidden p-4 shadow-2xl ${currentStyle.navBg}`}
                >
                  <div className="flex flex-col gap-2">
                    <button onClick={() => navigateTo('reader')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'reader' ? 'bg-black/5 font-bold' : ''}`}>
                      <Search className="w-5 h-5" /> Read Bible
                    </button>
                    <button onClick={() => navigateTo('telugu')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'telugu' ? 'bg-black/5 font-bold' : ''}`}>
                      <Globe className="w-5 h-5" /> Telugu Bible
                    </button>
                    <button onClick={() => navigateTo('notes')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${view === 'notes' ? 'bg-black/5 font-bold' : ''}`}>
                      <StickyNote className="w-5 h-5" /> My Notes
                    </button>
                    <div className={`h-px my-2 ${theme === 'parchment' ? 'bg-[#3d2b1f]/10' : 'bg-white/10'}`} />
                    <button onClick={() => navigateTo('auth')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${currentStyle.accent}`}>
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
              {view === 'daily' && (
                <DailyVersePage key="daily" onBack={() => setView('hero')} />
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
              {view === 'study' && (
                <BibleStudyPage key="study" onBack={() => setView('hero')} />
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppLayout />
    </SettingsProvider>
  );
}

export default App;
