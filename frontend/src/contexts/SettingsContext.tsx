import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'divine' | 'christmas' | 'midnight' | 'parchment' | 'ethereal';
export type FontSize = 'normal' | 'large';
export type FontFamily = 'sans' | 'serif' | 'mono';

export type Atmosphere = 'rain' | 'celestial' | 'monastery' | 'relax' | 'focus' | 'meditate' | 'none';

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
    fontFamily: FontFamily;
    setFontFamily: (v: FontFamily) => void;
    atmosphere: Atmosphere;
    setAtmosphere: (a: Atmosphere) => void;
    zenMode: boolean;
    setZenMode: (v: boolean) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('christmas');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [particles, setParticles] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
    const [atmosphere, setAtmosphere] = useState<Atmosphere>('none');
    const [zenMode, setZenMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Initialize from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('bible-mind-theme') as Theme;
        const savedVolume = localStorage.getItem('bible-mind-volume');
        const savedFontSize = localStorage.getItem('bible-mind-fontsize') as FontSize;
        const savedFontFamily = localStorage.getItem('bible-mind-fontfamily') as FontFamily;
        const savedAtmosphere = localStorage.getItem('bible-mind-atmosphere') as Atmosphere;

        if (savedTheme) setTheme(savedTheme);
        if (savedVolume) setVolume(parseFloat(savedVolume));
        if (savedFontSize) setFontSize(savedFontSize);
        if (savedFontFamily) setFontFamily(savedFontFamily);
        if (savedAtmosphere) setAtmosphere(savedAtmosphere);
    }, []);

    useEffect(() => {
        localStorage.setItem('bible-mind-theme', theme);
        localStorage.setItem('bible-mind-volume', volume.toString());
        localStorage.setItem('bible-mind-fontsize', fontSize);
        localStorage.setItem('bible-mind-fontfamily', fontFamily);
        localStorage.setItem('bible-mind-atmosphere', atmosphere);

        // Apply global body class for root variable handling
        document.body.className = `${theme} ${fontSize === 'large' ? 'text-lg' : ''} font-${fontFamily}`;

        // Apply font CSS variables directly
        const root = document.documentElement;
        if (fontFamily === 'serif') {
            root.style.setProperty('--font-main', '"Cinzel", serif');
            root.style.setProperty('--font-body', '"Lora", serif');
        } else if (fontFamily === 'mono') {
            root.style.setProperty('--font-main', '"JetBrains Mono", monospace');
            root.style.setProperty('--font-body', '"JetBrains Mono", monospace');
        } else {
            root.style.setProperty('--font-main', '"Outfit", sans-serif');
            root.style.setProperty('--font-body', '"Inter", sans-serif');
        }

        // Apply master volume to all audio elements
        const audioElements = document.getElementsByTagName('audio');
        for (let i = 0; i < audioElements.length; i++) {
            audioElements[i].volume = volume;
        }
    }, [theme, volume, fontSize, fontFamily, atmosphere]);

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            soundEnabled, setSoundEnabled,
            particles, setParticles,
            volume, setVolume,
            fontSize, setFontSize,
            fontFamily, setFontFamily,
            atmosphere, setAtmosphere,
            zenMode, setZenMode,
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
