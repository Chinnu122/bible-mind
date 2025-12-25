import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Book, Loader2, Globe, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { StrongsDefinition, API_BASE_URL } from '../api/bibleApi';

interface MultiLangMeaning {
    telugu?: string;
    hindi?: string;
    greek?: string;
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

const LexiconPanel: React.FC<LexiconPanelProps> = ({ word, loading, onClose }) => {
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
                    <span className="font-serif font-medium tracking-wide">Lexicon</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <X size={18} />
                </button>
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
                        </div>

                        {/* Definition */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">Definition</h3>
                                <p className="text-crema-100 leading-relaxed text-lg">
                                    {word.gloss}
                                </p>
                            </div>

                            {/* Multi-Language Translations */}
                            {loadingExtra ? (
                                <div className="mt-6 p-4 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Loader2 size={20} className="animate-spin text-purple-400 mr-2" />
                                    <span className="text-sm text-slate-400">Loading translations...</span>
                                </div>
                            ) : (multiLang.telugu || multiLang.hindi || multiLang.greek) && (
                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                    <div className="flex items-center gap-2 text-purple-300 mb-4">
                                        <Globe size={16} />
                                        <h3 className="text-xs uppercase tracking-widest">Multi-Language</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {multiLang.telugu && (
                                            <div className="flex items-start gap-3">
                                                <span className="text-xs font-bold text-purple-400 w-16 shrink-0">Telugu</span>
                                                <span className="text-crema-100 font-serif text-lg">{multiLang.telugu}</span>
                                            </div>
                                        )}
                                        {multiLang.hindi && (
                                            <div className="flex items-start gap-3">
                                                <span className="text-xs font-bold text-blue-400 w-16 shrink-0">Hindi</span>
                                                <span className="text-crema-100 font-serif text-lg">{multiLang.hindi}</span>
                                            </div>
                                        )}
                                        {multiLang.greek && (
                                            <div className="flex items-start gap-3">
                                                <span className="text-xs font-bold text-green-400 w-16 shrink-0">Greek</span>
                                                <span className="text-crema-100 font-serif text-lg">{multiLang.greek}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                        <div className="text-gold-400 font-medium mb-2">
                                            {occurrences[currentOccIndex]?.book} {occurrences[currentOccIndex]?.chapter}:{occurrences[currentOccIndex]?.verse}
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
                                    <div className="text-2xl font-mono text-gold-400 font-bold">{word.occurrences}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Language</div>
                                    <div className="text-xl font-serif text-gold-400 capitalize">{word.language}</div>
                                </div>
                            </div>

                            {/* First Occurrence */}
                            {word.firstOccurrence && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/20">
                                    <div className="text-xs text-gold-500/70 mb-1">First Occurrence</div>
                                    <div className="text-lg text-crema-100 font-medium">{word.firstOccurrence}</div>
                                </div>
                            )}
                        </div>
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
