import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Share2, BookOpen,
    Sparkles, MessageCircle, ArrowUpRight
} from 'lucide-react';
import { getTodayContent, languageNames, Language } from '../data/dailyContent';

interface DailyVersePageProps {
    onBack: () => void;
    onViewCharacter?: () => void;
    onViewQuiz?: () => void;
    onViewCommunity?: () => void;
}

export default function DailyVersePage({ onBack, onViewCharacter, onViewQuiz, onViewCommunity }: DailyVersePageProps) {
    const [language, setLanguage] = useState<Language>('en');

    const content = getTodayContent();

    if (!content) return null;

    // Get today's formatted date
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const year = today.getFullYear();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full pt-4 pb-20 px-4 max-w-7xl mx-auto"
        >
            {/* Header / Date */}
            <header className="flex flex-col md:flex-row justify-between items-end mb-8 px-2">
                <div className="mb-4 md:mb-0">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-crema-100 mb-6 transition-colors"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Hebron Calendar
                    </h2>
                    <h1 className="text-6xl font-editorial text-crema-50 leading-none">
                        {formattedDate}<span className="text-slate-600 text-4xl">.{year}</span>
                    </h1>
                </div>

                {/* Language Toggler */}
                <div className="flex bg-slate-800 rounded-full p-1 border border-white/5">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all ${language === lang
                                ? 'bg-crema-100 text-slate-900 font-bold'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {languageNames[lang]}
                        </button>
                    ))}
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. Hero Card - Daily Verse (Span 8) */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-1 md:col-span-8 row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 p-8 md:p-12 flex flex-col justify-center min-h-[400px]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BookOpen size={200} />
                    </div>

                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-widest mb-6 border border-gold-500/20">
                            <Sparkles size={12} /> Daily Manna
                        </span>

                        <blockquote className="text-3xl md:text-4xl lg:text-5xl font-editorial text-crema-50 leading-tight mb-8">
                            "{content.verse.text[language]}"
                        </blockquote>

                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <cite className="text-xl text-gold-200 font-serif italic not-italic">
                                — {content.verse.reference}
                            </cite>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Character Card (Span 4) */}
                <motion.div
                    variants={itemVariants}
                    onClick={onViewCharacter}
                    className="col-span-1 md:col-span-4 row-span-2 relative group cursor-pointer overflow-hidden rounded-3xl bg-slate-800 border border-white/5 p-8 transition-all hover:bg-slate-750 hover:border-gold-500/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-sans uppercase tracking-widest text-slate-400">
                                Character Study
                            </span>
                            <ArrowUpRight className="text-slate-500 group-hover:text-crema-100 transition-colors" />
                        </div>

                        <div className="mt-8">
                            <div className="w-20 h-20 rounded-full bg-slate-700 mb-6 flex items-center justify-center text-3xl border-2 border-slate-600 group-hover:border-gold-500 transition-colors font-editorial text-crema-50">
                                {content.character.name['en'].charAt(0)}
                            </div>
                            <h3 className="text-3xl font-editorial text-crema-50 mb-2 group-hover:text-gold-300 transition-colors">
                                {content.character.name[language]}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                                {content.character.meaning[language]}
                            </p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider group-hover:text-gold-400 transition-colors">
                                Tap to read story →
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Quiz / Engagement Card (Span 4) */}
                <motion.div
                    variants={itemVariants}
                    onClick={onViewQuiz}
                    className="col-span-1 md:col-span-4 bg-royal-900/20 border border-royal-500/20 rounded-3xl p-6 flex flex-col justify-between group hover:bg-royal-900/30 transition-colors cursor-pointer min-h-[180px]"
                >
                    <div className="flex items-center gap-3 text-royal-400 mb-2">
                        <MessageCircle size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Quiz Time</span>
                    </div>
                    <div>
                        <p className="text-xl text-crema-100 font-serif mb-2">
                            Test your knowledge
                        </p>
                        <p className="text-sm text-royal-200/60">
                            3 Questions • 50 XP
                        </p>
                    </div>
                    <div className="w-full h-1 bg-royal-900/50 rounded-full mt-4 overflow-hidden">
                        <div className="w-0 h-full bg-royal-500 group-hover:w-full transition-all duration-700" />
                    </div>
                </motion.div>

                {/* 4. Community / Share Card (Span 4) */}
                <motion.div
                    variants={itemVariants}
                    onClick={onViewCommunity}
                    className="col-span-1 md:col-span-4 bg-sage-900/20 border border-sage-500/20 rounded-3xl p-6 flex flex-col justify-between hover:bg-sage-900/30 transition-colors cursor-pointer min-h-[180px]"
                >
                    <div className="flex items-center gap-3 text-sage-400 mb-2">
                        <Share2 size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Sharing</span>
                    </div>
                    <div>
                        <p className="text-xl text-crema-100 font-serif mb-2">
                            Share Manna
                        </p>
                        <p className="text-sm text-sage-200/60">
                            Bless a friend today
                        </p>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="w-8 h-8 rounded-full bg-sage-500/20 flex items-center justify-center text-sage-300">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </motion.div>

                {/* 5. Date / Make it Count (Span 4) */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-1 md:col-span-4 bg-slate-800 border border-white/5 rounded-3xl p-6 flex items-center justify-center text-center min-h-[180px]"
                >
                    <div>
                        <span className="block text-3xl font-editorial text-crema-50 mb-2">
                            {today.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <div className="h-px w-12 bg-gold-500/30 mx-auto mb-2" />
                        <span className="text-xs text-gold-500 uppercase tracking-[0.3em]">
                            Make it Count
                        </span>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
