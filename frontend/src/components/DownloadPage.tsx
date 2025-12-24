import React from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Tablet, Monitor, CheckCircle, ArrowLeft, Shield, Zap, Globe } from 'lucide-react';

interface DownloadPageProps {
    onBack: () => void;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onBack }) => {
    const appInfo = {
        version: '2.9.0',
        size: '~90 MB',
        minAndroid: 'Android 9.0 (Pie)',
        lastUpdate: 'December 2024',
    };

    const features = [
        { icon: Zap, title: 'Fast & Smooth', desc: 'Optimized for mobile performance' },
        { icon: Globe, title: 'Offline Access', desc: 'Read Bible without internet' },
        { icon: Shield, title: 'Secure', desc: 'Your data stays private' },
    ];

    const compatible = [
        { icon: Smartphone, label: 'Android 9+', supported: true },
        { icon: Tablet, label: 'Tablets', supported: true },
        { icon: Monitor, label: 'ChromeOS', supported: true },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-gold-400 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/20"
                >
                    <span className="text-3xl font-bold text-black">BM</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-crema-100 mb-2">Bible Mind</h1>
                <p className="text-slate-400">Divine Intelligence for Your Spiritual Journey</p>
            </div>

            {/* Download Card */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gold-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-crema-100">Android App</h2>
                        <p className="text-slate-400 text-sm">Version {appInfo.version}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gold-400 font-bold">{appInfo.size}</p>
                        <p className="text-slate-500 text-xs">{appInfo.lastUpdate}</p>
                    </div>
                </div>

                <a
                    href="https://github.com/Chinnu122/bible-mind/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-black font-bold text-lg hover:from-gold-400 hover:to-amber-400 transition-all shadow-lg shadow-gold-500/20"
                >
                    <Download size={24} />
                    Get APK from GitHub
                </a>

                <p className="text-center text-slate-400 text-sm mt-3">
                    Download from GitHub Releases
                </p>
                <p className="text-center text-slate-500 text-xs mt-1">
                    Requires {appInfo.minAndroid} or higher
                </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-[#0a0a0a]/60 border border-white/5 rounded-xl p-4 text-center"
                    >
                        <feature.icon size={28} className="mx-auto mb-2 text-gold-400" />
                        <h3 className="text-crema-100 font-medium text-sm">{feature.title}</h3>
                        <p className="text-slate-500 text-xs mt-1">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Compatibility */}
            <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-xl p-4">
                <h3 className="text-crema-100 font-medium mb-3">Compatible Devices</h3>
                <div className="flex gap-4">
                    {compatible.map((device, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <device.icon size={18} className="text-slate-400" />
                            <span className="text-slate-300">{device.label}</span>
                            {device.supported && <CheckCircle size={14} className="text-emerald-400" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Installation Guide */}
            <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                    📱 After downloading, open the APK file and allow installation from unknown sources.
                </p>
            </div>
        </motion.div>
    );
};

export default DownloadPage;
