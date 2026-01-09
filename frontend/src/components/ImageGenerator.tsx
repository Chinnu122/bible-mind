import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { generateBibleImage, getImageUsageStats } from '../services/geminiService';

const PRESET_SUBJECTS = [
    { label: 'Jesus Teaching', prompt: 'Jesus teaching disciples on a mountain' },
    { label: 'David vs Goliath', prompt: 'David facing Goliath in battle' },
    { label: 'Noah\'s Ark', prompt: 'Noah\'s Ark with animals during the flood' },
    { label: 'Moses Parting Sea', prompt: 'Moses parting the Red Sea' },
    { label: 'Garden of Eden', prompt: 'The Garden of Eden with Adam and Eve' },
    { label: 'Nativity Scene', prompt: 'Baby Jesus in the manger, nativity scene' },
    { label: 'Burning Bush', prompt: 'Moses before the burning bush' },
    { label: 'Daniel & Lions', prompt: 'Daniel in the lions den, peaceful' }
];

const STYLE_OPTIONS = [
    { value: 'artistic', label: '🎨 Artistic', desc: 'Oil painting, Renaissance' },
    { value: 'realistic', label: '📷 Realistic', desc: 'Photorealistic, Cinematic' },
    { value: 'illustration', label: '📖 Illustration', desc: 'Children\'s book style' },
    { value: 'stained-glass', label: '⛪ Stained Glass', desc: 'Cathedral window style' }
] as const;

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState<'realistic' | 'artistic' | 'illustration' | 'stained-glass'>('artistic');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usageStats, setUsageStats] = useState({ used: 0, remaining: 5, limit: 5 });

    useEffect(() => {
        setUsageStats(getImageUsageStats());
    }, [imageUrl]);

    const handleGenerate = async (customPrompt?: string) => {
        const finalPrompt = customPrompt || prompt;
        if (!finalPrompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const url = await generateBibleImage(finalPrompt, style);
            setImageUrl(url);
            setUsageStats(getImageUsageStats());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError(null);

        try {
            const url = await generateBibleImage(prompt, style);
            setImageUrl(url);
            setUsageStats(getImageUsageStats());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to regenerate');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `bible-image-${Date.now()}.png`;
        link.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-serif text-gold-200 mb-2 flex items-center justify-center gap-3">
                    <ImageIcon className="w-8 h-8 text-purple-400" />
                    AI Image Generator
                </h2>
                <p className="text-slate-400">Create beautiful Bible-themed artwork</p>

                {/* Usage Stats */}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/30">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">
                        {usageStats.remaining}/{usageStats.limit} images remaining today
                    </span>
                </div>
            </div>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto space-y-4">
                {/* Custom Prompt */}
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your image (e.g., 'Jesus walking on water at sunset')"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none h-24"
                    />
                </div>

                {/* Style Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {STYLE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setStyle(opt.value)}
                            className={`p-3 rounded-xl border transition-all ${style === opt.value
                                ? 'bg-purple-600/30 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                }`}
                        >
                            <div className="text-lg">{opt.label}</div>
                            <div className="text-xs opacity-60 mt-1">{opt.desc}</div>
                        </button>
                    ))}
                </div>

                {/* Generate Button */}
                <button
                    onClick={() => handleGenerate()}
                    disabled={loading || !prompt.trim() || usageStats.remaining <= 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-5 h-5" />
                            Generate Image
                        </>
                    )}
                </button>

                {/* Preset Subjects */}
                <div>
                    <p className="text-slate-500 text-sm mb-2">Or try a preset:</p>
                    <div className="flex flex-wrap gap-2">
                        {PRESET_SUBJECTS.map((subject) => (
                            <button
                                key={subject.label}
                                onClick={() => {
                                    setPrompt(subject.prompt);
                                    handleGenerate(subject.prompt);
                                }}
                                disabled={loading || usageStats.remaining <= 0}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-full text-sm text-slate-300 transition border border-white/10"
                            >
                                {subject.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16 text-purple-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-lg">Creating your masterpiece...</p>
                    <p className="text-sm text-slate-500 mt-2">This may take 10-30 seconds</p>
                </div>
            )}

            {/* Generated Image */}
            <AnimatePresence>
                {imageUrl && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                            <img
                                src={imageUrl}
                                alt={prompt}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={handleRegenerate}
                                disabled={loading || usageStats.remaining <= 0}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 transition disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Regenerate
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 transition"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
