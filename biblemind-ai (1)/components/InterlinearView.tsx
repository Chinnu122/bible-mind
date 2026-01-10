import React, { useState } from 'react';
import { InterlinearData } from '../types';
import { getInterlinearAnalysis } from '../services/geminiService';

const BOOKS = [
  'Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'Revelation'
];

const InterlinearView: React.FC = () => {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState<InterlinearData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const result = await getInterlinearAnalysis(book, chapter);
      setData(result);
    } catch (e) {
      setError("Failed to load data. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!data) return;
    
    const headers = ['Verse', 'Original', 'Transliteration', 'English', 'Telugu', 'Strongs', 'Count', 'First Occur', 'Ref'];
    const rows = data.words.map(w => [
      w.verse,
      w.originalWord,
      w.transliteration,
      `"${w.englishMeaning}"`, // Quote to handle commas
      `"${w.teluguMeaning}"`,
      w.strongsNumber,
      w.occurrenceCount,
      w.isFirstOccurrence ? 'Yes' : 'No',
      w.firstOccurrenceReference || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.book}_${data.chapter}_Interlinear_Full.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Interlinear Analysis (Whole Chapter)</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Book</label>
            <select 
              value={book} 
              onChange={(e) => setBook(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-48"
            >
              {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
              <option value="Custom">Type Custom...</option>
            </select>
          </div>
          {book === 'Custom' && (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Book Name</label>
               <input 
                type="text" 
                className="px-4 py-2 border border-slate-300 rounded-lg w-48"
                onChange={(e) => setBook(e.target.value)}
               />
             </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chapter</label>
            <input 
              type="number" 
              min={1} 
              value={chapter} 
              onChange={(e) => setChapter(parseInt(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-24"
            />
          </div>
          <button 
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing Full Chapter...' : 'Analyze Chapter'}
          </button>
        </div>
        {loading && <p className="mt-2 text-sm text-slate-500 animate-pulse">Processing ancient texts... This may take a moment for longer chapters.</p>}
        {error && <p className="mt-4 text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-lg text-slate-800">{data.book} {data.chapter} ({data.language})</h3>
              <p className="text-xs text-slate-500">{data.words.length} words analyzed</p>
            </div>
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Full CSV
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">Vs</th>
                  <th className="p-4 font-semibold border-b">Original</th>
                  <th className="p-4 font-semibold border-b">Translit</th>
                  <th className="p-4 font-semibold border-b">English</th>
                  <th className="p-4 font-semibold border-b">Telugu</th>
                  <th className="p-4 font-semibold border-b">Strong's</th>
                  <th className="p-4 font-semibold border-b">Stats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {data.words.map((word, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-500">{word.verse}</td>
                    <td className="p-4 font-bold text-lg font-serif">{word.originalWord}</td>
                    <td className="p-4 italic text-slate-500">{word.transliteration}</td>
                    <td className="p-4">{word.englishMeaning}</td>
                    <td className="p-4 telugu-text font-medium text-indigo-700">{word.teluguMeaning}</td>
                    <td className="p-4 font-mono text-xs bg-slate-100 rounded text-slate-600 inline-block mt-2 px-2 py-1">{word.strongsNumber}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-xs text-slate-500">Total: {word.occurrenceCount}</span>
                        {word.isFirstOccurrence && (
                          <span 
                            className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full w-max cursor-pointer hover:bg-amber-200 transition-colors border border-amber-200"
                            onClick={() => word.firstOccurrenceReference && alert(`First Biblical Occurrence:\n${word.firstOccurrenceReference}\n\nThis is the first time the word "${word.transliteration}" appears in the Bible.`)}
                            title={word.firstOccurrenceReference ? `First found in ${word.firstOccurrenceReference}` : 'First Occurrence'}
                          >
                            First Use ↗
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterlinearView;
