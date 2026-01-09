import React, { useState } from 'react';
import { BookOpen, Home, Feather, User, Menu, X, Scroll, Sun, BookMarked, FileText } from 'lucide-react';
import { useAuth } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'interlinear', label: 'Interlinear', icon: BookOpen },
    { id: 'wordlist', label: 'Word Lists (CSV)', icon: FileText },
    { id: 'stories', label: 'Kids Stories', icon: Sun },
    { id: 'study', label: 'Bible Study', icon: Scroll },
    { id: 'notes', label: 'My Notes', icon: Feather },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
           <BookMarked className="w-6 h-6 text-amber-500" />
           <span className="font-bold text-lg serif-font text-amber-500">BibleMind</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <BookMarked className="w-8 h-8 text-amber-500" />
          <span className="font-bold text-2xl serif-font text-amber-500">BibleMind</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-500/10 shadow-lg' 
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {user ? (
            <div className="glass-panel p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
             <button 
               onClick={() => setActiveTab('profile')}
               className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition font-bold"
             >
               <User className="w-4 h-4" />
               Sign In
             </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[url('https://images.unsplash.com/photo-1507692863980-46a489fc3f4d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-fixed">
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-0 pointer-events-none"></div>
        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
