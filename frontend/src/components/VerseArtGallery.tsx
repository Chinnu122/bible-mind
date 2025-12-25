import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Share2, Info } from 'lucide-react';

interface Artwork {
    id: string;
    imageUrl: string;
    title: string;
    artist: string;
    upvotes: number;
    userVoted: boolean;
}

interface VerseArtGalleryProps {
    verseRef: string;
    onUploadClick: () => void;
}

const VerseArtGallery: React.FC<VerseArtGalleryProps> = ({ verseRef, onUploadClick }) => {
    // Mock data - In real app, fetch from API
    const [artworks, setArtworks] = useState<Artwork[]>([
        {
            id: '1',
            imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
            title: 'Cosmic Beginning',
            artist: 'Sarah Jenkins',
            upvotes: 24,
            userVoted: false
        },
        {
            id: '2',
            imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop',
            title: 'The Light',
            artist: 'David Cohen',
            upvotes: 18,
            userVoted: true
        },
        {
            id: '3',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
            title: 'Deep Waters',
            artist: 'Elena Rodriguez',
            upvotes: 42,
            userVoted: false
        },
        {
            id: '4',
            imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop',
            title: 'Star Field',
            artist: 'Michael Chang',
            upvotes: 12,
            userVoted: false
        }
    ]);

    const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

    const handleVote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setArtworks(prev => prev.map(art => {
            if (art.id === id) {
                return {
                    ...art,
                    upvotes: art.userVoted ? art.upvotes - 1 : art.upvotes + 1,
                    userVoted: !art.userVoted
                };
            }
            return art;
        }));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Gallery Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h3 className="text-xl text-crema-100 font-serif">Community Gallery</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Curated art for <span className="text-gold-400">{verseRef}</span>
                    </p>
                </div>
                <button
                    onClick={onUploadClick}
                    className="px-4 py-2 bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-full hover:bg-gold-500/30 transition-all text-sm font-medium"
                >
                    + Add Art
                </button>
            </div>

            {/* Masonry Grid (CSS Grid wrapper) */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gold-500/20 scrollbar-track-transparent">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artworks.map((art) => (
                        <motion.div
                            key={art.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedArt(art)}
                            className="relative group cursor-zoom-in rounded-xl overflow-hidden bg-black/40 border border-white/5 aspect-[3/4]"
                        >
                            <img
                                src={art.imageUrl}
                                alt={art.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <h4 className="text-sm font-bold text-crema-100">{art.title}</h4>
                                <p className="text-xs text-slate-400 italic mb-2">by {art.artist}</p>

                                <div className="flex items-center justify-between mt-1">
                                    <button
                                        onClick={(e) => handleVote(art.id, e)}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${art.userVoted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                            }`}
                                    >
                                        <Heart size={12} fill={art.userVoted ? "currentColor" : "none"} />
                                        {art.upvotes}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {artworks.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
                        <p>No community art yet.</p>
                        <p className="text-sm mt-2">Be the first to contribute!</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedArt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedArt(null)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedArt(null)}
                        >
                            <X size={32} />
                        </button>

                        <div
                            className="max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-8 items-center justify-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 max-h-[80vh]"
                            >
                                <img
                                    src={selectedArt.imageUrl}
                                    alt={selectedArt.title}
                                    className="max-h-[80vh] w-auto object-contain"
                                />
                            </motion.div>

                            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 w-full max-w-sm">
                                <h2 className="text-2xl font-serif text-gold-200 mb-1">{selectedArt.title}</h2>
                                <p className="text-slate-400 italic mb-6">by {selectedArt.artist}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Heart size={20} className={selectedArt.userVoted ? "text-red-500 fill-current" : ""} />
                                            <span>{selectedArt.upvotes} likes</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleVote(selectedArt.id, e)}
                                            className="text-sm text-gold-400 hover:text-gold-300 font-medium"
                                        >
                                            {selectedArt.userVoted ? 'Unlike' : 'Like'}
                                        </button>
                                    </div>

                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 flex items-center justify-center gap-2 transition-colors">
                                        <Share2 size={18} />
                                        Share Artwork
                                    </button>

                                    <div className="p-3 border border-white/5 rounded-xl text-xs text-slate-500 leading-relaxed">
                                        <Info size={14} className="inline mr-1 -mt-0.5" />
                                        All community artwork is curated for theological accuracy and reverence.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VerseArtGallery;
