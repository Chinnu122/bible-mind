import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, StickyNote, Lock, Loader2, RefreshCw, Cloud, CloudOff, User, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Note {
  id: string;
  userId: string;
  verseRef?: string;
  bookId?: number;
  chapter?: number;
  verse?: number;
  text: string;
  highlightColor?: string;
  isPublic?: boolean;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  // Local display properties
  color?: string;
  date?: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface NotesPageProps {
  onBack: () => void;
  onNavigateToAuth?: () => void;
}

const NOTE_COLORS = [
  { bg: 'bg-slate-800', hex: '#1e293b' },
  { bg: 'bg-slate-700', hex: '#334155' },
  { bg: 'bg-royal-900', hex: '#1e3a5f' },
  { bg: 'bg-gold-900', hex: '#78350f' },
  { bg: 'bg-emerald-900', hex: '#064e3b' },
  { bg: 'bg-purple-900', hex: '#581c87' },
];

export default function NotesPage({ onBack: _onBack, onNavigateToAuth }: NotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Check for logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem('bible-mind-user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Handle both old format (direct user object) and new format ({ user, tokens })
        const userData = parsed.user || parsed;
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user data', e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const getAuthToken = () => {
    const savedUser = localStorage.getItem('bible-mind-user');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return parsed.tokens?.accessToken || null;
    } catch {
      return null;
    }
  };

  // Load notes from server when user is available
  const loadNotes = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = getAuthToken();
      // If no token, maybe fall back to local or error? For now assume token exists if user exists (after migration)
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/notes`, { headers }); // Updated: uses base /notes endpoint which gets userId from token
      // Note: Original code used /notes/:userId. My new backend uses /notes (and gets user from token).
      // I should align them. My new backend route is router.get('/', ...).
      // So fetch(`${API_BASE_URL}/notes`) is correct.

      const data = await response.json();

      if (data.success && data.data) {
        // Transform server notes to local format
        const serverNotes = data.data.map((note: Note) => ({
          ...note,
          color: NOTE_COLORS.find(c => c.hex === note.highlightColor)?.bg || NOTE_COLORS[0].bg,
          date: new Date(note.createdAt).toLocaleDateString()
        }));
        setNotes(serverNotes);
        setSynced(true);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      // Fall back to local storage
      const saved = localStorage.getItem(`bible-mind-notes-${user.id}`);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
      setSynced(false);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadNotes();
    }
  }, [user?.id, loadNotes]);

  // Save note to server
  const saveNoteToServer = async (noteData: {
    text: string;
    highlightColor: string;
  }): Promise<Note | null> => {
    if (!user?.id) return null;

    setSaving(true);
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: user.id, // Redundant but harmless if backend ignores it (backend uses token)
          text: noteData.text,
          highlightColor: noteData.highlightColor,
          bookId: 1, // Defaulting to Gen 1:1 for general notes if required, or handle 0 in backend
          chapter: 1,
          verse: 1,
          verseRef: 'General Note',
          authorName: user.name,
          isPublic: false
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSynced(true);
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to save note to server:', error);
      setSynced(false);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete note from server
  const deleteNoteFromServer = async (noteId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, { // Backend doesn't need userId in query
        method: 'DELETE',
        headers
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Failed to delete note from server:', error);
      setSynced(false);
      return false;
    }
  };

  // Local storage backup
  const saveToLocalStorage = (updatedNotes: Note[]) => {
    if (user?.id) {
      localStorage.setItem(`bible-mind-notes-${user.id}`, JSON.stringify(updatedNotes));
    }
  };

  const addNote = async () => {
    if (!newNoteText.trim() || !user) return;

    const savedNote = await saveNoteToServer({
      text: newNoteText,
      highlightColor: selectedColor.hex
    });

    if (savedNote) {
      const newNote: Note = {
        ...savedNote,
        color: selectedColor.bg,
        date: new Date().toLocaleDateString()
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
    } else {
      // Local fallback
      const localNote: Note = {
        id: Date.now().toString(),
        userId: user.id,
        text: newNoteText,
        highlightColor: selectedColor.hex,
        color: selectedColor.bg,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedNotes = [localNote, ...notes];
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
    }

    setNewNoteText('');
    setIsAdding(false);
  };

  const deleteNote = async (id: string) => {
    const success = await deleteNoteFromServer(id);

    // Remove from local state regardless (optimistic update)
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);

    if (!success) {
      setSynced(false);
    }
  };

  // Not logged in - Show auth prompt
  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold-500/20 to-amber-500/20 border border-gold-500/30 flex items-center justify-center"
          >
            <Lock size={40} className="text-gold-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-editorial text-crema-50 mb-3">
            Personal Notes
          </h1>

          <p className="text-slate-400 mb-8 leading-relaxed">
            Sign in to access your personal notes. Your notes are securely saved and synced across all your devices.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 mb-8 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Cloud size={20} className="text-gold-400" />
              <span className="text-sm text-slate-300">Cloud sync across devices</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <StickyNote size={20} className="text-gold-400" />
              <span className="text-sm text-slate-300">Organize your Bible study notes</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Lock size={20} className="text-gold-400" />
              <span className="text-sm text-slate-300">Private & secure storage</span>
            </div>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateToAuth?.()}
            className="w-full py-4 bg-gradient-to-r from-gold-500 to-amber-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
          >
            <User size={20} />
            <span>Sign In to Access Notes</span>
            <ArrowRight size={18} />
          </motion.button>

          <p className="text-xs text-slate-500 mt-4">
            Don't have an account? You can create one for free.
          </p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  // Logged in - Show notes
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-editorial text-crema-50">.Notes</h1>
            {/* Sync status indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${synced ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {synced ? <Cloud size={12} /> : <CloudOff size={12} />}
              {synced ? 'Synced' : 'Offline'}
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Welcome, {user.name}! Your revelations are saved securely.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadNotes}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-gold-400 transition-colors"
            title="Refresh notes"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-crema-100 text-slate-900 px-5 py-2.5 rounded-full font-medium hover:bg-white transition-colors shadow-lg shadow-crema-500/10"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>
      </div>

      {/* Add Note Modal/Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 rounded-2xl bg-slate-800 border border-white/10 shadow-xl"
          >
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write something profound..."
              className="w-full bg-transparent text-crema-50 placeholder-slate-500 focus:outline-none resize-none min-h-[120px] mb-4 text-lg font-serif"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {NOTE_COLORS.map(color => (
                  <button
                    key={color.bg}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${color.bg} border-2 transition-all ${selectedColor.bg === color.bg ? 'border-crema-100 scale-110' : 'border-transparent hover:scale-110'}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-400 hover:text-crema-100 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  disabled={saving || !newNoteText.trim()}
                  className="px-6 py-2 bg-gold-400 text-black rounded-lg font-medium hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid (Masonry-ish) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={`relative group p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-md transition-all ${note.color || 'bg-slate-800'} h-fit min-h-[200px] flex flex-col justify-between`}
            >
              {note.verseRef && note.verseRef !== 'General Note' && (
                <div className="text-xs text-gold-400/70 mb-2 font-mono">{note.verseRef}</div>
              )}
              <p className="text-crema-100 whitespace-pre-wrap leading-relaxed mb-8 font-serif text-lg">
                {note.text}
              </p>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-mono uppercase tracking-wider">{note.date}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-2 hover:bg-black/20 rounded-full text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && !isAdding && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600">
            <StickyNote size={48} className="mb-4 opacity-50" />
            <p>Your collection is empty.</p>
            <p className="text-sm mt-2">Start capturing your revelations!</p>
          </div>
        )}
      </div>
    </div>
  );
}
