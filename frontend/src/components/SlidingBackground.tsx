import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const slides = [
    '/slide-1.jpg',
    '/slide-2.png',
    '/slide-3.jpg',
    '/slide-4.jpg'
];

export default function SlidingBackground() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload all images on mount
    useEffect(() => {
        let loadedCount = 0;
        slides.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === slides.length) {
                    setImagesLoaded(true);
                }
            };
        });
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000); // Slower transitions = smoother

        return () => clearInterval(interval);
    }, [imagesLoaded]);

    if (!imagesLoaded) {
        return (
            <div className="fixed inset-0 z-0 bg-black" />
        );
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Static blurred background - always visible, prevents flash */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                style={{
                    backgroundImage: `url('${slides[currentSlide]}')`,
                    willChange: 'auto'
                }}
            />

            <AnimatePresence initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center blur-sm"
                    style={{
                        backgroundImage: `url('${slides[currentSlide]}')`,
                        willChange: 'opacity'
                    }}
                />
            </AnimatePresence>

            {/* Dark overlay for content readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
    );
}
