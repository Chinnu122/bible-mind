import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, Quote, ThumbsUp, ChevronLeft } from 'lucide-react';

interface Review {
    id: string;
    userName: string;
    rating: number;
    text: string;
    date: string;
    likes: number;
}

const SAMPLE_REVIEWS: Review[] = [
    {
        id: '1',
        userName: 'Sarah James',
        rating: 5,
        text: 'This app has completely transformed my daily walk with God. The design is so peaceful.',
        date: '2 days ago',
        likes: 12
    },
    {
        id: '2',
        userName: 'David Chen',
        rating: 5,
        text: 'I love the daily quizzes! They help me remember what I read.',
        date: '1 week ago',
        likes: 8
    },
    {
        id: '3',
        userName: 'Maria Garcia',
        rating: 4,
        text: 'Beautiful interface. Would love to see more translations in the future.',
        date: '2 weeks ago',
        likes: 5
    }
];

export default function ReviewBoard({ onBack }: { onBack: () => void }) {
    const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [isWriting, setIsWriting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.trim()) return;

        const review: Review = {
            id: Date.now().toString(),
            userName: 'You', // In a real app, get from auth
            rating,
            text: newReview,
            date: 'Just now',
            likes: 0
        };

        setReviews([review, ...reviews]);
        setNewReview('');
        setIsWriting(false);
    };

    return (
        <div className="h-full flex flex-col pt-8 max-w-4xl mx-auto px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <div>
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors mb-4 flex items-center gap-2">
                        <ChevronLeft size={16} /> Back
                    </button>
                    <h1 className="text-4xl font-editorial text-crema-50 mb-2">Community Voices</h1>
                    <p className="text-slate-400">Join the conversation with fellow believers.</p>
                </div>

                {!isWriting && (
                    <button
                        onClick={() => setIsWriting(true)}
                        className="bg-gold-500 text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/10 flex items-center gap-2"
                    >
                        <MessageSquare size={18} />
                        Write Review
                    </button>
                )}
            </div>

            {/* Write Review Form */}
            <AnimatePresence>
                {isWriting && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-10 bg-slate-800/50 border border-white/5 rounded-3xl p-6 overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-colors ${star <= rating ? 'text-gold-400' : 'text-slate-600'}`}
                                >
                                    <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your testimony or experience..."
                            className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-crema-100 placeholder-slate-500 focus:outline-none focus:border-gold-500/30 min-h-[120px] mb-4 font-serif text-lg"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsWriting(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-crema-100 text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                            >
                                <Send size={16} /> Post
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reviews Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {reviews.map((review, i) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-colors group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-crema-100 font-bold border border-white/10">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-crema-50 font-bold text-sm">{review.userName}</h3>
                                        <span className="text-xs text-slate-500">{review.date}</span>
                                    </div>
                                </div>
                                <div className="flex text-gold-500 text-xs gap-0.5 bg-black/20 px-2 py-1 rounded-full">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={10} fill="currentColor" />
                                    ))}
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <Quote size={20} className="absolute -top-1 -left-1 text-slate-600 opacity-20" />
                                <p className="text-slate-300 leading-relaxed pl-4 font-serif italic text-lg opacity-90">
                                    {review.text}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-500 text-xs pt-4 border-t border-white/5">
                            <button className="flex items-center gap-1.5 hover:text-gold-400 transition-colors group-hover:text-slate-400">
                                <ThumbsUp size={14} />
                                <span>{review.likes} Helpful</span>
                            </button>
                            <button className="hover:text-gold-400 transition-colors ml-auto">
                                Reply
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
