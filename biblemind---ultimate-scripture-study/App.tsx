import React, { useState, useEffect, createContext, useContext } from 'react';
import Layout from './components/Layout';
import Intro from './components/Intro';
import { User, Note, DailyContent, Story, InterlinearResponse, StudySession, VocabularyItem } from './types';
import * as GeminiService from './services/geminiService';
import { BookOpen, Sparkles, Feather, Bookmark, Search, PlayCircle, Mic, Share2, Save, ArrowRight, Loader2, User as UserIcon, Download, FileText } from 'lucide-react';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  addNote: (note: Note) => void;
  notes: Note[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- Sub-Components (Views) ---

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-12 text-amber-500">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="text-sm uppercase tracking-widest opacity-80">Consulting Divine Wisdom...</p>
  </div>
);

const HomeView: React.FC = () => {
  const [daily, setDaily] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GeminiService.fetchDailyContent().then(data => {
      setDaily(data);
      setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold serif-font mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
          Daily Inspiration
        </h2>
        <p className="text-slate-400">Start your day with the Word of God</p>
      </header>

      {daily && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Verse Card */}
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <BookOpen className="w-32 h-32" />
             </div>
             <h3 className="text-xl font-bold text-amber-500 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Verse of the Day
             </h3>
             <blockquote className="relative z-10">
               <p className="text-2xl serif-font leading-relaxed mb-4">"{daily.verse.text_english}"</p>
               <p className="text-lg telugu-font text-slate-300 mb-6 leading-loose">{daily.verse.text_telugu}</p>
               <footer className="text-amber-400 font-bold text-right">— {daily.verse.reference}</footer>
             </blockquote>
          </div>

          {/* Character Card */}
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <UserIcon className="w-32 h-32" />
             </div>
             <h3 className="text-xl font-bold text-indigo-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                <UserIcon className="w-5 h-5" /> Character Focus
             </h3>
             <div className="relative z-10">
               <h4 className="text-3xl font-bold mb-3">{daily.character.name}</h4>
               <p className="text-slate-300 mb-6 leading-relaxed">{daily.character.summary}</p>
               <div className="inline-block px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-sm">
                 Key Ref: {daily.character.key_reference}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InterlinearView: React.FC = () => {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<InterlinearResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;
    setLoading(true);
    setResult(null);
    
    // Simple heuristic for OT vs NT
    const otBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "Samuel", "Kings", "Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];
    const isOT = otBooks.some(book => reference.includes(book));
    
    try {
      const data = await GeminiService.fetchInterlinear(reference, isOT);
      setResult(data);
    } catch (err) {
      alert("Failed to fetch translation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold serif-font text-white mb-2">Original Languages Interlinear</h2>
        <p className="text-slate-400">Word-for-word translation: Hebrew/Greek to Telugu & English</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
        <input 
          type="text" 
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Enter reference (e.g., Genesis 1:1, John 3:16)"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none transition"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          Analyze
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="animate-slide-up space-y-8">
           <div className="glass-panel p-6 rounded-xl border-l-4 border-amber-500">
              <h3 className="text-2xl font-bold mb-4">{result.reference}</h3>
              <p className="text-lg text-slate-200 mb-2 font-serif">{result.translation_english}</p>
              <p className="text-lg telugu-font text-amber-200/90">{result.translation_telugu}</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {result.words.map((word, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-amber-500/50 transition group">
                   <div className="text-center mb-3">
                      <span className="text-2xl font-bold text-amber-100 serif-font block mb-1">{word.original}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">{word.transliteration}</span>
                   </div>
                   <div className="space-y-1 text-center border-t border-slate-700 pt-3">
                      <p className="font-bold text-indigo-300 text-sm">{word.english}</p>
                      <p className="telugu-font text-emerald-300 text-sm">{word.telugu}</p>
                      <p className="text-xs text-slate-500 italic mt-2">{word.grammar}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const WordListView: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);

  const otBooks = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", 
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", 
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ];

  const handleBookClick = async (book: string) => {
    setSelectedBook(book);
    setLoading(true);
    setVocabulary([]);
    try {
      const data = await GeminiService.fetchBookVocabulary(book);
      setVocabulary(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch vocabulary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (vocabulary.length === 0) return;

    // CSV Header
    const headers = ["Hebrew", "English", "Telugu", "Hindi", "Occurrences"];
    
    // CSV Content
    const csvRows = [
      headers.join(","), // header row
      ...vocabulary.map(row => {
        // Escape quotes to prevent CSV breakage
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
        return [
          escape(row.hebrew),
          escape(row.english),
          escape(row.telugu),
          escape(row.hindi),
          escape(row.occurrences)
        ].join(",");
      })
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedBook}_vocabulary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold serif-font text-white mb-2">Hebrew Vocabulary Builder</h2>
        <p className="text-slate-400">Select an Old Testament book to generate a word list and download as CSV.</p>
      </div>

      {!selectedBook ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {otBooks.map(book => (
            <button
              key={book}
              onClick={() => handleBookClick(book)}
              className="bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-200 p-4 rounded-lg transition font-medium text-sm text-center"
            >
              {book}
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSelectedBook(null)}
              className="text-slate-400 hover:text-white flex items-center gap-2"
            >
              ← Back to Books
            </button>
            <h3 className="text-2xl font-bold text-amber-500 serif-font">{selectedBook}</h3>
            {vocabulary.length > 0 && (
              <button 
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-green-900/20"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            )}
          </div>

          {loading ? (
             <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">Hebrew</th>
                    <th className="px-6 py-4">English</th>
                    <th className="px-6 py-4">Telugu (తెలుగు)</th>
                    <th className="px-6 py-4">Hindi (हिंदी)</th>
                    <th className="px-6 py-4">Occurrences</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50 backdrop-blur-sm">
                  {vocabulary.map((word, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 font-bold text-xl text-amber-100 serif-font">{word.hebrew}</td>
                      <td className="px-6 py-4 text-indigo-200">{word.english}</td>
                      <td className="px-6 py-4 telugu-font text-emerald-300">{word.telugu}</td>
                      <td className="px-6 py-4">{word.hindi}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 bg-slate-950/30 rounded inline-block m-4 px-2 py-1">{word.occurrences}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StoriesView: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);

  const characters = ["David", "Moses", "Esther", "Noah", "Daniel", "Jonah", "Jesus", "Paul"];

  const generateStory = async (char: string) => {
    setSelectedChar(char);
    setLoading(true);
    setStory(null);
    try {
      const data = await GeminiService.fetchStory(char);
      setStory(data);
    } catch (e) {
       console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div className="text-center">
        <h2 className="text-4xl font-bold serif-font text-amber-400 mb-2 drop-shadow-lg">Bible Kids Storybook</h2>
        <p className="text-slate-300">Choose a hero to hear their adventure!</p>
      </div>

      {!story && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {characters.map((char) => (
            <button 
              key={char}
              onClick={() => generateStory(char)}
              className="aspect-square glass-panel rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-amber-500/20 hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-amber-400 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 transition">
                 <span className="text-2xl">📜</span>
              </div>
              <span className="font-bold text-xl">{char}</span>
            </button>
          ))}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {story && (
        <div className="max-w-3xl mx-auto animate-fade-in">
           <button onClick={() => setStory(null)} className="mb-4 text-slate-400 hover:text-white flex items-center gap-2">
             ← Back to Characters
           </button>
           <div className="bg-[#fff9e6] text-slate-900 p-8 md:p-12 rounded-lg shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-4 bg-amber-500/50 rounded-t-lg"></div>
              <h1 className="text-3xl font-bold serif-font text-amber-800 mb-6 text-center">{story.title}</h1>
              <div className="prose prose-lg text-slate-700 leading-loose mb-8 whitespace-pre-line">
                {story.content}
              </div>
              <div className="bg-amber-100 p-6 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-800 uppercase text-sm tracking-wide mb-2">Lesson for us:</h4>
                <p className="italic text-amber-900 font-medium">{story.moral}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StudyView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [study, setStudy] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await GeminiService.fetchStudy(topic);
      setStudy(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold serif-font mb-4">Deep Dive Bible Study</h2>
        <div className="flex gap-2 max-w-xl mx-auto">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g. Grace, Salvation, Romans 8)"
            className="flex-1 bg-slate-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleCreate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold">
             {loading ? 'Creating...' : 'Start Study'}
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {study && (
        <div className="glass-panel p-8 md:p-12 rounded-2xl animate-fade-in">
           <div className="flex justify-between items-start border-b border-slate-700 pb-6 mb-6">
              <h1 className="text-3xl font-bold serif-font text-amber-400">{study.topic}</h1>
              <span className="bg-indigo-900 text-indigo-200 px-3 py-1 rounded text-sm uppercase tracking-wider">Weekly Study</span>
           </div>
           
           <div className="space-y-6 text-lg leading-relaxed text-slate-300">
              {study.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
           </div>

           <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-700">
              <div>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" /> References
                </h4>
                <ul className="space-y-2">
                  {study.references.map((ref, i) => (
                    <li key={i} className="text-indigo-300 hover:text-indigo-200 cursor-pointer transition">
                      • {ref}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Feather className="w-5 h-5 text-amber-500" /> Reflection
                </h4>
                <ul className="space-y-3">
                  {study.questions.map((q, i) => (
                    <li key={i} className="bg-slate-800/50 p-3 rounded-lg text-sm text-slate-300 italic">
                      "{q}"
                    </li>
                  ))}
                </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const NotesView: React.FC = () => {
  const { notes, addNote, user } = useAuth();
  const [newNote, setNewNote] = useState('');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <UserIcon className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Please Sign In</h3>
        <p className="text-slate-400">You need to be logged in to access and save your notes.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!newNote.trim()) return;
    addNote({
      id: Date.now().toString(),
      timestamp: Date.now(),
      reference: 'General Note',
      content: newNote
    });
    setNewNote('');
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
           <Feather className="w-5 h-5 text-amber-500" /> Saved Notes
        </h3>
        <div className="space-y-3 h-[70vh] overflow-y-auto pr-2">
           {notes.length === 0 && <p className="text-slate-500 italic">No notes yet.</p>}
           {notes.map(note => (
             <div key={note.id} className="glass-panel p-4 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                <p className="text-xs text-slate-500 mb-1">{new Date(note.timestamp).toLocaleDateString()}</p>
                <p className="line-clamp-3 text-sm text-slate-300">{note.content}</p>
             </div>
           ))}
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="glass-panel p-6 rounded-xl h-full flex flex-col">
          <textarea
            className="flex-1 bg-transparent border-none outline-none resize-none text-lg text-slate-200 placeholder-slate-600 font-serif leading-relaxed"
            placeholder="Write your thoughts, prayers, or revelations here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end pt-4 border-t border-slate-700/50">
             <button 
               onClick={handleSave}
               className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition"
             >
               <Save className="w-4 h-4" /> Save Note
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileAuthView: React.FC = () => {
  const { user, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.name || 'User', formData.email);
  };

  if (user) {
    return (
      <div className="text-center p-12">
        <h2 className="text-3xl font-bold mb-4">Welcome back, {user.name}!</h2>
        <p className="text-slate-400">You are logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">{isLogin ? 'Sign In to BibleMind' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input 
              type="text" 
              required={!isLogin}
              className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:border-amber-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            required
            className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:border-amber-500 outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-bold transition">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-indigo-300">
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('biblemind_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      const savedNotes = localStorage.getItem(`biblemind_notes_${JSON.parse(savedUser).id}`);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const login = (name: string, email: string) => {
    const newUser = { id: email, name, email, savedVerses: [] };
    setUser(newUser);
    localStorage.setItem('biblemind_user', JSON.stringify(newUser));
    // Load notes for this user
    const savedNotes = localStorage.getItem(`biblemind_notes_${email}`);
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    else setNotes([]);
    setActiveTab('home');
  };

  const logout = () => {
    setUser(null);
    setNotes([]);
    localStorage.removeItem('biblemind_user');
    setActiveTab('home');
  };

  const addNote = (note: Note) => {
    if (!user) return;
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`biblemind_notes_${user.id}`, JSON.stringify(updatedNotes));
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomeView />;
      case 'interlinear': return <InterlinearView />;
      case 'wordlist': return <WordListView />;
      case 'stories': return <StoriesView />;
      case 'study': return <StudyView />;
      case 'notes': return <NotesView />;
      case 'profile': return <ProfileAuthView />;
      default: return <HomeView />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addNote, notes }}>
      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}
      <div className={`${!introComplete ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
