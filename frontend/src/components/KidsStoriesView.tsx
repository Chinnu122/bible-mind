import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Users, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface KidsStoriesViewProps {
    onBack?: () => void;
}

interface StoryData {
    title: string;
    character: string;
    storyText: string;
    moral: string;
    ageGroup: string;
}

interface CharacterButton {
    name: string;
    emoji: string;
    color: string;
    description: string;
}

const CHARACTERS: CharacterButton[] = [
    { name: 'David', emoji: '👑', color: 'from-amber-500/20 to-yellow-500/20', description: 'The Shepherd King' },
    { name: 'Moses', emoji: '🌊', color: 'from-blue-500/20 to-cyan-500/20', description: 'Parted the Red Sea' },
    { name: 'Noah', emoji: '🚢', color: 'from-sky-500/20 to-blue-500/20', description: 'Builder of the Ark' },
    { name: 'Daniel', emoji: '🦁', color: 'from-orange-500/20 to-amber-500/20', description: 'Survived the Lions\' Den' },
    { name: 'Jonah', emoji: '🐋', color: 'from-teal-500/20 to-blue-500/20', description: 'Inside the Whale' },
    { name: 'Joseph', emoji: '🌈', color: 'from-purple-500/20 to-pink-500/20', description: 'Dreamer with a Coat' },
    { name: 'Esther', emoji: '👸', color: 'from-pink-500/20 to-rose-500/20', description: 'The Brave Queen' },
    { name: 'Ruth', emoji: '🌾', color: 'from-amber-500/20 to-orange-500/20', description: 'A Loyal Heart' },
    { name: 'Peter', emoji: '⚓', color: 'from-slate-500/20 to-blue-500/20', description: 'The Fisherman' },
    { name: 'Paul', emoji: '✉️', color: 'from-indigo-500/20 to-purple-500/20', description: 'Letter Writer' },
    { name: 'Mary', emoji: '💙', color: 'from-blue-400/20 to-sky-500/20', description: 'Mother of Jesus' },
    { name: 'Abraham', emoji: '⭐', color: 'from-yellow-500/20 to-amber-500/20', description: 'Father of Nations' },
];

// Cache for loaded stories (prevents re-fetching during session)
const storyCache: Record<string, StoryData> = {};

export default function KidsStoriesView({ onBack }: KidsStoriesViewProps) {
    const [selectedChar, setSelectedChar] = useState<string | null>(null);
    const [story, setStory] = useState<StoryData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cached, setCached] = useState(false);

    const handleCharacterClick = async (characterName: string) => {
        setSelectedChar(characterName);
        setError(null);

        // Check session cache first
        if (storyCache[characterName]) {
            setStory(storyCache[characterName]);
            setCached(true);
            return;
        }

        setLoading(true);
        setCached(false);

        try {
            const response = await fetch(`${API_BASE_URL}/ai-content/kids-story/${encodeURIComponent(characterName)}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to load story');
            }

            // Save to session cache
            storyCache[characterName] = result.data;
            setStory(result.data);
            setCached(result.cached);
        } catch (err: any) {
            setError(err.message || 'Failed to load story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedChar(null);
        setStory(null);
        setError(null);
    };

    const selectedCharData = CHARACTERS.find(c => c.name === selectedChar);

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
                    {selectedChar && (
                        <button onClick={handleBack} className="flex items-center gap-2 text-gold-400 hover:text-gold-300">
                            <ArrowLeft className="w-5 h-5" /> Back to Characters
                        </button>
                    )}
                    <div className="flex-1" />
                    <div className="text-xs text-slate-500">
                        {CHARACTERS.length} characters available
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
                        <p className="text-xs text-slate-500 mt-1">✨ Stories generated by AI and saved for instant access</p>
                    </>
                )}
            </div>

            {/* Character Grid */}
            {!selectedChar && (
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
                            {storyCache[char.name] && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" title="Story loaded" />
                            )}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-4" />
                    <p className="text-gold-300 animate-pulse">Writing a wonderful story about {selectedChar}...</p>
                    <p className="text-xs text-slate-500 mt-2">This may take a moment for first-time stories</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => selectedChar && handleCharacterClick(selectedChar)}
                        className="px-4 py-2 bg-red-500/30 text-red-200 rounded-lg hover:bg-red-500/50 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Story Display */}
            <AnimatePresence mode="wait">
                {story && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto bg-slate-800/50 rounded-3xl overflow-hidden border border-gold-500/20"
                    >
                        {/* Story Header */}
                        <div className={`bg-gradient-to-r ${selectedCharData?.color || 'from-gold-500/20 to-amber-500/20'} p-8 text-center`}>
                            <div className="text-5xl mb-4">{selectedCharData?.emoji}</div>
                            <h3 className="text-3xl font-serif text-white mb-2">{story.title}</h3>
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-white/90">
                                    Ages: {story.ageGroup}
                                </span>
                                {cached && (
                                    <span className="px-3 py-1 bg-green-500/30 rounded-full text-green-200">
                                        ⚡ Instant
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Story Content */}
                        <div className="p-8 space-y-6">
                            <div className="prose prose-lg prose-invert max-w-none">
                                {story.storyText.split('\n').filter(p => p.trim()).map((para, i) => (
                                    <p key={i} className="text-crema-200 leading-relaxed mb-4">{para}</p>
                                ))}
                            </div>

                            {/* Moral */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex gap-4 items-start">
                                    <span className="text-3xl">💡</span>
                                    <div>
                                        <h4 className="font-bold text-amber-300 mb-1">Moral of the Story</h4>
                                        <p className="text-amber-200/80">{story.moral}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Characters */}
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Users className="w-4 h-4" />
                                <span>Character: {story.character}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
