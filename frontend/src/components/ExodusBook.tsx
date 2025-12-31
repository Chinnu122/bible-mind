import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw, BookOpen,
    Waves, Flame, Cloud, Sun, Moon, Mountain, Shield, Heart, X, Globe
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { exodusStories } from '../data/exodusStories';

// Available Languages
type Language = 'en' | 'te' | 'hi';

const languages: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

// Theme icons for Exodus
const themeIcons: Record<string, React.ReactNode> = {
    egypt: <Shield className="w-8 h-8" />,
    decree: <X className="w-8 h-8" />,
    baby: <Heart className="w-8 h-8" />,
    princess: <Heart className="w-8 h-8" />,
    flee: <Waves className="w-8 h-8" />,
    shepherd: <Cloud className="w-8 h-8" />,
    burning_bush: <Flame className="w-8 h-8" />,
    calling: <Mountain className="w-8 h-8" />,
    signs: <Flame className="w-8 h-8" />,
    pharaoh: <Shield className="w-8 h-8" />,
    plague1: <Waves className="w-8 h-8" />,
    plague2: <Waves className="w-8 h-8" />,
    plague3: <Cloud className="w-8 h-8" />,
    plague5: <Flame className="w-8 h-8" />,
    plague7: <Cloud className="w-8 h-8" />,
    plague8: <Cloud className="w-8 h-8" />,
    plague9: <Moon className="w-8 h-8" />,
    passover: <Heart className="w-8 h-8" />,
    plague10: <Moon className="w-8 h-8" />,
    exodus: <Sun className="w-8 h-8" />,
    chase: <Shield className="w-8 h-8" />,
    fear: <Heart className="w-8 h-8" />,
    parting: <Waves className="w-8 h-8" />,
    victory: <Sun className="w-8 h-8" />,
    song: <Heart className="w-8 h-8" />,
    marah: <Waves className="w-8 h-8" />,
    manna: <Cloud className="w-8 h-8" />,
    rock: <Mountain className="w-8 h-8" />,
    battle: <Shield className="w-8 h-8" />,
    judges: <BookOpen className="w-8 h-8" />,
    sinai: <Mountain className="w-8 h-8" />,
    thunder: <Cloud className="w-8 h-8" />,
    commandments1: <Book className="w-8 h-8" />,
    commandments2: <Book className="w-8 h-8" />,
    forty_days: <Mountain className="w-8 h-8" />,
    golden_calf: <X className="w-8 h-8" />,
    tablets_broken: <X className="w-8 h-8" />,
    glory: <Sun className="w-8 h-8" />,
    new_tablets: <Book className="w-8 h-8" />,
    shining: <Sun className="w-8 h-8" />,
    offering: <Heart className="w-8 h-8" />,
    ark: <Book className="w-8 h-8" />,
    tent: <Cloud className="w-8 h-8" />,
    altar: <Flame className="w-8 h-8" />,
    incense: <Cloud className="w-8 h-8" />,
    willing: <Heart className="w-8 h-8" />,
    building: <Mountain className="w-8 h-8" />,
    finished: <Sun className="w-8 h-8" />,
    setup: <Book className="w-8 h-8" />,
    glory_fills: <Sun className="w-8 h-8" />,
};

// Theme gradients for Exodus
const themeGradients: Record<string, string> = {
    egypt: 'from-amber-900 to-amber-700',
    decree: 'from-red-900 to-red-700',
    baby: 'from-blue-900 to-blue-700',
    princess: 'from-purple-900 to-purple-700',
    flee: 'from-orange-900 to-orange-700',
    shepherd: 'from-green-900 to-green-700',
    burning_bush: 'from-orange-600 to-red-700',
    calling: 'from-blue-800 to-purple-700',
    signs: 'from-amber-800 to-orange-700',
    pharaoh: 'from-slate-800 to-slate-600',
    plague1: 'from-red-800 to-red-600',
    plague2: 'from-green-800 to-green-600',
    plague3: 'from-gray-800 to-gray-600',
    plague5: 'from-red-700 to-orange-600',
    plague7: 'from-gray-700 to-blue-700',
    plague8: 'from-green-700 to-amber-700',
    plague9: 'from-slate-900 to-slate-700',
    passover: 'from-red-900 to-amber-700',
    plague10: 'from-black to-gray-800',
    exodus: 'from-amber-700 to-orange-600',
    chase: 'from-red-800 to-amber-700',
    fear: 'from-gray-800 to-blue-800',
    parting: 'from-blue-800 to-cyan-600',
    victory: 'from-amber-600 to-yellow-500',
    song: 'from-purple-700 to-pink-600',
    marah: 'from-blue-700 to-cyan-600',
    manna: 'from-amber-600 to-yellow-500',
    rock: 'from-gray-700 to-amber-700',
    battle: 'from-red-700 to-orange-600',
    judges: 'from-indigo-800 to-purple-700',
    sinai: 'from-gray-800 to-amber-700',
    thunder: 'from-slate-800 to-purple-700',
    commandments1: 'from-amber-800 to-orange-600',
    commandments2: 'from-amber-700 to-orange-500',
    forty_days: 'from-blue-900 to-purple-800',
    golden_calf: 'from-amber-600 to-red-600',
    tablets_broken: 'from-gray-800 to-red-700',
    glory: 'from-amber-500 to-yellow-400',
    new_tablets: 'from-amber-700 to-orange-600',
    shining: 'from-yellow-500 to-amber-400',
    offering: 'from-amber-700 to-purple-600',
    ark: 'from-amber-600 to-yellow-500',
    tent: 'from-blue-700 to-purple-600',
    altar: 'from-amber-700 to-red-600',
    incense: 'from-purple-700 to-pink-600',
    willing: 'from-green-700 to-teal-600',
    building: 'from-amber-700 to-orange-600',
    finished: 'from-green-600 to-teal-500',
    setup: 'from-amber-600 to-yellow-500',
    glory_fills: 'from-amber-500 to-yellow-400',
};

interface ExodusBookProps {
    onBack: () => void;
}

const ExodusBook: React.FC<ExodusBookProps> = ({ onBack }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [language, setLanguage] = useState<Language>('en');
    const [showLangSelector, setShowLangSelector] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const { fontSize } = useSettings();
    const containerRef = useRef<HTMLDivElement>(null);

    const story = exodusStories[currentPage];
    const content = story[language];
    const themeIcon = themeIcons[story.theme] || <BookOpen className="w-8 h-8" />;
    const themeGradient = themeGradients[story.theme] || 'from-slate-800 to-slate-600';

    const goToPage = (pageNum: number) => {
        if (pageNum >= 0 && pageNum < exodusStories.length && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(pageNum);
                setIsFlipping(false);
            }, 300);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const handleTouchStart = useRef<number>(0);
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = handleTouchStart.current - touchEnd;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextPage();
            else prevPage();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md border-b border-white/10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-serif text-lg">Exodus Story</span>
                </div>

                <button
                    onClick={() => setShowLangSelector(!showLangSelector)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{languages.find(l => l.id === language)?.native}</span>
                </button>
            </div>

            {/* Language Selector Dropdown */}
            {showLangSelector && (
                <div className="absolute top-16 right-4 z-60 bg-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                    {languages.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => {
                                setLanguage(lang.id);
                                setShowLangSelector(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${language === lang.id ? 'bg-blue-500/20 text-blue-400' : 'text-white/80'
                                }`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <div>
                                <div className="font-medium">{lang.name}</div>
                                <div className="text-xs text-white/50">{lang.native}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Story Content */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden relative"
                onTouchStart={(e) => handleTouchStart.current = e.touches[0].clientX}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`h-full transition-all duration-300 ${isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                >
                    {/* Theme Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} opacity-20`} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6 overflow-y-auto">
                        {/* Page Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/10 text-white/80">
                                    {themeIcon}
                                </div>
                                <div>
                                    <span className="text-xs text-white/50 uppercase tracking-wider">Page {story.page}</span>
                                    <div className="text-sm text-white/60">{story.ref}</div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight"
                        >
                            {content.title}
                        </h1>

                        {/* Paragraphs */}
                        <div className="space-y-4 flex-1">
                            {content.paragraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    className="text-lg md:text-xl text-white/80 leading-relaxed"
                                    style={{
                                        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1.125rem',
                                        lineHeight: 1.8
                                    }}
                                >
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Page Navigation Dots */}
                        <div className="flex justify-center gap-1 mt-6 flex-wrap max-w-md mx-auto">
                            {Array.from({ length: Math.min(10, exodusStories.length) }).map((_, idx) => {
                                const pageIndex = Math.floor(currentPage / 10) * 10 + idx;
                                if (pageIndex >= exodusStories.length) return null;
                                return (
                                    <button
                                        key={pageIndex}
                                        onClick={() => goToPage(pageIndex)}
                                        className={`w-2 h-2 rounded-full transition-all ${currentPage === pageIndex
                                            ? 'bg-blue-400 w-4'
                                            : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md border-t border-white/10">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPage === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => goToPage(0)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                        title="Go to beginning"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>

                    <div className="text-white/60 text-sm">
                        {currentPage + 1} / {exodusStories.length}
                    </div>
                </div>

                <button
                    onClick={nextPage}
                    disabled={currentPage === exodusStories.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPage === exodusStories.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-400 text-white'
                        }`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ExodusBook;
