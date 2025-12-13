import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

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

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

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

            const user: UserData = data.data;
            localStorage.setItem('bible-mind-user', JSON.stringify(user));
            setSuccess(data.message || 'Success!');
            onAuthSuccess?.(user);

            setTimeout(() => onBack(), 1000);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex overflow-hidden rounded-3xl bg-slate-900 border border-white/5 shadow-2xl">
            {/* Left Side - Visual / Artistic */}
            <div className="hidden lg:flex w-1/2 relative bg-premium-mesh overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" />

                <div className="relative z-10 max-w-md text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-editorial text-crema-100 mb-6 leading-tight">
                            "Thy word is a lamp unto my feet."
                        </h2>
                        <p className="text-crema-300/80 font-sans text-lg tracking-wide">
                            Join a community dedicated to exploring wisdom, one verse at a time.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-slate-900">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-crema-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="max-w-sm w-full mx-auto">
                    <div className="mb-10">
                        <h3 className="text-3xl font-editorial text-crema-50 mb-2">
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </h3>
                        <p className="text-slate-400">
                            {mode === 'signin'
                                ? 'Enter your details to access your personal study.'
                                : 'Begin your journey with us today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-gold-400 transition-colors">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-0 top-3 w-5 h-5 text-slate-600 group-focus-within:text-gold-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-transparent border-b border-slate-700 py-3 pl-8 text-crema-100 placeholder-slate-700 focus:outline-none focus:border-gold-400 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-gold-400 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-0 top-3 w-5 h-5 text-slate-600 group-focus-within:text-gold-400 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent border-b border-slate-700 py-3 pl-8 text-crema-100 placeholder-slate-700 focus:outline-none focus:border-gold-400 transition-all font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-gold-400 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-0 top-3 w-5 h-5 text-slate-600 group-focus-within:text-gold-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-transparent border-b border-slate-700 py-3 pl-8 text-crema-100 placeholder-slate-700 focus:outline-none focus:border-gold-400 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-3 text-slate-600 hover:text-crema-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm animate-fade-in">{error}</p>}
                        {success && <p className="text-sage-400 text-sm animate-fade-in">{success}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-crema-100 text-slate-900 font-semibold py-4 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        {mode === 'signin' ? (
                            <>
                                New here?{' '}
                                <button onClick={() => setMode('signup')} className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                                    Join the community
                                </button>
                            </>
                        ) : (
                            <>
                                Already a member?{' '}
                                <button onClick={() => setMode('signin')} className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                                    Sign in instead
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
