import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Book, Users, Crown, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';

interface BiblicalName {
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

interface DivineLibraryProps {
    onClose: () => void;
}

export default function DivineLibrary({ onClose }: DivineLibraryProps) {
    const [names, setNames] = useState<BiblicalName[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedName, setSelectedName] = useState<BiblicalName | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    // Load Biblical names data
    useEffect(() => {
        const loadNames = async () => {
            try {
                const response = await fetch('/data/biblical_names.json');
                const data = await response.json();
                setNames(data);
            } catch (error) {
                console.error('Failed to load Biblical names:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNames();
    }, []);

    // Get unique categories
    const categories = [...new Set(names.map(n => n.category))].sort();

    // Filter names based on search and category
    const filteredNames = names.filter(name => {
        const matchesSearch = !searchQuery ||
            name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
            name.telugu.includes(searchQuery);
        const matchesCategory = !categoryFilter || name.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            'Patriarch': <Crown className="w-4 h-4" />,
            'Matriarch': <Crown className="w-4 h-4" />,
            'Prophet': <Sparkles className="w-4 h-4" />,
            'Apostle': <Users className="w-4 h-4" />,
            'King': <Crown className="w-4 h-4" />,
            'Messiah': <Sparkles className="w-4 h-4" />,
        };
        return icons[category] || <Book className="w-4 h-4" />;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Patriarch': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            'Matriarch': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            'Prophet': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'Apostle': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'King': 'bg-gold-500/20 text-gold-300 border-gold-500/30',
            'Messiah': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            'Angel': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
            'Archangel': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
        return colors[category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed inset-4 md:inset-10 bg-[#0a0a0a] rounded-2xl border border-gold-500/20 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex-none p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/50 to-purple-950/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-gold-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gold-200">Divine Library</h2>
                                <p className="text-sm text-slate-400">Biblical Names & Their Meanings</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search names, meanings, or Telugu..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setCategoryFilter(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!categoryFilter
                                    ? 'bg-gold-500/30 text-gold-200 border border-gold-500/50'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            All ({names.length})
                        </button>
                        {categories.slice(0, 8).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === cat
                                        ? getCategoryColor(cat)
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Names List */}
                    <div className={`${selectedName ? 'w-1/3 hidden md:block' : 'w-full'} overflow-y-auto p-4 border-r border-white/10`}>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredNames.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                No names found matching "{searchQuery}"
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {filteredNames.map((name) => (
                                    <button
                                        key={name.name}
                                        onClick={() => setSelectedName(name)}
                                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedName?.name === name.name
                                                ? 'bg-gold-500/20 border border-gold-500/30'
                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(name.category)}`}>
                                                    {getCategoryIcon(name.category)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{name.name}</h3>
                                                    <p className="text-xs text-slate-400">{name.meaning}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Name Details */}
                    <AnimatePresence mode="wait">
                        {selectedName && (
                            <motion.div
                                key={selectedName.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1 overflow-y-auto p-6 bg-[#0c0c0c]"
                            >
                                {/* Back button on mobile */}
                                <button
                                    onClick={() => setSelectedName(null)}
                                    className="md:hidden mb-4 text-sm text-slate-400 hover:text-white flex items-center gap-1"
                                >
                                    ← Back to list
                                </button>

                                {/* Name Header */}
                                <div className="text-center mb-8">
                                    <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-3 ${getCategoryColor(selectedName.category)}`}>
                                        {selectedName.category}
                                    </div>
                                    <h2 className="text-4xl font-bold text-gold-200 mb-2">{selectedName.name}</h2>
                                    {selectedName.hebrew && (
                                        <p className="text-3xl text-amber-400 font-serif mb-1" dir="rtl">{selectedName.hebrew}</p>
                                    )}
                                    {selectedName.greek && (
                                        <p className="text-2xl text-blue-400 font-serif">{selectedName.greek}</p>
                                    )}
                                </div>

                                {/* Meanings */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-emerald-950/30 rounded-xl p-5 border border-emerald-500/20">
                                        <h4 className="text-xs uppercase tracking-widest text-emerald-500/70 mb-2 font-bold">తెలుగు అర్థం</h4>
                                        <p className="text-xl text-emerald-200">{selectedName.telugu}</p>
                                    </div>
                                    <div className="bg-gold-950/30 rounded-xl p-5 border border-gold-500/20">
                                        <h4 className="text-xs uppercase tracking-widest text-gold-500/70 mb-2 font-bold">English Meaning</h4>
                                        <p className="text-xl text-crema-100">{selectedName.meaning}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                        <span className="text-slate-500">🌍</span>
                                        <span className="text-slate-400">Origin:</span>
                                        <span className="text-white font-medium">{selectedName.origin}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                        <span className="text-slate-500">📚</span>
                                        <span className="text-slate-400">Strong's:</span>
                                        <span className="text-gold-300 font-mono">{selectedName.strongsRef}</span>
                                    </div>
                                </div>

                                {/* Bible References */}
                                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                        <Book className="w-4 h-4" />
                                        Bible References
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedName.references.map((ref, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-1 border border-blue-500/30"
                                            >
                                                {ref}
                                                <ExternalLink className="w-3 h-3 opacity-50" />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty state for desktop */}
                    {!selectedName && (
                        <div className="hidden md:flex flex-1 items-center justify-center text-slate-500">
                            <div className="text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Select a name to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
