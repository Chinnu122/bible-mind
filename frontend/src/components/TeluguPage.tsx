import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Download, ChevronLeft, ChevronRight, Book, Loader2 } from 'lucide-react';

interface TeluguPageProps {
  onBack: () => void;
}

interface TeluguBook {
  bookId: number;
  englishName: string;
  teluguName: string;
  chapterCount: number;
  testament: 'old' | 'new';
}

interface TeluguVerse {
  verse: number;
  teluguText: string;
}

export default function TeluguPage({ onBack }: TeluguPageProps) {
  const [books, setBooks] = useState<TeluguBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<TeluguBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<TeluguVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookSelector, setShowBookSelector] = useState(false);

  // Load Telugu books on mount
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/telugu/books`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.data);
          if (data.data.length > 0) {
            setSelectedBook(data.data[0]); // Start with Genesis
          }
        }
      } catch (error) {
        console.error('Failed to load Telugu books:', error);
      }
    }
    loadBooks();
  }, []);

  // Load chapter when book or chapter changes
  useEffect(() => {
    async function loadChapter() {
      if (!selectedBook) return;

      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/telugu/${selectedBook.bookId}/${selectedChapter}`);
        const data = await res.json();
        if (data.success) {
          setVerses(data.data.verses);
        }
      } catch (error) {
        console.error('Failed to load Telugu chapter:', error);
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [selectedBook, selectedChapter]);

  const goToPrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else if (selectedBook) {
      const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.chapterCount);
      }
    }
  };

  const goToNextChapter = () => {
    if (selectedBook && selectedChapter < selectedBook.chapterCount) {
      setSelectedChapter(prev => prev + 1);
    } else if (selectedBook) {
      const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
      if (currentIndex < books.length - 1) {
        setSelectedBook(books[currentIndex + 1]);
        setSelectedChapter(1);
      }
    }
  };

  const handleDownloadPDF = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/download/telugu`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-20 min-h-screen"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={goToPrevChapter}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <button
            onClick={() => setShowBookSelector(!showBookSelector)}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors mx-auto"
          >
            <Book className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">తెలుగు బైబిల్</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-serif text-gold-200 mt-2">
            {selectedBook?.teluguName || 'ఆదికాండము'} {selectedChapter}
          </h1>
          {selectedBook && (
            <p className="text-sm text-gray-500 mt-1 font-serif italic">
              {selectedBook.englishName} Chapter {selectedChapter}
            </p>
          )}
        </div>

        <button
          onClick={goToNextChapter}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Book Selector */}
      <AnimatePresence>
        {showBookSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">పాత నిబంధన (Old Testament)</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                {books.filter(b => b.testament === 'old').map(book => (
                  <button
                    key={book.bookId}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                      setShowBookSelector(false);
                    }}
                    className={`px-2 py-2 text-xs rounded-lg transition-all ${selectedBook?.bookId === book.bookId
                      ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    title={book.englishName}
                  >
                    {book.teluguName?.slice(0, 6) || book.englishName.slice(0, 4)}
                  </button>
                ))}
              </div>

              <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">క్రొత్త నిబంధన (New Testament)</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {books.filter(b => b.testament === 'new').map(book => (
                  <button
                    key={book.bookId}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                      setShowBookSelector(false);
                    }}
                    className={`px-2 py-2 text-xs rounded-lg transition-all ${selectedBook?.bookId === book.bookId
                      ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    title={book.englishName}
                  >
                    {book.teluguName?.slice(0, 6) || book.englishName.slice(0, 4)}
                  </button>
                ))}
              </div>

              {/* Chapter selector */}
              {selectedBook && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">
                    {selectedBook.teluguName} అధ్యాయాలు
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map(ch => (
                      <button
                        key={ch}
                        onClick={() => {
                          setSelectedChapter(ch);
                          setShowBookSelector(false);
                        }}
                        className={`w-10 h-10 rounded-lg transition-all ${selectedChapter === ch
                          ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                          }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 font-serif text-xl md:text-2xl leading-loose text-gray-300">
              {verses.map((verse, index) => (
                <motion.div
                  key={verse.verse}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="relative p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  <span className="text-sm font-sans text-gold-500/70 font-bold mr-3">
                    {verse.verse}
                  </span>
                  {verse.teluguText}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-gold-400" />
                <h3 className="text-gold-400 font-medium">తెలుగు బైబిల్</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                పవిత్ర గ్రంథం - Telugu Holy Bible
              </p>
              {selectedBook && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Book</p>
                  <p className="text-2xl font-serif text-gold-300">{selectedBook.teluguName}</p>
                  <p className="text-sm text-gray-400 italic">{selectedBook.englishName}</p>
                  <p className="text-sm text-gray-500 mt-2">{selectedBook.chapterCount} chapters</p>
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold-500/10 text-gold-300 rounded-lg hover:bg-gold-500/20 transition-colors border border-gold-500/30"
            >
              <Download className="w-4 h-4" />
              Download PDF Version
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
