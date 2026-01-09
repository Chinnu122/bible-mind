import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Download, FileText, FileSpreadsheet, ArrowLeft, Book, Globe, RefreshCw } from 'lucide-react';
import { fetchInterlinear, InterlinearResponse, getCacheStats } from '../services/geminiService';
import { exportInterlinearCSV, exportInterlinearPDF, downloadJSON } from '../utils/exportUtils';

interface InterlinearViewProps {
    onBack?: () => void;
}

const OT_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

export default function InterlinearView({ onBack }: InterlinearViewProps) {
    const [reference, setReference] = useState('');
    const [result, setResult] = useState<InterlinearResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOldTestament = (ref: string): boolean => {
        return OT_BOOKS.some(book => ref.toLowerCase().includes(book.toLowerCase()));
    };

    const handleSearch = async (e: React.FormEvent, forceRefresh: boolean = false) => {
        e.preventDefault();
        if (!reference.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const isOT = isOldTestament(reference);
            const data = await fetchInterlinear(reference, isOT, forceRefresh);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch translation');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!reference.trim() || loading) return;

        setLoading(true);
        setError(null);

        try {
            const isOT = isOldTestament(reference);
            const data = await fetchInterlinear(reference, isOT, true); // Force refresh
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to regenerate');
        } finally {
            setLoading(false);
        }
    };

    const cacheStats = getCacheStats();

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
                    <h2 className="text-2xl md:text-3xl font-serif text-gold-200 mb-1">Original Languages Interlinear</h2>
                    <p className="text-slate-400 text-sm">Word-for-word: Hebrew/Greek → Telugu & English</p>
                </div>
                <div className="text-xs text-slate-500">
                    Cached: {cacheStats.interlinear} verses
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Enter reference (e.g., Genesis 1:1, John 3:16)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !reference.trim()}
                    className="bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition-all"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Analyze
                </button>
            </form>

            {/* Quick Examples */}
            <div className="flex flex-wrap justify-center gap-2">
                <span className="text-slate-500 text-sm">Try:</span>
                {['Genesis 1:1', 'John 3:16', 'Psalm 23:1', 'Romans 8:28'].map(ref => (
                    <button
                        key={ref}
                        onClick={() => setReference(ref)}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm text-slate-300 transition"
                    >
                        {ref}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center text-red-200">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16 text-gold-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="text-sm uppercase tracking-widest opacity-80">Consulting Divine Wisdom...</p>
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Translation Summary */}
                        <div className="bg-gradient-to-r from-gold-900/30 to-amber-900/20 rounded-2xl p-6 border border-gold-500/20">
                            <h3 className="text-2xl font-serif text-gold-300 mb-4">{result.reference}</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wider font-bold">English</span>
                                    </div>
                                    <p className="text-lg text-blue-100 font-serif">{result.translation_english}</p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-bold">తెలుగు (Telugu)</span>
                                    </div>
                                    <p className="text-lg text-emerald-100" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                        {result.translation_telugu}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Export & Regenerate Buttons */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={handleRegenerate}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 rounded-lg text-amber-300 transition disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
                            </button>
                            <button
                                onClick={() => exportInterlinearCSV(result)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 transition"
                            >
                                <FileSpreadsheet className="w-4 h-4" /> CSV
                            </button>
                            <button
                                onClick={() => exportInterlinearPDF(result)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 transition"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </button>
                            <button
                                onClick={() => downloadJSON(result, `interlinear_${result.reference.replace(/[:\s]/g, '_')}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 transition"
                            >
                                <Download className="w-4 h-4" /> JSON
                            </button>
                        </div>

                        {/* Word Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {result.words.map((word, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-gold-500/50 transition group"
                                >
                                    {/* Original Word */}
                                    <div className="text-center mb-3">
                                        <span
                                            className="text-2xl font-bold text-gold-100 block mb-1"
                                            style={{ direction: isOldTestament(reference) ? 'rtl' : 'ltr' }}
                                        >
                                            {word.original}
                                        </span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wide">
                                            {word.transliteration}
                                        </span>
                                    </div>

                                    {/* Meanings */}
                                    <div className="space-y-2 text-center border-t border-slate-700 pt-3">
                                        <p className="font-medium text-indigo-300 text-sm">{word.english}</p>
                                        <p className="text-emerald-300 text-sm" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                            {word.telugu}
                                        </p>
                                        <p className="text-xs text-slate-500 italic mt-2 opacity-0 group-hover:opacity-100 transition">
                                            {word.grammar}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
