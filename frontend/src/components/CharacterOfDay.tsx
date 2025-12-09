import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Book, ChevronDown, ChevronUp, Globe, Loader2, ArrowLeft, Heart } from 'lucide-react';

interface CharacterName {
    english: string;
    hebrew: string;
    hebrewTransliteration: string;
    greek: string;
    greekTransliteration: string;
    telugu: string;
}

interface CharacterStory {
    creation?: { english: string; telugu: string };
    temptation?: { english: string; telugu: string };
    sin?: { english: string; telugu: string };
    consequences?: { english: string; telugu: string };
    redemption?: { english: string; telugu: string };
    hardWork?: { english: string; telugu: string };
}

interface CharacterReference {
    reference: string;
    topic: string;
}

interface Character {
    id: string;
    name: CharacterName;
    meaning: { english: string; hebrew: string; telugu: string };
    description: { english: string; telugu: string };
    story: CharacterStory;
    references: CharacterReference[];
    lessons: { english: string[]; telugu: string[] };
    date: string;
    dayNumber: number;
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
    const storyKeys = Object.keys(character.story) as Array<keyof CharacterStory>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-24 pb-20 px-4 md:px-12 max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
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
            </div>

            {/* Character Card */}
            <div className="bg-gradient-to-br from-gold-900/30 to-purple-900/20 rounded-3xl border border-gold-500/20 p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gold-400 uppercase tracking-widest mb-1">Character of the Day #{data.dayNumber}</p>
                        <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white">{character.name[language]}</h1>
                        <p className="text-gray-400 mt-1">
                            <span className="text-gold-300">{character.name.hebrew}</span> • {character.name.hebrewTransliteration}
                        </p>
                    </div>
                </div>

                {/* Meaning */}
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gold-400 uppercase tracking-wider mb-2">Meaning</p>
                    <p className="text-xl text-white">{character.meaning[language]}</p>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                    {character.description[language]}
                </p>
            </div>

            {/* Story Sections */}
            <div className="space-y-4 mb-8">
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
                                            {section[language]}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* References */}
            <div className="bg-white/5 rounded-xl p-6 mb-8">
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
            </div>

            {/* Lessons */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-cinzel font-bold text-purple-300 flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5" />
                    {language === 'english' ? 'Lessons for Today' : 'నేటి పాఠాలు'}
                </h3>
                <ul className="space-y-3">
                    {character.lessons[language].map((lesson, index) => (
                        <li key={index} className="flex gap-3">
                            <span className="text-purple-400 font-bold">{index + 1}.</span>
                            <span className="text-gray-300">{lesson}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
