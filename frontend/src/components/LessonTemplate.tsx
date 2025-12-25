import React from 'react';

export interface LessonContent {
    title: string;
    verseRef: string;
    verseText: string;
    includeLexicon: boolean;
    lexiconWords?: { word: string; mean: string }[];
    includeArt: boolean;
    artImageUrl?: string;
    notes: string;
}

interface LessonTemplateProps {
    content: LessonContent;
    templateType: 'classic' | 'modern' | 'minimal';
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({ content, templateType }) => {

    // Classic: Serif fonts, traditional layout, gold accents
    if (templateType === 'classic') {
        return (
            <div id="lesson-print-area" className="bg-white text-black p-12 max-w-[800px] mx-auto min-h-[1000px] shadow-xl">
                <div className="border-b-2 border-gold-500 pb-6 mb-8 text-center">
                    <h1 className="text-4xl font-serif text-slate-900 mb-2">{content.title}</h1>
                    <p className="text-xl text-gold-600 font-serif italic">{content.verseRef}</p>
                </div>

                <div className="mb-8 p-6 bg-slate-50 border-l-4 border-gold-500">
                    <p className="text-2xl font-serif leading-relaxed text-slate-800">
                        "{content.verseText}"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {content.includeLexicon && content.lexiconWords && (
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-2">
                                Word Studies
                            </h3>
                            <ul className="space-y-4">
                                {content.lexiconWords.map((item, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="font-bold text-slate-900">{item.word}</span>
                                        <span className="text-slate-600 italic">{item.mean}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {content.includeArt && content.artImageUrl && (
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-2 w-full">
                                Visualization
                            </h3>
                            <img src={content.artImageUrl} alt="Verse Art" className="rounded-sm shadow-md border-4 border-white" />
                        </div>
                    )}
                </div>

                {content.notes && (
                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4">Study Notes</h3>
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif">
                            {content.notes}
                        </p>
                    </div>
                )}

                <div className="mt-12 text-center text-xs text-slate-400">
                    Created with Bible Mind
                </div>
            </div>
        );
    }

    // Modern: Sans-serif, clean lines, bold headers
    if (templateType === 'modern') {
        return (
            <div id="lesson-print-area" className="bg-white text-black p-12 max-w-[800px] mx-auto min-h-[1000px] shadow-xl">
                <div className="flex items-end justify-between border-b-4 border-black pb-4 mb-10">
                    <h1 className="text-5xl font-bold tracking-tight text-black">{content.title}</h1>
                    <span className="text-2xl font-bold text-slate-400">{content.verseRef}</span>
                </div>

                <div className="mb-10">
                    <p className="text-3xl font-light leading-snug text-slate-900">
                        {content.verseText}
                    </p>
                </div>

                {content.includeArt && content.artImageUrl && (
                    <div className="mb-10 w-full h-64 overflow-hidden rounded-xl bg-slate-100">
                        <img src={content.artImageUrl} alt="Verse Art" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8 mb-10">
                    {content.includeLexicon && content.lexiconWords && (
                        <div className="col-span-1 bg-slate-100 p-6 rounded-xl">
                            <h3 className="font-bold mb-4">Keywords</h3>
                            <ul className="space-y-3 text-sm">
                                {content.lexiconWords.map((item, i) => (
                                    <li key={i}>
                                        <span className="font-bold block">{item.word}</span>
                                        <span className="text-slate-500">{item.mean}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {content.notes && (
                        <div className={`p-6 ${content.includeLexicon ? 'col-span-2' : 'col-span-3'}`}>
                            <h3 className="font-bold mb-4">Observations</h3>
                            <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                                {content.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Minimal: Simple, centered, focus on text
    return (
        <div id="lesson-print-area" className="bg-white text-black p-16 max-w-[800px] mx-auto min-h-[1000px] shadow-xl flex flex-col items-center text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">{content.verseRef}</span>

            <h1 className="text-3xl font-serif text-slate-900 mb-12">{content.title}</h1>

            <p className="text-xl leading-loose font-serif text-slate-700 max-w-lg mb-12">
                {content.verseText}
            </p>

            {content.includeLexicon && content.lexiconWords && (
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {content.lexiconWords.map((item, i) => (
                        <div key={i} className="text-sm">
                            <span className="font-serif italic text-slate-900">{item.word}</span>
                            <span className="text-slate-400 mx-2">—</span>
                            <span className="text-slate-500">{item.mean}</span>
                        </div>
                    ))}
                </div>
            )}

            {content.includeArt && content.artImageUrl && (
                <div className="mb-12 max-w-sm shadow-2xl">
                    <img src={content.artImageUrl} alt="Verse Art" className="grayscale opacity-80" />
                </div>
            )}

            {content.notes && (
                <div className="max-w-lg text-left text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-8 mt-auto">
                    {content.notes}
                </div>
            )}
        </div>
    );
};

export default LessonTemplate;
