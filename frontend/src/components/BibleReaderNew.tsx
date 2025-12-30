import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Loader2, Volume2, Square, Wand2, X, Type, Settings2, BookOpen, Search, List } from 'lucide-react';
import { bibleAPI, BibleVerse, BibleBook, StrongsDefinition } from '../api/bibleApi';
import LexiconPanel from './LexiconPanel';
import LessonBuilder from './LessonBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { useBible } from '../contexts/BibleContext';

type TranslationVersion = 'kjv' | 'web' | 'jps' | 'brenton' | 'telugu' | 'parallel';
type OriginalTextMode = 'hebrew' | 'greek' | 'both';

export default function BibleReader() {
  const {
    currentBook: selectedBook,
    currentChapter: selectedChapter,
    books,
    setBook: setSelectedBook,
    setChapter: setSelectedChapter,
    goToVerse,
    loading: contextLoading,
    error: contextError
  } = useBible();

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [showLessonBuilder, setShowLessonBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [showVerseSelector, setShowVerseSelector] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'old' | 'new'>('old'); // OT/NT filter
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { fontSize, setFontSize, fontFamily, setIsSettingsOpen } = useSettings();

  const [translationVersion, setTranslationVersion] = useState<TranslationVersion>('kjv');
  const [teluguChapter, setTeluguChapter] = useState<Record<number, string>>({});
  const [originalTextMode, setOriginalTextMode] = useState<OriginalTextMode>('both');

  // Lexicon State
  const [lexiconWord, setLexiconWord] = useState<StrongsDefinition | null>(null);
  const [lexiconLoading, setLexiconLoading] = useState(false);

  // Word translation cache for inline hints
  const [wordTranslations, setWordTranslations] = useState<Map<string, string>>(new Map());

  // Auto-detect testament and switch original text mode accordingly
  useEffect(() => {
    if (selectedBook) {
      const isOldTestament = selectedBook.bookId <= 39;
      setOriginalTextMode(isOldTestament ? 'hebrew' : 'greek');
      // Also update testament filter to match current book
      setTestamentFilter(isOldTestament ? 'old' : 'new');
    }
  }, [selectedBook]);

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

  const handleWordClick = async (word: string) => {
    setLexiconLoading(true);

    try {
      // Clean the word (remove punctuation, vowel points for better matching)
      const cleanWord = word.replace(/[^\u0590-\u05FF\u0370-\u03FF]/g, '');

      // Search for the word in Strong's database
      const results = await bibleAPI.searchStrongs(cleanWord);

      if (results && results.length > 0) {
        // Find the best match - exact word match preferred
        const exactMatch = results.find(r => r.word === cleanWord || r.word.includes(cleanWord));
        const bestMatch = exactMatch || results[0];
        setLexiconWord(bestMatch);

        // Cache the translation for inline display
        if (bestMatch.gloss) {
          setWordTranslations(prev => {
            const newMap = new Map(prev);
            newMap.set(cleanWord, bestMatch.gloss);
            return newMap;
          });
        }
      } else {
        // If no results, show a placeholder with the word
        setLexiconWord({
          strongsNumber: "Unknown",
          word: cleanWord,
          gloss: "Definition not found in database.",
          language: selectedBook?.testament === 'old' ? "Hebrew" : "Greek",
          partOfSpeech: "Unknown",
          gender: "",
          occurrences: 0,
          firstOccurrence: "",
          rootWord: ""
        });
      }
    } catch (error) {
      console.error('Error fetching Strong\'s definition:', error);
      setLexiconWord({
        strongsNumber: "Error",
        word: word,
        gloss: "Failed to fetch definition. Please try again.",
        language: "Unknown",
        partOfSpeech: "",
        gender: "",
        occurrences: 0,
        firstOccurrence: "",
        rootWord: ""
      });
    } finally {
      setLexiconLoading(false);
    }
  };

  // Load chapter when book or chapter changes
  useEffect(() => {
    async function loadChapter() {
      if (!selectedBook) return;

      setLoading(true);
      setError(null);
      setTeluguChapter({});
      try {
        const [chapterData, teluguData] = await Promise.all([
          bibleAPI.getChapter(selectedBook.bookId, selectedChapter),
          bibleAPI.getTeluguChapter(selectedBook.bookId, selectedChapter).catch(() => null)
        ]);

        setVerses(chapterData.verses);

        if (teluguData && teluguData.verses) {
          const telMap: Record<number, string> = {};
          teluguData.verses.forEach(v => {
            telMap[v.verse] = v.teluguText;
          });
          setTeluguChapter(telMap);
        }
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
      setSelectedChapter(selectedChapter - 1);
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
      setSelectedChapter(selectedChapter + 1);
    } else if (selectedBook) {
      // Go to next book's first chapter
      const currentIndex = books.findIndex(b => b.bookId === selectedBook.bookId);
      if (currentIndex < books.length - 1) {
        setSelectedBook(books[currentIndex + 1]);
        setSelectedChapter(1);
      }
    }
  };

  const cycleFontSize = () => {
    const sizes: ('small' | 'normal' | 'large' | 'extra-large')[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  return (
    <div className={`flex flex-col h-screen pt-0 overflow-hidden bg-[#0a0a0a] font-${fontFamily}`}>
      {/* Top Controls Bar */}
      <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a] z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevChapter}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center relative">
            <button
              onClick={() => setShowBookSelector(!showBookSelector)}
              className="group flex flex-col items-center"
            >
              <h1 className="text-2xl md:text-4xl font-serif text-gold-200 flex items-center gap-3 font-bold">
                {selectedBook?.bookName || 'Select Book'}
                <ChevronRight className={`w-5 h-5 text-gold-500/50 transition-transform ${showBookSelector ? 'rotate-90' : ''}`} />
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-lg text-gold-400 font-medium">Chapter {selectedChapter}</span>
                {selectedBook && (
                  <span className="text-sm text-gray-400 font-serif italic">
                    {selectedBook.hebrewName} • {selectedBook.greekName || selectedBook.hebrewTransliteration}
                  </span>
                )}
              </div>
            </button>

            {/* Hebrew/Greek Toggle */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setOriginalTextMode('hebrew')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${originalTextMode === 'hebrew'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
              >
                Hebrew (OT)
              </button>
              <button
                onClick={() => setOriginalTextMode('both')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${originalTextMode === 'both'
                  ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
              >
                Both
              </button>
              <button
                onClick={() => setOriginalTextMode('greek')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${originalTextMode === 'greek'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
              >
                Greek (NT)
              </button>
            </div>

            <AnimatePresence>
              {showBookSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-4xl bg-[#0f0f0f] border border-gold-500/20 rounded-2xl shadow-2xl z-50 p-6 overflow-hidden max-h-[70vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gold-400 text-sm uppercase tracking-widest">Select Book</h3>
                    <button onClick={() => setShowBookSelector(false)}><X className="w-5 h-5 text-slate-500" /></button>
                  </div>

                  {/* Testament Tabs */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setTestamentFilter('old')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${testamentFilter === 'old' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      <span className="block text-lg">📜</span>
                      <span>Old Testament</span>
                      <span className="block text-[10px] uppercase text-slate-500">Hebrew Bible (39 books)</span>
                    </button>
                    <button
                      onClick={() => setTestamentFilter('new')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${testamentFilter === 'new' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      <span className="block text-lg">✝️</span>
                      <span>New Testament</span>
                      <span className="block text-[10px] uppercase text-slate-500">Greek Bible (27 books)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    {books
                      .filter(book => testamentFilter === 'old' ? book.bookId <= 39 : book.bookId >= 40)
                      .map(book => (
                        <button
                          key={book.bookId}
                          onClick={() => {
                            setSelectedBook(book);
                            setShowBookSelector(false);
                            setShowChapterSelector(true); // Show chapter selector after book selection
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={goToNextChapter}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {verses.length > 0 && (
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/5 text-slate-400 hover:text-white'}`}
              title={isSpeaking ? "Stop Reading" : "Listen to Chapter"}
            >
              {isSpeaking ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={cycleFontSize}
            className="p-2 rounded-full bg-white/5 hover:text-gold-400 text-slate-400 transition-colors"
            title={`Font Size: ${fontSize}`}
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-white/5 hover:text-gold-400 text-slate-400 transition-colors"
            title="Open Settings"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowLessonBuilder(true)}
            className="p-2 rounded-full bg-white/5 hover:text-gold-400 text-slate-400 transition-colors"
            title="Create Lesson"
          >
            <Wand2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Secondary Navigation Bar - Quick Access */}
      <div className="flex-none px-4 md:px-8 py-2 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur flex items-center gap-4 flex-wrap z-10">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search verses (English/Telugu)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Chapter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowChapterSelector(!showChapterSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <List className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium">Chapter {selectedChapter}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showChapterSelector ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showChapterSelector && selectedBook && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 bg-[#0f0f0f] border border-gold-500/20 rounded-xl shadow-2xl z-50 p-3 max-h-[300px] overflow-y-auto w-[200px]"
              >
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map(ch => (
                    <button
                      key={ch}
                      onClick={() => {
                        setSelectedChapter(ch);
                        setShowChapterSelector(false);
                        setShowVerseSelector(true); // Show verse selector after chapter selection
                      }}
                      className={`p-2 text-sm rounded-lg transition-all ${selectedChapter === ch
                        ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verse Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowVerseSelector(!showVerseSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Jump to Verse</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showVerseSelector ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showVerseSelector && verses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 bg-[#0f0f0f] border border-gold-500/20 rounded-xl shadow-2xl z-50 p-3 max-h-[300px] overflow-y-auto w-[200px]"
              >
                <div className="grid grid-cols-5 gap-1">
                  {verses.map(v => (
                    <button
                      key={v.verse}
                      onClick={() => {
                        document.getElementById(`verse-${v.verse}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setShowVerseSelector(false);
                      }}
                      className="p-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
                    >
                      {v.verse}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Translation Selector (Compact) */}
        <select
          value={translationVersion}
          onChange={(e) => setTranslationVersion(e.target.value as TranslationVersion)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500/50 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <option value="kjv">KJV (English)</option>
          <option value="web">WEB (English)</option>
          <option value="telugu">Telugu (తెలుగు)</option>
          <option value="parallel">English + Telugu</option>
        </select>
      </div>

      {/* Main 3-Pane Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Pane: Original Text (Hebrew & Greek) */}
        <div className="flex-1 overflow-y-auto min-w-[320px] border-r border-white/5 bg-[#0a0a0a] scrollbar-thin scrollbar-thumb-white/10">
          <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10 p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-gold-500/70 uppercase tracking-widest">
              {originalTextMode === 'hebrew' ? 'Hebrew Bible (תנ״ך)' : originalTextMode === 'greek' ? 'Greek Bible (Κοινή)' : 'Original Text'}
            </span>
            <span className="text-xs text-slate-500">Click any word for meaning</span>
          </div>
          <div className="p-6 md:p-8 space-y-8 pb-32">
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gold-500" /></div>
            ) : (
              verses.map((verse) => (
                <div key={verse.id} className="relative group space-y-4">
                  <span className="absolute -left-4 top-1 text-xs font-sans text-slate-600 font-bold">{verse.verse}</span>

                  {(originalTextMode === 'hebrew' || originalTextMode === 'both') && verse.hebrewText ? (
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-1 text-right">Hebrew</div>
                      <p
                        className="text-2xl md:text-3xl font-serif leading-loose text-slate-200 text-right font-hebrew"
                        dir="rtl"
                      >
                        {verse.hebrewText.split(' ').map((word, i) => {
                          const cleanWord = word.replace(/[^\u0590-\u05FF]/g, '');
                          const translation = wordTranslations.get(cleanWord);
                          const isSelected = lexiconWord?.word === cleanWord;
                          return (
                            <span
                              key={`h-${i}`}
                              onClick={() => handleWordClick(word)}
                              title={translation ? `${cleanWord}: ${translation}` : 'Click for meaning'}
                              className={`inline-block px-1 rounded cursor-pointer transition-all ${isSelected ? 'bg-gold-500/30 text-gold-200 ring-2 ring-gold-500/50' : 'hover:text-gold-400 hover:bg-white/5'} ${translation ? 'border-b border-dotted border-gold-500/30' : ''}`}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  ) : (originalTextMode === 'hebrew' || originalTextMode === 'both') ? (
                    <p className="text-sm italic text-slate-600">Hebrew text unavailable for this verse.</p>
                  ) : null}

                  {(originalTextMode === 'greek' || originalTextMode === 'both') && verse.greekText ? (
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.25em] text-cyan-500 mb-1">Greek (Κοινή)</div>
                      <p
                        className="text-xl md:text-2xl font-serif leading-loose text-slate-200"
                        dir="ltr"
                      >
                        {verse.greekText.split(' ').map((word, i) => {
                          const cleanWord = word.replace(/[^\u0370-\u03FF]/g, '');
                          const translation = wordTranslations.get(cleanWord);
                          const isSelected = lexiconWord?.word === cleanWord;
                          return (
                            <span
                              key={`g-${i}`}
                              onClick={() => handleWordClick(word)}
                              title={translation ? `${cleanWord}: ${translation}` : 'Click for meaning'}
                              className={`inline-block px-1 rounded cursor-pointer transition-all ${isSelected ? 'bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-500/50' : 'hover:text-cyan-400 hover:bg-white/5'} ${translation ? 'border-b border-dotted border-cyan-500/30' : ''}`}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  ) : (originalTextMode === 'greek' || originalTextMode === 'both') ? (
                    <p className="text-sm italic text-slate-600">Greek text unavailable for this verse.</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Pane: Translation */}
        <div className="flex-1 overflow-y-auto min-w-[300px] bg-[#0c0c0c] scrollbar-thin scrollbar-thumb-white/10 hidden md:block">
          <div className="sticky top-0 bg-[#0c0c0c]/95 backdrop-blur z-10 px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-crema-100/50 uppercase tracking-widest">
                Translation:
              </span>
              <select
                value={translationVersion}
                onChange={(e) => setTranslationVersion(e.target.value as TranslationVersion)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-crema-100 focus:outline-none focus:border-gold-500/50 font-sans cursor-pointer hover:bg-white/10 transition-colors"
              >
                <option value="kjv">KJV (English)</option>
                <option value="web">WEB (English)</option>
                <option value="jps">JPS (English)</option>
                <option value="brenton">Brenton (Greek)</option>
                <option value="telugu">Telugu (తెలుగు)</option>
                <option value="parallel">English + Telugu</option>
              </select>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8 pb-32">
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-700" /></div>
            ) : (
              verses.map((verse) => (
                <div key={verse.id} className="relative">
                  <span className="absolute -left-4 top-1 text-xs font-sans text-slate-700 font-bold">{verse.verse}</span>
                  <div className={`leading-relaxed text-crema-100 ${fontSize === 'small' ? 'text-base' :
                    fontSize === 'large' ? 'text-2xl' :
                      fontSize === 'extra-large' ? 'text-3xl' : 'text-xl'
                    } font-${fontFamily} space-y-2`}>
                    {(() => {
                      const teluguText = teluguChapter[verse.verse];
                      if (translationVersion === 'telugu') {
                        return teluguText || <span className="text-sm italic text-slate-500">Telugu text not available for this verse.</span>;
                      }
                      if (translationVersion === 'parallel') {
                        return (
                          <>
                            <div>{verse.kjvText || verse.webText}</div>
                            <div className="text-emerald-200 font-serif">{teluguText || <span className="text-sm italic text-slate-500">Telugu text not available.</span>}</div>
                          </>
                        );
                      }
                      return verse[`${translationVersion}Text` as keyof BibleVerse] || verse.kjvText || verse.webText;
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Notes / Lexicon (Sidebar) */}
        <div className="w-[350px] lg:w-[400px] border-l border-white/5 bg-[#0a0a0a] flex-col hidden xl:flex">
          <LexiconPanel
            word={lexiconWord}
            loading={lexiconLoading}
            onClose={() => setLexiconWord(null)}
            onJumpToOccurrence={(book, chapter, verse) => {
              goToVerse(book, chapter, verse);
              setShowLessonBuilder(false);
              setSelectedVerse(null);
            }}
          />
        </div>

      </div>

      {/* Mobile Verse Detail Overlay */}
      <AnimatePresence>
        {selectedVerse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 xl:hidden"
          >
            <div
              onClick={() => setSelectedVerse(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Re-using LexiconPanel or LayeredVerseView for mobile modal if desired */}
            <div className="relative z-50 w-full max-w-lg h-[60vh]">
              <LexiconPanel
                word={lexiconWord}
                loading={lexiconLoading}
                onClose={() => setSelectedVerse(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Builder Modal */}
      <AnimatePresence>
        {showLessonBuilder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[60]"
          >
            <LessonBuilder
              initialVerse={{
                ref: `${selectedBook?.bookName || 'Genesis'} ${selectedChapter}:${selectedVerse?.verse || 1}`,
                text: selectedVerse?.kjvText || 'Select a verse to begin...'
              }}
              onClose={() => setShowLessonBuilder(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
