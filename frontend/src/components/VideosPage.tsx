import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const VideosPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const dummyVideos = [
        { id: 1, title: 'The Creation', duration: '5:20', thumbnail: 'bg-gradient-to-br from-gold-900 to-black' },
        { id: 2, title: 'Noah\'s Ark', duration: '8:45', thumbnail: 'bg-gradient-to-br from-indigo-900 to-black' },
        { id: 3, title: 'David & Goliath', duration: '12:10', thumbnail: 'bg-gradient-to-br from-amber-900 to-black' },
        { id: 4, title: 'Sermon on the Mount', duration: '15:30', thumbnail: 'bg-gradient-to-br from-emerald-900 to-black' },
        { id: 5, title: 'Parable of Sower', duration: '6:15', thumbnail: 'bg-gradient-to-br from-rose-900 to-black' },
        { id: 6, title: 'Exodus Journey', duration: '20:00', thumbnail: 'bg-gradient-to-br from-cyan-900 to-black' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4"
        >
            <button
                onClick={onBack}
                className="mb-8 px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
            >
                ← Back
            </button>

            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-main text-gold-400 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">
                    Sacred Visuals
                </h1>
                <p className="text-crema-300 font-serif italic max-w-2xl mx-auto">
                    "The word became flesh and made his dwelling among us."
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dummyVideos.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-video glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-gold-500/50 transition-all duration-300"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className={`absolute inset-0 ${video.thumbnail} opacity-60 group-hover:scale-105 transition-transform duration-700`} />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-300">
                                <PlayCircle size={32} className="text-white/80 group-hover:text-gold-300" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-lg font-main text-crema-100">{video.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-crema-400 mt-1">
                                <Clock size={12} />
                                <span>{video.duration}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default VideosPage;
