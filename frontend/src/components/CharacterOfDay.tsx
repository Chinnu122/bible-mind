import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { User, Book, ChevronDown, ChevronUp, Globe, Loader2, ArrowLeft, Heart } from 'lucide-react';

// Simplified interfaces matching actual API response
interface CharacterName {
    english: string;
    hebrew?: string;
    telugu?: string;
}

interface LocalizedText {
    english: string;
    telugu?: string;
}

interface CharacterReference {
    reference: string;
    topic: string;
}

interface Character {
    name: CharacterName;
    meaning: LocalizedText;
    description: LocalizedText;
    story: Record<string, LocalizedText>;
    references: CharacterReference[];
    lessons?: { english: string[]; telugu?: string[] };
}

interface CharacterData {
    character: Character;
    dayNumber: number;
    lastUpdated: string;
}

interface Props {
    onBack?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function CharacterOfDay({ onBack }: Props) {
    const [data, setData] = useState<CharacterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>('creation');
    const [language, setLanguage] = useState<'english' | 'telugu'>('english');

    useEffect(() => {
        async function fetchCharacter() {
            try {
                const response = await fetch(`${API_BASE_URL}/character-of-day`);
                if (!response.ok) throw new Error('Failed to fetch character');
                const json = await response.json();
                setData(json.data);
            } catch (err) {
                console.error('Error fetching character:', err);
                setError('Failed to load character of the day');
            } finally {
                setLoading(false);
            }
        }
        fetchCharacter();
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center">
                <div className="text-red-400 mb-4">{error || 'No character data available'}</div>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    const { character } = data;

    // Null safety: ensure character and all its properties exist
    if (!character || !character.name || !character.meaning || !character.description) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center">
                <div className="text-red-400 mb-4">Character data is incomplete</div>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    const storyKeys = character.story ? Object.keys(character.story) : [];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen pt-24 pb-20 px-4 md:px-12 max-w-5xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                {onBack && (
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                )}

                {/* Language Toggle */}
                <button
                    onClick={() => setLanguage(language === 'english' ? 'telugu' : 'english')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{language === 'english' ? 'తెలుగు' : 'English'}</span>
                </button>
            </motion.div>

            {/* Character Card */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-gold-900/30 to-purple-900/20 rounded-3xl border border-gold-500/20 p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gold-400 uppercase tracking-widest mb-1">Character of the Day #{data.dayNumber}</p>
                        <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white">{character.name?.[language] || character.name?.english || 'Unknown'}</h1>
                        <p className="text-gray-400 mt-1">
                            {character.name?.hebrew && <span className="text-gold-300">{character.name.hebrew}</span>}
                            {character.name?.telugu && <span className="text-emerald-300 ml-2">({character.name.telugu})</span>}
                        </p>
                    </div>
                </div>

                {/* Meaning */}
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gold-400 uppercase tracking-wider mb-2">Meaning</p>
                    <p className="text-xl text-white">{character.meaning?.[language] || character.meaning?.english || ''}</p>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                    {character.description?.[language] || character.description?.english || ''}
                </p>

            </motion.div>

            {/* Story Sections */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8">
                <h2 className="text-2xl font-cinzel font-bold text-gold-300 flex items-center gap-3">
                    <Book className="w-6 h-6" />
                    {language === 'english' ? 'The Story' : 'కథ'}
                </h2>

                {storyKeys.map((key) => {
                    const section = character.story[key];
                    if (!section) return null;

                    const titles: Record<string, { english: string; telugu: string }> = {
                        creation: { english: '🌟 Creation', telugu: '🌟 సృష్టి' },
                        temptation: { english: '🐍 Temptation', telugu: '🐍 శోధన' },
                        sin: { english: '💔 The Sin', telugu: '💔 పాపం' },
                        consequences: { english: '⚡ Consequences', telugu: '⚡ పరిణామాలు' },
                        redemption: { english: '✨ Promise of Redemption', telugu: '✨ విమోచన వాగ్దానం' },
                        hardWork: { english: '💪 Life of Hard Work', telugu: '💪 కష్టపడే జీవితం' }
                    };

                    const title = titles[key]?.[language] || key;

                    return (
                        <motion.div
                            key={key}
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleSection(key)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <span className="text-lg font-medium text-white">{title}</span>
                                {expandedSection === key ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {expandedSection === key && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-4"
                                    >
                                        <p className="text-gray-300 leading-relaxed">
                                            {section?.[language] || section?.english || ''}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* References */}
            <motion.div variants={itemVariants} className="bg-white/5 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-cinzel font-bold text-gold-300 mb-4">
                    {language === 'english' ? '📖 Bible References' : '📖 బైబిల్ సూచనలు'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {character.references.map((ref, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer"
                        >
                            <Book className="w-4 h-4 text-gold-400 flex-shrink-0" />
                            <div>
                                <p className="text-white font-medium">{ref.reference}</p>
                                <p className="text-sm text-gray-400">{ref.topic}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Lessons - Only show if lessons exist */}
            {character.lessons && (character.lessons[language] || character.lessons.english) && (
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-xl font-cinzel font-bold text-purple-300 flex items-center gap-3 mb-4">
                        <Heart className="w-5 h-5" />
                        {language === 'english' ? 'Lessons for Today' : 'నేటి పాఠాలు'}
                    </h3>
                    <ul className="space-y-3">
                        {(character.lessons[language] || character.lessons.english || []).map((lesson, index) => (
                            <li key={index} className="flex gap-3">
                                <span className="text-purple-400 font-bold">{index + 1}.</span>
                                <span className="text-gray-300">{lesson}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.div >
    );
}
