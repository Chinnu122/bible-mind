import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useState } from 'react';
import { useSettings, Language } from '../contexts/SettingsContext';

const languages: { code: Language; label: string; native: string }[] = [
    { code: 'english', label: 'English', native: 'English' },
    { code: 'telugu', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hindi', label: 'Hindi', native: 'हिन्दी' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors text-slate-300 hover:text-white"
            >
                <Globe size={18} className="text-gold-400" />
                <span className="text-sm font-medium uppercase tracking-wider hidden sm:block">
                    {languages.find(l => l.code === language)?.native || 'English'}
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-12 right-0 z-50 w-48 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gold-500/20 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${language === lang.code
                                                ? 'bg-gold-500/20 text-gold-400'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{lang.native}</span>
                                            <span className="text-xs opacity-50">{lang.label}</span>
                                        </div>
                                        {language === lang.code && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
