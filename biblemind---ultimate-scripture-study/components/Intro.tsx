import React, { useEffect, useState } from 'react';
import { BookMarked } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500); // Fade in logo
    const t2 = setTimeout(() => setStage(2), 2000); // Fade in text
    const t3 = setTimeout(() => setStage(3), 3500); // Fade out
    const t4 = setTimeout(onComplete, 4000); // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-1000 ${stage === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`transition-all duration-1000 transform ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <BookMarked className="w-32 h-32 text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
      </div>
      <h1 className={`mt-6 text-4xl md:text-6xl font-bold serif-font text-white tracking-widest transition-all duration-1000 delay-300 ${stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        BIBLE<span className="text-amber-500">MIND</span>
      </h1>
      <p className={`mt-4 text-slate-400 font-light tracking-widest uppercase text-sm transition-all duration-1000 delay-500 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        Wisdom • Truth • Life
      </p>
    </div>
  );
};

export default Intro;
