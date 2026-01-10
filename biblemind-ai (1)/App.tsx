import React, { useState } from 'react';
import { AppTab } from './types';
import InterlinearView from './components/InterlinearView';
import StudyView from './components/StudyView';
import KidsView from './components/KidsView';
import Puzzles from './components/Puzzles';
import MindGame from './components/MindGame';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INTERLINEAR);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                BibleMind AI
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {[
                { id: AppTab.INTERLINEAR, label: 'Interlinear', icon: '📖' },
                { id: AppTab.STUDY, label: 'Bible Study', icon: '✝️' },
                { id: AppTab.KIDS, label: 'Kids', icon: '🎈' },
                { id: AppTab.PUZZLES, label: 'Quiz', icon: '🧩' },
                { id: AppTab.MIND_GAME, label: 'Mind Game', icon: '🧠' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-slate-100 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
            {/* Mobile menu placeholer - keeping simple for this demo */}
            <div className="md:hidden text-xs text-slate-400">Desktop View Recommended</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in-up">
          {activeTab === AppTab.INTERLINEAR && <InterlinearView />}
          {activeTab === AppTab.STUDY && <StudyView />}
          {activeTab === AppTab.KIDS && <KidsView />}
          {activeTab === AppTab.PUZZLES && <Puzzles />}
          {activeTab === AppTab.MIND_GAME && <MindGame />}
        </div>
      </main>

      {/* Mobile Tab Bar (Sticky Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around z-50 overflow-x-auto">
        {[
            { id: AppTab.INTERLINEAR, label: 'Text', icon: '📖' },
            { id: AppTab.STUDY, label: 'Study', icon: '✝️' },
            { id: AppTab.KIDS, label: 'Kids', icon: '🎈' },
            { id: AppTab.PUZZLES, label: 'Quiz', icon: '🧩' },
            { id: AppTab.MIND_GAME, label: 'Mind', icon: '🧠' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium whitespace-nowrap">{tab.label}</span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default App;
