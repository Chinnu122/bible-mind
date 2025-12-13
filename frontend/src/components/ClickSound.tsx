import { useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

// Singleton AudioContext for performance (avoid creating new one on each click)
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
        // Resume if suspended (browser policy)
        if (sharedAudioContext.state === 'suspended') {
            sharedAudioContext.resume();
        }
        return sharedAudioContext;
    }

    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return null;
        sharedAudioContext = new AudioContextClass();
        return sharedAudioContext;
    } catch {
        return null;
    }
}

export default function ClickSound() {
    const context = useSettings();
    const soundEnabled = context ? context.soundEnabled : true;
    const lastClickTime = useRef(0);

    const playClick = useCallback(() => {
        if (!soundEnabled) return;

        // Throttle: Prevent rapid-fire audio (max 10 clicks/sec)
        const now = performance.now();
        if (now - lastClickTime.current < 100) return;
        lastClickTime.current = now;

        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const currentTime = ctx.currentTime;

            // Primary oscillator (Mechanical Thud)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            filter.type = 'lowpass';
            filter.frequency.value = 800;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, currentTime + 0.08);

            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(0.12, currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(currentTime);
            osc.stop(currentTime + 0.1);

        } catch {
            // Audio ignore
        }
    }, [soundEnabled]);

    useEffect(() => {
        const handleClick = () => playClick();

        // Use passive listener for performance
        window.addEventListener('mousedown', handleClick, { passive: true });
        window.addEventListener('touchstart', handleClick, { passive: true });

        return () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('touchstart', handleClick);
        };
    }, [playClick]);

    return null;
}
