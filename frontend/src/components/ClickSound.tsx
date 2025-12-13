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

            // Primary oscillator (Body of sound)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Filter for warmer sound
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;

            osc.type = 'triangle'; // Softer than sine

            // Pitch Envelope: Quick drop (Mechanical Thud)
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

            // Volume Envelope: Percussive
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.01); // Attack
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); // Decay

            // Connect
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);

            // Optional: High frequency "click" tick for definition
            const tickOsc = ctx.createOscillator();
            const tickGain = ctx.createGain();
            tickOsc.type = 'sine';
            tickOsc.frequency.setValueAtTime(2000, now);
            tickGain.gain.setValueAtTime(0.05, now);
            tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            tickOsc.connect(tickGain);
            tickGain.connect(ctx.destination);
            tickOsc.start(now);
            tickOsc.stop(now + 0.02);

        } catch (e) {
            // Audio ignore
        }
    }, [soundEnabled]);

    useEffect(() => {
        const handleClick = () => playClick();
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [playClick]);

    return null;
}
