import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Trophy, HelpCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Question {
    id: number;
    question: string;
    options: string[];
}

interface QuizResult {
    correct: boolean;
    correctAnswer: number;
    reference: string;
}

interface DailyQuizProps {
    onBack: () => void;
}

export default function DailyQuiz({ onBack }: DailyQuizProps) {
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetchDailyQuestion();
        // Load score
        const savedScore = localStorage.getItem('bible-quiz-score');
        if (savedScore) setScore(parseInt(savedScore));
    }, []);

    const fetchDailyQuestion = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE_URL}/quiz/today`);

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            const json = await res.json();

            if (json.success && json.data) {
                // API returns array of questions for the day, take the first one
                const questionData = Array.isArray(json.data) ? json.data[0] : json.data;

                if (questionData && questionData.question && questionData.options) {
                    setQuestion({
                        id: questionData.questionId || questionData.id,
                        question: questionData.question,
                        options: questionData.options
                    });
                } else {
                    throw new Error('No quiz questions available for today');
                }
            } else {
                // API returned success but no valid question data
                throw new Error('No quiz questions available for today');
            }
        } catch (e) {
            console.error('Error fetching quiz:', e);
            setError(e instanceof Error ? e.message : 'Failed to load quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = async (index: number) => {
        if (result) return; // Already answered
        setSelectedOption(index);

        try {
            const res = await fetch(`${API_BASE_URL}/quiz/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: question?.id,
                    answerIndex: index
                })
            });
            const json = await res.json();
            if (json.success) {
                setResult(json);
                if (json.correct) {
                    const newScore = score + 10;
                    setScore(newScore);
                    localStorage.setItem('bible-quiz-score', newScore.toString());
                    localStorage.setItem('bible-quiz-last-answered', new Date().toDateString() + '-' + question?.id);
                }
            }
        } catch (e) {
            console.error('Error checking answer', e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 px-4 md:px-12 max-w-3xl mx-auto pb-20 min-h-screen"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gold-400" />
                    </button>
                    <h1 className="text-3xl font-serif text-gold-100">Daily Bible Quiz</h1>
                </div>
                <div className="flex items-center gap-2 bg-gold-500/10 px-4 py-2 rounded-full border border-gold-500/20">
                    <Trophy className="w-5 h-5 text-gold-400" />
                    <span className="text-gold-300 font-bold">{score} XP</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 animate-pulse">Loading today's challenge...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-[#1a1a1d] border border-white/10 rounded-2xl">
                    <HelpCircle className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-red-400 mb-2">Unable to Load Quiz</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchDailyQuestion}
                        className="px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/30 rounded-full text-gold-300 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            ) : !question ? (
                <div className="text-center py-20 bg-[#1a1a1d] border border-white/10 rounded-2xl">
                    <HelpCircle className="w-16 h-16 text-gray-500/50 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-gray-400 mb-2">No Quiz Available</h3>
                    <p className="text-gray-500 mb-6">Check back later for today's Bible challenge!</p>
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all"
                    >
                        Go Back
                    </button>
                </div>
            ) : (
                <div className="bg-[#1a1a1d] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    {/* Background Decoration */}
                    <HelpCircle className="absolute -top-10 -right-10 w-64 h-64 text-white/5 rotate-12" />

                    <h2 className="text-2xl font-serif text-white mb-8 relative z-10">{question.question}</h2>

                    <div className="space-y-4 relative z-10">
                        {question.options.map((option, index) => {
                            let stateClass = "bg-white/5 border-white/10 hover:bg-white/10";
                            if (selectedOption !== null) {
                                if (result) {
                                    if (index === result.correctAnswer) stateClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
                                    else if (index === selectedOption && !result.correct) stateClass = "bg-red-500/20 border-red-500/50 text-red-300";
                                    else stateClass = "bg-white/5 border-white/10 opacity-50";
                                } else if (index === selectedOption) {
                                    stateClass = "bg-gold-500/20 border-gold-500 text-gold-300"; // Selected, waiting
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={!!result}
                                    onClick={() => handleOptionSelect(index)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${stateClass}`}
                                >
                                    <span className="text-lg">{option}</span>
                                    {result && index === result.correctAnswer && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                                    {result && index === selectedOption && !result.correct && <XCircle className="w-5 h-5 text-red-400" />}
                                </button>
                            );
                        })}
                    </div>

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-4 rounded-xl border ${result.correct ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}
                        >
                            <h3 className={`font-bold mb-1 ${result.correct ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {result.correct ? 'Correct! Well done.' : 'Not quite!'}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Biblical Reference: <span className="text-white font-medium">{result.reference}</span>
                            </p>
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
