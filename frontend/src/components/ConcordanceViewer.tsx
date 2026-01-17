import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, BarChart3, GitBranch, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface WordOccurrence {
    book: string;
    bookNumber: number;
    chapter: number;
    verse: number;
    text: string;
    reference: string;
}

interface WordStats {
    strongNumber: string;
    totalOccurrences: number;
    bookDistribution: { [book: string]: number };
    firstOccurrence: WordOccurrence | null;
}

interface RootChainData {
    strongsNumber: string;
    word: string;
    gloss: string;
    root?: {
        strongsNumber: string;
        word: string;
    };
    derivedWords: Array<{
        strongNumber: string;
        word: string;
        gloss: string;
    }>;
}

interface ConcordanceViewerProps {
    strongsNumber?: string;
    onVerseClick?: (book: string, chapter: number, verse: number) => void;
    onStrongsClick?: (strongNumber: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ConcordanceViewer: React.FC<ConcordanceViewerProps> = ({
    strongsNumber: initialNumber,
    onVerseClick,
    onStrongsClick
}) => {
    const [searchQuery, setSearchQuery] = useState(initialNumber || '');
    const [strongsNumber, setStrongsNumber] = useState(initialNumber || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [occurrences, setOccurrences] = useState<WordOccurrence[]>([]);
    const [stats, setStats] = useState<WordStats | null>(null);
    const [rootChain, setRootChain] = useState<RootChainData | null>(null);

    const [wordInfo, setWordInfo] = useState<{ word: string; gloss: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'occurrences' | 'stats' | 'roots'>('occurrences');
    const [showAllBooks, setShowAllBooks] = useState(false);

    useEffect(() => {
        if (initialNumber) {
            setSearchQuery(initialNumber);
            setStrongsNumber(initialNumber);
            fetchConcordanceData(initialNumber);
        }
    }, [initialNumber]);

    const fetchConcordanceData = async (num: string) => {
        if (!num) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch all data in parallel
            const [occRes, statsRes, rootsRes] = await Promise.all([
                fetch(`${API_BASE}/api/concordance/${num}?limit=100`),
                fetch(`${API_BASE}/api/concordance/${num}/stats`),
                fetch(`${API_BASE}/api/concordance/${num}/roots`)
            ]);

            const [occData, statsData, rootsData] = await Promise.all([
                occRes.json(),
                statsRes.json(),
                rootsRes.json()
            ]);

            if (occData.success) {
                setOccurrences(occData.data.occurrences || []);
                setWordInfo({
                    word: occData.data.word,
                    gloss: occData.data.gloss
                });
            }

            if (statsData.success) {
                setStats(statsData.data);
            }

            if (rootsData.success) {
                setRootChain(rootsData.data);
            }

        } catch (err) {
            setError('Failed to load concordance data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const normalized = searchQuery.toUpperCase().trim();
        if (normalized && /^[HG]\d+$/.test(normalized)) {
            setStrongsNumber(normalized);
            fetchConcordanceData(normalized);
        }
    };

    const handleVerseClick = (occ: WordOccurrence) => {
        if (onVerseClick) {
            onVerseClick(occ.book, occ.chapter, occ.verse);
        }
    };

    const handleStrongsClick = (num: string) => {
        if (onStrongsClick) {
            onStrongsClick(num);
        } else {
            setSearchQuery(num);
            setStrongsNumber(num);
            fetchConcordanceData(num);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Strong's number (e.g., H430, G3056)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 
                                       rounded-xl text-white placeholder-gray-500 focus:outline-none 
                                       focus:border-amber-500/50 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 
                                   rounded-xl font-medium text-white hover:from-amber-500 
                                   hover:to-amber-400 transition shadow-lg shadow-amber-500/25"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Word Info Header */}
            {wordInfo && strongsNumber && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent 
                               border border-amber-500/30 rounded-xl"
                >
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 
                                        font-mono font-bold rounded-lg">
                            {strongsNumber}
                        </span>
                        <span className="text-2xl font-hebrew text-white">
                            {wordInfo.word}
                        </span>
                        <span className="text-gray-400 flex-1">
                            {wordInfo.gloss?.split('\n')[0]?.substring(0, 100)}...
                        </span>
                        {stats && (
                            <span className="text-sm text-amber-400">
                                {stats.totalOccurrences} occurrences
                            </span>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-8 text-red-400">
                    <p>{error}</p>
                </div>
            )}

            {/* Tabs */}
            {!loading && strongsNumber && (
                <>
                    <div className="flex gap-2 border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab('occurrences')}
                            className={`flex items-center gap-2 px-4 py-3 transition ${activeTab === 'occurrences'
                                    ? 'text-amber-400 border-b-2 border-amber-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Occurrences
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center gap-2 px-4 py-3 transition ${activeTab === 'stats'
                                    ? 'text-amber-400 border-b-2 border-amber-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Distribution
                        </button>
                        <button
                            onClick={() => setActiveTab('roots')}
                            className={`flex items-center gap-2 px-4 py-3 transition ${activeTab === 'roots'
                                    ? 'text-amber-400 border-b-2 border-amber-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <GitBranch className="w-4 h-4" />
                            Etymology
                        </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'occurrences' && (
                            <motion.div
                                key="occurrences"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar"
                            >
                                {occurrences.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        No occurrences found
                                    </p>
                                ) : (
                                    occurrences.map((occ, idx) => (
                                        <motion.div
                                            key={`${occ.reference}-${idx}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => handleVerseClick(occ)}
                                            className="p-3 bg-gray-800/40 rounded-lg hover:bg-gray-700/50 
                                                       cursor-pointer transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-amber-400 font-medium min-w-[120px]">
                                                    {occ.reference}
                                                </span>
                                                <span className="text-gray-300 text-sm truncate">
                                                    {occ.text || '(click to view)'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'stats' && stats && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {/* Book Distribution Chart */}
                                <div className="grid gap-2">
                                    {Object.entries(stats.bookDistribution)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, showAllBooks ? undefined : 10)
                                        .map(([book, count]) => (
                                            <div key={book} className="flex items-center gap-3">
                                                <span className="text-gray-400 min-w-[120px] text-sm">
                                                    {book}
                                                </span>
                                                <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${(count / stats.totalOccurrences) * 100}%`
                                                        }}
                                                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                                    />
                                                </div>
                                                <span className="text-amber-400 min-w-[30px] text-right text-sm">
                                                    {count}
                                                </span>
                                            </div>
                                        ))}
                                </div>

                                {Object.keys(stats.bookDistribution).length > 10 && (
                                    <button
                                        onClick={() => setShowAllBooks(!showAllBooks)}
                                        className="flex items-center gap-1 text-amber-400 text-sm 
                                                   hover:text-amber-300 transition"
                                    >
                                        {showAllBooks ? (
                                            <>Show Less <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Show All Books <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'roots' && rootChain && (
                            <motion.div
                                key="roots"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {/* Root Word */}
                                {rootChain.root && (
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                        <p className="text-sm text-blue-400 mb-2">Root Word</p>
                                        <button
                                            onClick={() => handleStrongsClick(rootChain.root!.strongsNumber)}
                                            className="flex items-center gap-3 hover:bg-blue-500/10 
                                                       p-2 rounded-lg transition w-full"
                                        >
                                            <span className="font-mono text-blue-400">
                                                {rootChain.root.strongsNumber}
                                            </span>
                                            <span className="text-white font-hebrew text-xl">
                                                {rootChain.root.word}
                                            </span>
                                        </button>
                                    </div>
                                )}

                                {/* Current Word */}
                                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                    <p className="text-sm text-amber-400 mb-2">Current Word</p>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-amber-400">
                                            {rootChain.strongsNumber}
                                        </span>
                                        <span className="text-white font-hebrew text-xl">
                                            {rootChain.word}
                                        </span>
                                        <span className="text-gray-400 text-sm flex-1">
                                            {rootChain.gloss?.split('\n')[0]?.substring(0, 60)}...
                                        </span>
                                    </div>
                                </div>

                                {/* Derived Words */}
                                {rootChain.derivedWords.length > 0 && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <p className="text-sm text-green-400 mb-2">
                                            Derived Words ({rootChain.derivedWords.length})
                                        </p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {rootChain.derivedWords.map((dw) => (
                                                <button
                                                    key={dw.strongNumber}
                                                    onClick={() => handleStrongsClick(dw.strongNumber)}
                                                    className="flex items-center gap-3 hover:bg-green-500/10 
                                                               p-2 rounded-lg transition w-full text-left"
                                                >
                                                    <span className="font-mono text-green-400 min-w-[60px]">
                                                        {dw.strongNumber}
                                                    </span>
                                                    <span className="text-white font-hebrew">
                                                        {dw.word}
                                                    </span>
                                                    <span className="text-gray-400 text-sm truncate">
                                                        {dw.gloss?.split('\n')[0]?.substring(0, 40)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default ConcordanceViewer;
