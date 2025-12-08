import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Calendar, Book } from 'lucide-react';

interface NoteData {
  text: string;
  bookName: string;
  chapter: number;
  verse: number;
  updatedAt: number;
}

interface NotesPageProps {
  onBack: () => void;
}

export default function NotesPage({ onBack }: NotesPageProps) {
  const [notes, setNotes] = useState<[string, NoteData][]>([]);

  useEffect(() => {
    try {
      const allNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
      // Convert object to array and sort by date (newest first)
      const notesArray = Object.entries(allNotes) as [string, NoteData][];
      notesArray.sort((a, b) => b[1].updatedAt - a[1].updatedAt);
      setNotes(notesArray);
    } catch (e) {
      console.error('Error loading notes', e);
    }
  }, []);

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
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </button>
        <h1 className="text-3xl font-serif text-gold-100">My Study Notes</h1>
      </div>

      {notes.length === 0 ? (
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
              className="bg-[#1a1a1d] border border-white/10 rounded-xl p-6 hover:border-gold-500/30 transition-colors group"
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
                <button
                  onClick={() => deleteNote(id)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 font-serif leading-relaxed whitespace-pre-wrap">
                {note.text}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
