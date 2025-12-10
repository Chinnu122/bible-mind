import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'divine' | 'midnight' | 'parchment' | 'ethereal';

interface SettingsContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    soundEnabled: boolean;
    setSoundEnabled: (v: boolean) => void;
    particles: boolean;
    setParticles: (v: boolean) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('divine');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [particles, setParticles] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Initialize from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('bible-mind-theme') as Theme;
        if (savedTheme) setTheme(savedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem('bible-mind-theme', theme);
        // Apply global body class for root variable handling if needed
        document.body.className = theme;
    }, [theme]);

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            soundEnabled, setSoundEnabled,
            particles, setParticles,
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
