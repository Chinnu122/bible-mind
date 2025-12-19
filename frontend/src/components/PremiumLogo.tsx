import { motion } from 'framer-motion';

export default function PremiumLogo({ className = "w-10 h-10" }: { className?: string }) {
    // Paths remain the same, just updating colors
    const brainLeftPath = "M 40 30 C 20 30, 10 50, 10 70 C 10 100, 30 110, 40 110";
    const brainLeftInner = "M 20 50 C 15 60, 25 70, 20 80";
    const brainRightPath = "M 80 30 C 100 30, 110 50, 110 70 C 110 100, 90 110, 80 110";
    const brainRightInner = "M 100 50 C 105 60, 95 70, 100 80";
    const crossVertical = "M 60 40 L 60 100";
    const crossHorizontal = "M 45 55 L 75 55";
    const bookLeftPage = "M 20 120 Q 40 110 60 130 L 60 90 Q 40 80 20 90 Z";
    const bookRightPage = "M 100 120 Q 80 110 60 130 L 60 90 Q 80 80 100 90 Z";

    return (
        <div className={`${className} relative group cursor-pointer`}>
            <motion.svg
                viewBox="0 0 120 140"
                className="w-full h-full drop-shadow-[0_0_8px_rgba(196,142,47,0.4)]"
                whileHover={{ scale: 1.05 }}
            >
                {/* Brain Parts - Dark Metallic Blue -> Luxury Dark Slate/Gold mix for now, keeping generic dark for contrast */}
                <motion.path d={brainLeftPath} fill="transparent" stroke="#C48E2F" strokeWidth="3" strokeLinecap="round" className="opacity-80 group-hover:stroke-gold-300 transition-colors duration-500" />
                <motion.path d={brainLeftInner} fill="transparent" stroke="#C48E2F" strokeWidth="2" strokeLinecap="round" className="opacity-60 group-hover:stroke-gold-300 transition-colors duration-500" />

                <motion.path d={brainRightPath} fill="transparent" stroke="#C48E2F" strokeWidth="3" strokeLinecap="round" className="opacity-80 group-hover:stroke-gold-300 transition-colors duration-500" />
                <motion.path d={brainRightInner} fill="transparent" stroke="#C48E2F" strokeWidth="2" strokeLinecap="round" className="opacity-60 group-hover:stroke-gold-300 transition-colors duration-500" />

                {/* Cross - Bright Gold */}
                <motion.path d={crossVertical} fill="transparent" stroke="#F5ECC8" strokeWidth="4" strokeLinecap="round" className="group-hover:stroke-white transition-colors" />
                <motion.path d={crossHorizontal} fill="transparent" stroke="#F5ECC8" strokeWidth="4" strokeLinecap="round" className="group-hover:stroke-white transition-colors" />

                {/* Book - Subtle Gold Fill */}
                <motion.path d={bookLeftPage} fill="#C48E2F" fillOpacity={0.15} stroke="#C48E2F" strokeWidth="2" className="group-hover:fill-opacity-40 transition-all duration-500" />
                <motion.path d={bookRightPage} fill="#C48E2F" fillOpacity={0.15} stroke="#C48E2F" strokeWidth="2" className="group-hover:fill-opacity-40 transition-all duration-500" />
            </motion.svg>
        </div>
    );
}
