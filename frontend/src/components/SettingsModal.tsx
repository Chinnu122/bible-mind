import { motion } from 'framer-motion';
import { useSettings, Theme } from '../contexts/SettingsContext';
import { X, Volume2, VolumeX, Sparkles, Moon, Sun, Scroll, Zap } from 'lucide-react';

export default function SettingsModal() {
    const { theme, setTheme, soundEnabled, setSoundEnabled, setIsSettingsOpen, particles, setParticles } = useSettings();

    const themes: { id: Theme; name: string; icon: any; color: string; desc: string }[] = [
        { id: 'divine', name: 'Divine', icon: Sun, color: 'bg-gradient-to-br from-gray-900 to-black border-gold-500/50', desc: 'Premium Gold & Dark' },
        { id: 'midnight', name: 'Midnight', icon: Moon, color: 'bg-gradient-to-br from-slate-900 to-blue-900 border-blue-500/50', desc: 'Deep Space & Neon' },
        { id: 'parchment', name: 'Parchment', icon: Scroll, color: 'bg-[#f4e4bc] border-[#8b4513]/50', desc: 'Ancient Scroll Light' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto"
        >
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsSettingsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                <h2 className="text-3xl font-cinzel font-bold text-white mb-2">Experience Settings</h2>
                <p className="text-white/50 mb-8 font-lato">Customize your reality.</p>

                {/* Theme Selection */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Select Reality</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden ${theme === t.id ? 'border-white scale-105 shadow-xl' : 'border-transparent hover:border-white/20'
                                    } ${t.color}`}
                            >
                                <div className={`p-3 rounded-full w-fit mb-3 ${theme === t.id ? 'bg-white text-black' : 'bg-black/20 text-white'}`}>
                                    <t.icon className="w-6 h-6" />
                                </div>
                                <h4 className={`text-lg font-bold mb-1 ${t.id === 'parchment' ? 'text-black' : 'text-white'}`}>{t.name}</h4>
                                <p className={`text-xs ${t.id === 'parchment' ? 'text-black/60' : 'text-white/60'}`}>{t.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div>
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Immersion</h3>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </div>
                                <span className="text-white font-medium">Interface Sounds</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-white/10'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </button>

                        <button
                            onClick={() => setParticles(!particles)}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">Performance Mode (Disables Sparkles)</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${!particles ? 'bg-green-500' : 'bg-white/10'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${!particles ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
