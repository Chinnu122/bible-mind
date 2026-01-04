import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Volume2, VolumeX, Globe } from 'lucide-react';

interface Slide {
    id: number;
    text: string;
    detail: string;
    image: string;
}

interface LanguageContent {
    title: string;
    slides: Slide[];
}

interface InfographicBook {
    id: string;
    title: string;
    color: string;
    bgMusic?: string;
    content: {
        en: LanguageContent;
        te: LanguageContent;
        hi: LanguageContent;
    };
}

interface InfographicPlayerProps {
    book: InfographicBook;
    onClose: () => void;
}

export default function InfographicPlayer({ book, onClose }: InfographicPlayerProps) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentContent = book.content[language];
    const slides = currentContent.slides;
    const currentSlide = slides[currentSlideIndex];

    useEffect(() => {
        if (book.bgMusic) {
            audioRef.current = new Audio(book.bgMusic);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
            if (!isMuted) {
                audioRef.current.play().catch(e => console.log("Audio play failed (autoplay policy):", e));
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [book.bgMusic]);

    useEffect(() => {
        if (audioRef.current) {
            if (isMuted) audioRef.current.pause();
            else audioRef.current.play().catch(() => { });
        }
    }, [isMuted]);

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const toggleLanguage = () => {
        const langs: ('en' | 'te' | 'hi')[] = ['en', 'te', 'hi'];
        const currentIndex = langs.indexOf(language);
        const nextIndex = (currentIndex + 1) % langs.length;
        setLanguage(langs[nextIndex]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black text-white flex flex-col"
        >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.image}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-gold-200">{currentContent.title}</h2>
                            <p className="text-xs text-slate-300 uppercase tracking-widest">
                                {language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleLanguage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2 px-4 transition-colors">
                            <Globe className="w-5 h-5 text-gold-400" />
                            <span className="text-sm font-medium uppercase">{language}</span>
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
                        </button>
                    </div>
                </div>

                {/* Main Slide Content */}
                <div className="flex-1 flex items-center justify-center p-8 md:p-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentSlideIndex}-${language}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-4xl w-full text-center"
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight drop-shadow-lg">
                                {currentSlide.text}
                            </h1>
                            <div className="w-24 h-1 bg-gold-500/50 mx-auto mb-8 rounded-full" />
                            <p className="text-lg md:text-2xl text-slate-200 font-serif leading-relaxed italic opacity-90">
                                {currentSlide.detail}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls & Progress */}
                <div className="p-8">
                    <div className="max-w-3xl mx-auto flex items-center gap-6">
                        <button
                            onClick={prevSlide}
                            disabled={currentSlideIndex === 0}
                            className={`p-4 rounded-full border border-white/20 transition-all ${currentSlideIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 active:scale-95'}`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex-1 flex gap-1 h-1.5 align-middle">
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-full rounded-full flex-1 transition-all duration-300 ${idx <= currentSlideIndex ? 'bg-gold-500' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            disabled={currentSlideIndex === slides.length - 1}
                            className={`p-4 rounded-full border border-white/20 transition-all ${currentSlideIndex === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 active:scale-95'}`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="text-center mt-4 text-xs text-slate-500 font-mono">
                        SLIDE {currentSlideIndex + 1} / {slides.length}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
