import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const BooksPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const dummyBooks = [
        { id: 1, title: 'The Genesis', author: 'Moses', color: 'from-amber-700 to-orange-900' },
        { id: 2, title: 'Psalms of David', author: 'King David', color: 'from-blue-700 to-indigo-900' },
        { id: 3, title: 'Wisdom of Solomon', author: 'Solomon', color: 'from-purple-700 to-fuchsia-900' },
        { id: 4, title: 'The Prophets', author: 'Various', color: 'from-red-700 to-rose-900' },
        { id: 5, title: 'Gospel Stories', author: 'Apostles', color: 'from-emerald-700 to-teal-900' },
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
                    Divine Library
                </h1>
                <p className="text-crema-300 font-serif italic max-w-2xl mx-auto">
                    "For wisdom is more moving than any motion: she passeth and goeth through all things by reason of her pureness."
                </p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {dummyBooks.map((book, index) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group perspective-1000 cursor-pointer"
                    >
                        <div className="relative w-full aspect-[2/3] transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-15deg] group-hover:translate-x-2">
                            {/* Book Cover */}
                            <div className={`absolute inset-0 rounded-r-lg rounded-l-sm bg-gradient-to-br ${book.color} shadow-xl border-l-4 border-white/10 flex flex-col items-center justify-center p-4 text-center glass-card`}>
                                <div className="w-full h-full border border-white/20 rounded-sm flex flex-col items-center justify-center p-2">
                                    <Star size={24} className="text-gold-300 mb-4 opacity-80" />
                                    <h3 className="font-main text-lg text-white mb-2 leading-tight">{book.title}</h3>
                                    <p className="font-serif text-white/60 text-xs italic">{book.author}</p>
                                </div>
                            </div>

                            {/* Spine Effect (Pseudo) */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/10 rounded-l-sm" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default BooksPage;
