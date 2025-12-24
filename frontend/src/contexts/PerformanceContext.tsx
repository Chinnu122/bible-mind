import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PerformanceLevel = 'high' | 'medium' | 'low';

interface PerformanceContextType {
    level: PerformanceLevel;
    particleCount: number;
    enableEffects: boolean;
    enableBlur: boolean;
    enableShadows: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
    level: 'high',
    particleCount: 150,
    enableEffects: true,
    enableBlur: true,
    enableShadows: true,
});

export const usePerformance = () => useContext(PerformanceContext);

export function PerformanceProvider({ children }: { children: ReactNode }) {
    const [level, setLevel] = useState<PerformanceLevel>('high');

    useEffect(() => {
        // Detect device capability
        const detectPerformance = () => {
            // Check for low-end indicators
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
            const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
            const isLowPowerMode = (navigator as any).getBattery?.().then?.((b: any) => b.charging === false && b.level < 0.2);

            // Simple heuristic
            if (isMobile && (hasLowMemory || hasSlowCPU)) {
                setLevel('low');
            } else if (isMobile || hasSlowCPU) {
                setLevel('medium');
            } else {
                setLevel('high');
            }
        };

        detectPerformance();

        // Also check frame rate after a delay
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId: number;

        const checkFps = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;

                // If FPS drops below 30, switch to lower quality
                if (fps < 25) {
                    setLevel(prev => prev === 'high' ? 'medium' : 'low');
                }
            }
            rafId = requestAnimationFrame(checkFps);
        };

        // Run FPS check for first 3 seconds
        rafId = requestAnimationFrame(checkFps);
        setTimeout(() => cancelAnimationFrame(rafId), 3000);

        return () => cancelAnimationFrame(rafId);
    }, []);

    // Settings based on level
    const settings: PerformanceContextType = {
        level,
        particleCount: level === 'high' ? 150 : level === 'medium' ? 50 : 20,
        enableEffects: level !== 'low',
        enableBlur: level === 'high',
        enableShadows: level !== 'low',
    };

    return (
        <PerformanceContext.Provider value={settings}>
            {children}
        </PerformanceContext.Provider>
    );
}
