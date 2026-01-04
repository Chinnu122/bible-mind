import React, { useState } from 'react';
import NebulaBackground from './components/NebulaBackground';
import Reader from './components/Reader';
import StoryView from './components/StoryView';
import SearchView from './components/SearchView';
import NotesView from './components/NotesView';
import { User, AppMode } from './types';
import { Book, Feather, Search, BookOpen, LogIn, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: '', isLoggedIn: false });
  const [mode, setMode] = useState<AppMode>(AppMode.READER);
  const [loginInput, setLoginInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(loginInput.trim()) {
        setUser({ username: loginInput, isLoggedIn: true });
        setMode(AppMode.READER);
    }
  };

  const handleLogout = () => {
    setUser({ username: '', isLoggedIn: false });
    setMode(AppMode.READER);
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-purple-500/30">
      <NebulaBackground />
      
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="font-serif font-bold text-white">B</span>
             </div>
             <span className="font-serif text-xl tracking-wide font-medium text-white hidden sm:block">BibleMind</span>
          </div>

          <div className="flex space-x-1 sm:space-x-2">
            <NavButton active={mode === AppMode.READER} onClick={() => setMode(AppMode.READER)} icon={<Book className="w-4 h-4" />} label="Read" />
            <NavButton active={mode === AppMode.SEARCH} onClick={() => setMode(AppMode.SEARCH)} icon={<Search className="w-4 h-4" />} label="Search" />
            <NavButton active={mode === AppMode.STORY} onClick={() => setMode(AppMode.STORY)} icon={<Feather className="w-4 h-4" />} label="Kids" />
            {user.isLoggedIn && (
                <NavButton active={mode === AppMode.NOTES} onClick={() => setMode(AppMode.NOTES)} icon={<BookOpen className="w-4 h-4" />} label="Notes" />
            )}
          </div>

          <div>
             {user.isLoggedIn ? (
                 <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400 hidden md:block">Hi, {user.username}</span>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                 </div>
             ) : (
                 <button onClick={() => setMode(AppMode.LOGIN)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-sm transition-all border border-white/5">
                    Sign In
                 </button>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-10 px-4 h-screen max-w-7xl mx-auto">
         <div className="h-full">
            {mode === AppMode.READER && <Reader />}
            {mode === AppMode.SEARCH && <SearchView />}
            {mode === AppMode.STORY && <StoryView />}
            {mode === AppMode.NOTES && <NotesView username={user.username} />}
            
            {mode === AppMode.LOGIN && (
                <div className="flex items-center justify-center h-full">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl text-center">
                        <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <UserIcon className="w-8 h-8 text-purple-300" />
                        </div>
                        <h2 className="text-3xl font-serif text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 mb-8">Sign in to access your personal study notes.</p>
                        
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input 
                                type="text"
                                value={loginInput}
                                onChange={(e) => setLoginInput(e.target.value)}
                                placeholder="Enter Username"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/30">
                                Enter Sanctuary
                            </button>
                        </form>
                    </div>
                </div>
            )}
         </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${active ? 'bg-white/15 text-white shadow-inner border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);

export default App;
