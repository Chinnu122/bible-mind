import { useState, useEffect } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll } from 'framer-motion';
import {
  Settings, User, Home, BookOpen, Calendar, CheckCircle, MessageSquare, Image as ImageIcon, LogOut, Crown, Download, Library, StickyNote
} from 'lucide-react';
import Hero from './components/Hero';
import SimpleBibleReader from './components/SimpleBibleReader';
// import BibleReaderNew from './components/BibleReaderNew';
import TeluguPage from './components/TeluguPage';
import AuthPage from './components/AuthPage';
import NotesPage from './components/NotesPage';
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
import LogoIntro from './components/LogoIntro';
import NebulaBackground from './components/NebulaBackground';
import MetallicWavesWallpaper from './components/MetallicWavesWallpaper';
import LivingPrismIntro from './components/LivingPrismIntro';
// LogoIntro removed
import MagneticButton from './components/MagneticButton';
import Logo from './components/Logo';
import MobileDrawer from './components/MobileDrawer';
import DownloadPage from './components/DownloadPage';
import UpdateChecker from './components/UpdateChecker';
import WordSearch from './components/WordSearch';
import HebrewGreekGlossary from './components/HebrewGreekGlossary';
import LanguageSelector from './components/LanguageSelector';
import { BibleProvider } from './contexts/BibleContext';
import AdvancedSearchPage from './components/AdvancedSearchPage';

type ViewState = 'landing' | 'hero' | 'reader' | 'notes' | 'telugu' | 'auth' | 'daily' | 'study' | 'character' | 'reviews' | 'quiz' | 'gallery' | 'videos' | 'books' | 'dashboard' | 'pricing' | 'download' | 'search' | 'about' | 'privacy' | 'terms' | 'sources' | 'contact';

interface UserData {
  id: string;
  email: string;
  name: string;
}

// ... imports
import TopNavbar from './components/TopNavbar';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import { PrivacyPolicy, TermsOfUse, BibleSources, ContactPage } from './components/TrustPages';

// ... existing imports ...

function AppLayout() {
  const { theme, zenMode, customBackground, isSettingsOpen, setIsSettingsOpen, setZenMode, language } = useSettings();
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<ViewState>('landing');
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Restore user
  useEffect(() => {
    const savedUser = localStorage.getItem('bible-mind-user');
    if (savedUser) try { setLoggedInUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
  }, []);

  const navigateTo = (target: string) => {
    setView(target as ViewState);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  const handleLogout = () => {
    localStorage.removeItem('bible-mind-user');
    setLoggedInUser(null);
  };

  /* Render Content based on View */
  const renderContent = () => {
    switch (view) {
      case 'landing': return <Hero onStart={() => navigateTo('reader')} onSearch={() => setSearchOpen(true)} onStudy={() => navigateTo('study')} />;
      case 'reader': return <SimpleBibleReader />;
      case 'study': return <Dashboard onNavigate={navigateTo as any} onBack={() => navigateTo('landing')} />; // 'study' maps to dashboard for now
      case 'about': return <AboutPage />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfUse />;
      case 'sources': return <BibleSources />;
      case 'contact': return <ContactPage />;

      // Existing Component Mappings
      case 'dashboard': return <Dashboard onNavigate={navigateTo as any} onBack={() => navigateTo('landing')} />;
      case 'search': return <AdvancedSearchPage onNavigate={() => navigateTo('reader')} onBack={() => navigateTo('landing')} />;
      case 'daily': return <DailyVersePage onBack={() => navigateTo('landing')} onViewCharacter={() => navigateTo('character')} onViewQuiz={() => navigateTo('quiz')} onViewCommunity={() => navigateTo('reviews')} />;
      case 'telugu': return <TeluguPage onBack={() => navigateTo('reader')} />;
      case 'auth': return <AuthPage onBack={() => navigateTo('landing')} onAuthSuccess={(user) => { setLoggedInUser(user); navigateTo('landing'); }} />;
      case 'notes': return <NotesPage onBack={() => navigateTo('landing')} onNavigateToAuth={() => navigateTo('auth')} />;
      case 'character': return <CharacterOfDay onBack={() => navigateTo('daily')} />;
      case 'reviews': return <ReviewBoard onBack={() => navigateTo('landing')} />;
      case 'quiz': return <DailyQuiz onBack={() => navigateTo('landing')} />;
      case 'gallery': return <VerseGallery onBack={() => navigateTo('landing')} />;
      case 'videos': return <VisualsGallery onBack={() => navigateTo('dashboard')} />;
      case 'books': return <BooksPage onBack={() => navigateTo('dashboard')} />;
      case 'pricing': return <PricingPage onBack={() => navigateTo('dashboard')} />;
      case 'download': return <DownloadPage onBack={() => navigateTo('landing')} />;

      default: return <Hero onStart={() => navigateTo('reader')} onSearch={() => setSearchOpen(true)} onStudy={() => navigateTo('study')} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-ivory-100 text-charcoal-900 font-sans selection:bg-gold-500/30">

      {/* Background - Clean Ivory Base */}
      <div className="fixed inset-0 z-0 bg-ivory-100 pointer-events-none" />

      <ClickSound />
      <UpdateChecker />
      <WordSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={() => setSearchOpen(true)}
        onAdvancedSearch={() => { setSearchOpen(false); navigateTo('search'); }}
      />

      {/* Top Navigation */}
      {!zenMode && (
        <TopNavbar
          currentView={view}
          onNavigate={navigateTo}
          user={loggedInUser}
          onLogout={handleLogout}
          onSignIn={() => navigateTo('auth')}
        />
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal />}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`relative transition-all duration-500 min-h-screen ${!zenMode ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - Only show on main content pages, hide in reader/zen modes if preferred, but usually good to have */}
      {!zenMode && view !== 'reader' && (
        <Footer onNavigate={navigateTo} />
      )}

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
