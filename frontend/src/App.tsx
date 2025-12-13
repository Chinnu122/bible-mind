import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll } from 'framer-motion';
import {
  Settings, User, Home, LogOut, BookOpen, Calendar, StickyNote, CheckCircle, MessageSquare
} from 'lucide-react';
import Hero from './components/Hero';
import BibleReaderNew from './components/BibleReaderNew';
import ImmersiveIntro from './components/ImmersiveIntro';
import NotesPage from './components/NotesPage';
import TeluguPage from './components/TeluguPage';
import AuthPage from './components/AuthPage';
import ClickSound from './components/ClickSound';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import SettingsModal from './components/SettingsModal';
import DailyVersePage from './components/DailyVersePage';
import BibleStudyPage from './components/BibleStudyPage';
import CharacterOfDay from './components/CharacterOfDay';
import ReviewBoard from './components/ReviewBoard';
import DailyQuiz from './components/DailyQuiz';
import SlidingBackground from './components/SlidingBackground';
import ChristmasSnow from './components/ChristmasSnow';
import AtmospherePlayer from './components/AtmospherePlayer';
import DivineRays from './components/DivineRays';

type ViewState = 'hero' | 'reader' | 'notes' | 'telugu' | 'auth' | 'daily' | 'study' | 'character' | 'reviews' | 'quiz';

function AppLayout() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('hero');
  const [_mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSettingsOpen, setIsSettingsOpen, zenMode, setZenMode, theme } = useSettings();
  const [santaMessage, setSantaMessage] = useState(false);

  const navigateTo = (target: ViewState) => {
    setView(target);
    setMobileMenuOpen(false);
  };

  // Navigation Items Configuration
  const navItems = [
    { id: 'hero', icon: Home, label: 'Home' },
    { id: 'reader', icon: BookOpen, label: 'Read' },
    { id: 'daily', icon: Calendar, label: 'Daily' },
    { id: 'quiz', icon: CheckCircle, label: 'Quiz' },
    { id: 'notes', icon: StickyNote, label: 'Notes' },
    { id: 'reviews', icon: MessageSquare, label: 'Community' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-crema-50 font-sans selection:bg-gold-500/30">
      <SlidingBackground />
      <DivineRays />
      {theme === 'christmas' && <ChristmasSnow />}
      <ClickSound />
      <AtmospherePlayer />

      {/* Surprise 10: Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold-500 z-[100] origin-left"
        style={{ scaleX: useScroll().scrollYProgress }}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900"
          >
            <ImmersiveIntro onComplete={() => setShowIntro(false)} />
          </motion.div>
        ) : (
          <LayoutGroup>
            {/* Main Content Container - Glass Effect */}
            <motion.main
              layout
              className={`relative min-h-screen transition-all duration-700 ease-out 
                  ${isSettingsOpen ? 'scale-[0.92] opacity-50 blur-sm rounded-[2rem] overflow-hidden' : 'scale-100'} 
                  pt-8 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto`}
            >
              <AnimatePresence mode="wait">
                {view === 'hero' && <Hero key="hero" onStart={() => setView('reader')} />}
                {view === 'reader' && <BibleReaderNew key="reader" />}
                {view === 'daily' && <DailyVersePage key="daily" onBack={() => setView('hero')} onViewCharacter={() => setView('character')} onViewQuiz={() => setView('quiz')} onViewCommunity={() => setView('reviews')} />}
                {view === 'notes' && <NotesPage key="notes" onBack={() => setView('reader')} />}
                {view === 'telugu' && <TeluguPage key="telugu" onBack={() => setView('reader')} />}
                {view === 'auth' && <AuthPage key="auth" onBack={() => setView('hero')} />}
                {view === 'study' && <BibleStudyPage key="study" onBack={() => setView('hero')} />}
                {view === 'character' && <CharacterOfDay key="character" onBack={() => setView('daily')} />}
                {view === 'reviews' && <ReviewBoard key="reviews" onBack={() => setView('hero')} />}
                {view === 'quiz' && <DailyQuiz key="quiz" onBack={() => setView('hero')} />}
              </AnimatePresence>
            </motion.main>

            {/* Floating Dock Navigation (Desktop) - Hidden in Zen Mode */}
            {!zenMode && (
              <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 p-2 
                  bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl shadow-black/20">

                {navItems.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id as ViewState)}
                      className="relative group p-3 rounded-full transition-all duration-300 hover:bg-white/5"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon
                        size={24}
                        className={`relative z-10 transition-colors duration-300 
                          ${isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-crema-100'}`}
                      />

                      {/* Tooltip */}
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-xs 
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/5">
                        {item.label}
                      </span>
                    </button>
                  );
                })}

                <div className="w-px h-8 bg-white/10 mx-2" />

                <button
                  onClick={() => navigateTo('auth')}
                  className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-gold-400 transition-colors relative group"
                >
                  <User size={24} />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-xs 
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/5">
                    Profile
                  </span>
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-gold-400 transition-colors relative group"
                >
                  <Settings size={24} />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-xs 
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/5">
                    Settings
                  </span>
                </button>
              </nav>
            )}

            {/* Exit Zen Mode Button */}
            {zenMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setZenMode(false)}
                className="fixed bottom-8 right-8 z-[100] px-4 py-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-white/50 hover:text-white transition-all flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="text-xs uppercase tracking-widest font-sans">Exit Zen</span>
              </motion.button>
            )}

            {/* Surprise 8: Santa Widget (Christmas Theme Only) */}
            {theme === 'christmas' && !zenMode && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="fixed bottom-24 right-4 md:right-8 z-50"
              >
                <button
                  onClick={() => setSantaMessage(p => !p)}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-white/20 shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-pointer relative"
                >
                  🎅
                  {santaMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute bottom-20 right-0 w-48 bg-white text-slate-900 p-4 rounded-2xl shadow-xl text-center font-serif text-sm border-2 border-red-500 after:content-[''] after:absolute after:bottom-[-8px] after:right-6 after:w-4 after:h-4 after:bg-white after:rotate-45 after:border-r-2 after:border-b-2 after:border-red-500"
                    >
                      <p className="mb-2 font-bold text-red-600">Merry Christmas!</p>
                      <p>May the peace of Christ rule in your hearts.</p>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            )}

            {/* Mobile Bottom Bar - Hidden in Zen Mode */}
            {!zenMode && (
              <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/90 border-t border-white/5 pb-6">
                <div className="flex justify-around items-center p-3">
                  {/* Main Nav Items (4 items) */}
                  {navItems.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id as ViewState)}
                      className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-gold-400' : 'text-slate-500'}`}
                    >
                      <item.icon size={20} />
                      <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
                    </button>
                  ))}

                  {/* Profile Button */}
                  <button
                    onClick={() => navigateTo('auth')}
                    className={`flex flex-col items-center gap-1 ${view === 'auth' ? 'text-gold-400' : 'text-slate-500'}`}
                  >
                    <User size={20} />
                    <span className="text-[9px] uppercase tracking-wider">Profile</span>
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-500"
                  >
                    <Settings size={20} />
                    <span className="text-[9px] uppercase tracking-wider">Settings</span>
                  </button>
                </div>
              </nav>
            )}

          </LayoutGroup>
        )}
      </AnimatePresence>
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
