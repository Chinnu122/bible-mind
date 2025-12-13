import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, Theme } from '../contexts/SettingsContext';
import { X, Volume2, VolumeX, Moon, Sun, Scroll, Zap, Paintbrush, Music, Info, Monitor, Type } from 'lucide-react';
import { useState } from 'react';

export default function SettingsModal() {
    const { theme, setTheme, soundEnabled, setSoundEnabled, setIsSettingsOpen, particles, setParticles, volume, setVolume, fontSize, setFontSize } = useSettings();
    const [activeTab, setActiveTab] = useState<'visuals' | 'sound' | 'about'>('visuals');

    const themes: { id: Theme; name: string; icon: any; color: string; desc: string }[] = [
        { id: 'divine', name: 'Divine', icon: Sun, color: 'from-amber-100 to-amber-500', desc: 'Heavenly Light' },
        { id: 'midnight', name: 'Midnight', icon: Moon, color: 'from-slate-900 to-blue-900', desc: 'Deep Space' },
        { id: 'parchment', name: 'Parchment', icon: Scroll, color: 'from-[#f4e4bc] to-[#d4c5a0]', desc: 'Ancient Scroll' },
    ];

    const tabVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsSettingsOpen(false)}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl h-[600px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex overflow-hidden"
            >
                {/* Sidebar */}
                <div className="w-20 md:w-64 bg-black/20 border-r border-white/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-editorial text-crema-50 mb-8 hidden md:block">Settings</h2>
                        <div className="flex flex-col gap-2">
                            {[
                                { id: 'visuals', icon: Paintbrush, label: 'Visuals' },
                                { id: 'sound', icon: Music, label: 'Sound' },
                                { id: 'about', icon: Info, label: 'About' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-gold-500/20 text-gold-400 shadow-lg shadow-gold-500/5'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    <span className="hidden md:block font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-slate-600 hidden md:block">
                        v2.5.0 Premium
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <X size={20} className="text-slate-400 hover:text-white" />
                    </button>

                    <AnimatePresence mode="wait">
                        {activeTab === 'visuals' && (
                            <motion.div
                                key="visuals"
                                variants={tabVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Monitor size={14} /> Theme & Atmosphere
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {themes.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`group relative h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden text-left ${theme === t.id ? 'border-gold-500 shadow-gold-500/20 shadow-lg scale-[1.02]' : 'border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r ${t.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                                <div className="absolute inset-0 p-5 flex items-center justify-between z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center ${theme === t.id ? 'text-gold-400' : 'text-slate-400'}`}>
                                                            <t.icon size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg text-crema-50">{t.name}</h4>
                                                            <p className="text-xs text-slate-400">{t.desc}</p>
                                                        </div>
                                                    </div>
                                                    {theme === t.id && (
                                                        <motion.div layoutId="activeCheck" className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-black" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Type size={14} /> Typography
                                    </h3>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                        <span className="text-crema-50 font-medium">Reading Size</span>
                                        <div className="flex bg-black/20 rounded-lg p-1">
                                            {['normal', 'large'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setFontSize(size as any)}
                                                    className={`px-4 py-1.5 rounded-md text-sm transition-all capitalize ${fontSize === size ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap size={14} /> Performance
                                    </h3>
                                    <button
                                        onClick={() => setParticles(!particles)}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-crema-50 font-medium">Particle Effects</span>
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${particles ? 'bg-gold-500' : 'bg-slate-700'}`}>
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white shadow-sm"
                                                animate={{ x: particles ? 24 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </button>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'sound' && (
                            <motion.div
                                key="sound"
                                variants={tabVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Volume2 size={14} /> Master Audio
                                    </h3>

                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                        <div className="flex justify-between mb-4">
                                            <span className="text-crema-50 font-medium">Volume Level</span>
                                            <span className="text-gold-400 font-mono text-sm">{Math.round(volume * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={volume}
                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className="w-full mt-4 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {soundEnabled ? <Volume2 className="text-gold-400" size={20} /> : <VolumeX className="text-slate-500" size={20} />}
                                            <span className="text-crema-50 font-medium">UI Click Sounds</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${soundEnabled ? 'bg-gold-500' : 'bg-slate-700'}`}>
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white shadow-sm"
                                                animate={{ x: soundEnabled ? 24 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </button>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'about' && (
                            <motion.div
                                key="about"
                                variants={tabVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-400 mx-auto">
                                    <Info size={40} />
                                </div>
                                <h3 className="text-2xl font-editorial text-crema-50 mb-2">Bible Mind</h3>
                                <p className="text-slate-400 mb-6">Version 2.5.0 (Premium Build)</p>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                                    Designed to help you connect with the Word in a peaceful, distraction-free environment.
                                    Built with modern web technologies for a smooth experience.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

