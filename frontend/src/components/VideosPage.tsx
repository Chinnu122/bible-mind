import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { Folder, ChevronRight, ArrowLeft } from 'lucide-react';
import ImageDetailModal from './ImageDetailModal';

// Mock Data
const FOLDERS = [
    { id: 'genesis', name: 'Genesis', count: 23, cover: '/photos/Genesis/Genesis 1.png' },
    { id: 'revelation', name: 'Revelation', count: 22, cover: '/photos/Revelation/Chapter 1.png' }
];

const VisualsGallery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { setCustomBackground } = useSettings();
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);

    // Dynamic Photos Generator
    const getPhotos = (folderId: string) => {
        if (folderId === 'genesis') {
            return Array.from({ length: 23 }, (_, i) => ({
                id: `gen-${i + 1}`,
                src: `/photos/Genesis/Genesis ${i + 1}.png`,
                title: `Genesis ${i + 1}`
            }));
        } else {
            return Array.from({ length: 22 }, (_, i) => ({
                id: `rev-${i + 1}`,
                src: `/photos/Revelation/Chapter ${i + 1}.png`,
                title: `Revelation ${i + 1}`
            }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => currentFolder ? setCurrentFolder(null) : onBack()}
                    className="px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> {currentFolder ? 'Back to Folders' : 'Back'}
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-main text-gold-400 flex items-center gap-3">
                        Visuals <ChevronRight className="opacity-50" size={24} />
                        <span className="text-crema-100">{currentFolder ? FOLDERS.find(f => f.id === currentFolder)?.name : 'Collections'}</span>
                    </h1>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!currentFolder ? (
                    // Folder View
                    <motion.div
                        key="folders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {FOLDERS.map((folder) => (
                            <motion.div
                                key={folder.id}
                                onClick={() => setCurrentFolder(folder.id)}
                                className="group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group-hover:border-gold-500/50 transition-colors shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={folder.cover}
                                        alt={folder.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-3 bg-gold-500/20 backdrop-blur-md rounded-xl text-gold-400">
                                                <Folder size={24} />
                                            </div>
                                            <h2 className="text-2xl font-main text-white">{folder.name}</h2>
                                        </div>
                                        <p className="text-white/50 text-sm ml-1">{folder.count} Visuals</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    // Grid View
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {getPhotos(currentFolder).map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedImage(photo)}
                                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-gold-500/20 hover:border-gold-500/60 transition-all shadow-lg bg-black"
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-[#0a0a0a]"
                                    loading="lazy"
                                    style={{ backgroundColor: '#0a0a0a' }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                    <span className="text-xs font-medium text-crema-100">{photo.title}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <ImageDetailModal
                        imageSrc={selectedImage.src}
                        title={selectedImage.title}
                        onClose={() => setSelectedImage(null)}
                        onSetBackground={(src) => {
                            setCustomBackground(src);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisualsGallery;
