import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface ArtUploadProps {
    verseRef: string; // e.g., "Genesis 1:1"
    onClose: () => void;
    onUploadSuccess?: () => void;
}

const ArtUpload: React.FC<ArtUploadProps> = ({ verseRef, onClose, onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [artistName, setArtistName] = useState('');
    const [title, setTitle] = useState('');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        // Simulate upload delay
        setTimeout(() => {
            setLoading(false);
            onUploadSuccess?.();
            onClose();
        }, 1500);
    };

    return (
        <div className="bg-[#0a0a0a] border border-gold-500/20 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gold-500/10 flex items-center justify-between bg-gold-500/5">
                <div className="flex items-center gap-2 text-gold-400">
                    <Upload size={18} />
                    <span className="font-serif font-medium tracking-wide">Upload Artwork</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold-500/20 scrollbar-track-transparent">
                {!selectedFile ? (
                    <form
                        className="h-full flex flex-col"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="mb-6">
                            <h3 className="text-xl text-crema-100 font-serif mb-2">Share Your Art</h3>
                            <p className="text-slate-400 text-sm">
                                Upload visual interpretation for <span className="text-gold-400 font-medium">{verseRef}</span>
                            </p>
                        </div>

                        <label
                            className={`
                                flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
                                ${dragActive
                                    ? 'border-gold-500 bg-gold-500/10'
                                    : 'border-white/10 hover:border-gold-500/50 hover:bg-white/5'}
                            `}
                        >
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <div className="p-4 rounded-full bg-white/5 mb-4">
                                <ImageIcon size={32} className="text-gold-500/50" />
                            </div>
                            <p className="text-crema-100 font-medium mb-1">Click or drag image here</p>
                            <p className="text-slate-500 text-sm">JPG, PNG, WEBP up to 5MB</p>
                        </label>
                    </form>
                ) : (
                    <div className="h-full flex flex-col">
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-white/10 bg-black/50 group">
                            <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-slate-500 tracking-widest mb-1.5">Artwork Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., The Beginning of Light"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-crema-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-500 tracking-widest mb-1.5">Artist Name</label>
                                <input
                                    type="text"
                                    required
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-crema-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Submit Artwork
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtUpload;
