import { useEffect, useRef } from 'react';
import { useSettings, Atmosphere } from '../contexts/SettingsContext';

const SOUNDS: Record<Atmosphere, string> = {
    none: '',
    rain: '/sounds/soft-rain.mp3',
    celestial: '/sounds/celestial-drone.mp3',
    monastery: '/sounds/monastery-chant.mp3',
    relax: '/sounds/relax-chill.mp3',
    focus: '/sounds/focus-flow.mp3',
    meditate: '/sounds/meditate-zen.mp3'
};

export default function AtmospherePlayer() {
    const { atmosphere, volume } = useSettings();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const src = SOUNDS[atmosphere];

        if (!src) {
            audio.pause();
            audio.currentTime = 0;
            return;
        }

        audio.src = src;
        audio.volume = volume;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Auto-play was prevented
                console.log("Audio play prevented:", error);
            });
        }

    }, [atmosphere]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            loop
            className="hidden"
        />
    );
}
