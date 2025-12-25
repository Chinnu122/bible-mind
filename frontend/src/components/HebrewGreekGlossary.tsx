import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Book, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { bibleAPI, StrongsDefinition } from '../api/bibleApi';

interface HebrewGreekGlossaryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWord?: (def: StrongsDefinition) => void;
}

const HebrewGreekGlossary: React.FC<HebrewGreekGlossaryProps> = ({ isOpen, onClose, onSelectWord }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StrongsDefinition[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedWord, setSelectedWord] = useState<StrongsDefinition | null>(null);
    const [allWords, setAllWords] = useState<StrongsDefinition[]>([]);
    const [featuredWords, setFeaturedWords] = useState<StrongsDefinition[]>([]);

    // Load all Strong's definitions on mount
    useEffect(() => {
        if (isOpen && allWords.length === 0) {
            loadAllWords();
        }
    }, [isOpen]);

    const loadAllWords = async () => {
        try {
            const all = await bibleAPI.getAllStrongs();
            setAllWords(all);
            // Pick random featured words
            const shuffled = [...all].sort(() => 0.5 - Math.random());
            setFeaturedWords(shuffled.slice(0, 6));
        } catch (err) {
            console.error('Failed to load Strong\'s:', err);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            // Search locally in allWords
            const lowerQuery = query.toLowerCase();
            const filtered = allWords.filter(word =>
                word.word.toLowerCase().includes(lowerQuery) ||
                word.gloss.toLowerCase().includes(lowerQuery) ||
                word.strongsNumber.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered.slice(0, 50));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query.length >= 2) {
            const debounce = setTimeout(handleSearch, 300);
            return () => clearTimeout(debounce);
        } else {
            setResults([]);
        }
    }, [query, allWords]);

    const handleWordClick = (word: StrongsDefinition) => {
        setSelectedWord(word);
        onSelectWord?.(word);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0a0a0a] w-full max-w-4xl h-[85vh] rounded-3xl border border-gold-500/20 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Left: Search Panel */}
                <div className="w-full md:w-1/2 border-r border-white/5 flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-gold-500/10 to-transparent">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-gold-400">
                                <Book size={20} />
                                <h2 className="text-xl font-serif">Word Glossary</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Hebrew or Greek words..."
                                className="w-full bg-white/5 border border-white/10 rounded-full px-12 py-3 text-crema-100 focus:outline-none focus:border-gold-500/50 placeholder:text-slate-600"
                            />
                            {loading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 animate-spin" />}
                        </div>
                    </div>

                    {/* Results / Featured */}
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gold-500/20 scrollbar-track-transparent">
                        {query.length < 2 ? (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 px-2">Featured Words</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {featuredWords.map((word) => (
                                        <motion.button
                                            key={word.strongsNumber}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleWordClick(word)}
                                            className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-gold-500/30 transition-all"
                                        >
                                            <div className="text-2xl font-serif text-gold-200 mb-1">{word.word}</div>
                                            <div className="text-xs text-slate-500 font-mono">{word.strongsNumber}</div>
                                            <div className="text-sm text-slate-400 mt-2 line-clamp-2">{word.gloss}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map((word) => (
                                    <motion.button
                                        key={word.strongsNumber}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => handleWordClick(word)}
                                        className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${selectedWord?.strongsNumber === word.strongsNumber
                                            ? 'bg-gold-500/20 border border-gold-500/30'
                                            : 'bg-white/5 border border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-lg font-serif text-crema-100 mr-2">{word.word}</span>
                                            <span className="text-xs text-slate-500 font-mono">{word.strongsNumber}</span>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{word.gloss}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-500" />
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-slate-500">
                                No results found
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Detail Panel */}
                <div className="flex-1 bg-gradient-to-br from-[#0f0f0f] to-black overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {selectedWord ? (
                            <motion.div
                                key={selectedWord.strongsNumber}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Word Header */}
                                <div className="text-center pb-6 border-b border-white/5">
                                    <h2 className="text-5xl font-serif text-gold-200 mb-3">{selectedWord.word}</h2>
                                    <div className="flex items-center justify-center gap-3 text-sm">
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 font-mono">{selectedWord.strongsNumber}</span>
                                        <span className="text-slate-400 capitalize">{selectedWord.language}</span>
                                    </div>
                                </div>

                                {/* Definition */}
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-3">Definition</h3>
                                    <p className="text-2xl text-crema-100 font-serif leading-relaxed">{selectedWord.gloss}</p>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-xs text-slate-500 mb-1">Part of Speech</div>
                                        <div className="text-lg font-medium text-crema-100">{selectedWord.partOfSpeech || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-xs text-slate-500 mb-1">Occurrences</div>
                                        <div className="text-lg font-medium text-gold-400">{selectedWord.occurrences || 'N/A'}</div>
                                    </div>
                                </div>

                                {selectedWord.rootWord && (
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">Root / Etymology</h3>
                                        <p className="text-slate-300">{selectedWord.rootWord}</p>
                                    </div>
                                )}

                                {selectedWord.firstOccurrence && (
                                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                                            <Sparkles size={16} />
                                            <span className="text-xs uppercase tracking-widest">First Occurrence</span>
                                        </div>
                                        <p className="text-crema-100">{selectedWord.firstOccurrence}</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center text-slate-500"
                            >
                                <Book size={48} className="opacity-20 mb-4" />
                                <p>Select a word to view details</p>
                                <p className="text-sm mt-2">Search or explore featured words</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HebrewGreekGlossary;
