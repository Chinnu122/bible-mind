import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Gift, Clock, ArrowLeft, Star, Heart, Zap, Users, Shield } from 'lucide-react';

interface PricingPageProps {
    onBack: () => void;
}

export default function PricingPage({ onBack }: PricingPageProps) {

    const features = [
        { icon: <Check className="w-5 h-5" />, text: "Full Bible Access (KJV)" },
        { icon: <Check className="w-5 h-5" />, text: "Genesis Stories (All Languages)" },
        { icon: <Check className="w-5 h-5" />, text: "Daily Verse & Quiz" },
        { icon: <Check className="w-5 h-5" />, text: "Telugu & Hindi Translations" },
        { icon: <Check className="w-5 h-5" />, text: "Unlimited Notes & Bookmarks" },
        { icon: <Check className="w-5 h-5" />, text: "All Visual Themes" },
        { icon: <Check className="w-5 h-5" />, text: "AI Image Generation" },
        { icon: <Check className="w-5 h-5" />, text: "Character Stories" },
    ];

    const comingSoonFeatures = [
        { icon: <Zap className="w-5 h-5" />, text: "AI Bible Study Assistant" },
        { icon: <Users className="w-5 h-5" />, text: "Family Sharing (5 members)" },
        { icon: <Shield className="w-5 h-5" />, text: "Offline Mode" },
        { icon: <Star className="w-5 h-5" />, text: "Exclusive Study Materials" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-8 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-3xl md:text-4xl font-main text-gold-400">
                        Subscription
                    </h1>
                </div>

                {/* Early Adopter Banner */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-emerald-600/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 mb-8 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2310b981%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Gift className="w-6 h-6 text-emerald-400" />
                            <span className="text-emerald-400 font-bold text-lg uppercase tracking-wider">Limited Time Offer</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                            🎉 You're an Early Adopter!
                        </h2>
                        <p className="text-emerald-200 text-lg">
                            All premium features are <span className="font-bold text-white">FREE FOREVER</span> for founding members
                        </p>
                    </div>
                </motion.div>

                {/* Current Plan Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gold-500/20 to-amber-600/20 border-2 border-gold-500/50 rounded-3xl p-8 mb-8 relative overflow-hidden"
                >
                    {/* Lifetime Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-500 to-amber-500 text-black px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        LIFETIME FREE
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-black" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white">Founding Member</h3>
                            <p className="text-gold-300">Your current plan</p>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-black text-white">₹0</span>
                        <span className="text-gray-400 line-through">₹999/year</span>
                        <span className="text-emerald-400 font-bold">FOREVER</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-white">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                        <Heart className="w-5 h-5 text-rose-400" />
                        <p className="text-gray-300 text-sm">
                            Thank you for being an early supporter! Your access will <span className="text-white font-bold">never expire</span>.
                        </p>
                    </div>
                </motion.div>

                {/* Coming Soon Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">Coming Soon</h3>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold">2025</span>
                    </div>

                    <p className="text-gray-400 mb-6">
                        We're working on amazing new features. As a founding member, you'll get these <span className="text-white font-bold">automatically included</span> in your plan!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {comingSoonFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-gray-400 bg-white/5 rounded-xl p-4">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-500 text-sm mt-8"
                >
                    Premium subscriptions with additional features will be available in 2025.
                    <br />
                    Your founding member status is permanent and can never be revoked.
                </motion.p>
            </div>
        </motion.div>
    );
}
