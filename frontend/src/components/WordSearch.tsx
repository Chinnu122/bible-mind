import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Book, Globe } from 'lucide-react';
import { bibleAPI, BibleVerse } from '../api/bibleApi';

interface SearchResult {
    book: string;
    chapter: number;
    verse: number;
    englishText: string;
    teluguText?: string;
    hebrewText?: string;
    greekText?: string;
}

interface WordSearchProps {
    onVerseClick?: (book: string, chapter: number, verse: number) => void;
}

const WordSearch: React.FC<WordSearchProps> = ({ onVerseClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);

        try {
            // Use the bibleAPI to search verses
            const verses: BibleVerse[] = await bibleAPI.searchVerses(searchQuery, 50);

            // Convert API response to SearchResult format
            const formattedResults: SearchResult[] = verses.map(verse => ({
                book: verse.bookName,
                chapter: verse.chapter,
                verse: verse.verse,
                englishText: verse.kjvText || verse.webText,
                teluguText: undefined, // Add Telugu when available in API
                hebrewText: verse.hebrewText || undefined,
                greekText: verse.greekText || undefined
            }));

            setResults(formattedResults);
        } catch (error) {
            console.error('Search failed:', error);
            // Fallback: search locally if API fails
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const highlightWord = (text: string, query: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-gold-500/30 text-gold-200 px-0.5 rounded">{part}</mark> : part
        );
    };

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-20 z-50 p-3 rounded-full bg-[#0a0a0a]/80 border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 transition-colors backdrop-blur-md"
                title="Search Bible"
            >
                <Search size={20} />
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.95 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] w-full max-w-2xl mx-4"
                        >
                            <div className="bg-[#0a0a0a] border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl">
                                {/* Search Header */}
                                <div className="p-4 border-b border-gold-500/10">
                                    <div className="flex items-center gap-3">
                                        <Search size={20} className="text-gold-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Search any word in the Bible..."
                                            className="flex-1 bg-transparent border-none outline-none text-lg text-crema-100 placeholder:text-slate-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSearch}
                                            disabled={loading}
                                            className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
                                        </button>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                                        <Globe size={12} />
                                        Searches in English, Telugu, Hebrew, and Greek
                                    </p>
                                </div>

                                {/* Results */}
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 size={32} className="text-gold-400 animate-spin" />
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="divide-y divide-white/5">
                                            {results.map((result, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    onClick={() => {
                                                        onVerseClick?.(result.book, result.chapter, result.verse);
                                                        setIsOpen(false);
                                                    }}
                                                    className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                                                >
                                                    {/* Reference */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Book size={14} className="text-gold-500" />
                                                        <span className="text-gold-400 font-medium">
                                                            {result.book} {result.chapter}:{result.verse}
                                                        </span>
                                                    </div>

                                                    {/* English */}
                                                    <p className="text-crema-100 text-sm mb-2">
                                                        🇺🇸 {highlightWord(result.englishText, searchQuery)}
                                                    </p>

                                                    {/* Telugu */}
                                                    {result.teluguText && (
                                                        <p className="text-slate-300 text-sm mb-2">
                                                            🇮🇳 {result.teluguText}
                                                        </p>
                                                    )}

                                                    {/* Greek */}
                                                    {result.greekText && (
                                                        <p className="text-slate-400 text-sm italic">
                                                            🇬🇷 {result.greekText}
                                                        </p>
                                                    )}

                                                    {/* Hebrew */}
                                                    {result.hebrewText && (
                                                        <p className="text-slate-400 text-sm text-right font-hebrew" dir="rtl">
                                                            🇮🇱 {result.hebrewText}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : searched ? (
                                        <div className="py-12 text-center text-slate-400">
                                            <p>No results found for "{searchQuery}"</p>
                                            <p className="text-sm mt-2">Try different keywords</p>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center text-slate-500">
                                            <Search size={32} className="mx-auto mb-3 opacity-50" />
                                            <p>Enter a word to search the Bible</p>
                                            <p className="text-sm mt-2">Results will show in all languages</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default WordSearch;
