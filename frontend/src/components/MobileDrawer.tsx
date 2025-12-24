import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Home, TrendingUp, BookOpen, Calendar, CheckCircle, MessageSquare,
    Image as ImageIcon, Crown, Settings, User, LogOut, Download, Smartphone
} from 'lucide-react';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: Array<{ id: string; icon: React.ElementType; label: string }>;
    currentView: string;
    onNavigate: (id: string) => void;
    loggedInUser: { name: string } | null;
    onLogout: () => void;
    onOpenSettings: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
    isOpen,
    onClose,
    navItems,
    currentView,
    onNavigate,
    loggedInUser,
    onLogout,
    onOpenSettings
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 z-[70] w-72 bg-[#0a0a0a] border-r border-gold-500/20 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gold-500/10">
                            <h2 className="text-lg font-bold text-gold-400">Bible Mind</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* User Section */}
                        <div className="p-4 border-b border-gold-500/10">
                            {loggedInUser ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center">
                                        <span className="text-black font-bold">{loggedInUser.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-crema-100 font-medium">{loggedInUser.name}</p>
                                        <button
                                            onClick={onLogout}
                                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                        >
                                            <LogOut size={12} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { onNavigate('auth'); onClose(); }}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors"
                                >
                                    <User size={20} />
                                    <span>Sign In / Register</span>
                                </button>
                            )}
                        </div>

                        {/* Navigation Items */}
                        <div className="p-2 flex-1 overflow-y-auto">
                            <p className="px-3 py-2 text-xs uppercase text-slate-500 tracking-wider">Navigation</p>
                            {navItems.map((item) => {
                                const isActive = currentView === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { onNavigate(item.id); onClose(); }}
                                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 transition-all
                      ${isActive
                                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                                : 'text-slate-300 hover:bg-white/5 hover:text-crema-100'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="mobileActiveIndicator"
                                                className="ml-auto w-2 h-2 rounded-full bg-gold-400"
                                            />
                                        )}
                                    </button>
                                );
                            })}

                            {/* Download APK Link */}
                            <div className="mt-4 pt-4 border-t border-gold-500/10">
                                <p className="px-3 py-2 text-xs uppercase text-slate-500 tracking-wider">Download</p>
                                <button
                                    onClick={() => { onNavigate('download'); onClose(); }}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                >
                                    <Download size={20} />
                                    <span className="font-medium">Download App</span>
                                    <Smartphone size={16} className="ml-auto opacity-50" />
                                </button>
                            </div>

                            {/* Settings */}
                            <div className="mt-4 pt-4 border-t border-gold-500/10">
                                <button
                                    onClick={() => { onOpenSettings(); onClose(); }}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-crema-100 transition-colors"
                                >
                                    <Settings size={20} />
                                    <span className="font-medium">Settings</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gold-500/10">
                            <p className="text-xs text-slate-500 text-center">Bible Mind v2.9.0</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileDrawer;
