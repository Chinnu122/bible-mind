import React, { useState } from 'react';
import { PuzzleGame } from '../types';
import { getBiblePuzzle } from '../services/geminiService';

const Puzzles: React.FC = () => {
  const [game, setGame] = useState<PuzzleGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const startNewGame = async () => {
    setLoading(true);
    setGame(null);
    setAnswers({});
    setShowResults(false);
    try {
      const res = await getBiblePuzzle();
      setGame(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId: number, option: string) => {
    if (showResults) return;
    setAnswers(prev => ({...prev, [qId]: option}));
  };

  const calculateScore = () => {
    if (!game) return 0;
    let score = 0;
    game.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Bible Mind Games</h2>
          <p className="text-slate-500">Test your knowledge with AI-generated puzzles.</p>
        </div>
        <button 
          onClick={startNewGame}
          disabled={loading}
          className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'New Quiz'}
        </button>
      </div>

      {!game && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-6xl mb-4">🧩</div>
          <h3 className="text-xl font-medium text-slate-600">Press "New Quiz" to start a challenge!</h3>
        </div>
      )}

      {game && (
        <div className="space-y-6">
          <div className="bg-teal-50 text-teal-800 px-6 py-3 rounded-lg font-medium text-center border border-teal-100">
            Topic: {game.topic}
          </div>
          
          {game.questions.map((q) => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            const userAnswer = answers[q.id];
            
            return (
              <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">{q.id}. {q.question}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map(opt => {
                    let btnClass = "p-3 rounded-lg text-left border transition-all ";
                    if (showResults) {
                      if (opt === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
                      else if (opt === userAnswer && opt !== q.correctAnswer) btnClass += "bg-red-100 border-red-500 text-red-800";
                      else btnClass += "bg-slate-50 border-slate-200 opacity-50";
                    } else {
                      btnClass += userAnswer === opt 
                        ? "bg-teal-600 border-teal-600 text-white shadow-md" 
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";
                    }

                    return (
                      <button 
                        key={opt}
                        onClick={() => handleSelect(q.id, opt)}
                        className={btnClass}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!showResults ? (
            <button 
              onClick={() => setShowResults(true)}
              className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 shadow-xl transition-colors"
            >
              Submit Answers
            </button>
          ) : (
            <div className="text-center bg-slate-900 text-white p-8 rounded-2xl shadow-2xl animate-fade-in">
              <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">Final Score</p>
              <div className="text-5xl font-black mb-4">{calculateScore()} / {game.questions.length}</div>
              <p>{calculateScore() === game.questions.length ? "Perfect! 🎉" : "Good try! Keep studying! 📖"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Puzzles;
