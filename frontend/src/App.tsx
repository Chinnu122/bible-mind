import { useState, useEffect } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll } from 'framer-motion';
import {
  Settings, User, Home, BookOpen, Calendar, CheckCircle, MessageSquare, Image as ImageIcon, LogOut, Crown, Download, Library
} from 'lucide-react';
import Hero from './components/Hero';
import BibleReaderNew from './components/BibleReaderNew';
import TeluguPage from './components/TeluguPage';
import AuthPage from './components/AuthPage';
import ClickSound from './components/ClickSound';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import SettingsModal from './components/SettingsModal';
import DailyVersePage from './components/DailyVersePage';
import BibleStudyPage from './components/BibleStudyPage';
import CharacterOfDay from './components/CharacterOfDay';
import ReviewBoard from './components/ReviewBoard';
import DailyQuiz from './components/DailyQuiz';
import AtmospherePlayer from './components/AtmospherePlayer';
import HolidayManager, { HolidayMode } from './components/holiday/HolidayManager';
import HolidayBackground from './components/holiday/HolidayBackground';
import VerseGallery from './components/VerseGallery';
import VisualsGallery from './components/VideosPage';
import BooksPage from './components/BooksPage';
import Dashboard from './components/Dashboard';
import PricingPage from './components/PricingPage';
import LiveAbstractWallpaper from './components/LiveAbstractWallpaper';
import NebulaBackground from './components/NebulaBackground';
import AbstractLinesWallpaper from './components/AbstractLinesWallpaper';
import LivingPrismIntro from './components/LivingPrismIntro';
import LogoIntro from './components/LogoIntro';
import MagneticButton from './components/MagneticButton';
import GoldenDustCursor from './components/GoldenDustCursor';
import DivineRays from './components/DivineRays';
import Logo from './components/Logo';
import MobileDrawer from './components/MobileDrawer';
import DownloadPage from './components/DownloadPage';
import UpdateChecker from './components/UpdateChecker';
import WordSearch from './components/WordSearch';
import HebrewGreekGlossary from './components/HebrewGreekGlossary';
import LanguageSelector from './components/LanguageSelector';
import { BibleProvider } from './contexts/BibleContext';
import AdvancedSearchPage from './components/AdvancedSearchPage';

type ViewState = 'landing' | 'hero' | 'reader' | 'notes' | 'telugu' | 'auth' | 'daily' | 'study' | 'character' | 'reviews' | 'quiz' | 'gallery' | 'videos' | 'books' | 'dashboard' | 'pricing' | 'download' | 'search';

interface UserData {
  id: string;
  email: string;
  name: string;
}

function AppLayout() {
  const { theme, zenMode, customBackground, isSettingsOpen, setIsSettingsOpen, setZenMode, language } = useSettings();
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('landing');
  const [_mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [holidayMode, setHolidayMode] = useState<HolidayMode>('none');
  const [showGlossary, setShowGlossary] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('bible-mind-user');
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const navigateTo = (target: ViewState) => {
    setView(target);
    setMobileMenuOpen(false);
  };

  // Background Selection
  const renderBackground = () => {
    // Holiday Mode Override
    if (holidayMode !== 'none') {
      return <HolidayBackground mode={holidayMode} />;
    }

    if (customBackground) {
      return (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url('${customBackground}')` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
      );
    }

    // Use AbstractLinesWallpaper for concentrated, modern aesthetic
    return <AbstractLinesWallpaper />;
  };

  // Navigation Translations
  const navTranslations = {
    english: {
      landing: 'Home',
      reader: 'Read',
      videos: 'Visuals',
      books: 'Books',
      daily: 'Daily',
      quiz: 'Quiz',
      reviews: 'Community',
      pricing: 'Pricing',
      download: 'Download'
    },
    telugu: {
      landing: 'ప్రారంభం', // Home
      reader: 'చదవండి', // Read
      videos: 'దృశ్యాలు', // Visuals
      books: 'పుస్తకాలు', // Books
      daily: 'దినచర్య', // Daily
      quiz: 'ప్రశ్నలు', // Quiz
      reviews: 'సమాజం', // Community
      pricing: 'ధరలు', // Pricing
      download: 'డౌన్‌లోడ్' // Download
    },
    hindi: {
      landing: 'होम',
      reader: 'पढ़ें',
      videos: 'दृश्य',
      books: 'किताबें',
      daily: 'दैनिक',
      quiz: 'प्रश्नोत्तरी',
      reviews: 'समुदाय',
      pricing: 'मूल्य',
      download: 'डाउनलोड'
    }
  };

  const t = navTranslations[language as keyof typeof navTranslations] || navTranslations.english;

  // Navigation Items Configuration
  const navItems = [
    { id: 'landing', icon: Home, label: t.landing },
    { id: 'reader', icon: BookOpen, label: t.reader },
    { id: 'videos', icon: ImageIcon, label: t.videos },
    { id: 'books', icon: Library, label: t.books },
    { id: 'daily', icon: Calendar, label: t.daily },
    { id: 'quiz', icon: CheckCircle, label: t.quiz },
    { id: 'reviews', icon: MessageSquare, label: t.reviews },
    { id: 'pricing', icon: Crown, label: t.pricing },
    { id: 'download', icon: Download, label: t.download },
  ];

  /* Main App Layout */
  return (
    <div className="min-h-screen relative overflow-hidden text-crema-50 font-sans selection:bg-gold-500/30">

      {renderBackground()}

      <DivineRays />
      <GoldenDustCursor />
      <ClickSound />
      <AtmospherePlayer />
      <HolidayManager onModeChange={setHolidayMode} />
      <UpdateChecker />
      <WordSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={() => setSearchOpen(true)}
        onAdvancedSearch={() => {
          setSearchOpen(false);
          navigateTo('search');
        }}
      />
      <HebrewGreekGlossary
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
      />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold-500 z-[100] origin-left"
        style={{ scaleX: useScroll().scrollYProgress }}
      />

      {/* App Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-50 cursor-pointer"
        onClick={() => navigateTo('landing')}
      >
        <Logo size="sm" />
      </motion.div>

      {/* Language Selector (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50"
      >
        <LanguageSelector />
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal />}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        navItems={navItems}
        currentView={view}
        onNavigate={(id) => navigateTo(id as ViewState)}
        loggedInUser={loggedInUser}
        onLogout={() => { localStorage.removeItem('bible-mind-user'); setLoggedInUser(null); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <LogoIntro onComplete={() => setShowIntro(false)} />
        ) : (
          <LayoutGroup>
            {/* Main Content Container - Glass Effect */}
            <motion.main
              layout
              className={`relative min-h-screen transition-all duration-700 ease-out 
                  ${isSettingsOpen ? 'scale-[0.92] opacity-50 blur-sm rounded-[2rem] overflow-hidden' : 'scale-100'} 
                  pt-20 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto`}
            >
              <AnimatePresence mode="wait">
                {view === 'landing' && (
                  <Hero
                    key="landing"
                    onStart={() => setView('reader')}
                    onSearch={() => setSearchOpen(true)}
                    onStudy={() => setView('study')}
                  />
                )}
                {view === 'dashboard' && <Dashboard key="dashboard" onNavigate={navigateTo} onBack={() => navigateTo('landing')} />}
                {view === 'reader' && <BibleReaderNew key="reader" />}
                {view === 'search' && <AdvancedSearchPage key="search" onNavigate={() => setView('reader')} onBack={() => setView('landing')} />}
                {view === 'daily' && <DailyVersePage key="daily" onBack={() => setView('landing')} onViewCharacter={() => setView('character')} onViewQuiz={() => setView('quiz')} onViewCommunity={() => setView('reviews')} />}
                {view === 'telugu' && <TeluguPage key="telugu" onBack={() => setView('reader')} />}
                {view === 'auth' && <AuthPage key="auth" onBack={() => setView('landing')} onAuthSuccess={(user) => setLoggedInUser(user)} />}
                {view === 'study' && <BibleStudyPage key="study" onBack={() => setView('landing')} />}
                {view === 'character' && <CharacterOfDay key="character" onBack={() => setView('daily')} />}
                {view === 'reviews' && <ReviewBoard key="reviews" onBack={() => setView('landing')} />}
                {view === 'quiz' && <DailyQuiz key="quiz" onBack={() => setView('landing')} />}
                {view === 'gallery' && <VerseGallery key="gallery" onBack={() => setView('landing')} />}
                {view === 'videos' && <VisualsGallery key="videos" onBack={() => setView('dashboard')} />}
                {view === 'books' && <BooksPage key="books" onBack={() => setView('dashboard')} />}
                {view === 'pricing' && <PricingPage key="pricing" onBack={() => setView('dashboard')} />}
                {view === 'download' && <DownloadPage key="download" onBack={() => setView('landing')} />}
              </AnimatePresence>
            </motion.main>

            {/* Floating Dock Navigation (Desktop) - Hidden in Zen Mode */}
            {!zenMode && (
              <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 p-2 
                  bg-[#050505]/80 backdrop-blur-xl border border-gold-500/10 rounded-full shadow-2xl shadow-black/40">
                {navItems.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <MagneticButton
                      key={item.id}
                      onClick={() => navigateTo(item.id as ViewState)}
                      className={`relative group p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-gold-500/20 text-gold-400' : 'text-slate-400 hover:text-crema-50 hover:bg-white/5'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gold-500/10 rounded-full border border-gold-500/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon size={20} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-crema-100'}`} />

                      {/* Tooltip */}
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a1a] text-xs text-gold-100
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-gold-500/10 whitespace-nowrap">
                        {item.label}
                      </span>
                    </MagneticButton>
                  );
                })}

                <div className="w-px h-8 bg-white/10 mx-2" />

                {loggedInUser ? (
                  <MagneticButton
                    onClick={() => {
                      localStorage.removeItem('bible-mind-user');
                      setLoggedInUser(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 text-gold-400 hover:text-red-400 transition-colors relative group"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium max-w-[100px] truncate hidden md:block">{loggedInUser.name}</span>
                    <LogOut size={16} className="opacity-50 group-hover:opacity-100" />
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    onClick={() => navigateTo('auth')}
                    className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-gold-400 transition-colors relative group"
                  >
                    <User size={24} />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a1a] text-xs text-gold-100
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-gold-500/10 whitespace-nowrap">
                      Sign In
                    </span>
                  </MagneticButton>
                )}

                <MagneticButton
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-gold-400 transition-colors relative group"
                >
                  <Settings size={24} />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a1a] text-xs text-gold-100
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-gold-500/10 whitespace-nowrap">
                    Settings
                  </span>
                </MagneticButton>
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

            {/* Mobile Bottom Bar - Hidden in Zen Mode */}
            {!zenMode && (
              <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a0a] border-t border-gold-500/10 pb-6">
                <div className="flex justify-around items-center p-3">
                  {/* Hamburger Menu Button */}
                  <button
                    onClick={() => setMobileDrawerOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-500 hover:text-gold-400"
                  >
                    <div className="space-y-1">
                      <div className="w-5 h-0.5 bg-current rounded"></div>
                      <div className="w-5 h-0.5 bg-current rounded"></div>
                      <div className="w-5 h-0.5 bg-current rounded"></div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider">Menu</span>
                  </button>

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
                  {loggedInUser ? (
                    <button
                      onClick={() => {
                        localStorage.removeItem('bible-mind-user');
                        setLoggedInUser(null);
                      }}
                      className="flex flex-col items-center gap-1 text-gold-400"
                    >
                      <LogOut size={20} />
                      <span className="text-[9px] uppercase tracking-wider">Logout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('auth')}
                      className={`flex flex-col items-center gap-1 ${view === 'auth' ? 'text-gold-400' : 'text-slate-500'}`}
                    >
                      <User size={20} />
                      <span className="text-[9px] uppercase tracking-wider">Sign In</span>
                    </button>
                  )}

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
    <PerformanceProvider>
      <SettingsProvider>
        <BibleProvider>
          <AppLayout />
        </BibleProvider>
      </SettingsProvider>
    </PerformanceProvider>
  );
}

export default App;
