import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Bot, User, ChevronLeft, Loader2,
    BookOpen, Sparkles, Languages, Heart
} from 'lucide-react';

// AI Service URL - use environment variable or default
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickActions = [
    { icon: BookOpen, label: 'Explain a verse', prompt: 'Explain John 3:16' },
    { icon: Sparkles, label: 'Study topic', prompt: 'Create a study on faith' },
    { icon: Languages, label: 'Translate', prompt: 'Translate "God is love" to Telugu' },
    { icon: Heart, label: 'Kids story', prompt: 'Tell me a story about David' },
];

export default function AIChat({ onBack }: { onBack: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${AI_SERVICE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || 'Sorry, I could not process that request.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, the AI service is currently unavailable. Please try again later.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    <ChevronLeft className="text-crema-200" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-crema-100">Bible Mind AI</h1>
                        <p className="text-xs text-crema-300/60">Ask anything about the Bible</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                            <Sparkles size={32} className="text-purple-400" />
                        </div>
                        <h2 className="text-xl font-serif text-crema-100 mb-2">Welcome to Bible Mind AI</h2>
                        <p className="text-crema-300/60 mb-8 max-w-md mx-auto">
                            Ask questions about the Bible, get verse explanations, create study notes, or explore stories.
                        </p>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(action.prompt)}
                                    className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
                                >
                                    <action.icon size={18} className="text-purple-400 group-hover:text-purple-300" />
                                    <span className="text-sm text-crema-200">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-sm'
                                        : 'bg-white/10 text-crema-100 rounded-bl-sm'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-crema-600 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-crema-100" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-white/10 rounded-2xl rounded-bl-sm p-4">
                            <div className="flex items-center gap-2 text-crema-300">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
                <div className="flex gap-3 max-w-3xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Ask about the Bible..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-crema-100 placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
