import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Copy, Bookmark } from 'lucide-react';
import { StrongsDefinition } from '../api/bibleApi';

interface WordPopupModalProps {
    word: StrongsDefinition | null;
    loading: boolean;
    onClose: () => void;
}

export default function WordPopupModal({ word, loading, onClose }: WordPopupModalProps) {
    if (!word && !loading) return null;

    const copyToClipboard = () => {
        if (!word) return;
        const text = `${word.word} (${word.strongsNumber})\n${word.gloss}\nTelugu: ${word.telugu || 'N/A'}`;
        navigator.clipboard.writeText(text);
    };

    const speakWord = () => {
        if (!word?.word) return;
        const utterance = new SpeechSynthesisUtterance(word.gloss || word.word);
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <AnimatePresence>
            {(word || loading) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center gap-3">
                                <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-slate-400 text-sm">Loading meaning...</p>
                            </div>
                        ) : word ? (
                            <div className="p-6">
                                {/* Header: Original Word */}
                                <div className="text-center mb-6">
                                    <p className={`text-4xl font-bold mb-2 ${word.language === 'Hebrew' ? 'font-hebrew' : 'font-greek'}`} dir={word.language === 'Hebrew' ? 'rtl' : 'ltr'}>
                                        {word.word}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                        <span className="px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded font-mono text-xs">
                                            {word.strongsNumber}
                                        </span>
                                        <span className="text-slate-500">•</span>
                                        <span>{word.partOfSpeech || word.language}</span>
                                    </div>
                                </div>

                                {/* English Meaning */}
                                <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">EN</span>
                                        <span className="text-xs text-slate-500">English Meaning</span>
                                    </div>
                                    <p className="text-lg text-white leading-relaxed">
                                        {word.gloss || 'No English definition available.'}
                                    </p>
                                </div>

                                {/* Telugu Meaning */}
                                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">TE</span>
                                        <span className="text-xs text-slate-500">Telugu Meaning (తెలుగు)</span>
                                    </div>
                                    <p className="text-lg text-emerald-200 leading-relaxed font-serif">
                                        {word.telugu || 'Telugu translation not available for this word.'}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={speakWord}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                        Listen
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors"
                                    >
                                        <Bookmark className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
