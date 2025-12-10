import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Search, Menu, StickyNote, Globe, X, User, Settings, Calendar, BookOpen, MessageSquare, CheckCircle } from 'lucide-react';
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
import CharacterOfDay from './components/CharacterOfDay';
import RealisticSnow from './components/RealisticSnow';
import EtherealTheme from './components/EtherealTheme';
import ReviewBoard from './components/ReviewBoard';
import DailyQuiz from './components/DailyQuiz';

type ViewState = 'hero' | 'reader' | 'notes' | 'telugu' | 'auth' | 'daily' | 'study' | 'character' | 'reviews' | 'quiz';

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
    hover: 'hover:text-cyan-300',
    backdrop: 'backdrop-blur-md bg-slate-900/50' // Added visibility fix
  },
  ethereal: {
    bg: 'bg-black',
    text: 'text-purple-100',
    navBg: 'bg-black/80',
    accent: 'text-purple-400',
    hover: 'hover:text-purple-300',
    backdrop: 'backdrop-blur-lg bg-black/40 border border-white/10' // High readability
  }
};

// Map 'parchment' to 'ethereal' if user selects it (Legacy support or force upgrade)
// Or better, just treat 'parchment' as 'ethereal' in the UI/Logic if we want to replace it.
const activeTheme = theme === 'parchment' ? 'ethereal' : theme;
const currentStyle = styles[activeTheme];

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

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {showIntro ? (
          theme === 'parchment' || theme === 'ethereal' ?
            <PremiumLogo onComplete={() => setShowIntro(false)} /> :
            <LogoIntro onComplete={() => setShowIntro(false)} />
        ) : (
          <div className="relative">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${currentStyle.navBg} backdrop-blur-md border-b border-white/5`}>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('hero')}>
                <BookOpen className={`w-8 h-8 ${currentStyle.accent}`} />
                <span className={`text-xl font-cinzel font-bold tracking-wider ${currentStyle.text}`}>Bible Mind</span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => navigateTo('reader')} className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:scale-105 transition-all ${view === 'reader' ? currentStyle.accent : 'opacity-70 hover:opacity-100'}`}>
                  <BookOpen className="w-4 h-4" /> Reading
                </button>
                <button onClick={() => navigateTo('daily')} className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:scale-105 transition-all ${view === 'daily' ? currentStyle.accent : 'opacity-70 hover:opacity-100'}`}>
                  <Calendar className="w-4 h-4" /> Daily
                </button>
                <button onClick={() => navigateTo('notes')} className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:scale-105 transition-all ${view === 'notes' ? currentStyle.accent : 'opacity-70 hover:opacity-100'}`}>
                  <StickyNote className="w-4 h-4" /> Notes
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={() => navigateTo('quiz')} className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:scale-105 transition-all ${view === 'quiz' ? currentStyle.accent : 'opacity-70 hover:opacity-100'}`}>
                  <CheckCircle className="w-4 h-4" /> Quiz
                </button>
                <button onClick={() => navigateTo('reviews')} className={`flex items-center gap-2 text-sm uppercase tracking-widest hover:scale-105 transition-all ${view === 'reviews' ? currentStyle.accent : 'opacity-70 hover:opacity-100'}`}>
                  <MessageSquare className="w-4 h-4" /> Community
                </button>
                <button onClick={() => navigateTo('auth')} className={`px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all ${currentStyle.accent}`}>
                  Sign In
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`fixed inset-0 z-40 pt-24 px-6 ${currentStyle.bg}`}
                >
                  <div className="flex flex-col gap-6 text-2xl font-cinzel">
                    <button onClick={() => navigateTo('reader')} className="flex items-center gap-4 py-4 border-b border-white/10">
                      <BookOpen /> Reading
                    </button>
                    <button onClick={() => navigateTo('daily')} className="flex items-center gap-4 py-4 border-b border-white/10">
                      <Calendar /> Daily
                    </button>
                    <button onClick={() => navigateTo('notes')} className="flex items-center gap-4 py-4 border-b border-white/10">
                      <StickyNote /> Notes
                    </button>
                    <button onClick={() => navigateTo('quiz')} className="flex items-center gap-4 py-4 border-b border-white/10">
                      <CheckCircle /> Daily Quiz
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-4 py-4 border-b border-white/10">
                      <Settings /> Settings
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
                <DailyVersePage key="daily" onBack={() => setView('hero')} onViewCharacter={() => setView('character')} />
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
              {view === 'character' && (
                <CharacterOfDay key="character" onBack={() => setView('daily')} />
              )}
              {view === 'reviews' && (
                <ReviewBoard key="reviews" onBack={() => setView('hero')} />
              )}
              {view === 'quiz' && (
                <DailyQuiz key="quiz" onBack={() => setView('hero')} />
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
