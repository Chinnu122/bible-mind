import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Globe } from 'lucide-react';

interface InterlinearViewProps {
    onBack?: () => void;
}

interface WordData {
    original: string;
    transliteration: string;
    english: string;
    telugu: string;
    hindi: string;
    grammar: string;
}

interface VerseData {
    reference: string;
    translation_english: string;
    translation_telugu: string;
    translation_hindi: string;
    words: WordData[];
}

// Pre-defined interlinear data for common verses
const VERSE_DATA: Record<string, VerseData> = {
    'Genesis 1:1': {
        reference: 'Genesis 1:1',
        translation_english: 'In the beginning God created the heaven and the earth.',
        translation_telugu: 'ఆదిలో దేవుడు భూమ్యాకాశములను సృజించెను.',
        translation_hindi: 'आदि में परमेश्‍वर ने आकाश और पृथ्वी की सृष्‍टि की।',
        words: [
            { original: 'בְּרֵאשִׁית', transliteration: 'bereshit', english: 'In the beginning', telugu: 'ఆదిలో', hindi: 'आदि में', grammar: 'noun, common, feminine' },
            { original: 'בָּרָא', transliteration: 'bara', english: 'created', telugu: 'సృజించెను', hindi: 'सृष्टि की', grammar: 'verb, qal, perfect' },
            { original: 'אֱלֹהִים', transliteration: 'elohim', english: 'God', telugu: 'దేవుడు', hindi: 'परमेश्वर', grammar: 'noun, masculine, plural' },
            { original: 'אֵת', transliteration: 'et', english: '(object marker)', telugu: '-', hindi: '-', grammar: 'particle' },
            { original: 'הַשָּׁמַיִם', transliteration: 'hashamayim', english: 'the heavens', telugu: 'ఆకాశమును', hindi: 'आकाश', grammar: 'noun, masculine, plural' },
            { original: 'וְאֵת', transliteration: "ve'et", english: 'and', telugu: 'మరియు', hindi: 'और', grammar: 'conjunction + particle' },
            { original: 'הָאָרֶץ', transliteration: "ha'aretz", english: 'the earth', telugu: 'భూమిని', hindi: 'पृथ्वी', grammar: 'noun, common, feminine' }
        ]
    },
    'John 3:16': {
        reference: 'John 3:16',
        translation_english: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        translation_telugu: 'దేవుడు లోకమును ఎంతో ప్రేమించెను గనుక ఆయన తన అద్వితీయ కుమారుని ఇచ్చెను.',
        translation_hindi: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया।',
        words: [
            { original: 'Οὕτως', transliteration: 'houtos', english: 'For...so', telugu: 'ఎంతో', hindi: 'ऐसा', grammar: 'adverb' },
            { original: 'ἠγάπησεν', transliteration: 'egapesen', english: 'loved', telugu: 'ప్రేమించెను', hindi: 'प्रेम रखा', grammar: 'verb, aorist, active' },
            { original: 'ὁ θεὸς', transliteration: 'ho theos', english: 'God', telugu: 'దేవుడు', hindi: 'परमेश्वर', grammar: 'noun, nominative' },
            { original: 'τὸν κόσμον', transliteration: 'ton kosmon', english: 'the world', telugu: 'లోకమును', hindi: 'जगत', grammar: 'noun, accusative' },
            { original: 'ὥστε', transliteration: 'hoste', english: 'that', telugu: 'గనుక', hindi: 'कि', grammar: 'conjunction' },
            { original: 'τὸν υἱὸν', transliteration: 'ton huion', english: 'the Son', telugu: 'కుమారుని', hindi: 'पुत्र', grammar: 'noun, accusative' },
            { original: 'ἔδωκεν', transliteration: 'edoken', english: 'he gave', telugu: 'ఇచ్చెను', hindi: 'दे दिया', grammar: 'verb, aorist, active' }
        ]
    },
    'Psalm 23:1': {
        reference: 'Psalm 23:1',
        translation_english: 'The LORD is my shepherd; I shall not want.',
        translation_telugu: 'యెహోవా నా కాపరి, నాకు లేమి కలుగదు.',
        translation_hindi: 'यहोवा मेरा चरवाहा है; मुझे कुछ घटी न होगी।',
        words: [
            { original: 'יְהוָה', transliteration: 'YHWH', english: 'The LORD', telugu: 'యెహోవా', hindi: 'यहोवा', grammar: 'proper noun' },
            { original: 'רֹעִי', transliteration: "ro'i", english: 'my shepherd', telugu: 'నా కాపరి', hindi: 'मेरा चरवाहा', grammar: 'noun + suffix' },
            { original: 'לֹא', transliteration: 'lo', english: 'not', telugu: 'కాదు', hindi: 'नहीं', grammar: 'adverb, negative' },
            { original: 'אֶחְסָר', transliteration: 'echsar', english: 'I shall want', telugu: 'లేమి కలుగదు', hindi: 'घटी होगी', grammar: 'verb, qal, imperfect' }
        ]
    }
};

const QUICK_REFS = ['Genesis 1:1', 'John 3:16', 'Psalm 23:1'];

export default function InterlinearView({ onBack }: InterlinearViewProps) {
    const [reference, setReference] = useState('');
    const [result, setResult] = useState<VerseData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference.trim()) return;

        setError(null);
        setResult(null);

        // Check if we have this verse in our data
        const normalizedRef = reference.trim();
        const foundVerse = Object.entries(VERSE_DATA).find(([key]) =>
            key.toLowerCase() === normalizedRef.toLowerCase()
        );

        if (foundVerse) {
            setResult(foundVerse[1]);
        } else {
            setError(`Interlinear data not available for "${reference}". Try: Genesis 1:1, John 3:16, or Psalm 23:1`);
        }
    };

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
                    {Object.keys(VERSE_DATA).length} verses available
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
                    disabled={!reference.trim()}
                    className="bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition-all"
                >
                    <Search className="w-5 h-5" />
                    Analyze
                </button>
            </form>

            {/* Quick Examples */}
            <div className="flex flex-wrap justify-center gap-2">
                <span className="text-slate-500 text-sm">Try:</span>
                {QUICK_REFS.map(ref => (
                    <button
                        key={ref}
                        onClick={() => {
                            setReference(ref);
                            setResult(VERSE_DATA[ref]);
                            setError(null);
                        }}
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

                            <div className="grid md:grid-cols-3 gap-4">
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

                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-bold">हिंदी (Hindi)</span>
                                    </div>
                                    <p className="text-lg text-orange-100" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                                        {result.translation_hindi}
                                    </p>
                                </div>
                            </div>
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
                                            style={{ direction: result.reference.includes('John') ? 'ltr' : 'rtl' }}
                                        >
                                            {word.original}
                                        </span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wide">
                                            {word.transliteration}
                                        </span>
                                    </div>

                                    {/* Meanings */}
                                    <div className="space-y-1 text-center border-t border-slate-700 pt-3">
                                        <p className="font-medium text-indigo-300 text-sm">{word.english}</p>
                                        <p className="text-emerald-300 text-sm" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                                            {word.telugu}
                                        </p>
                                        <p className="text-orange-300 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                                            {word.hindi}
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
