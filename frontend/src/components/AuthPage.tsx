import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UserData {
    id: string;
    email: string;
    name: string;
}

interface AuthPageProps {
    onBack: () => void;
    onAuthSuccess?: (user: UserData) => void;
}

export default function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    // Check for existing session
    useEffect(() => {
        const savedUser = localStorage.getItem('bible-mind-user');
        if (savedUser) {
            try {
                setLoggedInUser(JSON.parse(savedUser));
            } catch { }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const endpoint = mode === 'signin' ? '/auth/login' : '/auth/register';
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Save to localStorage
            const user: UserData = data.data;
            localStorage.setItem('bible-mind-user', JSON.stringify(user));
            setLoggedInUser(user);
            setSuccess(data.message || 'Success!');

            onAuthSuccess?.(user);

            // Auto redirect after success
            setTimeout(() => onBack(), 1500);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bible-mind-user');
        setLoggedInUser(null);
        setFormData({ email: '', password: '', name: '' });
    };

    // If user is logged in, show profile
    if (loggedInUser) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-24 px-4 md:px-12 min-h-screen flex items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Bible
                    </button>

                    <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-black" />
                        </div>

                        <h2 className="text-2xl font-cinzel font-bold text-gold-200 mb-1">
                            Welcome, {loggedInUser.name}!
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">{loggedInUser.email}</p>

                        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                            <p className="text-gray-300 text-sm">
                                ✓ Your notes and highlights are saved<br />
                                ✓ Your progress syncs across devices<br />
                                ✓ Community reviews use your name
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full bg-white/10 text-white py-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 px-4 md:px-12 min-h-screen flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Bible
                </button>

                {/* Card */}
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-cinzel font-bold text-gold-200 mb-2">
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {mode === 'signin'
                                ? 'Sign in to access your notes and bookmarks'
                                : 'Join Bible Mind to save your study progress'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6 text-emerald-400 text-sm text-center"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold py-4 rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {mode === 'signin' ? (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => { setMode('signup'); setError(''); }} className="text-gold-400 hover:text-gold-300 transition-colors">
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => { setMode('signin'); setError(''); }} className="text-gold-400 hover:text-gold-300 transition-colors">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Your data is encrypted and securely stored
                </p>
            </motion.div>
        </motion.div>
    );
}
