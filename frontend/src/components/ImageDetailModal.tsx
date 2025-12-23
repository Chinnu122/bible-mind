import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Download, Check, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ImageDetailModalProps {
    imageSrc: string;
    title: string;
    onClose: () => void;
    onSetBackground: (src: string) => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ imageSrc, title, onClose, onSetBackground }) => {
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Load saved note logic would typically go here
    useEffect(() => {
        const savedNote = localStorage.getItem(`note-${imageSrc}`);
        if (savedNote) setNote(savedNote);
    }, [imageSrc]);

    const handleSave = () => {
        localStorage.setItem(`note-${imageSrc}`, note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDownload = async () => {
        setDownloading(true);
        const element = document.getElementById('capture-card');
        if (element) {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
            const link = document.createElement('a');
            link.download = `${title.replace(/\s+/g, '_')}_note.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        setDownloading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left: Image (Capture Area) */}
                <div
                    className="flex-1 relative bg-black flex items-center justify-center p-8 bg-grid-pattern"
                    id="capture-card"
                >
                    <div className="relative rounded-lg overflow-hidden shadow-2xl max-h-full">
                        <img src={imageSrc} alt={title} className="max-w-full max-h-[60vh] object-contain" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h2 className="text-white font-serif text-xl tracking-wide">{title}</h2>
                        </div>
                    </div>
                    {/* Hidden note overlay just for capture if desired, simplified here ot just image capture for now, 
                        but user asked for note. Let's imagine the capture includes the note if we wrap 'capture-card' around both?
                        Actually user said "download", suggesting saving the card. Let's try to capture just the visual for now, or maybe the whole modal content looks weird.
                        Let's caputure the Image with the Note overlaid if possible? Or just the Image logic.
                        Let's keep it simple: Download Image + Note Text ?
                        
                        Re-reading: "pop up in square box and in right side there is an notes... option like save ,download" 
                        Likely wants to download the content. I'll make the capture target effectively the visual representation.
                    */}
                </div>

                {/* Right: Studio / Notes */}
                <div className="w-full md:w-96 bg-[#0a0a0a] border-l border-white/10 flex flex-col p-6">
                    <h3 className="text-gold-400 font-main text-xl mb-4 flex items-center gap-2">
                        <ImageIcon size={20} /> Studio
                    </h3>

                    <div className="flex-1 mb-6 flex flex-col">
                        <label className="text-xs text-slate-500 uppercase tracking-widest mb-2">Personal Notes</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write your reflections here..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-crema-200 resize-none focus:outline-none focus:border-gold-500/50 transition-colors font-serif leading-relaxed"
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
                            onClick={() => onSetBackground(imageSrc)}
                            className="w-full py-3 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 rounded-xl text-purple-400 font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            <ImageIcon size={18} /> Use as Wallpaper
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

export default ImageDetailModal;
