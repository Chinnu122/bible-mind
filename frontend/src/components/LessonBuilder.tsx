import React, { useState } from 'react';
import { Download, ArrowLeft, Wand2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LessonTemplate, { LessonContent } from './LessonTemplate';

interface LessonBuilderProps {
    initialVerse: {
        ref: string;
        text: string;
    };
    onClose: () => void;
}

const LessonBuilder: React.FC<LessonBuilderProps> = ({ initialVerse, onClose }) => {
    const [step, setStep] = useState<'content' | 'design' | 'preview'>('content');
    const [loading, setLoading] = useState(false);

    const [content, setContent] = useState<LessonContent>({
        title: 'Verse Study',
        verseRef: initialVerse.ref,
        verseText: initialVerse.text,
        includeLexicon: true,
        includeArt: true,
        artImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop', // Mock for demo
        lexiconWords: [
            { word: 'Bereshit', mean: 'In the beginning' },
            { word: 'Bara', mean: 'Created (ex nihilo)' },
            { word: 'Elohim', mean: 'God (Plural majesty)' }
        ],
        notes: ''
    });

    const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic');

    const generatePDF = async () => {
        setLoading(true);
        const input = document.getElementById('lesson-print-area');
        if (!input) return;

        try {
            const canvas = await html2canvas(input, {
                scale: 2, // High resolution
                useCORS: true, // Allow cross-origin images
                logging: false
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${content.title.replace(/\s+/g, '_')}_BibleMind_Lesson.pdf`);
        } catch (err) {
            console.error("PDF Fail:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f0f0f]">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Wand2 size={20} className="text-gold-500" />
                        <h2 className="text-lg font-serif text-crema-100">Lesson Builder</h2>
                    </div>
                </div>

                <div className="flex items-center bg-black/50 rounded-lg p-1 border border-white/5">
                    {(['content', 'design', 'preview'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStep(s)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${step === s ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Download size={18} />
                            Export PDF
                        </>
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Configuration Panel */}
                <div className="w-80 border-r border-white/10 bg-[#0f0f0f] overflow-y-auto p-6 scrollbar-thin">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Settings</h3>

                    {step === 'content' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Lesson Title</label>
                                <input
                                    type="text"
                                    value={content.title}
                                    onChange={e => setContent({ ...content, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">My Notes / Study</label>
                                <textarea
                                    value={content.notes}
                                    onChange={e => setContent({ ...content, notes: e.target.value })}
                                    placeholder="Add your reflections here..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-500/50 resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-slate-400 text-sm">Include Sections</label>
                                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={content.includeLexicon}
                                        onChange={e => setContent({ ...content, includeLexicon: e.target.checked })}
                                        className="accent-gold-500"
                                    />
                                    <span className="text-slate-200">Word Studies</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={content.includeArt}
                                        onChange={e => setContent({ ...content, includeArt: e.target.checked })}
                                        className="accent-gold-500"
                                    />
                                    <span className="text-slate-200">Verse Art</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 'design' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-4">Choose Template</label>
                                {(['classic', 'modern', 'minimal'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTemplate(t)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all mb-3 ${template === t
                                            ? 'border-gold-500 bg-gold-500/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="font-bold text-crema-100 capitalize mb-1">{t} Style</div>
                                        <div className="text-xs text-slate-500">
                                            {t === 'classic' && 'Timeless & Elegant'}
                                            {t === 'modern' && 'Bold & Clean'}
                                            {t === 'minimal' && 'Simple & Focused'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-[#1a1a1a] p-8 flex items-start justify-center overflow-y-auto">
                    <div className="transform origin-top scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 transition-transform">
                        <LessonTemplate content={content} templateType={template} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonBuilder;
