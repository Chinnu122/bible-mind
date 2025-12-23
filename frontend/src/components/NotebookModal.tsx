import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Download, Check, Book } from 'lucide-react';
import html2canvas from 'html2canvas';

interface NotebookModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle: string;
    bookId: number;
}

const NotebookModal: React.FC<NotebookModalProps> = ({ isOpen, onClose, bookTitle, bookId }) => {
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedNote = localStorage.getItem(`book-note-${bookId}`);
            if (savedNote) setNote(savedNote);
            else setNote('');
        }
    }, [isOpen, bookId]);

    const handleSave = () => {
        localStorage.setItem(`book-note-${bookId}`, note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDownload = async () => {
        setDownloading(true);
        const element = document.getElementById('book-note-card');
        if (element) {
            try {
                const canvas = await html2canvas(element, { scale: 2, backgroundColor: null } as any);
                const link = document.createElement('a');
                link.download = `${bookTitle}_Notes.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                console.error("Download failed:", err);
            }
        }
        setDownloading(false);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#1a1a1a] border border-gold-500/20 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-gold-500/10 rounded-full text-white/70 hover:text-gold-400 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left: The Visual Card (Capture Target) */}
                <div
                    id="book-note-card"
                    className="flex-1 bg-gradient-to-br from-[#121212] to-[#0a0a0a] p-8 md:p-12 flex flex-col relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gold-500/10 rounded-full border border-gold-500/30">
                                <Book size={24} className="text-gold-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-main text-gold-100">{bookTitle}</h2>
                                <p className="text-sm text-gold-500/60 uppercase tracking-widest font-serif">Divine Revelations</p>
                            </div>
                        </div>

                        <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                            <p className="font-serif text-lg leading-relaxed text-crema-200 whitespace-pre-wrap">
                                {note || "No notes written yet..."}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-between items-end">
                            <div className="text-xs text-white/30 font-mono">
                                Bible Mind • {new Date().toLocaleDateString()}
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="w-full md:w-80 bg-[#111] border-l border-white/10 flex flex-col p-6">
                    <h3 className="text-gold-400 font-main text-xl mb-4 flex items-center gap-2">
                        Editor
                    </h3>

                    <div className="flex-1 mb-6 flex flex-col">
                        <label className="text-xs text-slate-500 uppercase tracking-widest mb-2">Your Notes</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Type your insights here..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-crema-200 resize-none focus:outline-none focus:border-gold-500/50 transition-colors font-serif leading-relaxed text-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 rounded-xl text-gold-400 font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            {saved ? <Check size={18} /> : <Save size={18} />}
                            {saved ? 'Saved' : 'Save Note'}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-900/20"
                        >
                            <Download size={18} />
                            {downloading ? 'Capturing...' : 'Download Card'}
                        </button>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default NotebookModal;
