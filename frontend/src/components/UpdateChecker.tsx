import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles, ArrowRight } from 'lucide-react';

interface VersionInfo {
    version: string;
    releaseDate: string;
    downloadUrl: string;
    forceUpdate: boolean;
    changelog: string[];
}

const APP_VERSION = '2.9.0';
const VERSION_CHECK_KEY = 'bible-mind-last-version-check';
const DISMISSED_VERSION_KEY = 'bible-mind-dismissed-version';

const UpdateChecker: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

    useEffect(() => {
        checkForUpdates();
    }, []);

    const checkForUpdates = async () => {
        try {
            // Don't check too frequently (once per hour)
            const lastCheck = localStorage.getItem(VERSION_CHECK_KEY);
            const now = Date.now();
            if (lastCheck && (now - parseInt(lastCheck)) < 3600000) {
                return;
            }

            // Fetch version info
            const response = await fetch('/version.json?' + now);
            if (!response.ok) return;

            const data: VersionInfo = await response.json();
            localStorage.setItem(VERSION_CHECK_KEY, now.toString());

            // Compare versions
            if (isNewerVersion(data.version, APP_VERSION)) {
                // Check if user already dismissed this version
                const dismissedVersion = localStorage.getItem(DISMISSED_VERSION_KEY);
                if (dismissedVersion !== data.version || data.forceUpdate) {
                    setVersionInfo(data);
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.log('Update check failed:', error);
        }
    };

    const isNewerVersion = (remote: string, local: string): boolean => {
        const remoteParts = remote.split('.').map(Number);
        const localParts = local.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            if ((remoteParts[i] || 0) > (localParts[i] || 0)) return true;
            if ((remoteParts[i] || 0) < (localParts[i] || 0)) return false;
        }
        return false;
    };

    const handleDismiss = () => {
        if (versionInfo && !versionInfo.forceUpdate) {
            localStorage.setItem(DISMISSED_VERSION_KEY, versionInfo.version);
        }
        setShowModal(false);
    };

    const handleUpdate = () => {
        if (versionInfo) {
            window.open(versionInfo.downloadUrl, '_blank');
        }
    };

    if (!showModal || !versionInfo) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-md bg-[#0a0a0a] border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative p-6 pb-4 bg-gradient-to-b from-gold-500/10 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gold-500/20 rounded-xl">
                                    <Sparkles className="text-gold-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-crema-100">New Update Available!</h2>
                                    <p className="text-sm text-slate-400">Version {versionInfo.version}</p>
                                </div>
                            </div>
                            {!versionInfo.forceUpdate && (
                                <button
                                    onClick={handleDismiss}
                                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Changelog */}
                    <div className="px-6 py-4">
                        <h3 className="text-sm font-medium text-gold-400 mb-3">What's New:</h3>
                        <ul className="space-y-2">
                            {versionInfo.changelog.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-2 text-sm text-slate-300"
                                >
                                    <ArrowRight size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-4 flex gap-3">
                        {!versionInfo.forceUpdate && (
                            <button
                                onClick={handleDismiss}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
                            >
                                Later
                            </button>
                        )}
                        <button
                            onClick={handleUpdate}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-black font-bold flex items-center justify-center gap-2 hover:from-gold-400 hover:to-amber-400 transition-all"
                        >
                            <Download size={18} />
                            Update Now
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UpdateChecker;
