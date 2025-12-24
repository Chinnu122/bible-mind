import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';

interface ChristmasVideoPlayerProps {
    onComplete: () => void;
    videoSrc: string;
}

export default function ChristmasVideoPlayer({ onComplete, videoSrc }: ChristmasVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.log('Autoplay blocked, muting and retrying:', err);
                video.muted = true;
                setIsMuted(true);
                video.play();
            });
        }
    }, []);

    const handleVideoEnd = () => {
        onComplete();
    };

    const handleSkip = () => {
        onComplete();
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            >
                {/* Video Container */}
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    playsInline
                    muted={isMuted}
                />

                {/* Controls Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top gradient for visibility */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Skip Button */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    onClick={handleSkip}
                    className="absolute top-6 right-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors pointer-events-auto"
                >
                    <span className="text-sm">Skip</span>
                    <X size={16} />
                </motion.button>

                {/* Mute Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={toggleMute}
                    className="absolute bottom-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors pointer-events-auto"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>

                {/* Christmas Message */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-lg mb-2">
                        Merry Christmas
                    </h1>
                    <p className="text-white/80 text-lg font-light">
                        "For unto us a Child is born" - Isaiah 9:6
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
