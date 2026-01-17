
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Brain, Baby, Gamepad2, HelpCircle,
    Search, ChevronRight, Loader2
} from 'lucide-react';
import { bibleAPI } from '../api/bibleApi';

// Types from backend
interface StudyData {
    title: string;
    mainPassage: string;
    introduction: string;
    keyPoints: { point: string; reference: string; }[];
    crossReferences: string[];
    conclusion: string;
}

interface KidStory {
    title: string;
    character: string;
    storyText: string;
    moral: string;
    ageGroup: string;
}

interface QuizGame {
    topic: string;
    questions: {
        id: number;
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

interface Riddle {
    riddle: string;
    hints: string[];
    answer: string;
    explanation: string;
    difficulty: string;
}

export default function AIStudio({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'study' | 'kids' | 'quiz' | 'riddle'>('study');

    return (
        <div className="min-h-screen bg-transparent text-crema-50 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    <ChevronRight className="rotate-180 text-crema-200" />
                </button>
                <div>
                    <h1 className="text-3xl font-serif text-crema-100 flex items-center gap-3">
                        <Sparkles className="text-gold-400" />
                        Bible Mind AI
                    </h1>
                    <p className="text-crema-300/60 text-sm">Powered by Advanced AI</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                <TabButton
                    active={activeTab === 'study'}
                    onClick={() => setActiveTab('study')}
                    icon={Brain}
                    label="Bible Study"
                />
                <TabButton
                    active={activeTab === 'kids'}
                    onClick={() => setActiveTab('kids')}
                    icon={Baby}
                    label="Kids Stories"
                />
                <TabButton
                    active={activeTab === 'quiz'}
                    onClick={() => setActiveTab('quiz')}
                    icon={Gamepad2}
                    label="Quiz"
                />
                <TabButton
                    active={activeTab === 'riddle'}
                    onClick={() => setActiveTab('riddle')}
                    icon={HelpCircle}
                    label="Riddles"
                />
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'study' && <StudyGenerator />}
                    {activeTab === 'kids' && <KidsStoryGenerator />}
                    {activeTab === 'quiz' && <QuizGenerator />}
                    {activeTab === 'riddle' && <RiddleGenerator />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`
        relative px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap transition-all
        ${active ? 'text-gold-900 font-medium' : 'text-crema-300 hover:text-crema-100 hover:bg-white/5'}
      `}
        >
            {active && (
                <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gold-400 rounded-full"
                />
            )}
            <Icon size={18} className="relative z-10" />
            <span className="relative z-10">{label}</span>
        </button>
    );
}

// --- Feature Components ---

function StudyGenerator() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<StudyData | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const res = await bibleAPI.getAiStudy(topic);
            setData(res as unknown as StudyData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-serif text-gold-200 mb-4">What would you like to study?</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Grace, The Life of David, Faith in Hard Times..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-crema-100 placeholder:text-white/20 focus:outline-none focus:border-gold-500/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-gold-950 font-medium px-6 rounded-xl flex items-center gap-2 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                        Study
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-white/30">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p>Analyzing scriptures...</p>
                </div>
            )}

            {data && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#0a0a0a] border border-gold-500/20 rounded-2xl p-8 space-y-8"
                >
                    <div className="text-center space-y-2 border-b border-white/10 pb-6">
                        <h2 className="text-3xl font-serif text-gold-100">{data.title}</h2>
                        <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-sm text-gold-400 font-mono">
                            {data.mainPassage}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gold-500 text-sm uppercase tracking-widest mb-3">Introduction</h4>
                        <p className="text-crema-200 leading-relaxed">{data.introduction}</p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-gold-500 text-sm uppercase tracking-widest">Key Insights</h4>
                        {data.keyPoints.map((point, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-serif shrink-0">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-crema-100 mb-2">{point.point}</p>
                                    <span className="text-xs text-white/40 font-mono">{point.reference}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gold-900/10 border border-gold-500/10 rounded-xl p-6">
                        <h4 className="text-gold-500 text-sm uppercase tracking-widest mb-3">Conclusion</h4>
                        <p className="text-crema-200 italic">{data.conclusion}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function KidsStoryGenerator() {
    const [character, setCharacter] = useState('');
    const [loading, setLoading] = useState(false);
    const [story, setStory] = useState<KidStory | null>(null);

    const handleGenerate = async () => {
        if (!character.trim()) return;
        setLoading(true);
        try {
            const res = await bibleAPI.getAiKidStory(character);
            setStory(res as unknown as KidStory);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-indigo-900/20 backdrop-blur-md border border-indigo-500/20 p-6 rounded-3xl text-center">
                <h3 className="text-2xl font-serif text-indigo-200 mb-4">Who do you want to hear a story about?</h3>
                <div className="flex gap-3 max-w-md mx-auto">
                    <input
                        type="text"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
                        placeholder="e.g. David, Esther, Noah..."
                        className="flex-1 bg-black/40 border border-indigo-500/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !character}
                        className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold px-6 rounded-2xl transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Go!"}
                    </button>
                </div>
            </div>

            {story && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-100 to-transparent opacity-50" />

                    <div className="relative">
                        <h2 className="text-4xl font-serif text-indigo-900 mb-2 text-center">{story.title}</h2>
                        <p className="text-center text-indigo-400 font-bold mb-8 uppercase tracking-wider text-sm">
                            A Story about {story.character}
                        </p>

                        <div className="prose prose-lg text-slate-700 leading-relaxed mx-auto">
                            {story.storyText.split('\n').map((p, i) => (
                                <p key={i} className="mb-4">{p}</p>
                            ))}
                        </div>

                        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                            <h4 className="text-amber-800 font-bold uppercase text-xs tracking-widest mb-2">The Moral Lesson</h4>
                            <p className="text-amber-900 font-serif text-lg italic">"{story.moral}"</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function QuizGenerator() {
    const [topic, setTopic] = useState('');
    const [game, setGame] = useState<QuizGame | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const startQuiz = async () => {
        setLoading(true);
        setScore(null);
        setAnswers({});
        try {
            const res = await bibleAPI.getAiQuiz(topic || undefined);
            setGame(res as unknown as QuizGame);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswers = () => {
        if (!game) return;
        let correct = 0;
        game.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correct++;
        });
        setScore(correct);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {!game && (
                <div className="text-center py-10">
                    <Gamepad2 size={64} className="mx-auto text-emerald-500 mb-6 opacity-80" />
                    <h2 className="text-3xl font-serif text-crema-100 mb-6">Bible Trivia Challenge</h2>
                    <div className="flex gap-3 justify-center max-w-md mx-auto mb-8">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Specific topic (optional)..."
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-crema-100 focus:outline-none focus:border-emerald-500/50"
                        />
                        <button
                            onClick={startQuiz}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 rounded-xl transition-colors"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Start Quiz"}
                        </button>
                    </div>
                </div>
            )}

            {game && (
                <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h3 className="text-xl text-emerald-400 font-medium">{game.topic}</h3>
                        <button onClick={() => setGame(null)} className="text-sm text-white/40 hover:text-white">Exit</button>
                    </div>

                    <div className="space-y-8">
                        {game.questions.map((q, idx) => {
                            const userAnswer = answers[q.id];
                            const isGraded = score !== null;

                            return (
                                <div key={q.id} className="bg-white/5 rounded-2xl p-6">
                                    <h4 className="text-lg text-crema-100 mb-4 font-medium flex gap-3">
                                        <span className="text-white/20">{idx + 1}.</span>
                                        {q.question}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt) => {
                                            const isSelected = userAnswer === opt;
                                            const isAnswer = q.correctAnswer === opt;

                                            let bgClass = "bg-black/20 hover:bg-white/10 border-transparent";
                                            if (isSelected) bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                                            if (isGraded) {
                                                if (isAnswer) bgClass = "bg-green-500/30 border-green-500 text-green-100";
                                                else if (isSelected && !isAnswer) bgClass = "bg-red-500/20 border-red-500 text-red-200 opacity-50";
                                                else bgClass = "opacity-30";
                                            }

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => !isGraded && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                    disabled={isGraded}
                                                    className={`
                                text-left px-4 py-3 rounded-xl border transition-all
                                ${bgClass}
                             `}
                                                >
                                                    <span className="opacity-50 mr-2">{String.fromCharCode(65 + q.options.indexOf(opt))}.</span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!score && Object.keys(answers).length === game.questions.length && (
                        <div className="flex justify-center pt-8">
                            <button
                                onClick={checkAnswers}
                                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-12 py-4 rounded-full text-lg shadow-lg shadow-emerald-900/20 transition-transform hover:scale-105"
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}

                    {score !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#1a1a1a] border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full text-center"
                            >
                                <Gamepad2 className="mx-auto text-emerald-400 mb-4" size={48} />
                                <h2 className="text-3xl font-bold text-white mb-2">Score</h2>
                                <div className="text-6xl font-serif text-emerald-400 mb-6 font-bold">
                                    {score}/{game.questions.length}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setScore(null)} className="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20">Review</button>
                                    <button onClick={() => setGame(null)} className="flex-1 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-500 text-white font-medium">New Quiz</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function RiddleGenerator() {
    const [riddle, setRiddle] = useState<Riddle | null>(null);
    const [loading, setLoading] = useState(false);
    const [revealedHints, setRevealedHints] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const loadRiddle = async () => {
        setLoading(true);
        setRevealedHints(0);
        setShowAnswer(false);
        try {
            const res = await bibleAPI.getAiRiddle(true);
            setRiddle(res as unknown as Riddle);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto text-center space-y-8 py-10">
            {!riddle && (
                <div className="space-y-6">
                    <HelpCircle size={64} className="mx-auto text-purple-400 opacity-80" />
                    <h2 className="text-3xl font-serif text-crema-100">Biblical Riddles</h2>
                    <p className="text-crema-300">Test your wisdom with AI-generated riddles.</p>
                    <button
                        onClick={loadRiddle}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-3 rounded-full transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Get a Riddle"}
                    </button>
                </div>
            )}

            {riddle && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 border border-purple-500/20 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="bg-purple-500/10 inline-block px-3 py-1 rounded-full text-purple-300 text-xs uppercase tracking-wider mb-6 border border-purple-500/20">
                        Difficulty: {riddle.difficulty}
                    </div>

                    <p className="text-2xl font-serif text-crema-100 italic leading-relaxed mb-8">
                        "{riddle.riddle}"
                    </p>

                    <div className="space-y-4 mb-8">
                        {riddle.hints.map((hint, i) => (
                            <div key={i} className="overflow-hidden">
                                {revealedHints > i ? (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="bg-black/30 p-3 rounded-xl text-purple-200 text-sm"
                                    >
                                        💡 Hint {i + 1}: {hint}
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setRevealedHints(i + 1)}
                                        disabled={revealedHints < i}
                                        className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:bg-white/5 hover:text-white/50 transition-colors"
                                    >
                                        Reveal Hint {i + 1}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {showAnswer ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-purple-600 rounded-2xl p-6"
                        >
                            <div className="text-purple-200 text-xs uppercase tracking-widest mb-2">Answer</div>
                            <h3 className="text-3xl font-bold text-white mb-2">{riddle.answer}</h3>
                            <p className="text-purple-100/80 text-sm border-t border-purple-500 mt-4 pt-4">
                                {riddle.explanation}
                            </p>
                            <button onClick={loadRiddle} className="mt-6 bg-white text-purple-900 px-6 py-2 rounded-full font-bold text-sm">
                                Next Riddle
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            onClick={() => setShowAnswer(true)}
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-colors"
                        >
                            Reveal Answer
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
