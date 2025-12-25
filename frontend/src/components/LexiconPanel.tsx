import React from 'react';
import { motion } from 'framer-motion';
import { X, Book, Loader2 } from 'lucide-react';
import { StrongsDefinition } from '../api/bibleApi';

interface LexiconPanelProps {
    word?: StrongsDefinition | null;
    loading: boolean;
    onClose: () => void;
}

const LexiconPanel: React.FC<LexiconPanelProps> = ({ word, loading, onClose }) => {
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

                            {/* Etymology/Root - Placeholder if API doesn't provide fully yet */}
                            {word.rootWord && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">Root Word</h3>
                                    <p className="text-slate-300 font-serif italic">
                                        From {word.rootWord}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Occurrences</div>
                                    <div className="text-xl font-mono text-gold-400">{word.occurrences}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 mb-1">Language</div>
                                    <div className="text-xl font-serif text-gold-400 capitalize">{word.language}</div>
                                </div>
                            </div>
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
