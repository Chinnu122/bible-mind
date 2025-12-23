import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Users, Eye, TrendingUp } from 'lucide-react';
import PremiumLogo from './PremiumLogo';

const Dashboard: React.FC<{ onBack?: () => void; onNavigate?: (target: any) => void }> = ({ onBack, onNavigate: _onNavigate }) => {
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Dummy Stats
    const stats = [
        { title: 'Total Views', value: '1.2M', icon: Eye, change: '+12%', color: 'text-gold-400' },
        { title: 'Active Readers', value: '45.3K', icon: Users, change: '+5%', color: 'text-royal-400' },
        { title: 'Daily Verses', value: '8.1K', icon: TrendingUp, change: '+18%', color: 'text-emerald-400' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4"
        >
            <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <PremiumLogo className="w-12 h-12" />
                    <div>
                        <h1 className="text-3xl font-main text-gold-400">Dashboard</h1>
                        <p className="text-crema-300 font-sans text-sm">Overview & Analytics</p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
                >
                    ← Back to App
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={64} className={stat.color} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-crema-400 mb-1">{stat.title}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-main text-crema-50">{stat.value}</h3>
                                <span className="text-xs text-green-400 font-mono">{stat.change}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder Chart Section */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-main text-gold-200">Traffic Overview</h3>
                        <BarChart className="text-gold-500/50" />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-full bg-gradient-to-t from-gold-900/20 to-gold-500/20 rounded-t-lg hover:to-gold-500/40 transition-colors"
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-crema-400 font-mono">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-main text-crema-50 mb-2">
                            {authMode === 'signin' ? 'Welcome Back' : 'Join Bible Mind'}
                        </h3>
                        <p className="text-crema-400 text-sm">
                            {authMode === 'signin' ? 'Sign in to access your dashboard' : 'Create an account to track your journey'}
                        </p>
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto w-full">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-crema-100 placeholder:text-white/20 focus:border-gold-500/50 focus:outline-none transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-crema-100 placeholder:text-white/20 focus:border-gold-500/50 focus:outline-none transition-colors"
                        />
                        <button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-medium py-3 rounded-xl transition-all shadow-lg shadow-gold-900/20">
                            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setAuthMode(m => m === 'signin' ? 'signup' : 'signin')}
                            className="text-xs text-gold-400 hover:text-gold-300 underline underline-offset-4"
                        >
                            {authMode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
