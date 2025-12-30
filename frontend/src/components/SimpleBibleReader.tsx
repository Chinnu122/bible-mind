import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2, Book, X } from 'lucide-react';
import { bibleAPI, BibleVerse } from '../api/bibleApi';
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

    // Load verses when book/chapter changes
    useEffect(() => {
        if (selectedBook && selectedChapter) {
            setLoading(true);
            bibleAPI.getChapter(selectedBook.bookId, selectedChapter)
                .then(data => {
                    // Fix: Extract verses from response object if needed, or handle array
                    // detailed check of API response type needed, assuming data.verses based on lint error
                    // "Argument of type '{ book: string; chapter: number; verses: BibleVerse[]; }'..."
                    if ('verses' in data) {
                        setVerses((data as any).verses);
                    } else if (Array.isArray(data)) {
                        setVerses(data);
                    }
                })
                .catch(err => console.error('Failed to load verses:', err))
                .finally(() => setLoading(false));
        }
    }, [selectedBook, selectedChapter]);

    // Auto-detect testament filter based on selected book
    useEffect(() => {
        if (selectedBook) {
            setTestamentFilter(selectedBook.bookId <= 39 ? 'old' : 'new');
        }
    }, [selectedBook]);

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

            {/* Compact Header */}
            <div className="flex-none px-4 py-3 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur z-20">
                <div className="flex items-center justify-between max-w-4xl mx-auto">

                    {/* Book & Chapter Selector */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowBookSelector(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gold-200 font-medium transition-all"
                        >
                            <Book className="w-4 h-4 text-gold-500" />
                            <span>{selectedBook?.bookName || 'Select Book'}</span>
                            <ChevronDown className="w-4 h-4 text-gold-500/50" />
                        </button>

                        <button
                            onClick={() => setShowChapterSelector(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all"
                        >
                            <span>Chapter {selectedChapter}</span>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrevChapter}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goToNextChapter}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - English Bible Text */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {verses.map((verse) => (
                                <div key={verse.id} className="group relative">
                                    <span className="absolute -left-8 top-1 text-xs text-gold-500/60 font-bold">
                                        {verse.verse}
                                    </span>
                                    <p className={`${getFontSizeClass()} text-crema-100 leading-relaxed font-serif`}>
                                        {verse.kjvText || verse.webText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
        </div>
    );
}
