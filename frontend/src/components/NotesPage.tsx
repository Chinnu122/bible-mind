import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Calendar, Book, Share2, Check } from 'lucide-react';
import { copyShareableLink, checkAndImportSharedNotes } from '../utils/deviceSync';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface NoteData {
  text: string;
  bookName: string;
  chapter: number;
  verse: number;
  updatedAt: number;
}

interface PublicNote {
  id: string;
  authorName: string;
  text: string;
  verseRef: string;
  bookId: number;
  chapter: number;
  verse: number;
  createdAt: string;
}

interface NotesPageProps {
  onBack: () => void;
}

export default function NotesPage({ onBack }: NotesPageProps) {
  const [notes, setNotes] = useState<[string, NoteData][]>([]);
  const [publicNotes, setPublicNotes] = useState<PublicNote[]>([]);
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [importedNotes, setImportedNotes] = useState(false);
  const [loadingPublic, setLoadingPublic] = useState(false);

  useEffect(() => {
    // Check for shared notes on load
    checkAndImportSharedNotes().then(imported => {
      if (imported) {
        setImportedNotes(true);
        setTimeout(() => setImportedNotes(false), 3000);
      }
    });

    // Load notes
    try {
      const allNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
      const notesArray = Object.entries(allNotes) as [string, NoteData][];
      notesArray.sort((a, b) => b[1].updatedAt - a[1].updatedAt);
      setNotes(notesArray);
    } catch (e) {
      console.error('Error loading notes', e);
    }

    // Load public notes
    fetchPublicNotes();
  }, []);

  const fetchPublicNotes = async () => {
    try {
      setLoadingPublic(true);
      const res = await fetch(`${API_BASE_URL}/notes/public`);
      const json = await res.json();
      if (json.success) {
        setPublicNotes(json.data);
      }
    } catch (e) {
      console.error('Error fetching public notes', e);
    } finally {
      setLoadingPublic(false);
    }
  };

  const shareToCommunity = async (noteData: NoteData) => {
    if (!confirm('Share this note publicly with the community?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous', // Or real user ID if auth
          text: noteData.text,
          verseRef: `${noteData.bookName} ${noteData.chapter}:${noteData.verse}`,
          bookId: 1, // Need real bookId mapping, preventing for now or using 0
          chapter: noteData.chapter,
          verse: noteData.verse,
          isPublic: true,
          authorName: 'Community Member'
        })
      });

      if (res.ok) {
        alert('Note shared to community!');
        fetchPublicNotes();
        setActiveTab('public');
      }
    } catch (e) {
      console.error('Error sharing note', e);
      alert('Failed to share note');
    }
  };

  const handleShare = async () => {
    const success = await copyShareableLink();
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const deleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const allNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
        delete allNotes[id];
        localStorage.setItem('bible-notes', JSON.stringify(allNotes));
        setNotes(prev => prev.filter(n => n[0] !== id));
      } catch (e) {
        console.error('Error deleting note', e);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 px-4 md:px-12 max-w-5xl mx-auto pb-20 min-h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gold-400" />
          </button>
          <h1 className="text-3xl font-serif text-gold-100">Study Notes</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'private' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            My Notes
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'public' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            <Share2 className="w-4 h-4" /> Community
          </button>
        </div>

        {activeTab === 'private' && notes.length > 0 && (
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${shareSuccess
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gold-500/20 text-gold-300 border border-gold-500/30 hover:bg-gold-500/30'
              }`}
          >
            {shareSuccess ? (
              <><Check className="w-4 h-4" /> Link Copied!</>
            ) : (
              <><Share2 className="w-4 h-4" /> Share All</>
            )}
          </button>
        )}
      </div>

      {importedNotes && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-300">
          ✓ Notes imported from shared link!
        </div>
      )}

      {/* Notes Content */}
      {activeTab === 'private' ? (
        notes.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <Book className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-400 font-serif mb-2">No notes yet</h3>
            <p className="text-gray-500">
              Start reading and add notes to verses to see them here.
            </p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-2 bg-gold-500/20 text-gold-300 rounded-lg hover:bg-gold-500/30 transition-colors"
            >
              Start Reading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map(([id, note]) => (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1d] border border-white/10 rounded-xl p-6 hover:border-gold-500/30 transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-serif text-gold-300">
                      {note.bookName} {note.chapter}:{note.verse}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => shareToCommunity(note)}
                      className="p-2 text-gray-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Share to Community"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(id)}
                      className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 font-serif leading-relaxed whitespace-pre-wrap">
                  {note.text}
                </p>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* Public Notes View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingPublic ? (
            <div className="col-span-2 text-center text-white py-10">Loading community notes...</div>
          ) : publicNotes.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-10">No community notes yet. Share yours!</div>
          ) : (
            publicNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-serif text-blue-300">
                      {note.verseRef}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      by {note.authorName} • {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 font-serif leading-relaxed">
                  {note.text}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
