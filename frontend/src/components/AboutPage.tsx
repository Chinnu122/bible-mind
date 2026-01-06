import { motion } from 'framer-motion';
import { BookOpen, Heart, Globe, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-12 md:py-20"
        >
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-charcoal-900 mb-6">About Bible-Mind</h1>
                <p className="text-xl md:text-2xl text-charcoal-600 leading-relaxed font-light">
                    A simple and focused Bible study platform created to help believers read and understand Scripture with clarity.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-6">
                    <div className="inline-block px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                        Our Vision
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-900">
                        Removing complexity. <br />
                        Focusing on the Word.
                    </h2>
                    <p className="text-lg text-charcoal-600 leading-relaxed">
                        Our goal is to remove complexity and provide a calm, distraction-free environment for Bible reading and study.
                        We believe the Word of God should be easy to access, easy to understand, and available to everyone free from clutter.
                    </p>
                    <p className="text-lg text-charcoal-600 leading-relaxed">
                        Bible-Mind is built with respect for Scripture and with a commitment to accuracy, simplicity, and spiritual growth.
                    </p>
                </div>
                <div className="relative h-[400px] bg-ivory-200 rounded-2xl overflow-hidden shadow-lg border border-gold-500/10">
                    {/* Placeholder for an image or abstract graphic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-charcoal-100 flex items-center justify-center">
                        <BookOpen size={64} className="text-gold-400 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <ValueCard
                    icon={<Zap size={32} />}
                    title="Easy to Access"
                    desc="Intuitive navigation designed for quick reading."
                />
                <ValueCard
                    icon={<BookOpen size={32} />}
                    title="Easy to Understand"
                    desc="Integrated word meanings and study tools."
                />
                <ValueCard
                    icon={<Globe size={32} />}
                    title="Multi-Language"
                    desc="Seamless switching between English, Telugu, and more."
                />
                <ValueCard
                    icon={<Heart size={32} />}
                    title="Distraction Free"
                    desc="A calm interface focused solely on scripture."
                />
            </div>

            {/* Bottom Statement */}
            <div className="bg-charcoal-900 rounded-3xl p-10 md:p-16 text-center text-ivory-100 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h3 className="text-3xl font-serif font-bold mb-6">Build a trusted digital space.</h3>
                    <p className="text-lg text-charcoal-300 mb-8">
                        Our mission is to make Bible reading simple, accessible, and meaningful for every believer.
                    </p>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-navy-500/20 rounded-full blur-3xl" />
            </div>

        </motion.div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-charcoal-50">
            <div className="mb-4 text-gold-500">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-charcoal-900 mb-2">{title}</h3>
            <p className="text-charcoal-500 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
