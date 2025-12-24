import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HolidayCountdown from './HolidayCountdown';
import MegaIntro from './MegaIntro';
import ChristmasVideoPlayer from './ChristmasVideoPlayer';

export type HolidayMode = 'none' | 'christmas-eve' | 'christmas-day' | 'new-year-countdown' | 'new-year-day';

interface HolidayManagerProps {
    onModeChange?: (mode: HolidayMode) => void;
}

export default function HolidayManager({ onModeChange }: HolidayManagerProps) {
    const [mode, setMode] = useState<HolidayMode>('none');
    const [showIntro, setShowIntro] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [introSeen, setIntroSeen] = useState<{ christmas: boolean; newyear: boolean; christmasVideo: boolean }>({
        christmas: false,
        newyear: false,
        christmasVideo: false
    });

    useEffect(() => {
        // Check local storage for seen intros
        const saved = localStorage.getItem('bible-mind-holiday-intros');
        if (saved) {
            setIntroSeen(JSON.parse(saved));
        }

        const checkDate = () => {
            const now = new Date();
            const month = now.getMonth(); // 0-11 (11 is Dec, 0 is Jan)
            const day = now.getDate();

            // For testing purposes, we can override date here if needed
            // const now = new Date('2025-12-25T00:00:01');

            let currentMode: HolidayMode = 'none';

            // Christmas Eve: Dec 24
            if (month === 11 && day === 24) {
                currentMode = 'christmas-eve';
            }
            // Christmas Day: Dec 25
            else if (month === 11 && day === 25) {
                currentMode = 'christmas-day';
            }
            // New Year Countdown: Dec 26 - Dec 31
            else if (month === 11 && day >= 26) {
                currentMode = 'new-year-countdown';
            }
            // New Year Day: Jan 1
            else if (month === 0 && day === 1) {
                currentMode = 'new-year-day';
            }

            setMode(currentMode);
        };

        checkDate();
        const interval = setInterval(checkDate, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Notify parent of mode change
    useEffect(() => {
        if (onModeChange) onModeChange(mode);
    }, [mode, onModeChange]);

    // Trigger Intro Logic
    useEffect(() => {
        if (mode === 'christmas-day' && !introSeen.christmas) {
            setShowIntro(true);
        } else if (mode === 'new-year-day' && !introSeen.newyear) {
            setShowIntro(true);
        }
    }, [mode, introSeen]);

    const handleIntroComplete = () => {
        setShowIntro(false);

        let updatedSeen = { ...introSeen };
        if (mode === 'christmas-day') updatedSeen.christmas = true;
        if (mode === 'new-year-day') updatedSeen.newyear = true;

        setIntroSeen(updatedSeen);
        localStorage.setItem('bible-mind-holiday-intros', JSON.stringify(updatedSeen));
    };

    // Christmas Countdown Target
    const christmasTarget = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0);

    // New Year Countdown Target
    const nextYear = new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    const newYearTarget = new Date(nextYear, 0, 1, 0, 0, 0);

    // Theme Colors Injection
    useEffect(() => {
        const root = document.documentElement;
        if (mode === 'christmas-eve' || mode === 'christmas-day') {
            root.style.setProperty('--color-gold-500', '#D4AF37'); // Classic Gold
            root.style.setProperty('--color-crema-50', '#FFF5E1'); // Warm Cream
        } else if (mode === 'new-year-countdown' || mode === 'new-year-day') {
            root.style.setProperty('--color-gold-500', '#C0C0C0'); // Silver/Platinum override
            // We keep gold mostly but add silver accents logic effectively via component render
        }
    }, [mode]);

    return (
        <>
            <AnimatePresence>
                {showIntro && mode === 'christmas-day' && (
                    <MegaIntro
                        key="christmas-intro"
                        theme="christmas"
                        onComplete={handleIntroComplete}
                        texts={[
                            "Glory to God in the Highest",
                            "And on Earth Peace",
                            "Goodwill toward Men",
                            "Merry Christmas"
                        ]}
                        subtexts={[
                            "Luke 2:14",
                            "For unto us a Child is born, unto us a Son is given.",
                            "Celebrate the birth of our Savior.",
                            "May His light shine in your heart today."
                        ]}
                    />
                )}

                {showIntro && mode === 'new-year-day' && (
                    <MegaIntro
                        key="newyear-intro"
                        theme="newyear"
                        onComplete={handleIntroComplete}
                        texts={[
                            "Behold",
                            "I Am Making All Things New",
                            "Happy New Year",
                            "2026"
                        ]}
                        subtexts={[
                            "Revelation 21:5",
                            "Forget the former things; do not dwell on the past.",
                            "A new season of blessings awaits.",
                            "Walk in His grace this year."
                        ]}
                    />
                )}
            </AnimatePresence>

            {/* Christmas Video Player */}
            <AnimatePresence>
                {showVideo && (
                    <ChristmasVideoPlayer
                        key="christmas-video"
                        videoSrc="/videos/christmas-video.mp4"
                        onComplete={() => {
                            setShowVideo(false);
                            const updated = { ...introSeen, christmasVideo: true };
                            setIntroSeen(updated);
                            localStorage.setItem('bible-mind-holiday-intros', JSON.stringify(updated));
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Effects removed - user found them distracting */}

            {/* Countdowns */}
            <AnimatePresence>
                {mode === 'christmas-eve' && (
                    <HolidayCountdown
                        targetDate={christmasTarget}
                        onComplete={() => {
                            setMode('christmas-day');
                            // Show video if not seen
                            if (!introSeen.christmasVideo) {
                                setShowVideo(true);
                            }
                        }}
                        label="CHRISTMAS COUNTDOWN"
                    />
                )}

                {mode === 'new-year-countdown' && (
                    <HolidayCountdown
                        targetDate={newYearTarget}
                        onComplete={() => setMode('new-year-day')}
                        label="NEW YEAR COUNTDOWN"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
