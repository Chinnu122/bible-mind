import React, { useState } from 'react';
import { BibleStudyData } from '../types';
import { getBibleStudy } from '../services/geminiService';

const StudyView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [studyData, setStudyData] = useState<BibleStudyData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStudy = async () => {
    if (!topic) return;
    setLoading(true);
    setStudyData(null);
    try {
      const result = await getBibleStudy(topic);
      setStudyData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Sermon & Bible Study Assistant</h2>
        <p className="text-slate-500">Enter a topic, verse, or theme to generate a structured study guide.</p>
        
        <div className="flex gap-2 justify-center max-w-lg mx-auto">
          <input 
            type="text"
            placeholder="e.g., Grace of God, Romans 8, The Life of David"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStudy()}
          />
          <button 
            onClick={handleStudy}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-70"
          >
            {loading ? 'Researching...' : 'Study'}
          </button>
        </div>
      </div>

      {studyData && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 animate-fade-in">
          <div className="border-b border-indigo-100 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{studyData.title}</h1>
            <p className="text-indigo-600 font-medium text-lg">{studyData.mainPassage}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">01</span>
                Introduction
              </h3>
              <p className="text-slate-700 leading-relaxed pl-10">{studyData.introduction}</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">02</span>
                Key Points
              </h3>
              <div className="grid gap-4 pl-10">
                {studyData.keyPoints.map((kp, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-800 mb-1">{kp.point}</p>
                    <p className="text-sm text-indigo-500 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded">{kp.reference}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Cross References</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 bg-slate-50 p-4 rounded-lg">
                    {studyData.crossReferences.map((ref, idx) => (
                      <li key={idx} className="hover:text-indigo-600 cursor-pointer">{ref}</li>
                    ))}
                  </ul>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Conclusion</h3>
                  <p className="text-slate-700 bg-amber-50 p-4 rounded-lg border border-amber-100 italic">
                    {studyData.conclusion}
                  </p>
               </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyView;
