import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Book, Loader2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { StrongsDefinition, API_BASE_URL } from '../api/bibleApi';

interface MultiLangMeaning {
    telugu?: string;
    hindi?: string;
}

interface OccurrenceLocation {
    book: string;
    chapter: number;
    verse: number;
    text: string;
}

interface LexiconPanelProps {
    word?: StrongsDefinition | null;
    loading: boolean;
    onClose: () => void;
    onJumpToOccurrence?: (book: string, chapter: number, verse: number) => void;
}

// Fetch multi-language data from API
const fetchMultiLangMeanings = async (strongsNumber: string): Promise<MultiLangMeaning> => {
    try {
        const response = await fetch(`${API_BASE_URL}/strongs/${strongsNumber}/multilang`);
        const json = await response.json();
        return json.data || {};
    } catch (error) {
        console.error('Error fetching multi-lang:', error);
        return {};
    }
};

// Fetch occurrence locations from API
const fetchOccurrenceLocations = async (strongsNumber: string): Promise<OccurrenceLocation[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/strongs/${strongsNumber}/occurrences`);
        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching occurrences:', error);
        return [];
    }
};

const LexiconPanel: React.FC<LexiconPanelProps> = ({ word, loading, onClose, onJumpToOccurrence }) => {
    const [multiLang, setMultiLang] = useState<MultiLangMeaning>({});
    const [occurrences, setOccurrences] = useState<OccurrenceLocation[]>([]);
    const [currentOccIndex, setCurrentOccIndex] = useState(0);
    const [loadingExtra, setLoadingExtra] = useState(false);

    useEffect(() => {
        if (word && word.strongsNumber && word.strongsNumber !== 'Unknown' && word.strongsNumber !== 'Error') {
            setLoadingExtra(true);
            Promise.all([
                fetchMultiLangMeanings(word.strongsNumber),
                fetchOccurrenceLocations(word.strongsNumber)
            ]).then(([multiLangData, occurrenceData]) => {
                setMultiLang(multiLangData);
                setOccurrences(occurrenceData);
                setCurrentOccIndex(0);
            }).finally(() => {
                setLoadingExtra(false);
            });
        } else {
            setMultiLang({});
            setOccurrences([]);
        }
    }, [word]);

    const nextOccurrence = () => {
        setCurrentOccIndex((prev) => (prev + 1) % occurrences.length);
    };

    const prevOccurrence = () => {
        setCurrentOccIndex((prev) => (prev - 1 + occurrences.length) % occurrences.length);
    };

    return (
        <div className="bg-[#0a0a0a] border border-gold-500/20 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gold-500/10 flex items-center justify-between bg-gold-500/5">
                <div className="flex items-center gap-2 text-gold-400">
                    <Book size={18} />
                    <span className="font-serif font-medium tracking-wide">Word Lexicon</span>
                </div>
                <div className="flex items-center gap-2">
                    {word && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${word.language === 'H' || word.language === 'A' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                            {word.language === 'H' ? 'Hebrew' : word.language === 'A' ? 'Aramaic' : word.language === 'G' ? 'Greek' : 'Unknown'}
                        </span>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold-500/20 scrollbar-track-transparent">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gold-400/50 gap-3">
                        <Loader2 size={32} className="animate-spin" />
                        <span className="text-sm">Loading definition...</span>
                    </div>
                ) : word ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Word Header */}
                        <div className="text-center pb-6 border-b border-white/5">
                            <h2 className="text-4xl font-serif text-gold-200 mb-2 font-bold">{word.word}</h2>
                            <div className="flex items-center justify-center gap-3 text-sm">
                                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                                    {word.strongsNumber}
                                </span>
                                <span className="text-gold-500/70">•</span>
                                <span className="text-slate-300 italic">{word.partOfSpeech}</span>
                            </div>
                            {/* Quick gloss badges */}
                            <div className="mt-4 space-y-3">
                                {/* Telugu Translation - Most Prominent */}
                                {multiLang.telugu && (
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-center">
                                        <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Telugu Translation</div>
                                        <div className="text-xl font-serif text-emerald-200">{multiLang.telugu}</div>
                                    </div>
                                )}

                                {/* English and Telugu badges only */}
                                <div className="flex flex-wrap gap-2 justify-center text-xs">
                                    {word.gloss && (
                                        <span className="px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-200 border border-gold-500/30">
                                            English: {word.gloss}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Definition Section */}
                        <div className="space-y-4">
                            {/* English Meaning - Primary */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gold-500/10 to-amber-500/10 border border-gold-500/20">
                                <h3 className="text-xs uppercase tracking-widest text-gold-500 mb-2 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center text-[10px]">EN</span>
                                    English Meaning
                                </h3>
                                <p className="text-crema-100 leading-relaxed text-lg font-serif">
                                    {word.gloss || 'Definition not available'}
                                </p>
                            </div>

                            {/* Telugu Meaning - Primary */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                                <h3 className="text-xs uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">తె</span>
                                    Telugu Meaning (తెలుగు)
                                </h3>
                                {loadingExtra ? (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Loader2 size={14} className="animate-spin" />
                                        <span className="text-sm">Loading...</span>
                                    </div>
                                ) : multiLang.telugu ? (
                                    <p className="text-emerald-100 leading-relaxed text-xl font-serif">{multiLang.telugu}</p>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">Telugu translation not available for this word.</p>
                                )}
                            </div>


                        </div>



                        {/* Occurrence Slider */}
                        {occurrences.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gold-500/70">
                                        <MapPin size={14} />
                                        <h3 className="text-xs uppercase tracking-widest">
                                            Occurrences ({currentOccIndex + 1} of {word.occurrences || occurrences.length})
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={prevOccurrence}
                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            onClick={nextOccurrence}
                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Occurrence Progress Bar */}
                                <div className="h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentOccIndex + 1) / occurrences.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {/* Current Occurrence */}
                                <motion.div
                                    key={currentOccIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="text-gold-400 font-medium">
                                            {occurrences[currentOccIndex]?.book} {occurrences[currentOccIndex]?.chapter}:{occurrences[currentOccIndex]?.verse}
                                        </div>
                                        {onJumpToOccurrence && (
                                            <button
                                                onClick={() => occurrences[currentOccIndex] && onJumpToOccurrence(
                                                    occurrences[currentOccIndex].book,
                                                    occurrences[currentOccIndex].chapter,
                                                    occurrences[currentOccIndex].verse
                                                )}
                                                className="text-xs px-2 py-1 rounded-lg bg-gold-500/20 text-gold-200 hover:bg-gold-500/30 transition-colors"
                                            >
                                                Open
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-sm italic">
                                        "{occurrences[currentOccIndex]?.text}"
                                    </p>
                                </motion.div>

                                {/* Quick Jump Dots */}
                                <div className="flex justify-center gap-1.5 mt-4">
                                    {occurrences.slice(0, 10).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentOccIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${currentOccIndex === idx
                                                ? 'bg-gold-400 scale-125'
                                                : 'bg-white/20 hover:bg-white/40'
                                                }`}
                                        />
                                    ))}
                                    {occurrences.length > 10 && (
                                        <span className="text-xs text-slate-500 ml-2">+{occurrences.length - 10}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Root Word */}
                        {word.rootWord && (
                            <div className="mt-4">
                                <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">Root Word</h3>
                                <p className="text-slate-300 font-serif italic">
                                    From {word.rootWord}
                                </p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1">Total Occurrences</div>
                                <div className="text-2xl font-mono text-gold-400 font-bold">{word.occurrences || 0}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1">Language</div>
                                <div className="text-xl font-serif text-gold-400 capitalize">{word.language || 'Unknown'}</div>
                            </div>
                        </div>

                        {/* First Occurrence */}
                        {word.firstOccurrence && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/20">
                                <div className="text-xs text-gold-500/70 mb-1">First Occurrence</div>
                                <div className="text-lg text-crema-100 font-medium">{word.firstOccurrence}</div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                        <Book size={32} className="opacity-20" />
                        <p className="text-sm">Select a word to view definition</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LexiconPanel;
