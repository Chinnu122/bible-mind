import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, RefreshCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

const SAMPLE_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "Who is known as the 'Father of Many Nations'?",
        options: ["Moses", "Abraham", "David", "Solomon"],
        correctAnswer: 1,
        explanation: "In Genesis 17:5, God changes Abram's name to Abraham, meaning 'father of a multitude'."
    },
    {
        id: 2,
        question: "What is the shortest verse in the Bible?",
        options: ["God is love", "Jesus wept", "Rejoice always", "Pray without ceasing"],
        correctAnswer: 1,
        explanation: "John 11:35 'Jesus wept' is the shortest verse in English translations."
    },
    {
        id: 3,
        question: "How many books are in the New Testament?",
        options: ["27", "39", "66", "12"],
        correctAnswer: 0,
        explanation: "There are 27 books in the New Testament and 39 in the Old Testament."
    }
];

export default function DailyQuiz({ onBack }: { onBack: () => void }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const question = SAMPLE_QUESTIONS[currentQuestionIdx];

    const handleOptionSelect = (idx: number) => {
        if (isAnswered) return;

        setSelectedOption(idx);
        setIsAnswered(true);

        if (idx === question.correctAnswer) {
            setScore(prev => prev + 1);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < SAMPLE_QUESTIONS.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsCompleted(true);
            // Big celebration
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C0C0C0', '#ffffff']
            });
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIdx(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsCompleted(false);
    };

    return (
        <div className="h-full flex flex-col pt-8 max-w-2xl mx-auto px-4">

            {/* Header Progress */}
            {!isCompleted && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                            &larr; Back
                        </button>
                        <h2 className="text-crema-100 font-serif">Daily Challenge</h2>
                    </div>

                    <div className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-500 mb-2">
                        <span>Question {currentQuestionIdx + 1}/{SAMPLE_QUESTIONS.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIdx) / SAMPLE_QUESTIONS.length) * 100}%` }}
                            className="h-full bg-gold-500/50"
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!isCompleted ? (
                    <motion.div
                        key={currentQuestionIdx}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="bg-slate-800 border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden"
                    >
                        <h2 className="text-2xl md:text-3xl font-editorial text-crema-50 mb-8 leading-relaxed">
                            {question.question}
                        </h2>

                        <div className="space-y-3">
                            {question.options.map((option, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === question.correctAnswer;
                                const showResult = isAnswered && (isSelected || isCorrect);

                                let borderColor = 'border-white/5';
                                let bgColor = 'bg-white/5';

                                if (showResult) {
                                    if (isCorrect) {
                                        borderColor = 'border-sage-500';
                                        bgColor = 'bg-sage-500/20';
                                    } else if (isSelected) {
                                        borderColor = 'border-red-500';
                                        bgColor = 'bg-red-500/20';
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group 
                                            ${borderColor} ${bgColor} ${!isAnswered && 'hover:bg-white/10 hover:border-white/10'}`}
                                    >
                                        <span className={`font-sans text-lg ${showResult && isCorrect ? 'text-sage-300' : 'text-crema-100'}`}>
                                            {option}
                                        </span>
                                        {showResult && (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                {isCorrect ? <CheckCircle className="text-sage-400" size={20} /> : isSelected ? <XCircle className="text-red-400" size={20} /> : null}
                                            </motion.span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 pt-6 border-t border-white/5"
                            >
                                <div className="bg-black/20 rounded-xl p-4 mb-6">
                                    <strong className="text-gold-400 block mb-1 uppercase text-xs tracking-wider">Explanation</strong>
                                    <p className="text-slate-300 text-sm font-serif italic">
                                        "{question.explanation}"
                                    </p>
                                </div>
                                <button
                                    onClick={nextQuestion}
                                    className="w-full py-3 bg-crema-100 text-slate-900 rounded-xl font-bold hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                    Next Question <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    /* Completion Card */
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-800 border border-gold-500/20 p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden mt-10"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                        <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-400">
                            <Award size={48} />
                        </div>

                        <h2 className="text-4xl font-editorial text-crema-50 mb-2">Quiz Complete!</h2>
                        <p className="text-slate-400 mb-8 text-lg">You scored <span className="text-gold-400 font-bold">{score}</span> out of {SAMPLE_QUESTIONS.length}</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={restartQuiz}
                                className="w-full px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-crema-100 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={18} /> Retry Quiz
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full px-6 py-3 rounded-xl bg-gold-500 text-slate-900 font-bold hover:bg-gold-400 transition-colors"
                            >
                                Return Home
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
