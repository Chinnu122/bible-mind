import { createContext, useContext, ReactNode } from 'react';

type PerformanceLevel = 'high' | 'medium' | 'low';

interface PerformanceContextType {
    level: PerformanceLevel;
    particleCount: number;
    enableEffects: boolean;
    enableBlur: boolean;
    enableShadows: boolean;
    targetFps: number;
}

// FORCED HIGH QUALITY - 120fps for premium experience
const PerformanceContext = createContext<PerformanceContextType>({
    level: 'high',
    particleCount: 250,
    enableEffects: true,
    enableBlur: true,
    enableShadows: true,
    targetFps: 120,
});

export const usePerformance = () => useContext(PerformanceContext);

export function PerformanceProvider({ children }: { children: ReactNode }) {
    // MAXIMUM QUALITY SETTINGS - No adaptive detection
    const settings: PerformanceContextType = {
        level: 'high',
        particleCount: 250, // Increased from 150
        enableEffects: true,
        enableBlur: true,
        enableShadows: true,
        targetFps: 120, // 120fps for high refresh rate displays
    };

    return (
        <PerformanceContext.Provider value={settings}>
            {children}
        </PerformanceContext.Provider>
    );
}
