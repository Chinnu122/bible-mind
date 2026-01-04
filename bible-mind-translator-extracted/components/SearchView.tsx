import React, { useState } from 'react';
import { searchBible } from '../services/geminiService';
import { Search, Loader2, Quote } from 'lucide-react';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchBible(query);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-white">Biblical Search</h2>
        <p className="text-gray-300">Search in English, Telugu, Hindi, Tamil or Transliterated.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Devudu preminchu', 'Love is patient'..."
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 pl-14 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 shadow-xl transition-all"
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-full transition-colors flex items-center"
        >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Search"}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {results.map((res, idx) => (
            <div key={idx} className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-purple-300">{res.reference}</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-200 transition-colors">
                        {res.relevance}
                    </span>
                </div>
                <div className="flex items-start">
                    <Quote className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 transform rotate-180" />
                    <p className="text-gray-200 text-lg font-serif italic">{res.text}</p>
                </div>
            </div>
        ))}
        {results.length === 0 && !loading && query && (
            <div className="text-center text-gray-500 mt-12">
                Try searching for a theme, keyword, or sentence in any supported language.
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
