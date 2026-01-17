import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Globe, Languages, ChevronLeft, ChevronRight, Loader2, Copy, Check } from 'lucide-react';

interface ParallelVerseData {
    reference: string;
    bookId: number;
    bookName: string;
    chapter: number;
    verse: number;
    text: {
        english: string;
        hebrew?: string;
        telugu?: string;
        greek?: string;
    };
    translations?: {
        kjv?: string;
        web?: string;
        jps?: string;
        brenton?: string;
    };
}

interface ParallelVerseViewProps {
    book: string;
    chapter: number;
    verse: number;
    onClose?: () => void;
    onNavigate?: (book: string, chapter: number, verse: number) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ParallelVerseView: React.FC<ParallelVerseViewProps> = ({
    book,
    chapter,
    verse,
    onClose: _onClose,
    onNavigate
}) => {
    const [data, setData] = useState<ParallelVerseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedLang, setCopiedLang] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'parallel' | 'translations'>('parallel');

    useEffect(() => {
        fetchParallelVerse();
    }, [book, chapter, verse]);

    const fetchParallelVerse = async () => {
        setLoading(true);
        setError(null);
        try {
            const reference = encodeURIComponent(`${book} ${chapter}:${verse}`);
            const response = await fetch(`${API_BASE}/api/verses/parallel/${reference}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || 'Failed to load verse');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string, lang: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedLang(lang);
            setTimeout(() => setCopiedLang(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const navigateVerse = (direction: 'prev' | 'next') => {
        if (!onNavigate) return;
        const newVerse = direction === 'next' ? verse + 1 : verse - 1;
        if (newVerse > 0) {
            onNavigate(book, chapter, newVerse);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-400">
                <p>{error}</p>
                <button
                    onClick={fetchParallelVerse}
                    className="mt-4 px-4 py-2 bg-amber-600 rounded-lg hover:bg-amber-500 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    const LanguagePanel: React.FC<{
        title: string;
        text: string;
        lang: string;
        isRTL?: boolean;
        className?: string;
    }> = ({ title, text, lang, isRTL, className }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group bg-gradient-to-br from-gray-800/60 to-gray-900/60 
                        backdrop-blur-sm rounded-xl p-5 border border-gray-700/50
                        hover:border-amber-500/30 transition-all duration-300 ${className || ''}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium text-sm uppercase tracking-wider">
                        {title}
                    </span>
                </div>
                <button
                    onClick={() => copyToClipboard(text, lang)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 
                               hover:bg-gray-700 rounded-lg"
                    title="Copy to clipboard"
                >
                    {copiedLang === lang ? (
                        <Check className="w-4 h-4 text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                    )}
                </button>
            </div>
            <p
                className={`text-gray-200 leading-relaxed ${isRTL ? 'text-right font-hebrew' : ''}`}
                style={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    fontSize: isRTL ? '1.25rem' : '1rem'
                }}
            >
                {text || <span className="text-gray-500 italic">Not available</span>}
            </p>
        </motion.div>
    );

    return (
        <div className="space-y-4">
            {/* Header with navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Book className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{data.reference}</h2>
                        <p className="text-sm text-gray-400">Multi-language parallel view</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateVerse('prev')}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                        disabled={verse <= 1}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="text-gray-400 min-w-[60px] text-center">
                        {chapter}:{verse}
                    </span>
                    <button
                        onClick={() => navigateVerse('next')}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Tab selector */}
            <div className="flex gap-2 border-b border-gray-700 pb-2">
                <button
                    onClick={() => setActiveTab('parallel')}
                    className={`px-4 py-2 rounded-lg transition ${activeTab === 'parallel'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <Globe className="w-4 h-4 inline mr-2" />
                    Parallel Languages
                </button>
                <button
                    onClick={() => setActiveTab('translations')}
                    className={`px-4 py-2 rounded-lg transition ${activeTab === 'translations'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <Book className="w-4 h-4 inline mr-2" />
                    English Translations
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'parallel' ? (
                    <motion.div
                        key="parallel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {/* Hebrew - takes full width for proper RTL display */}
                        {data.text.hebrew && (
                            <LanguagePanel
                                title="Hebrew (עברית)"
                                text={data.text.hebrew}
                                lang="hebrew"
                                isRTL={true}
                                className="md:col-span-2"
                            />
                        )}

                        {/* English */}
                        <LanguagePanel
                            title="English"
                            text={data.text.english}
                            lang="english"
                        />

                        {/* Telugu */}
                        {data.text.telugu && (
                            <LanguagePanel
                                title="Telugu (తెలుగు)"
                                text={data.text.telugu}
                                lang="telugu"
                            />
                        )}

                        {/* Greek */}
                        {data.text.greek && (
                            <LanguagePanel
                                title="Greek (Ελληνικά)"
                                text={data.text.greek}
                                lang="greek"
                                className="md:col-span-2"
                            />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="translations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-4"
                    >
                        {data.translations?.kjv && (
                            <LanguagePanel
                                title="King James Version (KJV)"
                                text={data.translations.kjv}
                                lang="kjv"
                            />
                        )}
                        {data.translations?.web && (
                            <LanguagePanel
                                title="World English Bible (WEB)"
                                text={data.translations.web}
                                lang="web"
                            />
                        )}
                        {data.translations?.jps && (
                            <LanguagePanel
                                title="Jewish Publication Society (JPS)"
                                text={data.translations.jps}
                                lang="jps"
                            />
                        )}
                        {data.translations?.brenton && (
                            <LanguagePanel
                                title="Brenton's Septuagint"
                                text={data.translations.brenton}
                                lang="brenton"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParallelVerseView;
