import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2, Book, X } from 'lucide-react';
import { bibleAPI, BibleVerse, CrossReference } from '../api/bibleApi';
import { useSettings } from '../contexts/SettingsContext';
import { useBible } from '../contexts/BibleContext';
import { useWordDictionary, WordMeaning } from '../hooks/useWordDictionary';

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
    const [teluguSearchResults, setTeluguSearchResults] = useState<{
        bookId: number;
        chapter: number;
        verse: number;
        teluguText: string;
        englishName: string;
        teluguName: string;
        reference: string;
        matchedWord?: string;
    }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<'english' | 'telugu' | 'hebrew' | 'hindi'>('english');

    // Word Dictionary for inline meanings
    const { lookupWord } = useWordDictionary();
    const [inlineWordPopup, setInlineWordPopup] = useState<{
        word: string;
        meaning: WordMeaning | null;
        position: { x: number; y: number };
    } | null>(null);

    // Handle word click for inline popup
    const handleInlineWordClick = useCallback((word: string, event: React.MouseEvent) => {
        event.stopPropagation();
        const meaning = lookupWord(word);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setInlineWordPopup({
            word,
            meaning,
            position: { x: rect.left, y: rect.bottom + 5 }
        });
    }, [lookupWord]);

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

    // Handle Search - Now supports Telugu transliteration (e.g., "devudu" finds దేవుడు)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setShowSearchResults(true);
        try {
            // Search both English and Telugu in parallel
            const [englishResults, teluguResults] = await Promise.all([
                bibleAPI.searchVerses(searchQuery),
                bibleAPI.searchTeluguVerses(searchQuery)
            ]);

            setSearchResults(englishResults);
            setTeluguSearchResults(teluguResults);
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
        <div className={`flex flex-col h-screen font-${fontFamily}`}>

            {/* Header */}
            <div className="flex-none px-4 py-3 z-20 space-y-3">

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto w-full relative">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search (English, Telugu, or Roman: devudu, yesu...)..."
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
            <div className="flex-1 overflow-y-auto" onClick={() => setInlineWordPopup(null)}>
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
                                        {/* Hebrew mode - show clickable words */}
                                        {selectedVersion === 'hebrew' && verse.hebrewText ? (
                                            <div
                                                className={`${getFontSizeClass()} text-crema-100 leading-relaxed font-serif`}
                                                dir="rtl"
                                            >
                                                {verse.hebrewText.split(/\s+/).map((word, idx) => (
                                                    <span
                                                        key={idx}
                                                        onClick={(e) => handleInlineWordClick(word, e)}
                                                        className="inline-block mx-1 px-1 rounded cursor-pointer hover:bg-gold-500/20 hover:text-gold-200 transition-all"
                                                        title="Click for meaning"
                                                    >
                                                        {word}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p
                                                onClick={() => handleVerseClick(verse)}
                                                className={`${getFontSizeClass()} text-crema-100 leading-relaxed font-serif cursor-pointer hover:text-gold-100 transition-colors`}
                                                dir={selectedVersion === 'hebrew' && verse.bookId <= 39 ? 'rtl' : 'ltr'}
                                            >
                                                {getPrimaryText(verse)}
                                            </p>
                                        )}

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

                {/* Inline Word Meaning Popup */}
                <AnimatePresence>
                    {inlineWordPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="fixed z-50 bg-[#151515] border border-gold-500/30 rounded-xl shadow-2xl p-4 max-w-sm"
                            style={{
                                left: Math.min(inlineWordPopup.position.x, window.innerWidth - 320),
                                top: inlineWordPopup.position.y
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setInlineWordPopup(null)}
                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>

                            {/* Hebrew Word */}
                            <div className="text-3xl font-serif text-gold-200 mb-3 text-right" dir="rtl">
                                {inlineWordPopup.word}
                            </div>

                            {inlineWordPopup.meaning ? (
                                <div className="space-y-3">
                                    {/* Telugu Meaning */}
                                    {(inlineWordPopup.meaning.teluguMeaning || inlineWordPopup.meaning.teluguWord) && (
                                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="text-[10px] uppercase text-emerald-400 mb-1">తెలుగు</div>
                                            <div className="text-lg text-emerald-200">
                                                {inlineWordPopup.meaning.teluguWord && (
                                                    <span className="font-bold mr-2">{inlineWordPopup.meaning.teluguWord}</span>
                                                )}
                                                {inlineWordPopup.meaning.teluguMeaning}
                                            </div>
                                        </div>
                                    )}

                                    {/* English Meaning */}
                                    <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                                        <div className="text-[10px] uppercase text-gold-400 mb-1">English</div>
                                        <div className="text-sm text-crema-100">
                                            {inlineWordPopup.meaning.englishMeaning || 'No meaning available'}
                                        </div>
                                    </div>

                                    {/* Strong's Number */}
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="font-mono bg-white/5 px-2 py-1 rounded">
                                            {inlineWordPopup.meaning.strongsNumber}
                                        </span>
                                        <span>{inlineWordPopup.meaning.language}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 italic">
                                    No meaning found for this word
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
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
                                ) : (searchResults.length > 0 || teluguSearchResults.length > 0) ? (
                                    <div className="space-y-4">
                                        {/* Telugu Results Section (Roman transliteration matches) */}
                                        {teluguSearchResults.length > 0 && (
                                            <>
                                                <div className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                                    <span>🇮🇳 Telugu Results</span>
                                                    <span className="text-emerald-500/50">({teluguSearchResults.length} found)</span>
                                                </div>
                                                {teluguSearchResults.map((res, idx) => (
                                                    <div key={`telugu-${idx}`} className="p-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            const book = books.find(b => b.bookId === res.bookId);
                                                            if (book) {
                                                                setSelectedBook(book);
                                                                setSelectedChapter(res.chapter);
                                                                setSelectedVersion('telugu');
                                                                setShowSearchResults(false);
                                                            }
                                                        }}
                                                    >
                                                        <div className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-2">
                                                            <span>{res.englishName} {res.chapter}:{res.verse}</span>
                                                            <span className="text-emerald-500/50">• {res.teluguName}</span>
                                                            {res.matchedWord && (
                                                                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                                                    matched: {res.matchedWord}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-300 line-clamp-2 font-telugu">{res.teluguText}</p>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {/* English Results Section */}
                                        {searchResults.length > 0 && (
                                            <>
                                                <div className="text-xs text-gold-400 uppercase tracking-widest font-bold mb-2 mt-4 flex items-center gap-2">
                                                    <span>🇺🇸 English Results</span>
                                                    <span className="text-gold-500/50">({searchResults.length} found)</span>
                                                </div>
                                                {searchResults.map((res: BibleVerse) => (
                                                    <div key={res.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                                        onClick={() => {
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
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 p-8">
                                        <p>No results found</p>
                                        <p className="text-xs mt-2 text-slate-600">
                                            💡 Tip: Try searching in Roman Telugu! (e.g., "devudu", "yesu", "prema")
                                        </p>
                                    </div>
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
    const [activeTab, setActiveTab] = useState<'original' | 'word-for-word' | 'lexicon' | 'ai-meanings'>('ai-meanings');
    const [wordDefinitions, setWordDefinitions] = useState<Record<string, any>>({});
    const [loadingWords, setLoadingWords] = useState(false);
    // For original text tab - selected word popup
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    // For viewing occurrences (placeholder for future feature)
    const [_viewingOccurrences, setViewingOccurrences] = useState<string | null>(null);

    // AI Meanings state
    const [aiMeanings, setAiMeanings] = useState<{
        word: string;
        strongsNumber: string;
        transliteration: string;
        meaning: string;
        teluguMeaning: string;
        occurrences: number;
        firstReference: string;
    }[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiCached, setAiCached] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const isOT = verse.bookId <= 39;
    const originalText = isOT ? verse.hebrewText : verse.greekText;
    const words = originalText ? originalText.split(/\s+/) : [];

    // Helper: Clean up English meaning - remove pronunciation, KJV refs, roots
    const cleanMeaning = (def: any): { telugu: string; english: string; grammar: string } => {
        let english = def.english || def.gloss || '';
        let telugu = def.telugu || '';
        let grammar = def.partOfSpeech || def.pos || '';

        // Remove pronunciation like "word (pronunciation)" at start
        english = english.replace(/^[^;]+\([^)]+\)\s*[a-z.-]*[;:]?\s*/i, '');
        // Remove "1. " "2. " numbering
        english = english.replace(/^\d+\.\s*/g, '');
        // Remove KJV references like "KJV: word, word;"
        english = english.replace(/;?\s*KJV:[^;.]+[;.]?/gi, '');
        // Remove Root references like "Root(s): H1234"
        english = english.replace(/;?\s*Root\(s\):[^;.]+[;.]?/gi, '');
        // Remove [from H1234...] references
        english = english.replace(/\[from\s+H\d+[^\]]*\]/gi, '');
        // Remove "(in the sense of...)" parentheticals
        english = english.replace(/\(in\s+the\s+sense\s+of[^)]+\)/gi, '');
        // Clean up extra semicolons and spaces
        english = english.replace(/^[;:\s]+/, '').replace(/[;:\s]+$/, '').trim();
        // Take first meaning only if multiple
        if (english.includes(';')) {
            english = english.split(';')[0].trim();
        }

        // Similarly clean Telugu - remove pronunciation
        telugu = telugu.replace(/^[^(]+\([^)]+\)\s*[a-z/-]*\s*/i, '');
        telugu = telugu.replace(/^\d+\.\s*/g, '').trim();
        if (telugu.includes(';')) {
            telugu = telugu.split(';')[0].trim();
        }

        // Clean grammar abbreviations
        if (grammar) {
            const grammarMap: Record<string, string> = {
                'n': 'Noun', 'n-f': 'Noun (f)', 'n-m': 'Noun (m)', 'n-p': 'Proper Noun',
                'v': 'Verb', 'adj': 'Adjective', 'adv': 'Adverb', 'prep': 'Preposition',
                'conj': 'Conjunction', 'pron': 'Pronoun', 'art': 'Article', 'interj': 'Interjection'
            };
            grammar = grammarMap[grammar.toLowerCase()] || grammar;
        }

        return { telugu, english, grammar };
    };

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

    // Fetch AI meanings
    useEffect(() => {
        if (activeTab === 'ai-meanings' && aiMeanings.length === 0 && !aiLoading) {
            setAiLoading(true);
            setAiError(null);
            bibleAPI.getVerseMeanings(verse.bookId, verse.chapter, verse.verse)
                .then(response => {
                    if (response.success) {
                        setAiMeanings(response.data || []);
                        setAiCached(response.cached);
                    } else {
                        setAiError('Failed to get meanings');
                    }
                })
                .catch(err => {
                    console.error('AI meanings error:', err);
                    setAiError(err.message || 'Failed to get meanings');
                })
                .finally(() => setAiLoading(false));
        }
    }, [activeTab, verse, aiMeanings.length, aiLoading]);

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
                <div className="flex border-b border-white/10 bg-[#0a0a0a] overflow-x-auto">
                    {[
                        { id: 'ai-meanings', label: '✨ AI Meanings' },
                        { id: 'original', label: 'Original Text' },
                        { id: 'word-for-word', label: 'Word-to-Word' },
                        { id: 'lexicon', label: 'Lexicon' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
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

                    {/* AI Meanings Tab */}
                    {activeTab === 'ai-meanings' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gold-200">✨ AI-Powered Word Meanings</h3>
                                    {aiCached && (
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Cached</span>
                                    )}
                                </div>
                                {aiLoading && <Loader2 className="w-5 h-5 animate-spin text-gold-500" />}
                            </div>

                            {aiError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                    {aiError}
                                </div>
                            )}

                            {!aiLoading && !aiError && aiMeanings.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No AI meanings available for this verse.</p>
                                    <p className="text-xs mt-2">Original Hebrew/Greek text may not be available.</p>
                                </div>
                            )}

                            <div className="grid gap-3">
                                {aiMeanings.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            {/* Original Word */}
                                            <div className="w-1/4" dir={verse.bookId <= 39 ? 'rtl' : 'ltr'}>
                                                <span className="text-2xl font-serif text-gold-200">{item.word}</span>
                                                <div className="mt-1 text-xs text-slate-500">{item.transliteration}</div>
                                                <div className="mt-1">
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                                                        {item.strongsNumber}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Meanings */}
                                            <div className="flex-1">
                                                {/* Telugu Meaning */}
                                                <div className="text-xl text-emerald-300 font-medium mb-1">
                                                    {item.teluguMeaning || 'అర్థం లేదు'}
                                                </div>
                                                {/* English Original Meaning */}
                                                <div className="text-base text-crema-100">
                                                    {item.meaning}
                                                </div>
                                                {/* Occurrences */}
                                                {item.occurrences > 0 && (
                                                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            📊 <span className="text-gold-300 font-bold">{item.occurrences}</span> times in Bible
                                                        </span>
                                                        {item.firstReference && (
                                                            <span className="flex items-center gap-1">
                                                                📖 First: <span className="text-emerald-300">{item.firstReference}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                    {activeTab === 'word-for-word' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gold-200">Word-for-Word Breakdown</h3>
                                {loadingWords && <Loader2 className="w-5 h-5 animate-spin text-gold-500" />}
                            </div>

                            <div className="grid gap-3">
                                {words.map((word, idx) => {
                                    const def = wordDefinitions[word];
                                    const cleaned = def ? cleanMeaning(def) : null;
                                    return (
                                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-start gap-4">
                                                {/* Original Word + Grammar Badge */}
                                                <div className="w-1/4" dir={isOT ? 'rtl' : 'ltr'}>
                                                    <span className="text-2xl font-serif text-gold-200">{word}</span>
                                                    {cleaned?.grammar && (
                                                        <div className="mt-1">
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                                                {cleaned.grammar}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Meanings */}
                                                <div className="flex-1">
                                                    {cleaned ? (
                                                        <>
                                                            {/* Telugu Meaning - Primary */}
                                                            <div className="text-xl text-emerald-300 font-medium mb-1">
                                                                {cleaned.telugu || 'అర్థం లేదు'}
                                                            </div>
                                                            {/* English Meaning */}
                                                            <div className="text-base text-slate-300">
                                                                {cleaned.english || '-'}
                                                            </div>
                                                            {/* Occurrence info - clickable */}
                                                            {def.occurrences > 0 && (
                                                                <button
                                                                    onClick={() => setViewingOccurrences(def.strongsNumber)}
                                                                    className="mt-2 text-xs text-slate-500 hover:text-gold-400 transition-colors flex items-center gap-1"
                                                                >
                                                                    <span>📊</span>
                                                                    <span className="underline">{def.occurrences} times in Bible</span>
                                                                    {def.firstOccurrence && <span className="ml-1">• 1st: {def.firstOccurrence}</span>}
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-500 italic text-sm">Loading...</span>
                                                    )}
                                                </div>
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
                            {loadingWords && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
                                </div>
                            )}
                            {words.map((word, idx) => {
                                const def = wordDefinitions[word];
                                if (!def) return null;
                                const cleaned = cleanMeaning(def);
                                return (
                                    <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10">
                                        {/* Word Header with Grammar Badge */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-serif text-gold-200" dir={isOT ? 'rtl' : 'ltr'}>{word}</span>
                                                <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-400 font-mono">
                                                    {def.strongsNumber}
                                                </span>
                                                {cleaned.grammar && (
                                                    <span className="text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-300">
                                                        {cleaned.grammar}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Meanings Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Telugu */}
                                            <div className="bg-emerald-950/30 rounded-lg p-4">
                                                <div className="text-[10px] uppercase text-emerald-500/70 mb-2 font-bold">తెలుగు అర్థం</div>
                                                <div className="text-2xl text-emerald-200 font-medium">
                                                    {cleaned.telugu || 'అర్థం అందుబాటులో లేదు'}
                                                </div>
                                            </div>
                                            {/* English */}
                                            <div className="bg-gold-950/30 rounded-lg p-4">
                                                <div className="text-[10px] uppercase text-gold-500/70 mb-2 font-bold">English Meaning</div>
                                                <div className="text-xl text-crema-100">
                                                    {cleaned.english || 'Not available'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Occurrences - Clickable */}
                                        {def.occurrences > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <button
                                                    onClick={() => setViewingOccurrences(def.strongsNumber)}
                                                    className="flex items-center gap-4 text-sm hover:opacity-80 transition-opacity group"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">📊</span>
                                                        <span className="text-slate-400 group-hover:text-gold-300">
                                                            Appears <span className="text-gold-300 font-bold underline">{def.occurrences}</span> times
                                                        </span>
                                                    </div>
                                                    {def.firstOccurrence && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500">📖</span>
                                                            <span className="text-slate-400">
                                                                First: <span className="text-emerald-300 underline">{def.firstOccurrence}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        )}
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
