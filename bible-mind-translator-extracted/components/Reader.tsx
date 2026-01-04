import React, { useState } from 'react';
import { analyzeVerse } from '../services/geminiService';
import { VerseAnalysis, WordAnalysis } from '../types';
import { BookOpen, Search, Loader2, Languages, Book, X } from 'lucide-react';

const Reader: React.FC = () => {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState('1');
  const [verse, setVerse] = useState('1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VerseAnalysis | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setData(null);
    setSelectedWord(null);
    try {
      const result = await analyzeVerse(book, chapter, verse);
      setData(result);
    } catch (error) {
      alert("Failed to analyze verse. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Search/Nav Bar */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-wrap gap-4 items-center shadow-xl">
        <div className="flex items-center space-x-2 flex-grow">
            <Book className="text-purple-300 w-5 h-5" />
            <input 
              value={book} 
              onChange={(e) => setBook(e.target.value)}
              placeholder="Book (e.g. John)" 
              className="bg-transparent border-b border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 px-2 py-1 w-32"
            />
            <input 
              value={chapter} 
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Ch" 
              className="bg-transparent border-b border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 px-2 py-1 w-16"
            />
            <span className="text-white/50">:</span>
            <input 
              value={verse} 
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Vs" 
              className="bg-transparent border-b border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 px-2 py-1 w-16"
            />
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-purple-600/80 hover:bg-purple-600 text-white px-6 py-2 rounded-full backdrop-blur-sm transition-all shadow-lg shadow-purple-900/50 flex items-center space-x-2"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
          <span>Analyze</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Text View */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 overflow-y-auto shadow-2xl relative">
          {!data && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <Languages className="w-16 h-16 mb-4 opacity-50" />
              <p>Enter a reference to translate word-for-word.</p>
            </div>
          )}
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-purple-300">
               <Loader2 className="w-12 h-12 animate-spin mb-4" />
               <p className="animate-pulse">Translating ancient manuscripts...</p>
            </div>
          )}

          {data && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-3xl font-serif text-white mb-2">{data.reference}</h2>
                <p className="text-lg text-gray-300 italic">"{data.text}"</p>
              </div>

              {/* Word by Word Grid */}
              <div>
                <h3 className="text-sm uppercase tracking-widest text-purple-400 mb-4 font-bold">Word-for-Word Analysis</h3>
                <div className="flex flex-wrap gap-3">
                  {data.words.map((w, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedWord(w)}
                      className="group flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer min-w-[80px]"
                    >
                      <span className="text-xl font-serif text-purple-200 mb-1">{w.original}</span>
                      <span className="text-xs text-gray-400">{w.transliteration}</span>
                      <span className="text-xs text-purple-400/70 mt-1">{w.meanings.english}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cross References */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-2 font-bold flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" /> Cross References
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.crossReferences.map((ref, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-500/30">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Commentary */}
               <div className="bg-gradient-to-br from-amber-900/20 to-transparent p-6 rounded-2xl border border-amber-500/20">
                <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-2 font-bold">Theological Note</h3>
                <p className="text-gray-300 leading-relaxed font-serif">
                  {data.commentary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Detailed Word View */}
        <div className={`lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl transition-all ${selectedWord ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-50 lg:opacity-100 lg:translate-x-0'}`}>
          {selectedWord ? (
            <div className="space-y-6 h-full overflow-y-auto">
               <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-4xl font-serif text-white mb-1">{selectedWord.original}</h3>
                    <p className="text-purple-300 text-lg">{selectedWord.transliteration}</p>
                 </div>
                 <button onClick={() => setSelectedWord(null)} className="lg:hidden p-2 bg-white/10 rounded-full">
                   <X className="w-4 h-4 text-white" />
                 </button>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                   <span className="text-xs text-gray-500 uppercase block mb-1">Strong's</span>
                   <span className="text-white font-mono">{selectedWord.strongs}</span>
                 </div>
                 <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                   <span className="text-xs text-gray-500 uppercase block mb-1">Morphology</span>
                   <span className="text-white text-sm">{selectedWord.grammar}</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-sm uppercase tracking-widest text-gray-400 border-b border-white/10 pb-2">Multilingual Meanings</h4>
                 
                 <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-3 rounded-lg border-l-2 border-blue-500">
                      <span className="text-xs text-blue-400 block">English</span>
                      <span className="text-white text-lg">{selectedWord.meanings.english}</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-900/20 to-transparent p-3 rounded-lg border-l-2 border-green-500">
                      <span className="text-xs text-green-400 block">Telugu</span>
                      <span className="text-white text-lg font-serif">{selectedWord.meanings.telugu}</span>
                    </div>
                    <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-3 rounded-lg border-l-2 border-orange-500">
                      <span className="text-xs text-orange-400 block">Hindi</span>
                      <span className="text-white text-lg font-serif">{selectedWord.meanings.hindi}</span>
                    </div>
                    <div className="bg-gradient-to-r from-red-900/20 to-transparent p-3 rounded-lg border-l-2 border-red-500">
                      <span className="text-xs text-red-400 block">Tamil</span>
                      <span className="text-white text-lg font-serif">{selectedWord.meanings.tamil}</span>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center text-center p-6 text-white/30">
               <p>Select a word from the verse analysis to see deep lexicon details.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reader;
