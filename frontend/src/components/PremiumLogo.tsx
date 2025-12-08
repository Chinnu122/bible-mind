import { motion } from 'framer-motion';

export default function PremiumLogo({ className = "w-10 h-10", animated = false }: { className?: string, animated?: boolean }) {
    // Static paths for the logo (same as intro but without build-up animation unless 'animated' is true)
    const brainLeftPath = "M 40 30 C 20 30, 10 50, 10 70 C 10 100, 30 110, 40 110";
    const brainLeftInner = "M 20 50 C 15 60, 25 70, 20 80";

    const brainRightPath = "M 80 30 C 100 30, 110 50, 110 70 C 110 100, 90 110, 80 110";
    const brainRightInner = "M 100 50 C 105 60, 95 70, 100 80";

    const crossVertical = "M 60 40 L 60 100";
    const crossHorizontal = "M 45 55 L 75 55";

    const bookLeftPage = "M 20 120 Q 40 110 60 130 L 60 90 Q 40 80 20 90 Z";
    const bookRightPage = "M 100 120 Q 80 110 60 130 L 60 90 Q 80 80 100 90 Z";

    const strokeColor = "#bfa37c"; // Gold
    const secondaryColor = "#1a3c5a"; // Navy

    return (
        <div className={`${className} relative group cursor-pointer`}>
            <motion.svg
                viewBox="0 0 120 140"
                className="w-full h-full drop-shadow-[0_0_5px_rgba(191,163,124,0.3)]"
                whileHover={{ scale: 1.05 }}
            >
                {/* Brain Left */}
                <motion.path
                    d={brainLeftPath}
                    fill="transparent"
                    stroke={secondaryColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="group-hover:stroke-[#bfa37c] transition-colors duration-500"
                />
                <motion.path
                    d={brainLeftInner}
                    fill="transparent"
                    stroke={secondaryColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="group-hover:stroke-[#bfa37c] transition-colors duration-500"
                />

                {/* Brain Right */}
                <motion.path
                    d={brainRightPath}
                    fill="transparent"
                    stroke={secondaryColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="group-hover:stroke-[#bfa37c] transition-colors duration-500"
                />
                <motion.path
                    d={brainRightInner}
                    fill="transparent"
                    stroke={secondaryColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="group-hover:stroke-[#bfa37c] transition-colors duration-500"
                />

                {/* Cross (Gold) */}
                <motion.path
                    d={crossVertical}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    // Add a subtle glow/pulse on hover
                    whileHover={{ strokeWidth: 5, filter: "drop-shadow(0 0 2px #bfa37c)" }}
                />
                <motion.path
                    d={crossHorizontal}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    whileHover={{ strokeWidth: 5, filter: "drop-shadow(0 0 2px #bfa37c)" }}
                />

                {/* Book (Gold Pages) */}
                <motion.path
                    d={bookLeftPage}
                    fill={strokeColor}
                    fillOpacity={0.1}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="group-hover:fill-opacity-30 transition-all duration-500"
                />
                <motion.path
                    d={bookRightPage}
                    fill={strokeColor}
                    fillOpacity={0.1}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="group-hover:fill-opacity-30 transition-all duration-500"
                />
            </motion.svg>

            {/* Surprise: Particle burst on click would be handled by parent or added here */}
        </div>
    );
}
