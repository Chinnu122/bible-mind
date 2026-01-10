import React, { useState } from 'react';
import { BibleRiddle } from '../types';
import { getBibleRiddle } from '../services/geminiService';

const MindGame: React.FC = () => {
  const [riddle, setRiddle] = useState<BibleRiddle | null>(null);
  const [loading, setLoading] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'idle'>('idle');
  const [feedback, setFeedback] = useState('');

  const startNewGame = async () => {
    setLoading(true);
    setRiddle(null);
    setHintsRevealed(0);
    setGameStatus('playing');
    setUserGuess('');
    setFeedback('');
    try {
      const res = await getBibleRiddle();
      setRiddle(res);
    } catch (e) {
      console.error(e);
      setFeedback("Failed to load a riddle. Please try again.");
      setGameStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!riddle || !userGuess.trim()) return;

    const guess = userGuess.trim().toLowerCase();
    const isCorrect = riddle.acceptedAnswers.some(ans => ans.toLowerCase() === guess) || 
                      riddle.answer.toLowerCase() === guess ||
                      guess.includes(riddle.answer.toLowerCase());

    if (isCorrect) {
      setGameStatus('won');
      setFeedback("Correct! You solved the mystery.");
    } else {
      setFeedback("Incorrect. Try again or use a hint!");
    }
  };

  const revealHint = () => {
    if (riddle && hintsRevealed < riddle.hints.length) {
      setHintsRevealed(prev => prev + 1);
      setFeedback("Hint revealed!");
    }
  };

  const giveUp = () => {
    setGameStatus('lost');
    setFeedback("Better luck next time!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Divine Riddles</h2>
        <p className="text-slate-500">A pure mind game. Solve the mystery.</p>
      </div>

      {!riddle && !loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-6">🧠</div>
          <button 
            onClick={startNewGame}
            className="px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Challenge
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600 font-medium">Consulting the scrolls...</p>
        </div>
      )}

      {riddle && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <span className="text-sm font-bold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full">
              {riddle.difficulty}
            </span>
            <span className="text-slate-300 text-sm">Mind Game</span>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="text-xl font-serif text-slate-800 leading-relaxed italic text-center">
                "{riddle.riddle}"
              </p>
            </div>

            {/* Hints Area */}
            <div className="space-y-3">
              {riddle.hints.map((hint, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-500 overflow-hidden ${
                    index < hintsRevealed ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm border border-yellow-100 flex items-start gap-2">
                    <span>💡</span> <span>Hint {index + 1}: {hint}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            {gameStatus === 'playing' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Who or what am I?"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <button 
                    onClick={checkAnswer}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Solve
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={revealHint}
                    disabled={hintsRevealed >= riddle.hints.length}
                    className="text-sm text-slate-500 hover:text-slate-800 font-medium disabled:opacity-50"
                  >
                    {hintsRevealed >= riddle.hints.length ? 'No more hints' : '+ Need a hint?'}
                  </button>
                  <button 
                    onClick={giveUp}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    I Give Up
                  </button>
                </div>
              </div>
            )}

            {/* Feedback / Result Area */}
            {feedback && gameStatus === 'playing' && (
              <p className="text-center font-medium animate-pulse text-indigo-600">{feedback}</p>
            )}

            {(gameStatus === 'won' || gameStatus === 'lost') && (
              <div className={`p-6 rounded-xl text-center ${gameStatus === 'won' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <h3 className={`text-2xl font-bold mb-2 ${gameStatus === 'won' ? 'text-green-800' : 'text-red-800'}`}>
                  {gameStatus === 'won' ? 'Correct! 🎉' : 'Revealed 🔓'}
                </h3>
                <p className="text-lg font-bold text-slate-800 mb-4">{riddle.answer}</p>
                <p className="text-slate-600 mb-6">{riddle.explanation}</p>
                <button 
                  onClick={startNewGame}
                  className="px-6 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
                >
                  Next Riddle
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MindGame;
