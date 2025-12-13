import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  date: string;
  color: string;
}

const NOTE_COLORS = [
  'bg-slate-800', // Default Dark
  'bg-slate-700', // Light Dark
  'bg-royal-900', // Blue Tint
  'bg-gold-900',  // Gold Tint
];

export default function NotesPage({ onBack: _onBack }: { onBack: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    const saved = localStorage.getItem('bible-mind-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('bible-mind-notes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newNoteText,
      date: new Date().toLocaleDateString(),
      color: selectedColor
    };

    saveNotes([note, ...notes]);
    setNewNoteText('');
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-editorial text-crema-50">.Notes</h1>
          <p className="text-slate-400 text-sm mt-1">Capture your revelations</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-crema-100 text-slate-900 px-5 py-2.5 rounded-full font-medium hover:bg-white transition-colors shadow-lg shadow-crema-500/10"
        >
          <Plus size={18} />
          New Note
        </button>
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
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${color} border-2 transition-all ${selectedColor === color ? 'border-crema-100 scale-110' : 'border-transparent hover:scale-110'}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-400 hover:text-crema-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="px-6 py-2 bg-gold-400 text-black rounded-lg font-medium hover:bg-gold-300 transition-colors"
                >
                  Save Note
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
              className={`relative group p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-md transition-all ${note.color} h-fit min-h-[200px] flex flex-col justify-between`}
            >
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
          </div>
        )}
      </div>
    </div>
  );
}
