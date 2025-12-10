import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare, Lightbulb, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Review {
    id: string;
    authorName: string;
    content: string;
    type: 'review' | 'idea';
    createdAt: string;
}

interface ReviewBoardProps {
    onBack: () => void;
}

export default function ReviewBoard({ onBack }: ReviewBoardProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newType, setNewType] = useState<'review' | 'idea'>('idea');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/reviews`);
            const json = await res.json();
            if (json.success) {
                setReviews(json.data);
            }
        } catch (e) {
            console.error('Error fetching reviews', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent.trim()) return;

        try {
            const res = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'anonymous',
                    authorName: newAuthor || 'Anonymous',
                    content: newContent,
                    type: newType
                })
            });

            if (res.ok) {
                setNewContent('');
                fetchReviews();
            }
        } catch (e) {
            console.error('Error submitting review', e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 px-4 md:px-12 max-w-5xl mx-auto pb-20 min-h-screen"
        >
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gold-400" />
                </button>
                <h1 className="text-3xl font-serif text-gold-100">Community Idea Board</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
                        <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" /> Share your thoughts
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="Anonymous"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500/50 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Type</label>
                                <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setNewType('idea')}
                                        className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all ${newType === 'idea' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Idea
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewType('review')}
                                        className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all ${newType === 'review' ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Review
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Message</label>
                                <textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="I think it would be cool if..."
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500/50 outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-2 rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all"
                            >
                                <Send className="w-4 h-4" /> Post
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading ideas...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No posts yet. Be the first!</div>
                    ) : (
                        reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1a1d] border border-white/5 rounded-xl p-6"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${review.type === 'idea' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {review.type === 'idea' ? <Lightbulb className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-200">{review.authorName}</h4>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 pl-11">{review.content}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}
