import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ImageIcon, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface GeneratedImage {
    filename: string;
    url: string;
    timestamp: string;
}

export default function VerseGallery({ onBack }: { onBack: () => void }) {
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async () => {
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/gallery`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            // Ensure data is an array
            if (Array.isArray(data)) {
                setImages(data);
            } else {
                setImages([]);
                console.warn('Gallery API returned non-array:', data);
            }
        } catch (e: any) {
            console.error('Gallery fetch error:', e);
            setError(e.message || 'Failed to load gallery');
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateNow = async () => {
        setGenerating(true);
        setError(null);
        try {
            // Trigger backend generation for testing
            const res = await fetch(`${API_BASE_URL}/gallery/generate`, { method: 'POST' });
            if (res.ok) {
                // Wait a moment for FS to sync then refresh
                setTimeout(fetchImages, 2000);
            } else {
                setError('Generation failed. Please try again.');
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to generate');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-4xl font-editorial text-crema-50 mb-4 flex items-center gap-3">
                            <Sparkles className="text-gold-400" />
                            Divine Gallery
                        </h2>
                        <p className="text-slate-400 max-w-xl">
                            AI-generated visualizations of scripture, updated hourly.
                            Powered by Gemini & Flux.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchImages}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                    {/* Dev Button: Generate Now */}
                    <button
                        onClick={handleGenerateNow}
                        disabled={generating}
                        className="hidden md:flex px-6 py-3 rounded-full bg-gold-500/10 border border-gold-500/50 text-gold-400 font-medium hover:bg-gold-500/20 transition-all items-center gap-2"
                    >
                        {generating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {generating ? 'Dreaming...' : 'Generate New'}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
                    <AlertCircle className="inline mr-2" size={18} />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-2 border-slate-700 border-t-gold-500 rounded-full animate-spin" />
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                        <ImageIcon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Images Yet</h3>
                    <p className="text-slate-500 mb-6">The gallery is waiting for its first inspiration.</p>
                    <button
                        onClick={handleGenerateNow}
                        disabled={generating}
                        className="px-6 py-3 rounded-full bg-crema-100 text-slate-900 font-bold hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        {generating ? 'Creating...' : 'Create First Image'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((img, i) => {
                        // Extract verse ref from filename (cleanup needed)
                        const cleanName = img.filename.replace(/_[0-9]+\.jpg$/, '').replace(/_/g, ' ');

                        return (
                            <motion.div
                                key={img.filename}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                layoutId={img.filename}
                                onClick={() => setSelectedImage(img)}
                                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-gold-500/50 transition-colors bg-slate-900 shadow-2xl"
                            >
                                <img
                                    src={`${API_BASE_URL.replace('/api', '')}${img.url}`}
                                    alt="Generated Verse"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-gold-400 font-cinzel text-sm tracking-widest uppercase mb-1">Verse Art</p>
                                    <h4 className="text-white font-editorial text-xl">{cleanName}</h4>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.div
                            layoutId={selectedImage.filename}
                            className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={`${API_BASE_URL.replace('/api', '')}${selectedImage.url}`}
                                alt="Full View"
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <AlertCircle className="rotate-45" size={24} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
