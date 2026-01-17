import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Book, ChevronRight, ArrowLeft } from 'lucide-react';
import { bibleAPI, BibleVerse, BibleBook } from '../api/bibleApi';
import { useBible } from '../contexts/BibleContext';

interface AdvancedSearchPageProps {
    onNavigate: (verse: BibleVerse) => void;
    onBack: () => void;
}

export default function AdvancedSearchPage({ onNavigate, onBack }: AdvancedSearchPageProps) {
    const { goToVerse } = useBible();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BibleVerse[]>([]);
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<BibleBook[]>([]);

    // Filters
    const [selectedBook, setSelectedBook] = useState<string>('all');
    const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');

    useEffect(() => {
        // Load books for filter
        bibleAPI.getBooks().then(setBooks).catch(console.error);
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            // Fetch more results to allow for client-side filtering
            const data = await bibleAPI.searchVerses(query, 1000);
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(verse => {
        // Filter by Testament (Need to lookup book testament from books array)
        const book = books.find(b => b.bookName === verse.bookName);
        if (selectedTestament !== 'all' && book?.testament !== selectedTestament) return false;

        // Filter by Book
        if (selectedBook !== 'all' && verse.bookName !== selectedBook) return false;

        return true;
    });

    const handleVerseClick = (verse: BibleVerse) => {
        goToVerse(verse.bookName, verse.chapter, verse.verse);
        onNavigate(verse);
    };

    return (
        <div className="min-h-screen pt-24 px-4 md:px-12 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <h1 className="text-3xl md:text-5xl font-serif text-gold-200 mb-2">Advanced Search</h1>
                <p className="text-slate-400">Deep dive into scripture with powerful filtering.</p>
            </div>

            {/* Search Bar & Filters */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search for words, phrases, or Strong's numbers (e.g. H430)..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-crema-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-8 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gold-500/70 text-sm font-bold uppercase tracking-widest mr-2">
                        <Filter size={16} /> Filters:
                    </div>

                    <select
                        value={selectedTestament}
                        onChange={(e) => setSelectedTestament(e.target.value as any)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-gold-500/30"
                    >
                        <option value="all">All Testaments</option>
                        <option value="old">Old Testament</option>
                        <option value="new">New Testament</option>
                    </select>

                    <select
                        value={selectedBook}
                        onChange={(e) => setSelectedBook(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-gold-500/30"
                    >
                        <option value="all">All Books</option>
                        {books
                            .filter(b => selectedTestament === 'all' || b.testament === selectedTestament)
                            .map(book => (
                                <option key={book.bookId} value={book.bookName}>{book.bookName}</option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {results.length > 0 && (
                    <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
                        <span>Found {results.length} results</span>
                        <span>Showing {filteredResults.length} filtered</span>
                    </div>
                )}

                {filteredResults.map((verse, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleVerseClick(verse)}
                        className="group p-6 bg-white/5 border border-white/5 hover:border-gold-500/30 rounded-xl cursor-pointer transition-all hover:bg-white/10"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Book size={16} className="text-gold-500" />
                                <span className="text-gold-400 font-serif text-lg">
                                    {verse.bookName} {verse.chapter}:{verse.verse}
                                </span>
                            </div>
                            <ChevronRight className="text-slate-600 group-hover:text-gold-400 transition-colors" size={20} />
                        </div>
                        <p className="text-crema-100/90 font-serif leading-relaxed text-lg">
                            <span dangerouslySetInnerHTML={{
                                __html: (verse.kjvText || verse.webText).replace(
                                    new RegExp(`(${query.split(' ').join('|')})`, 'gi'),
                                    '<span class="bg-gold-500/30 text-gold-200 px-1 rounded">$1</span>'
                                )
                            }} />
                        </p>
                        {verse.hebrewText && (
                            <p className="mt-2 text-slate-500 font-serif text-right font-hebrew" dir="rtl">{verse.hebrewText}</p>
                        )}
                    </motion.div>
                ))}

                {results.length > 0 && filteredResults.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Filter size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Results hidden by filters.</p>
                        <button onClick={() => { setSelectedBook('all'); setSelectedTestament('all') }} className="text-gold-400 hover:underline mt-2">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
