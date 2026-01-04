import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { PenTool, Trash2, Plus, Save } from 'lucide-react';

interface NotesViewProps {
    username: string;
}

const NotesView: React.FC<NotesViewProps> = ({ username }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editRef, setEditRef] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(`bible_notes_${username}`);
        if (saved) {
            setNotes(JSON.parse(saved));
        }
    }, [username]);

    const saveNotes = (updatedNotes: Note[]) => {
        setNotes(updatedNotes);
        localStorage.setItem(`bible_notes_${username}`, JSON.stringify(updatedNotes));
    };

    const handleCreate = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            reference: 'New Note',
            content: '',
            timestamp: Date.now()
        };
        saveNotes([newNote, ...notes]);
        setActiveNote(newNote.id);
        setEditContent('');
        setEditRef('New Note');
    };

    const handleSaveActive = () => {
        if (!activeNote) return;
        const updated = notes.map(n => n.id === activeNote ? { ...n, content: editContent, reference: editRef } : n);
        saveNotes(updated);
        // Visual feedback could go here
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = notes.filter(n => n.id !== id);
        saveNotes(updated);
        if (activeNote === id) setActiveNote(null);
    };

    const selectNote = (note: Note) => {
        setActiveNote(note.id);
        setEditRef(note.reference);
        setEditContent(note.content);
    };

    return (
        <div className="h-full flex gap-6">
            {/* Sidebar List */}
            <div className="w-1/3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <PenTool className="w-5 h-5 mr-2" /> My Notes
                    </h2>
                    <button onClick={handleCreate} className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-grow space-y-2 pr-2 custom-scrollbar">
                    {notes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => selectNote(note)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all group ${activeNote === note.id ? 'bg-white/10 border-purple-500/50' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-200 truncate">{note.reference}</span>
                                <button onClick={(e) => handleDelete(note.id, e)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">{note.content || "Empty note..."}</p>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="text-center text-gray-600 mt-10 text-sm">No notes yet.</div>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="w-2/3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col relative">
                {activeNote ? (
                    <>
                        <input 
                            value={editRef}
                            onChange={(e) => setEditRef(e.target.value)}
                            className="bg-transparent text-2xl font-serif text-white mb-4 focus:outline-none border-b border-transparent focus:border-white/20 pb-2"
                            placeholder="Reference / Title"
                        />
                        <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-grow bg-transparent text-gray-300 resize-none focus:outline-none font-sans text-lg leading-relaxed"
                            placeholder="Write your revelation here..."
                        />
                        <button 
                            onClick={handleSaveActive}
                            className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-all"
                        >
                            <Save className="w-4 h-4 mr-2" /> Save Note
                        </button>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Select a note or create a new one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesView;
