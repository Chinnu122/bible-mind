import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2, Book, X } from 'lucide-react';
import { bibleAPI, BibleVerse, CrossReference } from '../api/bibleApi';
import { useSettings } from '../contexts/SettingsContext';
import { useBible } from '../contexts/BibleContext';

export default function SimpleBibleReader() {
    const {
        currentBook: selectedBook,
        currentChapter: selectedChapter,
        books,
        setBook: setSelectedBook,
        setChapter: setSelectedChapter,
        // goToVerse, // Unused
        // loading: contextLoading, // Unused
    } = useBible();

    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBookSelector, setShowBookSelector] = useState(false);
    const [showChapterSelector, setShowChapterSelector] = useState(false);
    const [testamentFilter, setTestamentFilter] = useState<'old' | 'new'>('old');
    const { fontSize, fontFamily } = useSettings();

    const [selectedVerseForStudy, setSelectedVerseForStudy] = useState<BibleVerse | null>(null);
    const [selectedVerseForRefs, setSelectedVerseForRefs] = useState<BibleVerse | null>(null);
    const [teluguVerses, setTeluguVerses] = useState<any[]>([]);

    const [crossRefs, setCrossRefs] = useState<Array<CrossReference & { text?: string }>>([]);
    const [loadingCrossRefs, setLoadingCrossRefs] = useState(false);

    // Search & Version State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<'english' | 'telugu' | 'hebrew' | 'hindi'>('english');

    // Load verses when book/chapter changes
    useEffect(() => {
        if (selectedBook && selectedChapter) {
            setLoading(true);

            // Load English/Original Verses
            bibleAPI.getChapter(selectedBook.bookId, selectedChapter)
                .then(data => {
                    if ('verses' in data) {
                        setVerses((data as any).verses);
                    } else if (Array.isArray(data)) {
                        setVerses(data);
                    }
                })
                .catch(err => console.error('Failed to load verses:', err))
                .finally(() => setLoading(false));

            // Load Telugu Verses (always load for study/switching)
            bibleAPI.getTeluguChapter(selectedBook.bookId, selectedChapter)
                .then(data => {
                    if (data && data.verses) setTeluguVerses(data.verses);
                })
                .catch(err => console.error('Failed to load Telugu verses:', err));
        }
    }, [selectedBook, selectedChapter]);

    // Handle Search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setShowSearchResults(true);
        try {
            const results = await bibleAPI.searchVerses(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Auto-detect testament filter based on selected book
    useEffect(() => {
        if (selectedBook) {
            setTestamentFilter(selectedBook.bookId <= 39 ? 'old' : 'new');
        }
    }, [selectedBook]);

    const handleVerseClick = (verse: BibleVerse) => {
        setSelectedVerseForStudy(verse);
    };

    // Helper to get Telugu text for a verse
    const getTeluguText = (verseNum: number) => {
        const tVerse = teluguVerses.find(v => v.verse === verseNum);
        return tVerse ? tVerse.teluguText : 'Telugu translation loading...';
    };

    const getPrimaryText = (verse: BibleVerse) => {
        switch (selectedVersion) {
            case 'english': return verse.kjvText || verse.webText;
            case 'telugu': return getTeluguText(verse.verse);
            case 'hebrew': return verse.bookId <= 39 ? verse.hebrewText : verse.greekText; // Fallback to Greek for NT
            case 'hindi': return "Hindi translation coming soon..."; // Placeholder
            default: return verse.kjvText;
        }
    };

    // Load cross references when requested
    useEffect(() => {
        const loadCrossReferences = async () => {
            if (!selectedVerseForRefs) return;

            setLoadingCrossRefs(true);
            setCrossRefs([]);
            try {
                const resp = await bibleAPI.getCrossReferences(
                    selectedVerseForRefs.bookId,
                    selectedVerseForRefs.chapter,
                    selectedVerseForRefs.verse,
                    8
                );

                const refs = resp.crossReferences || [];

                const refsWithText = await Promise.all(refs.map(async (r) => {
                    try {
                        if (selectedVersion === 'telugu') {
                            const tv = await bibleAPI.getTeluguVerse(r.bookId, r.chapter, r.verse);
                            return { ...r, text: tv.teluguText };
                        }

                        const v = await bibleAPI.getVerse(r.bookId, r.chapter, r.verse);
                        const text = selectedVersion === 'hebrew'
                            ? (v.bookId <= 39 ? v.hebrewText : v.greekText)
                            : (v.kjvText || v.webText);
                        return { ...r, text };
                    } catch {
                        return { ...r };
                    }
                }));

                setCrossRefs(refsWithText);
            } catch (e) {
                console.error('Failed to load cross references:', e);
            } finally {
                setLoadingCrossRefs(false);
            }
        };

        loadCrossReferences();
    }, [selectedVerseForRefs, selectedVersion]);

    const goToPrevChapter = () => {
        if (!selectedBook) return;
        if (selectedChapter > 1) {
            setSelectedChapter(selectedChapter - 1);
        } else {
            // Go to previous book's last chapter
            const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
            if (currentIndex > 0) {
                const prevBook = books[currentIndex - 1];
                setSelectedBook(prevBook);
                setSelectedChapter(prevBook.chapterCount);
            }
        }
    };

    const goToNextChapter = () => {
        if (!selectedBook) return;
        if (selectedChapter < selectedBook.chapterCount) {
            setSelectedChapter(selectedChapter + 1);
        } else {
            // Go to next book's first chapter
            const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
            if (currentIndex < books.length - 1) {
                const nextBook = books[currentIndex + 1];
                setSelectedBook(nextBook);
                setSelectedChapter(1);
            }
        }
    };

    const getFontSizeClass = () => {
        switch (fontSize) {
            case 'small': return 'text-base';
            case 'large': return 'text-2xl';
            case 'extra-large': return 'text-3xl';
            default: return 'text-xl';
        }
    };

    return (
        <div className={`flex flex-col h-screen bg-[#0a0a0a] font-${fontFamily}`}>

            {/* Header */}
            <div className="flex-none px-4 py-3 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur z-20 space-y-3">

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto w-full relative">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search verses (English or Telugu)..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-sans"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-500">
                            {/* search icon placeholder, using text for now or Lucide if available */}
                            🔍
                        </button>
                    </form>
                </div>

                <div className="flex items-center justify-between max-w-4xl mx-auto">

                    {/* Controls Row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {/* Book Selector */}
                        <button
                            onClick={() => setShowBookSelector(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gold-200 text-sm font-medium transition-all whitespace-nowrap"
                        >
                            <Book className="w-3 h-3 text-gold-500" />
                            <span>{selectedBook?.bookName || 'Book'}</span>
                            <ChevronDown className="w-3 h-3 text-gold-500/50" />
                        </button>

                        {/* Chapter Selector */}
                        <button
                            onClick={() => setShowChapterSelector(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-all whitespace-nowrap"
                        >
                            <span>Ch {selectedChapter}</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                        </button>

                        {/* Version Selector */}
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <select
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value as any)}
                            className="bg-white/5 hover:bg-white/10 text-white text-xs py-1.5 px-2 rounded-lg border-none focus:ring-1 focus:ring-gold-500/50 cursor-pointer appearance-none"
                        >
                            <option value="english">🇺🇸 English (KJV)</option>
                            <option value="telugu">🇮🇳 Telugu</option>
                            <option value="hebrew">🇮🇱 Original (Heb/Gk)</option>
                            <option value="hindi">🇮🇳 Hindi</option>
                        </select>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1 pl-2">
                        <button
                            onClick={goToPrevChapter}
                            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goToNextChapter}
                            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Dynamic Bible Text */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {verses.map((verse) => (
                                <div
                                    key={verse.id}
                                    className="group relative hover:bg-white/5 p-4 rounded-xl -mx-4 transition-colors"
                                >
                                    <div className="absolute left-0 top-5 text-xs text-gold-500/60 font-bold w-6 text-right">
                                        {verse.verse}
                                    </div>

                                    <div className="pl-6">
                                        <p
                                            onClick={() => handleVerseClick(verse)}
                                            className={`${getFontSizeClass()} text-crema-100 leading-relaxed font-serif cursor-pointer hover:text-gold-100 transition-colors`}
                                            dir={selectedVersion === 'hebrew' && verse.bookId <= 39 ? 'rtl' : 'ltr'}
                                        >
                                            {getPrimaryText(verse)}
                                        </p>

                                        {/* Interaction Bar */}
                                        <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedVerseForRefs(verse)}
                                                className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-gold-400 flex items-center gap-1"
                                                title="View Cross references"
                                            >
                                                🔗 Refs
                                            </button>
                                            <button
                                                onClick={() => handleVerseClick(verse)}
                                                className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-emerald-400 flex items-center gap-1"
                                            >
                                                📖 Study
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Results Modal */}
            <AnimatePresence>
                {showSearchResults && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                            onClick={() => setShowSearchResults(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="fixed inset-x-4 top-20 bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[#151515] rounded-2xl border border-gold-500/20 shadow-2xl z-50 flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
                                <h2 className="text-lg font-bold text-gold-300">Search Results: "{searchQuery}"</h2>
                                <button onClick={() => setShowSearchResults(false)} className="p-1 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {isSearching ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold-500" /></div>
                                ) : searchResults.length > 0 ? (
                                    <div className="space-y-4">
                                        {searchResults.map((res: BibleVerse) => (
                                            <div key={res.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    // Navigate to this verse
                                                    const book = books.find(b => b.bookId === res.bookId);
                                                    if (book) {
                                                        setSelectedBook(book);
                                                        setSelectedChapter(res.chapter);
                                                        setShowSearchResults(false);
                                                    }
                                                }}
                                            >
                                                <div className="text-xs text-gold-500 font-bold mb-1">
                                                    {res.bookName} {res.chapter}:{res.verse}
                                                </div>
                                                <p className="text-sm text-slate-300 line-clamp-2">{res.kjvText}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 p-8">No results found</div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Book Selector Modal */}
            <AnimatePresence>
                {showBookSelector && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setShowBookSelector(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-[#0f0f0f] rounded-2xl border border-gold-500/20 shadow-2xl z-50 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gold-300">Select Book</h2>
                                <button onClick={() => setShowBookSelector(false)} className="p-1 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Testament Tabs */}
                            <div className="p-4 flex gap-2">
                                <button
                                    onClick={() => setTestamentFilter('old')}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${testamentFilter === 'old'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    📜 Old Testament
                                </button>
                                <button
                                    onClick={() => setTestamentFilter('new')}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${testamentFilter === 'new'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    ✝️ New Testament
                                </button>
                            </div>

                            {/* Book Grid */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {books
                                        .filter(book => testamentFilter === 'old' ? book.bookId <= 39 : book.bookId >= 40)
                                        .map(book => (
                                            <button
                                                key={book.bookId}
                                                onClick={() => {
                                                    setSelectedBook(book);
                                                    setShowBookSelector(false);
                                                    setShowChapterSelector(true);
                                                }}
                                                className={`px-3 py-2 text-sm rounded-lg text-left transition-all ${selectedBook?.bookId === book.bookId
                                                    ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                                    }`}
                                            >
                                                {book.shortName}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Chapter Selector Modal */}
            <AnimatePresence>
                {showChapterSelector && selectedBook && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setShowChapterSelector(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed inset-x-4 top-1/4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-[#0f0f0f] rounded-2xl border border-gold-500/20 shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gold-300">{selectedBook.bookName} - Select Chapter</h2>
                                <button onClick={() => setShowChapterSelector(false)} className="p-1 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Chapter Grid */}
                            <div className="p-4 max-h-[50vh] overflow-y-auto">
                                <div className="grid grid-cols-6 gap-2">
                                    {Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map(ch => (
                                        <button
                                            key={ch}
                                            onClick={() => {
                                                setSelectedChapter(ch);
                                                setShowChapterSelector(false);
                                            }}
                                            className={`p-3 text-sm font-medium rounded-lg transition-all ${selectedChapter === ch
                                                ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                                }`}
                                        >
                                            {ch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Verse Study Modal */}
            <AnimatePresence>
                {selectedVerseForStudy && (
                    <VerseStudyModal
                        verse={selectedVerseForStudy}
                        teluguText={getTeluguText(selectedVerseForStudy.verse)}
                        onClose={() => setSelectedVerseForStudy(null)}
                    />
                )}
            </AnimatePresence>

            {/* Cross References Modal */}
            <AnimatePresence>
                {selectedVerseForRefs && (
                    <CrossReferencesModal
                        verse={selectedVerseForRefs}
                        crossRefs={crossRefs}
                        loading={loadingCrossRefs}
                        version={selectedVersion}
                        onClose={() => setSelectedVerseForRefs(null)}
                        onNavigate={(ref) => {
                            const book = books.find(b => b.bookId === ref.bookId);
                            if (book) {
                                setSelectedBook(book);
                                setSelectedChapter(ref.chapter);
                            }
                            setSelectedVerseForRefs(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

interface CrossReferencesModalProps {
    verse: BibleVerse;
    crossRefs: Array<CrossReference & { text?: string }>;
    loading: boolean;
    version: 'english' | 'telugu' | 'hebrew' | 'hindi';
    onClose: () => void;
    onNavigate: (ref: CrossReference) => void;
}

function CrossReferencesModal({ verse, crossRefs, loading, version, onClose, onNavigate }: CrossReferencesModalProps) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                className="fixed inset-x-4 top-24 bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] bg-[#111111] rounded-2xl border border-gold-500/20 shadow-2xl z-[60] flex flex-col overflow-hidden"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
                    <div>
                        <h2 className="text-lg font-bold text-gold-300">Cross References</h2>
                        <div className="text-xs text-slate-500 mt-1">
                            {verse.bookName} {verse.chapter}:{verse.verse} • {version === 'hebrew' ? 'Original' : version}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-7 h-7 animate-spin text-gold-500" />
                        </div>
                    ) : crossRefs.length > 0 ? (
                        <div className="space-y-3">
                            {crossRefs.map((r) => (
                                <button
                                    key={`${r.bookId}-${r.chapter}-${r.verse}`}
                                    onClick={() => onNavigate(r)}
                                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-bold text-gold-300">{r.reference}</div>
                                        <div className="text-[10px] text-slate-500">Open</div>
                                    </div>
                                    {r.text ? (
                                        <div
                                            className="mt-2 text-sm text-slate-200 leading-relaxed"
                                            dir={version === 'hebrew' && r.bookId <= 39 ? 'rtl' : 'ltr'}
                                        >
                                            {r.text}
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm text-slate-500 italic">Text unavailable</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-16">No cross references found</div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                    <div className="text-[11px] text-slate-500">
                        Cross references are computed automatically from the verse text.
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// --- Verse Study Modal Component ---

interface VerseStudyModalProps {
    verse: BibleVerse;
    teluguText: string;
    onClose: () => void;
}

function VerseStudyModal({ verse, teluguText, onClose }: VerseStudyModalProps) {
    const [activeTab, setActiveTab] = useState<'original' | 'word-for-word' | 'lexicon'>('original');
    const [wordDefinitions, setWordDefinitions] = useState<Record<string, any>>({});
    const [loadingWords, setLoadingWords] = useState(false);
    // For original text tab - selected word popup
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const isOT = verse.bookId <= 39;
    const originalText = isOT ? verse.hebrewText : verse.greekText;
    const words = originalText ? originalText.split(/\s+/) : [];

    // Fetch definitions for words (for Word-for-Word and Lexicon tabs)
    useEffect(() => {
        if ((activeTab === 'word-for-word' || activeTab === 'lexicon') && words.length > 0 && !loadingWords) {
            setLoadingWords(true);
            const fetchDefinitions = async () => {
                const defs: Record<string, any> = {};
                // Process in parallel but limited to avoid browser lag
                await Promise.all(words.map(async (word) => {
                    // Strip punctuation for lookup if needed
                    const cleanWord = word.replace(/[^\w\u0590-\u05FF\u0370-\u03FF]/g, '');
                    try {
                        const results = await bibleAPI.searchStrongs(cleanWord);
                        if (results && results.length > 0) {
                            defs[word] = results[0]; // Take best match
                        }
                    } catch (e) {
                        console.warn('Lookup failed for', word);
                    }
                }));
                setWordDefinitions(defs);
                setLoadingWords(false);
            };
            fetchDefinitions();
        }
    }, [activeTab, verse]);

    // Lookup single word on click (Original Tab)
    const handleWordClick = async (word: string) => {
        setSelectedWord(word);
        if (!wordDefinitions[word]) {
            const cleanWord = word.replace(/[^\w\u0590-\u05FF\u0370-\u03FF]/g, '');
            const results = await bibleAPI.searchStrongs(cleanWord);
            if (results && results.length > 0) {
                setWordDefinitions(prev => ({ ...prev, [word]: results[0] }));
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl h-[85vh] bg-[#0f0f0f] rounded-2xl border border-gold-500/20 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
                    <div>
                        <h2 className="text-xl font-bold text-gold-200 font-serif">
                            {verse.bookName} {verse.chapter}:{verse.verse}
                        </h2>
                        <div className="flex gap-2 text-xs text-slate-400 mt-1">
                            <span>{isOT ? 'Old Testament (Hebrew)' : 'New Testament (Greek)'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-[#0a0a0a]">
                    {[
                        { id: 'original', label: 'Original Text' },
                        { id: 'word-for-word', label: 'Word-to-Word (Telugu)' },
                        { id: 'lexicon', label: 'Lexicon' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                ? 'text-gold-400'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeStudyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#0f0f0f]">

                    {/* 1. Original Text Tab */}
                    {activeTab === 'original' && (
                        <div className="space-y-8">
                            {/* English */}
                            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">English (KJV)</h3>
                                <p className="text-xl text-crema-100 font-serif leading-relaxed">
                                    {verse.kjvText}
                                </p>
                            </div>

                            {/* Original Language */}
                            <div className={`p-6 rounded-xl bg-black/40 border border-gold-500/10`}>
                                <h3 className="text-xs uppercase tracking-widest text-gold-500/50 mb-4">
                                    {isOT ? 'Hebrew (Masoretic)' : 'Greek (Textus Receptus)'}
                                </h3>
                                <div className={`flex flex-wrap gap-3 ${isOT ? 'flex-row-reverse text-right' : 'text-left'}`} dir={isOT ? 'rtl' : 'ltr'}>
                                    {words.map((word, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleWordClick(word)}
                                            className={`text-3xl font-serif p-2 rounded transition-all ${selectedWord === word
                                                ? 'bg-gold-500/20 text-gold-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs text-slate-500 italic text-center">
                                    Click any word to see its meaning
                                </p>
                            </div>

                            {/* Telugu Full Verse */}
                            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                                <h3 className="text-xs uppercase tracking-widest text-emerald-500/50 mb-3">Telugu Translation</h3>
                                <p className="text-xl text-emerald-100 font-serif leading-relaxed">
                                    {teluguText}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 2. Word-for-Word Tab */}
                    {activeTab === 'word-for-word' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gold-200">Word-for-Word Split</h3>
                                {loadingWords && <Loader2 className="w-5 h-5 animate-spin text-gold-500" />}
                            </div>

                            <div className="grid gap-3">
                                {words.map((word, idx) => {
                                    const def = wordDefinitions[word];
                                    return (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            {/* Original Word */}
                                            <div className="w-1/3 text-right" dir={isOT ? 'rtl' : 'ltr'}>
                                                <span className="text-2xl font-serif text-gold-200">{word}</span>
                                            </div>

                                            {/* Equality Sign */}
                                            <div className="text-slate-500">=</div>

                                            {/* Telugu / English Meaning */}
                                            <div className="flex-1">
                                                {def ? (
                                                    <div>
                                                        <div className="text-lg text-emerald-300 font-medium mb-1">
                                                            {def.telugu || 'Searching...'}
                                                        </div>
                                                        <div className="text-sm text-slate-400">
                                                            {def.english || def.gloss}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 italic text-sm">Loading meaning...</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 3. Lexicon Tab */}
                    {activeTab === 'lexicon' && (
                        <div className="space-y-4">
                            {words.map((word, idx) => {
                                const def = wordDefinitions[word];
                                if (!def) return null; // Only show loaded definitions
                                return (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 mb-2">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl font-serif text-gold-200">{word}</span>
                                            <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 font-mono">
                                                {def.strongsNumber}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <div className="text-[10px] uppercase text-slate-500 mb-1">English</div>
                                                <div className="text-crema-100">{def.english}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-emerald-500/70 mb-1">Telugu</div>
                                                <div className="text-emerald-300 text-lg">{def.telugu}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                {/* Selected Word Popover (for Original Text Tab) */}
                <AnimatePresence>
                    {activeTab === 'original' && selectedWord && wordDefinitions[selectedWord] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-0 left-0 right-0 bg-[#151515] border-t border-gold-500/20 p-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl font-serif text-gold-300">{selectedWord}</span>
                                        <span className="text-sm px-2 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
                                            {wordDefinitions[selectedWord].strongsNumber}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-emerald-500 mb-1">Telugu Match</h4>
                                            <p className="text-xl text-emerald-200">{wordDefinitions[selectedWord].telugu}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-gold-500 mb-1">English Definition</h4>
                                            <p className="text-crema-100">{wordDefinitions[selectedWord].english}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedWord(null)} className="p-1 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
