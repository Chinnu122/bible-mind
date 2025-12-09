import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Languages, BookOpen, Sparkles, StickyNote, Globe, ArrowRight, Layers } from 'lucide-react';
import { BibleVerse, bibleAPI, StrongsDefinition } from '../api/bibleApi';

interface VerseDetailPanelProps {
  verse: BibleVerse;
  onClose: () => void;
}

interface TeluguVerseData {
  teluguText: string;
  englishName: string;
  teluguName: string;
}

export default function VerseDetailPanel({ verse, onClose }: VerseDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'compare' | 'translations' | 'hebrew' | 'greek' | 'telugu' | 'notes'>('compare');
  const [strongsResults, setStrongsResults] = useState<StrongsDefinition[]>([]);
  const [_allStrongs, setAllStrongs] = useState<StrongsDefinition[]>([]);
  const [loadingStrongs, setLoadingStrongs] = useState(false);
  const [note, setNote] = useState('');
  const [teluguData, setTeluguData] = useState<TeluguVerseData | null>(null);
  const [loadingTelugu, setLoadingTelugu] = useState(false);

  // Map book names to book IDs
  const bookNameToId: Record<string, number> = {
    'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5,
    'Joshua': 6, 'Judges': 7, 'Ruth': 8, '1 Samuel': 9, '2 Samuel': 10,
    '1 Kings': 11, '2 Kings': 12, '1 Chronicles': 13, '2 Chronicles': 14, 'Ezra': 15,
    'Nehemiah': 16, 'Esther': 17, 'Job': 18, 'Psalms': 19, 'Proverbs': 20,
    'Ecclesiastes': 21, 'Song of Solomon': 22, 'Isaiah': 23, 'Jeremiah': 24, 'Lamentations': 25,
    'Ezekiel': 26, 'Daniel': 27, 'Hosea': 28, 'Joel': 29, 'Amos': 30,
    'Obadiah': 31, 'Jonah': 32, 'Micah': 33, 'Nahum': 34, 'Habakkuk': 35,
    'Zephaniah': 36, 'Haggai': 37, 'Zechariah': 38, 'Malachi': 39,
    'Matthew': 40, 'Mark': 41, 'Luke': 42, 'John': 43, 'Acts': 44,
    'Romans': 45, '1 Corinthians': 46, '2 Corinthians': 47, 'Galatians': 48, 'Ephesians': 49,
    'Philippians': 50, 'Colossians': 51, '1 Thessalonians': 52, '2 Thessalonians': 53, '1 Timothy': 54,
    '2 Timothy': 55, 'Titus': 56, 'Philemon': 57, 'Hebrews': 58, 'James': 59,
    '1 Peter': 60, '2 Peter': 61, '1 John': 62, '2 John': 63, '3 John': 64,
    'Jude': 65, 'Revelation': 66
  };

  // Load Telugu verse
  useEffect(() => {
    async function loadTelugu() {
      const bookId = bookNameToId[verse.bookName] || verse.bookId;
      if (!bookId) return;

      setLoadingTelugu(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/telugu/${bookId}/${verse.chapter}/${verse.verse}`);
        const data = await res.json();
        if (data.success) {
          setTeluguData({
            teluguText: data.data.teluguText,
            englishName: data.data.englishName,
            teluguName: data.data.teluguName
          });
        }
      } catch (error) {
        console.error('Failed to load Telugu verse:', error);
      } finally {
        setLoadingTelugu(false);
      }
    }
    loadTelugu();
  }, [verse]);

  // Load all Strong's definitions for word analysis
  useEffect(() => {
    async function loadAllStrongs() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/strongs/all`);
        const data = await res.json();
        if (data.success) {
          setAllStrongs(data.data);
        }
      } catch (error) {
        console.error('Failed to load all Strong\'s:', error);
      }
    }
    loadAllStrongs();
  }, []);

  // Load note from localStorage
  useEffect(() => {
    try {
      const allNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
      if (allNotes[verse.id]) {
        setNote(allNotes[verse.id].text);
      } else {
        setNote('');
      }
    } catch (e) {
      console.error('Error loading notes', e);
    }
  }, [verse.id]);

  // Save note to localStorage
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    setNote(newNote);

    try {
      const allNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
      if (newNote.trim()) {
        allNotes[verse.id] = {
          text: newNote,
          bookName: verse.bookName,
          chapter: verse.chapter,
          verse: verse.verse,
          updatedAt: Date.now()
        };
      } else {
        delete allNotes[verse.id];
      }
      localStorage.setItem('bible-notes', JSON.stringify(allNotes));
    } catch (e) {
      console.error('Error saving note', e);
    }
  };

  // Load related Strong's when tab changes
  useEffect(() => {
    async function loadRelatedStrongs() {
      if (activeTab !== 'hebrew' && activeTab !== 'greek') return;

      setLoadingStrongs(true);
      try {
        const words = verse.kjvText.split(/\s+/).filter(w => w.length > 4);
        const searchWord = words[Math.floor(words.length / 2)] || 'God';
        const results = await bibleAPI.searchStrongs(searchWord.replace(/[^a-zA-Z]/g, ''));
        setStrongsResults(results.slice(0, 8));
      } catch (error) {
        console.error('Failed to load Strong\'s data:', error);
      } finally {
        setLoadingStrongs(false);
      }
    }
    loadRelatedStrongs();
  }, [verse, activeTab]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#141416] border-l border-gold-500/20 shadow-2xl z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif text-gold-300">
            {verse.bookName} {verse.chapter}:{verse.verse}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'compare', label: 'Compare', icon: Layers },
            { id: 'translations', label: 'Translations', icon: BookOpen },
            { id: 'hebrew', label: 'Hebrew', icon: Languages },
            { id: 'greek', label: 'Greek', icon: Sparkles },
            { id: 'telugu', label: 'Telugu', icon: Globe },
            { id: 'notes', label: 'Notes', icon: StickyNote },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                : 'text-gray-400 hover:bg-white/5'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* COMPARE TAB - Multi-language Chain */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            {/* Determine if OT or NT */}
            {verse.bookId <= 39 ? (
              // Old Testament: English → Telugu → English Meaning → Hebrew
              <>
                <h3 className="text-xs uppercase tracking-widest text-gold-500/70 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Old Testament: English → Telugu → Meaning → Hebrew
                </h3>

                {/* Step 1: English */}
                <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 text-xs flex items-center justify-center font-bold">1</span>
                    <span className="text-xs text-blue-300 uppercase tracking-widest">English (KJV)</span>
                  </div>
                  <p className="text-lg font-serif text-blue-100 leading-relaxed">{verse.kjvText}</p>
                </div>

                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-600" /></div>

                {/* Step 2: Telugu */}
                <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center font-bold">2</span>
                    <span className="text-xs text-emerald-300 uppercase tracking-widest">Telugu (తెలుగు)</span>
                  </div>
                  <p className="text-xl font-serif text-emerald-100 leading-relaxed">
                    {teluguData?.teluguText || <span className="text-gray-500 italic">Loading Telugu...</span>}
                  </p>
                </div>

                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-600" /></div>

                {/* Step 3: English Meaning (Word Analysis) */}
                <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 text-xs flex items-center justify-center font-bold">3</span>
                    <span className="text-xs text-amber-300 uppercase tracking-widest">English Word Meaning</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {verse.kjvText.split(/\s+/).slice(0, 12).map((word, idx) => (
                      <span key={idx} className="bg-amber-900/30 px-3 py-1 rounded text-amber-200 text-sm">
                        {word}
                      </span>
                    ))}
                    {verse.kjvText.split(/\s+/).length > 12 && <span className="text-amber-400">...</span>}
                  </div>
                </div>

                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-600" /></div>

                {/* Step 4: Hebrew (Original) */}
                <div className="bg-gold-900/20 rounded-xl p-5 border border-gold-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-gold-500/30 text-gold-300 text-xs flex items-center justify-center font-bold">4</span>
                    <span className="text-xs text-gold-300 uppercase tracking-widest">Hebrew (עברית) - Original</span>
                  </div>
                  {verse.hebrewText ? (
                    <>
                      <p className="text-2xl font-serif text-gold-100 leading-relaxed text-right mb-4" dir="rtl">
                        {verse.hebrewText}
                      </p>
                      <div className="flex flex-wrap gap-2" dir="rtl">
                        {verse.hebrewText.split(/\s+/).slice(0, 8).map((word, idx) => (
                          <span key={idx} className="bg-gold-900/40 px-3 py-2 rounded-lg text-gold-200 text-lg cursor-pointer hover:bg-gold-800/50 transition-colors" title="Click for meaning">
                            {word}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Hebrew text not available for this verse</p>
                  )}
                </div>
              </>
            ) : (
              // New Testament: Telugu → English → Greek
              <>
                <h3 className="text-xs uppercase tracking-widest text-purple-500/70 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  New Testament: Telugu → English → Greek
                </h3>

                {/* Step 1: Telugu */}
                <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center font-bold">1</span>
                    <span className="text-xs text-emerald-300 uppercase tracking-widest">Telugu (తెలుగు)</span>
                  </div>
                  <p className="text-xl font-serif text-emerald-100 leading-relaxed">
                    {teluguData?.teluguText || <span className="text-gray-500 italic">Loading Telugu...</span>}
                  </p>
                </div>

                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-600" /></div>

                {/* Step 2: English */}
                <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 text-xs flex items-center justify-center font-bold">2</span>
                    <span className="text-xs text-blue-300 uppercase tracking-widest">English (KJV)</span>
                  </div>
                  <p className="text-lg font-serif text-blue-100 leading-relaxed">{verse.kjvText}</p>
                </div>

                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-600" /></div>

                {/* Step 3: Greek (Original) */}
                <div className="bg-purple-900/20 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 text-xs flex items-center justify-center font-bold">3</span>
                    <span className="text-xs text-purple-300 uppercase tracking-widest">Greek (Ελληνικά) - Original</span>
                  </div>
                  {verse.greekText ? (
                    <>
                      <p className="text-2xl font-serif text-purple-100 leading-relaxed mb-4">
                        {verse.greekText}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {verse.greekText.split(/\s+/).slice(0, 8).map((word, idx) => (
                          <span key={idx} className="bg-purple-900/40 px-3 py-2 rounded-lg text-purple-200 text-lg cursor-pointer hover:bg-purple-800/50 transition-colors" title="Click for meaning">
                            {word}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Greek text not available for this verse</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'translations' && (
          <div className="space-y-6">
            <TranslationBlock label="King James Version" text={verse.kjvText} highlight />
            <TranslationBlock label="World English Bible" text={verse.webText} />
            {verse.jpsText && <TranslationBlock label="Jewish Publication Society" text={verse.jpsText} />}
            {verse.brentonText && <TranslationBlock label="Brenton's Translation" text={verse.brentonText} />}
          </div>
        )}

        {activeTab === 'hebrew' && (
          <div className="space-y-6">
            {verse.hebrewText ? (
              <>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-3">Leningrad Codex (Hebrew)</p>
                  <p className="text-3xl font-serif text-gold-200 leading-relaxed text-right" dir="rtl">
                    {verse.hebrewText}
                  </p>
                </div>

                {/* Word-by-Word Analysis */}
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-xl p-6 border border-white/10">
                  <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Word-by-Word Analysis (Hebrew → English)
                  </h3>

                  {/* Hebrew words split */}
                  <div className="flex flex-wrap gap-3 mb-6" dir="rtl">
                    {verse.hebrewText.split(/\s+/).map((word, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gold-900/20 border border-gold-500/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-gold-900/40 transition-colors"
                        title="Click for Strong's definition"
                      >
                        <span className="text-xl text-gold-200">{word}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* English parallel */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gold-500/50 uppercase tracking-widest mb-2">English Translation</p>
                    <p className="text-gray-300 font-serif">{verse.kjvText}</p>
                  </div>
                </div>

                {/* Strong's Definitions */}
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4">
                    Strong's Concordance Meanings
                  </h3>
                  {loadingStrongs ? (
                    <p className="text-gray-500 text-sm">Loading definitions...</p>
                  ) : (
                    <div className="space-y-3">
                      {strongsResults.slice(0, 6).map((def, idx) => (
                        <StrongsCard key={idx} definition={def} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No Hebrew text available for this verse.</p>
                <p className="text-sm mt-2">This may be a New Testament passage.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'greek' && (
          <div className="space-y-6">
            {verse.greekText ? (
              <>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-3">Codex Alexandrinus (Greek)</p>
                  <p className="text-2xl font-serif text-gold-200 leading-relaxed">
                    {verse.greekText}
                  </p>
                </div>

                {/* Word-by-Word Analysis */}
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-xl p-6 border border-white/10">
                  <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Word-by-Word Analysis (Greek → English)
                  </h3>

                  {/* Greek words split */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {verse.greekText.split(/\s+/).map((word, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-purple-900/20 border border-purple-500/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-purple-900/40 transition-colors"
                      >
                        <span className="text-xl text-purple-200">{word}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* English parallel */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-purple-500/50 uppercase tracking-widest mb-2">English Translation</p>
                    <p className="text-gray-300 font-serif">{verse.brentonText || verse.kjvText}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No Greek text available for this verse.</p>
                <p className="text-sm mt-2">Greek text is primarily available for Old Testament (Septuagint).</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'telugu' && (
          <div className="space-y-6">
            {loadingTelugu ? (
              <div className="text-center py-10 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                <p>Loading Telugu verse...</p>
              </div>
            ) : teluguData ? (
              <>
                {/* Telugu Text */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-3">
                    తెలుగు బైబిల్ ({teluguData.teluguName})
                  </p>
                  <p className="text-2xl font-serif text-gold-200 leading-relaxed mb-4">
                    {teluguData.teluguText}
                  </p>
                </div>

                {/* Word-by-Word Analysis: Telugu → English */}
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-xl p-6 border border-white/10">
                  <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Word Analysis (Telugu → English)
                  </h3>

                  {/* Telugu words split */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {teluguData.teluguText.split(/\s+/).filter(w => w.length > 0).map((word, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-emerald-900/40 transition-colors group"
                      >
                        <span className="text-lg text-emerald-200">{word}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* English parallel */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-emerald-500/50 uppercase tracking-widest mb-2">English Meaning</p>
                    <p className="text-gray-300 font-serif italic">"{verse.kjvText}"</p>
                  </div>
                </div>

                {/* Telugu → Hebrew Comparison */}
                {verse.hebrewText && (
                  <div className="bg-gradient-to-b from-gold-900/10 to-transparent rounded-xl p-6 border border-gold-500/20">
                    <h3 className="text-sm uppercase tracking-widest text-gold-500/70 font-semibold mb-4">
                      Telugu → Hebrew Comparison
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-500/50 uppercase tracking-widest mb-2">Telugu</p>
                        <p className="text-lg text-emerald-200">{teluguData.teluguText}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gold-500/50 uppercase tracking-widest mb-2">Hebrew</p>
                        <p className="text-lg text-gold-200 text-right" dir="rtl">{verse.hebrewText}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Telugu → Greek Comparison */}
                {verse.greekText && (
                  <div className="bg-gradient-to-b from-purple-900/10 to-transparent rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-sm uppercase tracking-widest text-purple-500/70 font-semibold mb-4">
                      Telugu → Greek Comparison
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-500/50 uppercase tracking-widest mb-2">Telugu</p>
                        <p className="text-lg text-emerald-200">{teluguData.teluguText}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-500/50 uppercase tracking-widest mb-2">Greek</p>
                        <p className="text-lg text-purple-200">{verse.greekText}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Telugu text not available for this verse.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 h-full flex flex-col">
            <p className="text-sm text-gray-400">
              Add your personal study notes for <span className="text-gold-300">{verse.bookName} {verse.chapter}:{verse.verse}</span>.
              Notes are saved automatically to your browser.
            </p>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="Type your notes here..."
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-gold-500/50 resize-none font-serif text-lg leading-relaxed"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TranslationBlock({ label, text, highlight = false }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-gold-900/10 border-gold-500/20' : 'bg-white/5 border-white/5'}`}>
      <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-lg font-serif leading-relaxed ${highlight ? 'text-gold-100' : 'text-gray-300'}`}>
        {text}
      </p>
    </div>
  );
}

function StrongsCard({ definition }: { definition: StrongsDefinition }) {
  const [expanded, setExpanded] = useState(false);

  // Parse full gloss for numbered meanings
  const glossLines = (definition.gloss || '').split('\n').filter(l => l.trim());
  const kjvMatch = definition.gloss?.match(/KJV:\s*(.+?)(?:\n|$)/i);
  const kjvUsage = kjvMatch ? kjvMatch[1] : null;

  // Get primary meaning (first numbered item)
  const meaningMatch = definition.gloss?.match(/\d\.\s*(.+?)(?:\n|$)/);
  const primaryMeaning = meaningMatch ? meaningMatch[1] : glossLines[0] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-gold-500/30 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-serif text-gold-400">{definition.word}</span>
          <span className="text-xs text-gray-500 font-mono bg-gold-900/30 px-2 py-1 rounded border border-gold-500/20">
            {definition.strongsNumber}
          </span>
        </div>
        <span className="text-xs text-gray-400">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Primary Meaning */}
      <p className="text-base text-gray-300 mb-3 leading-relaxed">{primaryMeaning || 'Definition loading...'}</p>

      {/* Meta Row - Always Visible */}
      <div className="flex flex-wrap gap-3 text-xs mb-2">
        {definition.partOfSpeech && (
          <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded">{definition.partOfSpeech}</span>
        )}
        {definition.gender && (
          <span className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded">{definition.gender}</span>
        )}
        {definition.occurrences && (
          <span className="bg-emerald-900/30 text-emerald-300 px-3 py-1 rounded font-bold">
            {definition.occurrences} occurrences
          </span>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-white/10 space-y-3"
        >
          {/* Full Gloss */}
          {glossLines.length > 1 && (
            <div>
              <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-2">Full Definition</p>
              <div className="text-sm text-gray-400 space-y-1">
                {glossLines.slice(0, 5).map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* KJV Usage */}
          {kjvUsage && (
            <div>
              <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-2">KJV Usage</p>
              <p className="text-sm text-amber-300">{kjvUsage}</p>
            </div>
          )}

          {/* First Occurrence */}
          {definition.firstOccurrence && (
            <div>
              <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-2">First Occurrence</p>
              <p className="text-sm text-blue-300">{definition.firstOccurrence}</p>
            </div>
          )}

          {/* Root Word */}
          {definition.rootWord && (
            <div>
              <p className="text-xs text-gold-500/70 uppercase tracking-widest mb-2">Root Word</p>
              <p className="text-lg text-gold-200 font-serif">{definition.rootWord}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
