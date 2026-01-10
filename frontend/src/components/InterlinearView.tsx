import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Globe, ChevronDown, Download, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface InterlinearViewProps {
    onBack?: () => void;
}

interface InterlinearWord {
    verse: number;
    originalWord: string;
    transliteration: string;
    englishMeaning: string;
    teluguMeaning: string;
    hindiMeaning?: string;
    strongsNumber: string;
    occurrenceCount: number;
    isFirstOccurrence: boolean;
    firstOccurrenceReference?: string;
}

interface ChapterData {
    book: string;
    chapter: number;
    language: 'Hebrew' | 'Greek';
    words: InterlinearWord[];
}

const BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'Mark',
    'Luke', 'John', 'Acts', 'Romans', 'Revelation'
];

export default function InterlinearView({ onBack }: InterlinearViewProps) {
    const [book, setBook] = useState('Genesis');
    const [chapter, setChapter] = useState(1);
    const [data, setData] = useState<ChapterData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cached, setCached] = useState(false);

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${API_BASE_URL}/ai-content/interlinear/${encodeURIComponent(book)}/${chapter}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to load interlinear data');
            }

            setData(result.data);
            setCached(result.cached);
        } catch (err: any) {
            setError(err.message || 'Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!data) return;

        const headers = ['Verse', 'Original', 'Transliteration', 'English', 'Telugu', 'Strongs', 'Count', 'First'];
        const rows = data.words.map(w => [
            w.verse,
            w.originalWord,
            w.transliteration,
            `"${w.englishMeaning}"`,
            `"${w.teluguMeaning}"`,
            w.strongsNumber,
            w.occurrenceCount,
            w.isFirstOccurrence ? 'Yes' : 'No'
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.book}_${data.chapter}_Interlinear.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Group words by verse
    const groupedByVerse = data?.words.reduce((acc, word) => {
        if (!acc[word.verse]) acc[word.verse] = [];
        acc[word.verse].push(word);
        return acc;
    }, {} as Record<number, InterlinearWord[]>) || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {onBack && (
                    <button onClick={onBack} className="flex items-center gap-2 text-gold-400 hover:text-gold-300">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                )}
                <div className="text-center flex-1">
                    <h2 className="text-2xl md:text-3xl font-serif text-gold-200 mb-1">Interlinear Bible Study</h2>
                    <p className="text-slate-400 text-sm">Word-by-word: Hebrew/Greek → Telugu & English</p>
                </div>
            </div>

            {/* Selection Controls */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-2xl border border-gold-500/20 p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Book Selector */}
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-gold-300 mb-2">
                            <Book className="w-4 h-4 inline mr-1" /> Book
                        </label>
                        <div className="relative">
                            <select
                                value={book}
                                onChange={(e) => setBook(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/80 border border-gold-500/30 rounded-xl text-crema-100 appearance-none cursor-pointer focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                            >
                                {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Chapter Input */}
                    <div className="w-28">
                        <label className="block text-sm font-medium text-gold-300 mb-2">Chapter</label>
                        <input
                            type="number"
                            min={1}
                            max={150}
                            value={chapter}
                            onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 bg-slate-800/80 border border-gold-500/30 rounded-xl text-crema-100 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleFetch}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-slate-900 font-bold rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Globe className="w-5 h-5" />
                                Analyze Chapter
                            </>
                        )}
                    </button>
                </div>

                {loading && (
                    <p className="mt-4 text-sm text-gold-300/70 animate-pulse">
                        ✨ Processing ancient texts... This may take a moment for longer chapters.
                    </p>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-300">{error}</p>
                    </div>
                )}
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-800/50 rounded-2xl border border-gold-500/20 overflow-hidden"
                    >
                        {/* Results Header */}
                        <div className="p-4 bg-gradient-to-r from-gold-900/30 to-transparent border-b border-gold-500/20 flex justify-between items-center flex-wrap gap-3">
                            <div>
                                <h3 className="text-xl font-serif text-gold-200">
                                    {data.book} {data.chapter}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {data.words.length} words • {data.language}
                                    {cached && <span className="ml-2 text-green-400">• Cached</span>}
                                </p>
                            </div>
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/80 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download CSV
                            </button>
                        </div>

                        {/* Words Table */}
                        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                                    <tr className="text-gold-300/80 text-xs uppercase tracking-wider border-b border-gold-500/20">
                                        <th className="p-3 font-semibold">Vs</th>
                                        <th className="p-3 font-semibold">Original</th>
                                        <th className="p-3 font-semibold">Translit</th>
                                        <th className="p-3 font-semibold">English</th>
                                        <th className="p-3 font-semibold">Telugu</th>
                                        <th className="p-3 font-semibold">Strong's</th>
                                        <th className="p-3 font-semibold">Stats</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {data.words.map((word, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gold-500/5 transition-colors text-sm"
                                        >
                                            <td className="p-3 font-medium text-slate-500">{word.verse}</td>
                                            <td className="p-3 font-bold text-xl font-serif text-crema-100 direction-rtl">
                                                {word.originalWord}
                                            </td>
                                            <td className="p-3 italic text-slate-400">{word.transliteration}</td>
                                            <td className="p-3 text-crema-200">{word.englishMeaning}</td>
                                            <td className="p-3 font-medium text-amber-300">{word.teluguMeaning}</td>
                                            <td className="p-3">
                                                <code className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gold-300">
                                                    {word.strongsNumber}
                                                </code>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="text-xs text-slate-500">×{word.occurrenceCount}</span>
                                                    {word.isFirstOccurrence && (
                                                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">
                                                            First
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!data && !loading && !error && (
                <div className="text-center py-12 text-slate-500">
                    <Book className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a book and chapter, then click "Analyze Chapter" to see word-by-word breakdown.</p>
                </div>
            )}
        </div>
    );
}
