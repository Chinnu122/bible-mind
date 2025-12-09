import { useEffect, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function ClickSound() {
    // Safe default in case used outside provider (though App wraps it now)
    const context = useSettings();
    const soundEnabled = context ? context.soundEnabled : true;

    const playClick = useCallback(() => {
        if (!soundEnabled) return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            // Audio issues ignored
        }
    }, [soundEnabled]);

    useEffect(() => {
        const handleClick = () => playClick();
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [playClick]);

    return null;
}
