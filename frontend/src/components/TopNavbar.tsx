import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

interface NavItem {
    id: string;
    label: string;
    path?: string;
    action?: () => void;
    subItems?: { label: string; id: string }[];
}

interface TopNavbarProps {
    onNavigate: (view: string) => void;
    currentView: string;
    user: { name: string } | null;
    onLogout: () => void;
    onSignIn: () => void;
}

export default function TopNavbar({ onNavigate, currentView, user, onLogout, onSignIn }: TopNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language } = useSettings();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navTranslations = {
        english: {
            home: 'Home',
            read: 'Read Bible',
            study: 'Study Tools',
            about: 'About',
            contact: 'Contact',
        },
        telugu: {
            home: 'ప్రారంభం',
            read: 'బైబిల్ చదవండి',
            study: 'ధ్యాన సాధనాలు',
            about: 'మా గురించి',
            contact: 'సంప్రదించండి',
        },
        hindi: {
            home: 'होम',
            read: 'बाइबल पढ़ें',
            study: 'अध्ययन उपकरण',
            about: 'हमारे बारे में',
            contact: 'संपर्क करें',
        }
    };

    const t = navTranslations[language as keyof typeof navTranslations] || navTranslations.english;

    const navItems: NavItem[] = [
        { id: 'landing', label: t.home },
        { id: 'reader', label: t.read },
        { id: 'study', label: t.study }, // Maps to Study Tools page (which might be dashboard/tools)
        { id: 'about', label: t.about },
        { id: 'contact', label: t.contact }, // We might need a contact functionality or section
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-ivory-100/90 backdrop-blur-md shadow-sm border-b border-gold-500/10' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('landing')}>
                            <Logo size="md" />
                            {/* Note: Ensure Logo component effectively supports light mode or force it if needed */}
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`text-sm font-medium transition-colors hover:text-gold-600 ${currentView === item.id ? 'text-gold-600 font-semibold' : 'text-charcoal-700'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center space-x-6">
                            <LanguageSelector />

                            <div className="h-6 w-px bg-charcoal-200" />

                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-charcoal-700 hover:text-gold-600 transition-colors">
                                        <User size={20} />
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-charcoal-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                        <div className="py-1">
                                            <button
                                                onClick={onLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={onSignIn}
                                    className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-medium rounded-full transition-colors shadow-md shadow-gold-500/20"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-charcoal-800 hover:text-gold-600 p-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-20 left-0 right-0 bg-ivory-100 border-b border-gold-500/10 shadow-xl z-40 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`block w-full text-left py-3 px-4 rounded-lg text-base font-medium ${currentView === item.id
                                            ? 'bg-gold-50 text-gold-700'
                                            : 'text-charcoal-700 hover:bg-charcoal-50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className="border-t border-charcoal-100 pt-4 mt-4">
                                <div className="flex items-center justify-between px-4 mb-4">
                                    <span className="text-sm text-charcoal-500 font-medium">Language</span>
                                    <LanguageSelector />
                                </div>

                                {user ? (
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 text-red-600 rounded-lg font-medium"
                                    >
                                        <LogOut size={18} />
                                        <span>Sign Out ({user.name})</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onSignIn();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-3 bg-gold-500 text-white rounded-lg font-medium shadow-md"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
