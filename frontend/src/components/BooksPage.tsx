import React, { useState } from 'react';
import { Sparkles, Crown, Heart, Flame, BookOpen, Scroll, Users, Cross, Music, Compass, Sword, Shield, Feather, Waves, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotebookModal from './NotebookModal';
import GenesisBook from './GenesisBook';
import ExodusBook from './ExodusBook';

const bibleBooks = [
    // Old Testament
    { id: 1, title: 'Genesis', author: 'Moses', testament: 'Old' },
    { id: 2, title: 'Exodus', author: 'Moses', testament: 'Old' },
    { id: 3, title: 'Leviticus', author: 'Moses', testament: 'Old' },
    { id: 4, title: 'Numbers', author: 'Moses', testament: 'Old' },
    { id: 5, title: 'Deuteronomy', author: 'Moses', testament: 'Old' },
    { id: 6, title: 'Joshua', author: 'Joshua', testament: 'Old' },
    { id: 7, title: 'Judges', author: 'Samuel', testament: 'Old' },
    { id: 8, title: 'Ruth', author: 'Samuel', testament: 'Old' },
    { id: 9, title: '1 Samuel', author: 'Samuel/Gad/Nathan', testament: 'Old' },
    { id: 10, title: '2 Samuel', author: 'Gad/Nathan', testament: 'Old' },
    { id: 11, title: '1 Kings', author: 'Jeremiah', testament: 'Old' },
    { id: 12, title: '2 Kings', author: 'Jeremiah', testament: 'Old' },
    { id: 13, title: '1 Chronicles', author: 'Ezra', testament: 'Old' },
    { id: 14, title: '2 Chronicles', author: 'Ezra', testament: 'Old' },
    { id: 15, title: 'Ezra', author: 'Ezra', testament: 'Old' },
    { id: 16, title: 'Nehemiah', author: 'Nehemiah', testament: 'Old' },
    { id: 17, title: 'Esther', author: 'Mordecai', testament: 'Old' },
    { id: 18, title: 'Job', author: 'Unknown', testament: 'Old' },
    { id: 19, title: 'Psalms', author: 'David', testament: 'Old' },
    { id: 20, title: 'Proverbs', author: 'Solomon', testament: 'Old' },
    { id: 21, title: 'Ecclesiastes', author: 'Solomon', testament: 'Old' },
    { id: 22, title: 'Song of Solomon', author: 'Solomon', testament: 'Old' },
    { id: 23, title: 'Isaiah', author: 'Isaiah', testament: 'Old' },
    { id: 24, title: 'Jeremiah', author: 'Jeremiah', testament: 'Old' },
    { id: 25, title: 'Lamentations', author: 'Jeremiah', testament: 'Old' },
    { id: 26, title: 'Ezekiel', author: 'Ezekiel', testament: 'Old' },
    { id: 27, title: 'Daniel', author: 'Daniel', testament: 'Old' },
    { id: 28, title: 'Hosea', author: 'Hosea', testament: 'Old' },
    { id: 29, title: 'Joel', author: 'Joel', testament: 'Old' },
    { id: 30, title: 'Amos', author: 'Amos', testament: 'Old' },
    { id: 31, title: 'Obadiah', author: 'Obadiah', testament: 'Old' },
    { id: 32, title: 'Jonah', author: 'Jonah', testament: 'Old' },
    { id: 33, title: 'Micah', author: 'Micah', testament: 'Old' },
    { id: 34, title: 'Nahum', author: 'Nahum', testament: 'Old' },
    { id: 35, title: 'Habakkuk', author: 'Habakkuk', testament: 'Old' },
    { id: 36, title: 'Zephaniah', author: 'Zephaniah', testament: 'Old' },
    { id: 37, title: 'Haggai', author: 'Haggai', testament: 'Old' },
    { id: 38, title: 'Zechariah', author: 'Zechariah', testament: 'Old' },
    { id: 39, title: 'Malachi', author: 'Malachi', testament: 'Old' },
    // New Testament
    { id: 40, title: 'Matthew', author: 'Matthew', testament: 'New' },
    { id: 41, title: 'Mark', author: 'Mark', testament: 'New' },
    { id: 42, title: 'Luke', author: 'Luke', testament: 'New' },
    { id: 43, title: 'John', author: 'John', testament: 'New' },
    { id: 44, title: 'Acts', author: 'Luke', testament: 'New' },
    { id: 45, title: 'Romans', author: 'Paul', testament: 'New' },
    { id: 46, title: '1 Corinthians', author: 'Paul', testament: 'New' },
    { id: 47, title: '2 Corinthians', author: 'Paul', testament: 'New' },
    { id: 48, title: 'Galatians', author: 'Paul', testament: 'New' },
    { id: 49, title: 'Ephesians', author: 'Paul', testament: 'New' },
    { id: 50, title: 'Philippians', author: 'Paul', testament: 'New' },
    { id: 51, title: 'Colossians', author: 'Paul', testament: 'New' },
    { id: 52, title: '1 Thessalonians', author: 'Paul', testament: 'New' },
    { id: 53, title: '2 Thessalonians', author: 'Paul', testament: 'New' },
    { id: 54, title: '1 Timothy', author: 'Paul', testament: 'New' },
    { id: 55, title: '2 Timothy', author: 'Paul', testament: 'New' },
    { id: 56, title: 'Titus', author: 'Paul', testament: 'New' },
    { id: 57, title: 'Philemon', author: 'Paul', testament: 'New' },
    { id: 58, title: 'Hebrews', author: 'Unknown', testament: 'New' },
    { id: 59, title: 'James', author: 'James', testament: 'New' },
    { id: 60, title: '1 Peter', author: 'Peter', testament: 'New' },
    { id: 61, title: '2 Peter', author: 'Peter', testament: 'New' },
    { id: 62, title: '1 John', author: 'John', testament: 'New' },
    { id: 63, title: '2 John', author: 'John', testament: 'New' },
    { id: 64, title: '3 John', author: 'John', testament: 'New' },
    { id: 65, title: 'Jude', author: 'Jude', testament: 'New' },
    { id: 66, title: 'Revelation', author: 'John', testament: 'New' },
];

const BooksPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedBook, setSelectedBook] = useState<{ id: number; title: string } | null>(null);
    const [showGenesisBook, setShowGenesisBook] = useState(false);
    const [showExodusBook, setShowExodusBook] = useState(false);

    // Handle book click - special handling for Genesis and Exodus
    const handleBookClick = (book: { id: number; title: string }) => {
        if (book.id === 1) {
            // Genesis - open the story book
            setShowGenesisBook(true);
        } else if (book.id === 2) {
            // Exodus - open the story book
            setShowExodusBook(true);
        } else {
            // Other books - open notebook
            setSelectedBook(book);
        }
    };

    // Function to get a unique color gradient for each book
    const getBookColor = (id: number) => {
        const colors = [
            'from-amber-700 to-orange-900', 'from-blue-700 to-indigo-900', 'from-purple-700 to-fuchsia-900',
            'from-red-700 to-rose-900', 'from-emerald-700 to-teal-900', 'from-cyan-700 to-sky-900',
            'from-lime-700 to-green-900', 'from-pink-700 to-rose-900'
        ];
        return colors[id % colors.length];
    };

    // Function to get themed icon for each book
    const getBookIcon = (title: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            // Pentateuch (Torah)
            'Genesis': <Sparkles size={24} className="text-gold-300" />,
            'Exodus': <Waves size={24} className="text-blue-300" />,
            'Leviticus': <Flame size={24} className="text-orange-300" />,
            'Numbers': <Users size={24} className="text-teal-300" />,
            'Deuteronomy': <Scroll size={24} className="text-amber-300" />,
            // Historical Books
            'Joshua': <Sword size={24} className="text-gray-300" />,
            'Judges': <Shield size={24} className="text-amber-400" />,
            'Ruth': <Heart size={24} className="text-rose-300" />,
            '1 Samuel': <Crown size={24} className="text-purple-300" />,
            '2 Samuel': <Crown size={24} className="text-indigo-300" />,
            '1 Kings': <Crown size={24} className="text-gold-400" />,
            '2 Kings': <Crown size={24} className="text-amber-300" />,
            '1 Chronicles': <Scroll size={24} className="text-orange-300" />,
            '2 Chronicles': <Scroll size={24} className="text-red-300" />,
            'Ezra': <BookOpen size={24} className="text-blue-300" />,
            'Nehemiah': <Shield size={24} className="text-stone-300" />,
            'Esther': <Crown size={24} className="text-pink-300" />,
            // Wisdom/Poetry
            'Job': <Cloud size={24} className="text-slate-300" />,
            'Psalms': <Music size={24} className="text-purple-300" />,
            'Proverbs': <Compass size={24} className="text-emerald-300" />,
            'Ecclesiastes': <Compass size={24} className="text-gray-300" />,
            'Song of Solomon': <Heart size={24} className="text-red-300" />,
            // Major Prophets
            'Isaiah': <Feather size={24} className="text-sky-300" />,
            'Jeremiah': <Feather size={24} className="text-blue-300" />,
            'Lamentations': <Cloud size={24} className="text-gray-400" />,
            'Ezekiel': <Sparkles size={24} className="text-emerald-300" />,
            'Daniel': <Crown size={24} className="text-amber-300" />,
            // Minor Prophets
            'Hosea': <Heart size={24} className="text-rose-400" />,
            'Joel': <Flame size={24} className="text-red-300" />,
            'Amos': <Shield size={24} className="text-green-300" />,
            'Obadiah': <Feather size={24} className="text-amber-300" />,
            'Jonah': <Waves size={24} className="text-cyan-300" />,
            'Micah': <Compass size={24} className="text-teal-300" />,
            'Nahum': <Sword size={24} className="text-red-400" />,
            'Habakkuk': <Feather size={24} className="text-purple-300" />,
            'Zephaniah': <Cloud size={24} className="text-indigo-300" />,
            'Haggai': <BookOpen size={24} className="text-amber-300" />,
            'Zechariah': <Sparkles size={24} className="text-gold-300" />,
            'Malachi': <Flame size={24} className="text-orange-400" />,
            // Gospels
            'Matthew': <Cross size={24} className="text-gold-300" />,
            'Mark': <Cross size={24} className="text-red-300" />,
            'Luke': <Cross size={24} className="text-blue-300" />,
            'John': <Cross size={24} className="text-green-300" />,
            // History
            'Acts': <Flame size={24} className="text-orange-300" />,
            // Pauline Epistles
            'Romans': <Scroll size={24} className="text-red-300" />,
            '1 Corinthians': <Users size={24} className="text-blue-300" />,
            '2 Corinthians': <Users size={24} className="text-indigo-300" />,
            'Galatians': <Feather size={24} className="text-green-300" />,
            'Ephesians': <Shield size={24} className="text-purple-300" />,
            'Philippians': <Heart size={24} className="text-pink-300" />,
            'Colossians': <Crown size={24} className="text-gold-300" />,
            '1 Thessalonians': <Cloud size={24} className="text-sky-300" />,
            '2 Thessalonians': <Cloud size={24} className="text-blue-300" />,
            '1 Timothy': <BookOpen size={24} className="text-emerald-300" />,
            '2 Timothy': <BookOpen size={24} className="text-teal-300" />,
            'Titus': <Scroll size={24} className="text-amber-300" />,
            'Philemon': <Heart size={24} className="text-rose-300" />,
            // General Epistles
            'Hebrews': <Cross size={24} className="text-purple-300" />,
            'James': <Compass size={24} className="text-green-300" />,
            '1 Peter': <Shield size={24} className="text-blue-300" />,
            '2 Peter': <Shield size={24} className="text-indigo-300" />,
            '1 John': <Heart size={24} className="text-red-300" />,
            '2 John': <Heart size={24} className="text-rose-300" />,
            '3 John': <Heart size={24} className="text-pink-300" />,
            'Jude': <Sword size={24} className="text-orange-300" />,
            // Apocalyptic
            'Revelation': <Crown size={24} className="text-gold-300" />,
        };
        return iconMap[title] || <BookOpen size={24} className="text-gold-300/50" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 pb-20"
        >
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
                >
                    ← Back
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-4xl md:text-5xl font-main text-gold-400 bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">
                        Divine Library
                    </h1>
                </div>
                <div className="w-20" /> {/* Spacer for balance */}
            </div>

            <p className="text-center text-crema-300 font-serif italic max-w-2xl mx-auto mb-12">
                "Select a book to open your personal notebook. Write your revelations and save them as a keepsake."
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {bibleBooks.map((book, index) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="group perspective-1000 cursor-pointer"
                        onClick={() => handleBookClick(book)}
                    >
                        {/* Book Container with 3D Rotate */}
                        <div className="relative w-full aspect-[2/3] transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-20deg] group-hover:translate-x-3 group-hover:scale-110 z-10">

                            {/* Front Cover */}
                            <div className={`absolute inset-0 rounded-r-md rounded-l-sm bg-gradient-to-br ${getBookColor(book.id)} shadow-2xl border-l-[3px] border-white/10 flex flex-col items-center justify-between p-3 text-center backface-hidden overflow-hidden`}>
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay" />

                                <div className="relative z-10 w-full pt-4">
                                    <div className="w-full h-[1px] bg-gold-400/50 mb-1" />
                                    <div className="w-full h-[1px] bg-gold-400/30 mb-4" />
                                    <h3 className="font-main text-lg lg:text-xl text-gold-100 leading-tight drop-shadow-md">{book.title}</h3>
                                </div>

                                <div className="relative z-10 flex-1 flex items-center justify-center">
                                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                                        {getBookIcon(book.title)}
                                    </div>
                                </div>

                                <div className="relative z-10 w-full pb-4">
                                    <p className="font-serif text-white/50 text-[10px] uppercase tracking-widest">{book.author}</p>
                                    <div className="w-full h-[1px] bg-gold-400/30 mt-4" />
                                    <div className="w-full h-[1px] bg-gold-400/50 mt-1" />
                                </div>
                            </div>

                            {/* Pages Effect (Right Side) */}
                            <div className="absolute right-0 top-1 bottom-1 w-[10px] bg-crema-100 transform translate-z-[-2px] translate-x-[8px] rotate-y-[90deg] shadow-inner"
                                style={{
                                    background: 'linear-gradient(to right, #fdfbf7 0%, #e6d5b8 10%, #fdfbf7 20%, #e6d5b8 30%)',
                                    backgroundSize: '4px 100%'
                                }}
                            />
                            {/* Back Cover (for 3D effect) */}
                            <div className={`absolute inset-0 rounded-r-md bg-gradient-to-br ${getBookColor(book.id)} transform translate-z-[-10px] boder-l border-white/10`} />

                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedBook && (
                    <NotebookModal
                        isOpen={!!selectedBook}
                        onClose={() => setSelectedBook(null)}
                        bookTitle={selectedBook.title}
                        bookId={selectedBook.id}
                    />
                )}
                {showGenesisBook && (
                    <GenesisBook onClose={() => setShowGenesisBook(false)} />
                )}
                {showExodusBook && (
                    <ExodusBook onBack={() => setShowExodusBook(false)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BooksPage;
