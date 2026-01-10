import React, { useState } from 'react';
import { KidStory } from '../types';
import { getKidStory } from '../services/geminiService';

const CHARACTERS = ['David', 'Moses', 'Esther', 'Daniel', 'Noah', 'Jonah', 'Ruth', 'Peter', 'Paul', 'Mary'];

const KidsView: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState('');
  const [story, setStory] = useState<KidStory | null>(null);
  const [loading, setLoading] = useState(false);

  const generateStory = async (char: string) => {
    setSelectedChar(char);
    setLoading(true);
    setStory(null);
    try {
      const res = await getKidStory(char);
      setStory(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">Bible Stories for Kids</h2>
        <p className="text-slate-600 mb-8">Pick a character to read a magical story!</p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {CHARACTERS.map(char => (
            <button
              key={char}
              onClick={() => generateStory(char)}
              disabled={loading}
              className={`px-6 py-3 rounded-full font-bold shadow-sm transition-all transform hover:scale-105 ${
                selectedChar === char 
                ? 'bg-violet-600 text-white ring-4 ring-violet-200' 
                : 'bg-white text-slate-700 hover:bg-violet-50'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
           <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
           <p className="text-violet-600 font-medium animate-pulse">Writing a wonderful story...</p>
        </div>
      )}

      {story && !loading && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-violet-100">
           <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-2">{story.title}</h3>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Ages: {story.ageGroup}</span>
           </div>
           <div className="p-8 space-y-6">
              <div className="prose prose-lg text-slate-700 leading-loose font-medium">
                {story.storyText.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-100 flex gap-4 items-start">
                 <span className="text-3xl">💡</span>
                 <div>
                    <h4 className="font-bold text-yellow-800 mb-1">Moral of the Story</h4>
                    <p className="text-yellow-700">{story.moral}</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default KidsView;
