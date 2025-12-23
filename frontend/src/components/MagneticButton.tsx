import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    strength?: number; // How strong the pull is. Default 30.
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    onClick,
    className = "",
    strength = 30
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Use strength prop (default 30 becomes 0.3 factor roughly, or just use it as a divisor/multiplier)
        // Let's say strength 30 means max 30px movement? Or strength is the factor.
        // Let's treat strength as a factor relative to 100? Or just direct multiplier.
        // Original code was x * 0.5. Let's make it configurable. 
        // If strength is 30, maybe we want 0.3?
        const factor = strength / 100;

        setPosition({ x: x * factor, y: y * factor });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            className={className}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
