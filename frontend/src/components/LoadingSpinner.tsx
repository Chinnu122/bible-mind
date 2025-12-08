import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-spinner flex flex-col items-center justify-center gap-4"
        >
            <Loader2 className="w-12 h-12 text-gold-400 animate-spin" />
            <p className="text-gray-400 text-sm tracking-widest uppercase">{text}</p>
        </motion.div>
    );
}
