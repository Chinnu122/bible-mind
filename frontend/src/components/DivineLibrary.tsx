import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Book, Users, ChevronRight, ExternalLink, MapPin, Sparkles, Wand2, Music, Cross, PlayCircle } from 'lucide-react';
import InfographicPlayer from './InfographicPlayer';

interface BiblicalItem {
    name: string;
    hebrew?: string;
    greek?: string;
    meaning: string;
    telugu: string;
    origin: string;
    strongsRef: string;
    references: string[];
    category: string;
}

interface InfographicBook {
    id: string;
    title: string;
    color: string;
    bgMusic?: string;
    content: any; // Using any for brevity as the full type is in the component
    icon: string;
}

interface DivineLibraryProps {
    onClose: () => void;
}

export default function DivineLibrary({ onClose }: DivineLibraryProps) {
    const [activeTab, setActiveTab] = useState<'names' | 'places' | 'infographics'>('names');
    const [names, setNames] = useState<BiblicalItem[]>([]);
    const [places, setPlaces] = useState<BiblicalItem[]>([]);
    const [infographics, setInfographics] = useState<InfographicBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<BiblicalItem | null>(null);
    const [selectedInfographic, setSelectedInfographic] = useState<InfographicBook | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [namesRes, placesRes, infoRes] = await Promise.all([
                    fetch('/data/biblical_names.json'),
                    fetch('/data/biblical_places.json'),
                    fetch('/data/infographic_books.json').catch(() => ({ json: () => [] })) // Fallback if file missing
                ]);

                // Handle potential 404s cleanly
                if (namesRes.ok) setNames(await namesRes.json());
                if (placesRes.ok) setPlaces(await placesRes.json());

                // Allow infographic fetch to fail gracefully (e.g. if file is 404)
                try {
                    const infoData = await infoRes.json();
                    if (Array.isArray(infoData)) setInfographics(infoData);
                } catch (e) { console.warn("Infographics data not available"); }

            } catch (e) { console.error('Load error', e); }
            finally { setLoading(false); }
        };
        loadData();
    }, []);

    const currentItems = activeTab === 'names' ? names : activeTab === 'places' ? places : [];

    // Filter Names/Places
    const filteredItems = currentItems.filter(item => {
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.telugu.includes(searchQuery);
        return matchesSearch && (!categoryFilter || item.category === categoryFilter);
    });

    // Filter Infographics
    const filteredInfographics = infographics.filter(book =>
        !searchQuery || book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(currentItems.map(n => n.category))].sort();

    const getCategoryColor = (cat: string) => {
        const c: Record<string, string> = {
            'Patriarch': 'bg-amber-500/20 text-amber-300', 'Matriarch': 'bg-rose-500/20 text-rose-300',
            'Prophet': 'bg-purple-500/20 text-purple-300', 'Apostle': 'bg-blue-500/20 text-blue-300',
            'King': 'bg-gold-500/20 text-gold-300', 'Messiah': 'bg-emerald-500/20 text-emerald-300',
            'Holy City': 'bg-gold-500/20 text-gold-300', 'Region': 'bg-emerald-500/20 text-emerald-300',
            'Mountain': 'bg-amber-500/20 text-amber-300', 'River': 'bg-blue-500/20 text-blue-300',
            'City': 'bg-purple-500/20 text-purple-300', 'Nation': 'bg-orange-500/20 text-orange-300',
        };
        return c[cat] || 'bg-slate-500/20 text-slate-300';
    };

    const getBookIcon = (iconName: string) => {
        switch (iconName) {
            case 'sparkles': return <Sparkles className="w-6 h-6 text-gold-400" />;
            case 'waves': return <Wand2 className="w-6 h-6 text-blue-400" />; // approximating waves 
            case 'music': return <Music className="w-6 h-6 text-purple-400" />;
            case 'compass': return <MapPin className="w-6 h-6 text-emerald-400" />;
            case 'cross': return <Cross className="w-6 h-6 text-red-400" />;
            default: return <Book className="w-6 h-6 text-slate-400" />;
        }
    }

    return (
        <>
            <AnimatePresence>
                {selectedInfographic && (
                    <InfographicPlayer
                        book={selectedInfographic}
                        onClose={() => setSelectedInfographic(null)}
                    />
                )}
            </AnimatePresence>

            {/* Main Modal - Hide if infographic player is open to avoid clutter, or just layer above */}
            {!selectedInfographic && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={onClose} />

                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-4 md:inset-10 bg-[#0a0a0a] rounded-2xl border border-gold-500/20 shadow-2xl z-50 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex-none p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/50 to-purple-950/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                                        {activeTab === 'names' ? <Users className="w-6 h-6 text-gold-400" /> :
                                            activeTab === 'places' ? <MapPin className="w-6 h-6 text-gold-400" /> :
                                                <PlayCircle className="w-6 h-6 text-gold-400" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gold-200">Divine Library</h2>
                                        <p className="text-sm text-slate-400">
                                            {activeTab === 'names' ? 'Biblical Names & Meanings' :
                                                activeTab === 'places' ? 'Biblical Places & Meanings' :
                                                    'Interactive Infographic Books'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            {/* Tabs */}
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => { setActiveTab('names'); setCategoryFilter(null); setSelectedItem(null); }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'names' ? 'bg-gold-500/30 text-gold-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    <Users className="w-4 h-4" /> Names
                                </button>
                                <button onClick={() => { setActiveTab('places'); setCategoryFilter(null); setSelectedItem(null); }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'places' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    <MapPin className="w-4 h-4" /> Places
                                </button>
                                <button onClick={() => { setActiveTab('infographics'); setCategoryFilter(null); setSelectedItem(null); }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'infographics' ? 'bg-purple-500/30 text-purple-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    <PlayCircle className="w-4 h-4" /> Infographics
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50" />
                            </div>

                            {/* Categories (Only for Names/Places) */}
                            {activeTab !== 'infographics' && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button onClick={() => setCategoryFilter(null)}
                                        className={`px-3 py-1 rounded-lg text-xs ${!categoryFilter ? 'bg-gold-500/30 text-gold-200' : 'bg-white/5 text-slate-400'}`}>
                                        All ({currentItems.length})
                                    </button>
                                    {categories.slice(0, 6).map(cat => (
                                        <button key={cat} onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                                            className={`px-3 py-1 rounded-lg text-xs ${categoryFilter === cat ? getCategoryColor(cat) : 'bg-white/5 text-slate-400'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex bg-[#0c0c0c]">
                            {activeTab === 'infographics' ? (
                                // Infographics Grid View
                                <div className="p-6 w-full overflow-y-auto">
                                    {filteredInfographics.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                            <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                                <PlayCircle className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p>No infographic books available.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredInfographics.map(book => (
                                                <button
                                                    key={book.id}
                                                    onClick={() => setSelectedInfographic(book)}
                                                    className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all text-left"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/80 z-10" />
                                                    {/* Stylized background using book color */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                                                    <div className="relative z-20 p-6 flex flex-col h-full min-h-[200px] justify-between">
                                                        <div className="flex justify-between items-start">
                                                            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                                                {getBookIcon(book.icon)}
                                                            </div>
                                                            <div className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-white/10 text-white/70">
                                                                Animated
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-2xl font-bold text-white mb-1">{book.title}</h3>
                                                            <p className="text-sm text-slate-400">Interactive visual journey through the scriptures</p>

                                                            <div className="mt-4 flex items-center gap-2 text-gold-400 text-sm font-medium group-hover:gap-3 transition-all">
                                                                Start Watching <ChevronRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Existing List/Details View for Names/Places
                                <>
                                    <div className={`${selectedItem ? 'w-1/3 hidden md:block' : 'w-full'} overflow-y-auto p-4 border-r border-white/10`}>
                                        {loading ? (
                                            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
                                        ) : filteredItems.length === 0 ? (
                                            <div className="text-center py-20 text-slate-500">No results found</div>
                                        ) : (
                                            <div className="grid gap-2">
                                                {filteredItems.map((item) => (
                                                    <button key={item.name} onClick={() => setSelectedItem(item)}
                                                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedItem?.name === item.name ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(item.category)}`}>
                                                                    {activeTab === 'places' ? <MapPin className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-white">{item.name}</h3>
                                                                    <p className="text-xs text-slate-400">{item.meaning}</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {selectedItem && (
                                            <motion.div key={selectedItem.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                                className="flex-1 overflow-y-auto p-6 bg-[#0c0c0c]">
                                                <button onClick={() => setSelectedItem(null)} className="md:hidden mb-4 text-sm text-slate-400">← Back</button>

                                                <div className="text-center mb-8">
                                                    <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-3 ${getCategoryColor(selectedItem.category)}`}>{selectedItem.category}</div>
                                                    <h2 className="text-4xl font-bold text-gold-200 mb-2">{selectedItem.name}</h2>
                                                    {selectedItem.hebrew && <p className="text-3xl text-amber-400 font-serif" dir="rtl">{selectedItem.hebrew}</p>}
                                                    {selectedItem.greek && <p className="text-2xl text-blue-400 font-serif">{selectedItem.greek}</p>}
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-emerald-950/30 rounded-xl p-5 border border-emerald-500/20">
                                                        <h4 className="text-xs uppercase text-emerald-500/70 mb-2 font-bold">తెలుగు అర్థం</h4>
                                                        <p className="text-xl text-emerald-200">{selectedItem.telugu}</p>
                                                    </div>
                                                    <div className="bg-gold-950/30 rounded-xl p-5 border border-gold-500/20">
                                                        <h4 className="text-xs uppercase text-gold-500/70 mb-2 font-bold">English Meaning</h4>
                                                        <p className="text-xl text-crema-100">{selectedItem.meaning}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                                        <span>🌍</span><span className="text-slate-400">Origin:</span>
                                                        <span className="text-white font-medium">{selectedItem.origin}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                                        <span>📚</span><span className="text-slate-400">Strong's:</span>
                                                        <span className="text-gold-300 font-mono">{selectedItem.strongsRef}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Book className="w-4 h-4" /> Bible References</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedItem.references.map((ref, idx) => (
                                                            <span key={idx} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-1">
                                                                {ref} <ExternalLink className="w-3 h-3 opacity-50" />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!selectedItem && (
                                        <div className="hidden md:flex flex-1 items-center justify-center text-slate-500">
                                            <div className="text-center">
                                                {activeTab === 'places' ? <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" /> : <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />}
                                                <p>Select {activeTab === 'names' ? 'a name' : 'a place'} to view details</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
}
