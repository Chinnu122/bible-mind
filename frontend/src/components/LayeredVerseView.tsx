import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, Languages, ChevronRight } from 'lucide-react';
import { bibleAPI, BibleVerse, StrongsDefinition } from '../api/bibleApi';
import LexiconPanel from './LexiconPanel';

interface LayeredVerseViewProps {
    verse: BibleVerse;
    onClose: () => void;
}

type LayerType = 'text' | 'lexicon' | 'context';

const LayeredVerseView: React.FC<LayeredVerseViewProps> = ({ verse, onClose }) => {
    const [activeLayer, setActiveLayer] = useState<LayerType>('text');
    const [lexiconWord, setLexiconWord] = useState<StrongsDefinition | null>(null);
    const [lexiconLoading, setLexiconLoading] = useState(false);

    // Search for Hebrew word in Strong's database
    const handleWordClick = async (word: string) => {
        setLexiconLoading(true);
        setActiveLayer('lexicon');

        try {
            // Clean the word (remove punctuation, vowel points for better matching)
            const cleanWord = word.replace(/[^\u0590-\u05FF]/g, ''); // Keep only Hebrew characters

            // Search for the word in Strong's database
            const results = await bibleAPI.searchStrongs(cleanWord);

            if (results && results.length > 0) {
                // Find the best match - exact word match preferred
                const exactMatch = results.find(r => r.word === cleanWord || r.word.includes(cleanWord));
                const bestMatch = exactMatch || results[0];
                setLexiconWord(bestMatch);
            } else {
                // If no results, show a placeholder with the word
                setLexiconWord({
                    strongsNumber: "Unknown",
                    word: cleanWord,
                    gloss: "Definition not found in database. Try searching the glossary.",
                    language: "Hebrew",
                    partOfSpeech: "Unknown",
                    gender: "",
                    occurrences: 0,
                    firstOccurrence: "",
                    rootWord: ""
                });
            }
        } catch (error) {
            console.error('Error fetching Strong\'s definition:', error);
            setLexiconWord({
                strongsNumber: "Error",
                word: word,
                gloss: "Failed to fetch definition. Please try again.",
                language: "Hebrew",
                partOfSpeech: "",
                gender: "",
                occurrences: 0,
                firstOccurrence: "",
                rootWord: ""
            });
        } finally {
            setLexiconLoading(false);
        }
    };

    const tabs = [
        { id: 'text', label: 'Text', icon: BookOpen },
        { id: 'lexicon', label: 'Lexicon', icon: Languages },
        { id: 'context', label: 'AI Context', icon: Sparkles },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a0a] w-full max-w-5xl h-[85vh] rounded-3xl border border-gold-500/20 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Left Sidebar - Verse & Navigation */}
                <div className="w-full md:w-1/3 bg-black/20 border-r border-white/5 flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <div className="text-xs text-gold-500/70 font-bold uppercase tracking-widest mb-2">
                            {verse.bookName} {verse.chapter}:{verse.verse}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif text-crema-100 leading-tight">
                            Verse Analysis
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveLayer(tab.id as LayerType)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeLayer === tab.id
                                    ? 'bg-gold-500/20 border border-gold-500/30 text-gold-200'
                                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon size={20} />
                                    <span className="font-medium">{tab.label}</span>
                                </div>
                                {activeLayer === tab.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            Close
                        </button>
                    </div>
                </div>

                {/* Right Content Area - Layers */}
                <div className="flex-1 bg-gradient-to-br from-[#0f0f0f] to-black relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeLayer === 'text' && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col p-8 overflow-y-auto"
                            >
                                <h3 className="text-xl text-gold-400 font-serif mb-6">Translations</h3>

                                <div className="space-y-8">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">English (KJV)</div>
                                        <p className="text-xl md:text-2xl text-crema-100 font-serif leading-loose">
                                            {verse.kjvText || verse.webText}
                                        </p>
                                    </div>

                                    {verse.hebrewText && (
                                        <div>
                                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Hebrew (Original)</div>
                                            <p className="text-2xl md:text-3xl text-gold-200 font-serif font-hebrew leading-loose text-right" dir="rtl">
                                                {/* In a real app, we would map over words to make them clickable */}
                                                {verse.hebrewText.split(' ').map((word, i) => (
                                                    <span
                                                        key={i}
                                                        onClick={() => handleWordClick(word)}
                                                        className="hover:text-gold-400 hover:bg-white/5 rounded px-1 cursor-pointer transition-colors"
                                                    >
                                                        {word}{' '}
                                                    </span>
                                                ))}
                                            </p>
                                            <div className="mt-2 text-sm text-slate-500 text-right">
                                                <Sparkles size={12} className="inline mr-1" />
                                                Click any Hebrew word to view definition
                                            </div>
                                        </div>
                                    )}

                                    {verse.greekText && (
                                        <div>
                                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Greek (Original)</div>
                                            <p className="text-xl md:text-2xl text-crema-200 font-serif leading-loose">
                                                {verse.greekText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeLayer === 'lexicon' && (
                            <motion.div
                                key="lexicon"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full p-4"
                            >
                                <LexiconPanel
                                    word={lexiconWord}
                                    loading={lexiconLoading}
                                    onClose={() => setActiveLayer('text')}
                                />
                            </motion.div>
                        )}



                        {activeLayer === 'context' && (
                            <motion.div
                                key="context"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="p-6 rounded-full bg-purple-500/10 mb-6 relative">
                                    <Sparkles size={48} className="text-purple-400" />
                                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                                </div>
                                <h3 className="text-2xl text-crema-100 font-serif mb-2">AI Historical Context</h3>
                                <p className="text-slate-400 max-w-md mx-auto mb-8">
                                    Deep historical insights, timelines, and cultural context powered by AI.
                                    (Coming soon in Phase 4)
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LayeredVerseView;
