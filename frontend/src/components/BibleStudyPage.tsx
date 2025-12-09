import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, MapPin, MessageCircle, AlertTriangle, Gift, History, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { revelationChurches, Church } from '../data/revelationChurches';

interface BibleStudyPageProps {
    onBack: () => void;
}

export default function BibleStudyPage({ onBack }: BibleStudyPageProps) {
    const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>(['context', 'verses']);

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 px-4 md:px-8 pb-20"
        >
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">Back</span>
                </button>

                <h1 className="text-4xl md:text-6xl font-serif text-gold-200 mb-4">
                    Bible Study
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Deep dive into Scripture with historical context, cross-references, and detailed analysis.
                </p>
            </div>

            {/* Study Topics */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
                    <h2 className="text-2xl font-serif text-gold-300 mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6" />
                        The Seven Churches of Revelation
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        In Revelation chapters 2-3, Jesus Christ addresses seven churches in Asia Minor (modern Turkey).
                        Each message contains praise, criticism, exhortation, and promises that apply both to the historical
                        churches and to believers throughout history.
                    </p>

                    {/* Churches Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {revelationChurches.map((church) => (
                            <motion.button
                                key={church.id}
                                onClick={() => setSelectedChurch(church)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative overflow-hidden rounded-xl aspect-square group ${selectedChurch?.id === church.id
                                        ? 'ring-2 ring-gold-500'
                                        : ''
                                    }`}
                            >
                                <img
                                    src={church.image}
                                    alt={church.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white font-serif text-sm md:text-base">{church.name}</p>
                                    <p className="text-white/50 text-xs">{church.reference}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Selected Church Detail */}
                <AnimatePresence mode="wait">
                    {selectedChurch && (
                        <motion.div
                            key={selectedChurch.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-b from-gold-900/20 to-transparent rounded-2xl border border-gold-500/20 overflow-hidden"
                        >
                            {/* Church Header with Image */}
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={selectedChurch.image}
                                    alt={selectedChurch.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/50 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="flex items-center gap-2 text-gold-400 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{selectedChurch.modernName}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
                                        {selectedChurch.name}
                                    </h2>
                                    <p className="text-gold-300">{selectedChurch.passage}</p>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {/* Commendation & Criticism */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {selectedChurch.commendation && (
                                        <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 text-emerald-400 mb-3">
                                                <Gift className="w-5 h-5" />
                                                <h3 className="font-medium uppercase tracking-widest text-sm">Commendation</h3>
                                            </div>
                                            <p className="text-emerald-100">{selectedChurch.commendation}</p>
                                        </div>
                                    )}
                                    {selectedChurch.criticism && (
                                        <div className="bg-red-900/20 rounded-xl p-5 border border-red-500/20">
                                            <div className="flex items-center gap-2 text-red-400 mb-3">
                                                <AlertTriangle className="w-5 h-5" />
                                                <h3 className="font-medium uppercase tracking-widest text-sm">Criticism</h3>
                                            </div>
                                            <p className="text-red-100">{selectedChurch.criticism}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Exhortation */}
                                <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-500/20">
                                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                                        <MessageCircle className="w-5 h-5" />
                                        <h3 className="font-medium uppercase tracking-widest text-sm">Exhortation</h3>
                                    </div>
                                    <p className="text-amber-100 text-lg font-serif italic">"{selectedChurch.exhortation}"</p>
                                </div>

                                {/* Promise */}
                                <div className="bg-gold-900/20 rounded-xl p-5 border border-gold-500/20">
                                    <div className="flex items-center gap-2 text-gold-400 mb-3">
                                        <Gift className="w-5 h-5" />
                                        <h3 className="font-medium uppercase tracking-widest text-sm">Promise to Overcomers</h3>
                                    </div>
                                    <p className="text-gold-100 text-lg font-serif">"{selectedChurch.promise}"</p>
                                </div>

                                {/* Historical Context - Collapsible */}
                                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('context')}
                                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <History className="w-5 h-5" />
                                            <h3 className="font-medium uppercase tracking-widest text-sm">Historical Context</h3>
                                        </div>
                                        {expandedSections.includes('context') ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    {expandedSections.includes('context') && (
                                        <div className="px-5 pb-5">
                                            <p className="text-gray-300 leading-relaxed">{selectedChurch.historicalContext}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Key Verses - Collapsible */}
                                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('verses')}
                                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-purple-400">
                                            <BookOpen className="w-5 h-5" />
                                            <h3 className="font-medium uppercase tracking-widest text-sm">Key Verses</h3>
                                        </div>
                                        {expandedSections.includes('verses') ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    {expandedSections.includes('verses') && (
                                        <div className="px-5 pb-5 space-y-4">
                                            {selectedChurch.keyVerses.map((verse, idx) => (
                                                <div key={idx} className="bg-purple-900/10 rounded-lg p-4 border border-purple-500/10">
                                                    <p className="text-purple-300 text-sm font-mono mb-2">{verse.ref}</p>
                                                    <p className="text-purple-100 font-serif italic">"{verse.text}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Cross References */}
                                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                                        <ExternalLink className="w-5 h-5" />
                                        <h3 className="font-medium uppercase tracking-widest text-sm">Cross References</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedChurch.crossReferences.map((ref, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-white/5 px-3 py-1 rounded-full text-sm text-gray-300 border border-white/5 hover:border-gold-500/30 transition-colors cursor-pointer"
                                            >
                                                {ref}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Prompt to select if none selected */}
                {!selectedChurch && (
                    <div className="text-center py-12 text-gray-500">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Select a church above to view detailed study notes</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
