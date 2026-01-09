import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Download, FileText, Book, Sparkles, Users } from 'lucide-react';
import { fetchStory, Story, getCacheStats } from '../services/geminiService';
import { exportStoryPDF, downloadJSON } from '../utils/exportUtils';

interface KidsStoriesViewProps {
    onBack?: () => void;
}

const CHARACTERS = [
    { name: 'David', emoji: '👑', color: 'from-amber-500/20 to-yellow-500/20', description: 'The Shepherd King' },
    { name: 'Moses', emoji: '🌊', color: 'from-blue-500/20 to-cyan-500/20', description: 'Parted the Red Sea' },
    { name: 'Esther', emoji: '👸', color: 'from-pink-500/20 to-rose-500/20', description: 'Brave Queen of Persia' },
    { name: 'Noah', emoji: '🚢', color: 'from-sky-500/20 to-blue-500/20', description: 'Builder of the Ark' },
    { name: 'Daniel', emoji: '🦁', color: 'from-orange-500/20 to-amber-500/20', description: 'Survived the Lion\'s Den' },
    { name: 'Jonah', emoji: '🐋', color: 'from-teal-500/20 to-emerald-500/20', description: 'Swallowed by a Fish' },
    { name: 'Jesus', emoji: '✝️', color: 'from-gold-500/20 to-yellow-500/20', description: 'Son of God' },
    { name: 'Paul', emoji: '✉️', color: 'from-purple-500/20 to-violet-500/20', description: 'Apostle to the Gentiles' },
    { name: 'Joseph', emoji: '🌈', color: 'from-red-500/20 to-orange-500/20', description: 'Dreamer with Colorful Coat' },
    { name: 'Ruth', emoji: '🌾', color: 'from-amber-500/20 to-green-500/20', description: 'Faithful Daughter-in-law' },
    { name: 'Samson', emoji: '💪', color: 'from-red-500/20 to-rose-500/20', description: 'Strong Man of Israel' },
    { name: 'Abraham', emoji: '⭐', color: 'from-indigo-500/20 to-blue-500/20', description: 'Father of Faith' }
];

export default function KidsStoriesView({ onBack }: KidsStoriesViewProps) {
    const [selectedChar, setSelectedChar] = useState<string | null>(null);
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cacheStats = getCacheStats();

    const handleCharacterClick = async (charName: string) => {
        setSelectedChar(charName);
        setLoading(true);
        setError(null);
        setStory(null);

        try {
            const data = await fetchStory(charName);
            setStory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate story');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedChar(null);
        setStory(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-between mb-4">
                    {onBack && !selectedChar && (
                        <button onClick={onBack} className="flex items-center gap-2 text-gold-400 hover:text-gold-300">
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                    )}
                    <div className="flex-1" />
                    <div className="text-xs text-slate-500">
                        Saved: {cacheStats.stories} stories
                    </div>
                </div>

                {!selectedChar && (
                    <>
                        <h2 className="text-3xl md:text-4xl font-serif text-gold-300 mb-2 flex items-center justify-center gap-3">
                            <Sparkles className="w-8 h-8 text-gold-400" />
                            Bible Kids Storybook
                            <Sparkles className="w-8 h-8 text-gold-400" />
                        </h2>
                        <p className="text-slate-400">Choose a hero to hear their adventure!</p>
                    </>
                )}
            </div>

            {/* Character Grid */}
            {!selectedChar && !loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {CHARACTERS.map((char) => (
                        <motion.button
                            key={char.name}
                            onClick={() => handleCharacterClick(char.name)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${char.color} border border-white/10 hover:border-gold-500/50 p-6 text-left transition-all group`}
                        >
                            <div className="text-4xl mb-3">{char.emoji}</div>
                            <h3 className="text-xl font-bold text-white mb-1">{char.name}</h3>
                            <p className="text-sm text-slate-300 opacity-75">{char.description}</p>

                            {/* Hover indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-gold-500">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin" />
                        <Book className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-300" />
                    </div>
                    <p className="mt-4 text-lg">Creating story about {selectedChar}...</p>
                    <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-200 mb-4">{error}</p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                    >
                        Try Another Character
                    </button>
                </div>
            )}

            {/* Story Display */}
            <AnimatePresence>
                {story && selectedChar && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Characters
                        </button>

                        {/* Storybook Card */}
                        <div className="bg-[#fff9e6] text-slate-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Top Decorative Bar */}
                            <div className="h-3 bg-gradient-to-r from-amber-500 via-gold-500 to-amber-500" />

                            {/* Content */}
                            <div className="p-8 md:p-12">
                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-serif text-amber-800 mb-6 text-center">
                                    {story.title}
                                </h1>

                                {/* Characters */}
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {story.characters.map((char, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm border border-amber-200"
                                        >
                                            <Users className="w-3 h-3 inline mr-1" />
                                            {char}
                                        </span>
                                    ))}
                                </div>

                                {/* Story Content */}
                                <div className="prose prose-lg prose-amber max-w-none mb-8">
                                    {story.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-slate-700 leading-relaxed mb-4 text-lg">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Moral */}
                                <div className="bg-amber-100 rounded-xl p-6 border-2 border-amber-200">
                                    <h4 className="font-bold text-amber-800 uppercase text-sm tracking-wide mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Lesson for Us
                                    </h4>
                                    <p className="italic text-amber-900 font-medium text-lg">{story.moral}</p>
                                </div>

                                {/* Export Buttons */}
                                <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-amber-200">
                                    <button
                                        onClick={() => exportStoryPDF(story)}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                                    >
                                        <FileText className="w-4 h-4" /> Save as PDF
                                    </button>
                                    <button
                                        onClick={() => downloadJSON(story, `story_${selectedChar}`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg border border-amber-300 transition"
                                    >
                                        <Download className="w-4 h-4" /> Save Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
