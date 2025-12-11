import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'divine' | 'midnight' | 'parchment' | 'ethereal';
export type FontSize = 'normal' | 'large';

interface SettingsContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    soundEnabled: boolean;
    setSoundEnabled: (v: boolean) => void;
    particles: boolean;
    setParticles: (v: boolean) => void;
    volume: number;
    setVolume: (v: number) => void;
    fontSize: FontSize;
    setFontSize: (v: FontSize) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('divine');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [particles, setParticles] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Initialize from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('bible-mind-theme') as Theme;
        const savedVolume = localStorage.getItem('bible-mind-volume');
        const savedFontSize = localStorage.getItem('bible-mind-fontsize') as FontSize;

        if (savedTheme) setTheme(savedTheme);
        if (savedVolume) setVolume(parseFloat(savedVolume));
        if (savedFontSize) setFontSize(savedFontSize);
    }, []);

    useEffect(() => {
        localStorage.setItem('bible-mind-theme', theme);
        localStorage.setItem('bible-mind-volume', volume.toString());
        localStorage.setItem('bible-mind-fontsize', fontSize);

        // Apply global body class for root variable handling
        document.body.className = `${theme} ${fontSize === 'large' ? 'text-lg' : ''}`;

        // Apply master volume to all audio elements
        const audioElements = document.getElementsByTagName('audio');
        for (let i = 0; i < audioElements.length; i++) {
            audioElements[i].volume = volume;
        }
    }, [theme, volume, fontSize]);

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            soundEnabled, setSoundEnabled,
            particles, setParticles,
            volume, setVolume,
            fontSize, setFontSize,
            isSettingsOpen, setIsSettingsOpen
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
}
