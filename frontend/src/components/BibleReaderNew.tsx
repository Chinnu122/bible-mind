import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Book, Loader2, Volume2, Square } from 'lucide-react';
import { bibleAPI, BibleBook, BibleVerse } from '../api/bibleApi';
import VerseDetailPanel from './VerseDetailPanel';
import { useSettings } from '../contexts/SettingsContext';

export default function BibleReader() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { fontSize } = useSettings();

  // Stop audio on unmount or change
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [selectedChapter, selectedBook]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Gather text
      const text = verses.map(v => `${v.verse}. ${v.webText}`).join(' ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Load books on mount
  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const booksData = await bibleAPI.getBooks();
        setBooks(booksData);
        if (booksData.length > 0) {
          setSelectedBook(booksData[0]); // Start with Genesis
        } else {
          setError("No books found. Please check API connection.");
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load books:', error);
        setError("Failed to connect to Bible API. Please refresh or try again later.");
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  // Load chapter when book or chapter changes
  useEffect(() => {
    async function loadChapter() {
      if (!selectedBook) return;

      setLoading(true);
      setError(null);
      try {
        const chapterData = await bibleAPI.getChapter(selectedBook.bookId, selectedChapter);
        setVerses(chapterData.verses);
      } catch (error) {
        console.error('Failed to load chapter:', error);
        setError("Failed to load chapter content.");
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
      // Go to previous book's last chapter
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
      // Go to next book's first chapter
      const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
      if (currentIndex < books.length - 1) {
        setSelectedBook(books[currentIndex + 1]);
        setSelectedChapter(1);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

        <div className="flex flex-col items-center gap-4">
          {/* Audio Button */}
          {verses.length > 0 && (
            <button
              onClick={handleSpeak}
              className={`p-3 rounded-full transition-all flex items-center gap-2 ${isSpeaking ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/5 text-white hover:bg-white/10'}`}
              title={isSpeaking ? "Stop Reading" : "Listen to Chapter"}
            >
              {isSpeaking ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
              <span className="hidden md:inline text-sm font-medium">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          )}

          {/* Book/Chapter Title */}
          <div className="text-center">
            <button
              onClick={() => setShowBookSelector(!showBookSelector)}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Book className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Select Book</span>
            </button>
            <h1 className="text-3xl md:text-5xl font-serif text-gold-200 mt-2">
              {selectedBook?.bookName} {selectedChapter}
            </h1>
            {selectedBook && (
              <p className="text-sm text-gray-500 mt-1 font-serif italic">
                {selectedBook.hebrewName} • {selectedBook.hebrewTransliteration}
              </p>
            )}
          </div>
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
              <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">Old Testament</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                {books.filter(b => b.testament === 'old').map(book => (
                  <button
                    key={book.bookId}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                      setShowBookSelector(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedBook?.bookId === book.bookId
                      ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                  >
                    {book.shortName}
                  </button>
                ))}
              </div>

              <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">New Testament</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {books.filter(b => b.testament === 'new').map(book => (
                  <button
                    key={book.bookId}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                      setShowBookSelector(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedBook?.bookId === book.bookId
                      ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                  >
                    {book.shortName}
                  </button>
                ))}
              </div>

              {/* Chapter selector */}
              {selectedBook && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-gold-400 text-sm uppercase tracking-widest mb-4">
                    {selectedBook.bookName} Chapters
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-red-400 mb-2 font-serif text-xl">Connection Error</div>
              <p className="text-gray-400 mb-2">{error}</p>
              <div className="text-xs text-gray-600 mb-4 bg-black/20 p-2 rounded font-mono">
                Connecting to: {bibleAPI['baseUrl']}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className={`space-y-4 font-serif leading-loose text-gray-300 ${fontSize === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
              {verses.map((verse, index) => (
                <motion.div
                  key={verse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedVerse(verse)}
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${selectedVerse?.id === verse.id
                      ? 'bg-gold-900/20 border-gold-500/30 shadow-[0_0_30px_-10px_rgba(196,142,47,0.3)]'
                      : 'hover:bg-white/5 border-transparent hover:border-white/10'}
                    border
                  `}
                >
                  <span className="text-sm font-sans text-gold-500/70 font-bold mr-3">
                    {verse.verse}
                  </span>
                  {verse.kjvText}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-32">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
              <h3 className="text-gold-400 font-medium mb-4">Study Notes</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click on any verse to view the original Hebrew or Greek text,
                transliteration, and Strong's definitions.
              </p>
              {selectedBook && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Book Info</p>
                  <p className="text-2xl font-serif text-gold-300">{selectedBook.hebrewName}</p>
                  <p className="text-sm text-gray-400 italic">{selectedBook.hebrewTransliteration}</p>
                  <p className="text-sm text-gray-500 mt-2">"{selectedBook.hebrewMeaning}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verse Detail Panel */}
      <AnimatePresence>
        {selectedVerse && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVerse(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <VerseDetailPanel
              verse={selectedVerse}
              onClose={() => setSelectedVerse(null)}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
