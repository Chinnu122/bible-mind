import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Download, Edit3 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface NotebookModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle: string;
    bookId: number;
}

const NotebookModal: React.FC<NotebookModalProps> = ({ isOpen, onClose, bookTitle, bookId }) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Load saved note
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem(`bible-mind-note-${bookId}`);
            if (saved) setNote(saved);
            else setNote('');
        }
    }, [isOpen, bookId]);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(`bible-mind-note-${bookId}`, note);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleDownload = async () => {
        // Create a temporary element for PDF generation to ensure consistent styling
        const element = document.createElement('div');
        element.style.width = '595px'; // A4 width
        element.style.minHeight = '842px'; // A4 height
        element.style.padding = '40px';
        element.style.background = '#f4e4bc'; // Parchment color
        element.style.backgroundImage = 'url("https://www.transparenttextures.com/patterns/aged-paper.png")';
        element.style.color = '#3e2723';
        element.style.fontFamily = 'Georgia, serif';
        element.style.position = 'absolute';
        element.style.top = '-9999px';

        element.innerHTML = `
            <div style="border: 4px double #8d6e63; padding: 20px; height: 100%; box-sizing: border-box;">
                <h1 style="text-align: center; color: #5d4037; font-size: 32px; margin-bottom: 10px; border-bottom: 2px solid #5d4037; padding-bottom: 10px;">${bookTitle}</h1>
                <h3 style="text-align: center; color: #8d6e63; font-size: 16px; margin-bottom: 30px; font-style: italic;">Personal Reflections & Notes</h3>
                <div style="font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${note || 'No notes written...'}</div>
                <div style="margin-top: 50px; text-align: center; font-size: 12px; opacity: 0.7;">
                    <p>~ Bible Mind ~</p>
                </div>
            </div>
        `;

        document.body.appendChild(element);

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${bookTitle.replace(/\s+/g, '_')}_Notes.pdf`);
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            document.body.removeChild(element);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        style={{
                            backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-[#e6d5b8] p-4 flex items-center justify-between border-b border-[#d4c5a9]">
                            <div className="flex items-center gap-2 text-[#5d4037]">
                                <Edit3 size={20} />
                                <h2 className="font-serif text-xl font-bold">{bookTitle} - Notebook</h2>
                            </div>
                            <button onClick={onClose} className="text-[#8d6e63] hover:text-[#5d4037] transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 p-6 overflow-y-auto relative">
                            {/* Lined Paper Effect */}
                            <div className="absolute inset-0 pointer-events-none opacity-10"
                                style={{
                                    backgroundImage: "linear-gradient(#999 1px, transparent 1px)",
                                    backgroundSize: "100% 2em",
                                    marginTop: "2em"
                                }}
                            />

                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Write your revelations, prayers, and thoughts here..."
                                className="w-full h-full min-h-[400px] bg-transparent resize-none focus:outline-none font-serif text-lg leading-[2em] text-[#3e2723] placeholder-[#a1887f]"
                                style={{ lineHeight: '2em' }}
                            />
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 bg-[#f4e4bc] border-t border-[#d4c5a9] flex justify-between items-center">
                            <span className="text-xs text-[#8d6e63] font-serif italic">
                                {isSaving ? 'Saving...' : 'Auto-saves locally'}
                            </span>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#8d6e63] hover:bg-[#6d4c41] text-[#fdfbf7] rounded-md transition-colors font-serif shadow-sm"
                                >
                                    <Save size={18} />
                                    Save
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#5d4037] hover:bg-[#3e2723] text-[#fdfbf7] rounded-md transition-colors font-serif shadow-lg"
                                >
                                    <Download size={18} />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotebookModal;
