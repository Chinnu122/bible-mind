import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, ChevronLeft, Bot, User, Sparkles, Image, Loader2,
    BookOpen, Quote, Copy, Check, Trash2
} from 'lucide-react';
import { generateImage, callAI } from '../services/geminiService';

// Types
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    structured?: {
        intro: string;
        points: string[];
        references: string[];
        conclusion: string;
    };
    imageUrl?: string;
    timestamp: Date;
    isGeneratingImage?: boolean;
}

// Storage key
const CHAT_HISTORY_KEY = 'biblemind_chat_history';

// Call AI for structured response using unified service
async function callChatAI(prompt: string): Promise<ChatMessage['structured']> {
    const systemPrompt = `You are a wise, knowledgeable Bible study assistant. When answering questions:
1. Start with a brief introductory paragraph (2-3 sentences)
2. Provide 4-6 key points as bullet points
3. Include 3-5 relevant Scripture references
4. End with a thoughtful concluding paragraph

IMPORTANT: Respond in this exact JSON format:
{
    "intro": "Your opening paragraph here...",
    "points": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "references": ["Genesis 1:1", "John 3:16", "Psalm 23:1"],
    "conclusion": "Your closing thoughts here..."
}

User Question: ${prompt}`;

    try {
        const response = await callAI(systemPrompt, true);
        return JSON.parse(response);
    } catch (error) {
        console.error('Chat AI error:', error);
        // Fallback response
        return {
            intro: "I apologize, but I'm having trouble connecting to my knowledge base right now.",
            points: ["Please try again in a moment", "Check your internet connection", "The AI service may be temporarily unavailable"],
            references: ["Proverbs 3:5-6"],
            conclusion: "Trust in the Lord with all your heart, and lean not on your own understanding."
        };
    }
}

// Load/Save chat history
function loadChatHistory(): ChatMessage[] {
    try {
        const saved = localStorage.getItem(CHAT_HISTORY_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
        }
    } catch (e) {
        console.error('Failed to load chat history:', e);
    }
    return [];
}

function saveChatHistory(messages: ChatMessage[]) {
    try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-50))); // Keep last 50
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
}

// Main Component
export default function AIChatbot({ onBack }: { onBack: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Save on change
    useEffect(() => {
        saveChatHistory(messages);
    }, [messages]);

    // Send message
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const structured = await callChatAI(userMessage.content);

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `${structured?.intro || ''}\n\n${structured?.points?.map(p => `• ${p}`).join('\n') || ''}\n\n${structured?.conclusion || ''}`,
                structured,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate image for a message
    const handleGenerateImage = async (messageId: string, prompt: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, isGeneratingImage: true } : msg
        ));

        try {
            const imageUrl = await generateImage(prompt, true);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, imageUrl, isGeneratingImage: false } : msg
            ));
        } catch (error) {
            console.error('Image generation failed:', error);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, isGeneratingImage: false } : msg
            ));
        }
    };

    // Copy message
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Clear history
    const handleClearHistory = () => {
        setMessages([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);
    };

    // Suggested prompts
    const suggestions = [
        "What does the Bible say about faith?",
        "Explain the Beatitudes",
        "Who was King David?",
        "What is the meaning of grace?"
    ];

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-crema-50">AI Bible Guide</h1>
                            <p className="text-xs text-slate-400">Powered by Divine Intelligence</p>
                        </div>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2"
                        title="Clear history"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-6">
                            <Sparkles size={32} className="text-violet-400" />
                        </div>
                        <h2 className="text-2xl font-editorial text-crema-50 mb-2">Ask Me Anything</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Explore Scripture, understand context, and deepen your faith with AI-powered insights.
                        </p>

                        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(suggestion)}
                                    className="text-left p-4 bg-slate-800/50 border border-white/5 rounded-xl hover:border-violet-500/30 hover:bg-slate-800 transition-all text-sm text-slate-300"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                    <div className={`rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-sm'
                                        : 'bg-slate-800 border border-white/5 rounded-bl-sm'
                                        }`}>
                                        {msg.structured ? (
                                            <div className="space-y-4">
                                                {/* Intro */}
                                                <p className="text-slate-200 leading-relaxed">{msg.structured.intro}</p>

                                                {/* Points */}
                                                <div className="space-y-2">
                                                    {msg.structured.points.map((point, pi) => (
                                                        <div key={pi} className="flex gap-2 text-slate-300">
                                                            <span className="text-violet-400">•</span>
                                                            <span>{point}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* References */}
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.structured.references.map((ref, ri) => (
                                                        <span key={ri} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full flex items-center gap-1">
                                                            <BookOpen size={10} />
                                                            {ref}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Conclusion */}
                                                <div className="border-t border-white/10 pt-3">
                                                    <Quote size={14} className="text-slate-500 mb-1" />
                                                    <p className="text-slate-400 italic text-sm">{msg.structured.conclusion}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className={msg.role === 'user' ? 'text-white' : 'text-slate-200'}>
                                                {msg.content}
                                            </p>
                                        )}

                                        {/* Generated Image */}
                                        {msg.imageUrl && (
                                            <div className="mt-4 rounded-xl overflow-hidden">
                                                <img src={msg.imageUrl} alt="Generated" className="w-full" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions for assistant messages */}
                                    {msg.role === 'assistant' && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleCopy(msg.content, msg.id)}
                                                className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                                                {copiedId === msg.id ? 'Copied' : 'Copy'}
                                            </button>
                                            <button
                                                onClick={() => handleGenerateImage(msg.id, msg.structured?.intro || msg.content)}
                                                disabled={msg.isGeneratingImage}
                                                className="text-xs text-slate-500 hover:text-violet-400 transition-colors flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {msg.isGeneratingImage ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    <Image size={12} />
                                                )}
                                                {msg.isGeneratingImage ? 'Generating...' : 'Generate Image'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
                                        <User size={16} className="text-slate-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-bl-sm p-4">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
                <div className="flex gap-3 items-end">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Ask about Scripture, theology, or Bible history..."
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-crema-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none min-h-[52px] max-h-[120px]"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
