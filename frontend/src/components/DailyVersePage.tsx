import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, ChevronUp, Globe, BookOpen, User, Calendar, Sparkles } from 'lucide-react';
import { getTodayContent, languageNames, verseStudyContent, Language } from '../data/dailyContent';
import { useSettings } from '../contexts/SettingsContext';

interface DailyVersePageProps {
    onBack: () => void;
}

export default function DailyVersePage({ onBack }: DailyVersePageProps) {
    const [language, setLanguage] = useState<Language>('en');
    const [expandedVerse, setExpandedVerse] = useState<string | null>(null);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();

    const content = getTodayContent();

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No content available for today.</p>
            </div>
        );
    }

    const themeStyles = {
        divine: {
            card: 'bg-black/40 border-gold-500/20',
            accent: 'text-gold-400',
            button: 'bg-gold-500/20 hover:bg-gold-500/30 border-gold-500/30'
        },
        midnight: {
            card: 'bg-slate-800/60 border-cyan-500/20',
            accent: 'text-cyan-400',
            button: 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30'
        },
        parchment: {
            card: 'bg-white/60 border-amber-700/20',
            accent: 'text-amber-800',
            button: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-700/30'
        }
    };

    const styles = themeStyles[theme];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 pb-12 px-4 md:px-8"
        >
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all ${styles.button}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden md:inline">Back</span>
                    </button>

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all ${styles.button}`}
                        >
                            <Globe className="w-5 h-5" />
                            <span>{languageNames[language]}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showLangMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute right-0 mt-2 w-48 rounded-xl backdrop-blur-xl border shadow-2xl overflow-hidden z-50 ${styles.card}`}
                                >
                                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${language === lang ? styles.accent + ' font-bold' : ''}`}
                                        >
                                            {languageNames[lang]}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Hebron Calendar Date */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-center mb-8 p-6 rounded-2xl backdrop-blur-md border ${styles.card}`}
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className={`w-6 h-6 ${styles.accent}`} />
                        <span className="text-sm uppercase tracking-widest opacity-60">Hebron Calendar</span>
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-cinzel font-bold ${styles.accent}`}>
                        9.12.2025
                    </h2>
                </motion.div>

                {/* Daily Verse Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`mb-8 p-8 rounded-3xl backdrop-blur-md border relative overflow-hidden ${styles.card}`}
                >
                    <div className="absolute top-4 right-4">
                        <Sparkles className={`w-6 h-6 ${styles.accent} animate-pulse`} />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className={`w-5 h-5 ${styles.accent}`} />
                        <span className="text-sm uppercase tracking-widest opacity-60">Daily Verse</span>
                    </div>

                    <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-4">
                        "{content.verse.text[language]}"
                    </blockquote>

                    <p className={`text-lg font-medium ${styles.accent}`}>
                        — {content.verse.reference}
                    </p>
                </motion.div>

                {/* Character of the Day */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-8 rounded-3xl backdrop-blur-md border ${styles.card}`}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <User className={`w-5 h-5 ${styles.accent}`} />
                        <span className="text-sm uppercase tracking-widest opacity-60">Bible Character of the Day</span>
                    </div>

                    <h3 className={`text-3xl md:text-4xl font-cinzel font-bold mb-4 ${styles.accent}`}>
                        {content.character.name[language]}
                    </h3>

                    <p className="text-lg opacity-80 mb-6 italic">
                        {content.character.meaning[language]}
                    </p>

                    {/* Context */}
                    <div className="mb-8">
                        <h4 className="text-sm uppercase tracking-widest opacity-60 mb-3">Context</h4>
                        <p className="text-lg leading-relaxed">
                            {content.character.context[language]}
                        </p>
                    </div>

                    {/* Key Verses */}
                    <div>
                        <h4 className="text-sm uppercase tracking-widest opacity-60 mb-4">Key Verses (Click to Expand)</h4>
                        <div className="space-y-3">
                            {content.character.keyVerses.map((verse) => (
                                <div key={verse} className={`rounded-xl border overflow-hidden ${styles.card}`}>
                                    <button
                                        onClick={() => setExpandedVerse(expandedVerse === verse ? null : verse)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <span className={`font-medium ${styles.accent}`}>{verse}</span>
                                        {expandedVerse === verse ? (
                                            <ChevronUp className="w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {expandedVerse === verse && verseStudyContent[verse] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/10"
                                            >
                                                <p className="p-4 text-base leading-relaxed opacity-80">
                                                    {verseStudyContent[verse][language]}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
