import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw, BookOpen,
    TreeDeciduous, Cloud, Sun, Droplets, Heart,
    Flame, Baby, Tent, Crown, Gift, Users, Hammer, Mountain, Shield,
    Zap, Sprout, Moon, Bird, Fish, Wheat, Map, X, Star, Rainbow, Castle, Globe
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// Available Languages
type Language = 'en' | 'te' | 'hi';

const languages: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

// Story data with translations
interface StoryPage {
    page: number;
    ref: string;
    theme: string;
    en: { title: string; paragraphs: string[] };
    te: { title: string; paragraphs: string[] };
    hi: { title: string; paragraphs: string[] };
}

const genesisStories: StoryPage[] = [
    {
        page: 1, ref: "Genesis 1:1-5", theme: "day1",
        en: { title: "In the Beginning", paragraphs: ["Before the world began, there was no earth, no sky, and no sea. Everything was dark and empty.", "But God was there. And God had a wonderful plan to make something beautiful!", "God said, 'Let there be light!' And suddenly—FLASH!—bright, beautiful light appeared. God called the light 'Day' and the darkness 'Night.' That was the very first day."] },
        te: { title: "ఆరంభంలో", paragraphs: ["ప్రపంచం ప్రారంభమయ్యే ముందు, భూమి, ఆకాశం, సముద్రం లేదు. అంతా చీకటిగా, ఖాళీగా ఉంది.", "కానీ దేవుడు అక్కడ ఉన్నాడు. దేవుడు అందమైనది తయారు చేయడానికి అద్భుతమైన ప్రణాళిక కలిగి ఉన్నాడు!", "దేవుడు 'వెలుగు కలుగును గాక!' అని చెప్పాడు. అకస్మాత్తుగా—ఫ్లాష్!—ప్రకాశవంతమైన, అందమైన వెలుగు కనిపించింది. దేవుడు వెలుగును 'పగలు' అని, చీకటిని 'రాత్రి' అని పిలిచాడు. అది మొదటి రోజు."] },
        hi: { title: "आदि में", paragraphs: ["दुनिया शुरू होने से पहले, कोई पृथ्वी नहीं थी, कोई आकाश नहीं था, और कोई समुद्र नहीं था। सब कुछ अंधेरा और खाली था।", "लेकिन भगवान वहाँ थे। और भगवान के पास कुछ सुंदर बनाने की अद्भुत योजना थी!", "भगवान ने कहा, 'प्रकाश हो!' और अचानक—फ्लैश!—उज्ज्वल, सुंदर प्रकाश प्रकट हुआ। भगवान ने प्रकाश को 'दिन' और अंधकार को 'रात' कहा। यह पहला दिन था।"] }
    },
    {
        page: 2, ref: "Genesis 1:6-8", theme: "day2",
        en: { title: "Sky and Waters", paragraphs: ["On the second day, the world was still covered in water. So God spoke again.", "He made a big, blue space to separate the water. He pushed some water up high to make clouds.", "He called the space 'Sky.' Now there was a place for the wind to blow and clouds to float!"] },
        te: { title: "ఆకాశం మరియు నీరు", paragraphs: ["రెండవ రోజున, ప్రపంచం ఇంకా నీటితో కప్పబడి ఉంది. కాబట్టి దేవుడు మళ్ళీ మాట్లాడాడు.", "అతను నీటిని వేరు చేయడానికి పెద్ద, నీలం స్థలం చేసాడు. కొంత నీటిని పైకి మేఘాలు చేయడానికి నెట్టాడు.", "అతను ఆ స్థలాన్ని 'ఆకాశం' అని పిలిచాడు. ఇప్పుడు గాలి వీచడానికి మరియు మేఘాలు తేలడానికి స్థలం ఉంది!"] },
        hi: { title: "आकाश और जल", paragraphs: ["दूसरे दिन, दुनिया अभी भी पानी से ढकी हुई थी। इसलिए भगवान ने फिर से बात की।", "उसने पानी को अलग करने के लिए एक बड़ा, नीला स्थान बनाया। उसने कुछ पानी को ऊपर धकेल कर बादल बनाए।", "उसने उस स्थान को 'आकाश' कहा। अब हवा चलने और बादलों के तैरने के लिए जगह थी!"] }
    },
    {
        page: 3, ref: "Genesis 1:9-13", theme: "day3",
        en: { title: "Land and Plants", paragraphs: ["On the third day, God told the water below to gather together. Dry ground popped up from the ocean!", "Then God said, 'Let the land grow plants!'", "Suddenly, grass turned the hills green. Tall trees grew and colorful flowers bloomed everywhere."] },
        te: { title: "భూమి మరియు మొక్కలు", paragraphs: ["మూడవ రోజున, దేవుడు క్రింద ఉన్న నీటికి ఒకచోట చేరమని చెప్పాడు. సముద్రం నుండి పొడి నేల బయటకు వచ్చింది!", "అప్పుడు దేవుడు 'భూమి మొక్కలు పెరగనీ!' అని చెప్పాడు.", "అకస్మాత్తుగా, గడ్డి కొండలను ఆకుపచ్చగా మార్చింది. పొడవైన చెట్లు పెరిగాయి, ప్రతిచోటా రంగురంగుల పువ్వులు విరిసాయి."] },
        hi: { title: "भूमि और पौधे", paragraphs: ["तीसरे दिन, भगवान ने नीचे के पानी को एक जगह इकट्ठा होने को कहा। समुद्र से सूखी जमीन निकली!", "फिर भगवान ने कहा, 'भूमि पर पौधे उगें!'", "अचानक, घास ने पहाड़ियों को हरा कर दिया। ऊंचे पेड़ उगे और रंग-बिरंगे फूल हर जगह खिले।"] }
    },
    {
        page: 4, ref: "Genesis 1:14-19", theme: "day4",
        en: { title: "Sun, Moon, and Stars", paragraphs: ["On the fourth day, God made lights in the sky.", "He made the big, golden Sun to warm the day. Then He made the silvery Moon to watch over the night.", "He also scattered millions of twinkling stars across the darkness like diamond dust."] },
        te: { title: "సూర్యుడు, చంద్రుడు మరియు నక్షత్రాలు", paragraphs: ["నాలుగవ రోజున, దేవుడు ఆకాశంలో దీపాలు చేసాడు.", "అతను పగటిని వెచ్చగా చేయడానికి పెద్ద, బంగారు సూర్యుడిని చేసాడు. రాత్రిని చూసుకోవడానికి వెండి చంద్రుడిని చేసాడు.", "అతను చీకటి అంతటా వజ్రాల ధూళి వంటి లక్షలాది మెరిసే నక్షత్రాలను చెల్లాచెదురు చేసాడు."] },
        hi: { title: "सूर्य, चंद्रमा और तारे", paragraphs: ["चौथे दिन, भगवान ने आकाश में रोशनी बनाई।", "उसने दिन को गर्म करने के लिए बड़ा, सुनहरा सूर्य बनाया। फिर रात की देखभाल के लिए चांदी जैसा चंद्रमा बनाया।", "उसने अंधेरे में हीरे की धूल की तरह लाखों टिमटिमाते तारे बिखेर दिए।"] }
    },
    {
        page: 5, ref: "Genesis 1:20-23", theme: "day5",
        en: { title: "Fish and Birds", paragraphs: ["On the fifth day, God looked at the quiet oceans and the empty sky.", "He said, 'Let them be filled with living things!'", "Splash! Whales and fish began to swim. Flap! Eagles and parrots soared into the sky."] },
        te: { title: "చేపలు మరియు పక్షులు", paragraphs: ["ఐదవ రోజున, దేవుడు నిశ్శబ్ద సముద్రాలను మరియు ఖాళీ ఆకాశాన్ని చూసాడు.", "అతను 'వాటిని జీవులతో నింపండి!' అని చెప్పాడు.", "స్ప్లాష్! తిమింగలాలు మరియు చేపలు ఈదడం ప్రారంభించాయి. ఫ్లాప్! డేగలు మరియు చిలుకలు ఆకాశంలో ఎగిరాయి."] },
        hi: { title: "मछलियाँ और पक्षी", paragraphs: ["पांचवें दिन, भगवान ने शांत समुद्रों और खाली आकाश को देखा।", "उसने कहा, 'इन्हें जीवित प्राणियों से भर दो!'", "छपाक! व्हेल और मछलियाँ तैरने लगीं। फड़फड़! बाज और तोते आकाश में उड़ने लगे।"] }
    },
    {
        page: 6, ref: "Genesis 1:24-31", theme: "day6",
        en: { title: "Animals and Man", paragraphs: ["On the sixth day, God made animals for the land. Elephants, lions, and puppies appeared!", "Then God did something very special. He made a man named Adam from the dust.", "Adam was made in God's image to be God's friend and to take care of this new world."] },
        te: { title: "జంతువులు మరియు మనిషి", paragraphs: ["ఆరవ రోజున, దేవుడు భూమికి జంతువులను చేసాడు. ఏనుగులు, సింహాలు మరియు కుక్కపిల్లలు కనిపించాయి!", "అప్పుడు దేవుడు చాలా ప్రత్యేకమైనది చేసాడు. అతను మట్టి నుండి ఆదాము అనే మనిషిని చేసాడు.", "ఆదాము దేవుని స్నేహితుడిగా మరియు ఈ కొత్త ప్రపంచాన్ని జాగ్రత్తగా చూసుకోవడానికి దేవుని రూపంలో చేయబడ్డాడు."] },
        hi: { title: "जानवर और मनुष्य", paragraphs: ["छठे दिन, भगवान ने भूमि के लिए जानवर बनाए। हाथी, शेर और पिल्ले प्रकट हुए!", "फिर भगवान ने कुछ बहुत खास किया। उसने मिट्टी से आदम नामक मनुष्य बनाया।", "आदम को भगवान का मित्र बनने और इस नई दुनिया की देखभाल करने के लिए भगवान की छवि में बनाया गया था।"] }
    },
    {
        page: 7, ref: "Genesis 2:1-3", theme: "day7",
        en: { title: "A Day of Rest", paragraphs: ["By the seventh day, the whole universe was finished. It was perfect.", "So God rested. He didn't rest because He was tired, but to show that the work was done.", "He made the seventh day a special, holy day for rest and happiness."] },
        te: { title: "విశ్రాంతి రోజు", paragraphs: ["ఏడవ రోజు నాటికి, మొత్తం విశ్వం పూర్తయింది. అది పరిపూర్ణంగా ఉంది.", "కాబట్టి దేవుడు విశ్రాంతి తీసుకున్నాడు. అతను అలసిపోయాడు కాబట్టి కాదు, పని పూర్తయిందని చూపించడానికి.", "అతను ఏడవ రోజును విశ్రాంతి మరియు ఆనందం కోసం ప్రత్యేక, పవిత్ర దినంగా చేసాడు."] },
        hi: { title: "विश्राम का दिन", paragraphs: ["सातवें दिन तक, पूरा ब्रह्मांड तैयार हो गया। यह पूर्ण था।", "तो भगवान ने विश्राम किया। वह थके हुए नहीं थे, बल्कि यह दिखाने के लिए कि काम पूरा हो गया।", "उसने सातवें दिन को विश्राम और खुशी के लिए एक विशेष, पवित्र दिन बनाया।"] }
    },
];

// Theme-based illustration
const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        day1: 'from-gray-900 to-indigo-900', day2: 'from-sky-400 to-blue-500',
        day3: 'from-green-400 to-emerald-600', day4: 'from-indigo-800 to-purple-900',
        day5: 'from-blue-400 to-cyan-500', day6: 'from-amber-200 to-orange-300',
        day7: 'from-yellow-100 to-amber-200'
    };

    const icons: Record<string, React.ReactNode> = {
        day1: <Sun size={64} className="text-yellow-300" />,
        day2: <Cloud size={64} className="text-white" />,
        day3: <TreeDeciduous size={64} className="text-green-700" />,
        day4: <div className="flex gap-2"><Sun size={48} className="text-yellow-400" /><Moon size={40} className="text-gray-200" /></div>,
        day5: <div className="flex flex-col gap-2"><Bird size={44} className="text-blue-700" /><Fish size={44} className="text-cyan-400" /></div>,
        day6: <Users size={64} className="text-amber-800" />,
        day7: <div className="text-4xl font-bold text-amber-600">zZZ</div>
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <BookOpen size={64} className="text-white" />}
        </div>
    );
};

interface GenesisBookProps {
    onClose: () => void;
}

export default function GenesisBook({ onClose }: GenesisBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);

    const totalPages = genesisStories.length;

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(c => c + 1);
            if (contentRef.current) contentRef.current.scrollTop = 0;
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(c => c - 1);
            if (contentRef.current) contentRef.current.scrollTop = 0;
        }
    };

    const pageData = currentPage > 0 ? genesisStories[currentPage - 1] : null;
    const content = pageData ? pageData[selectedLang] : null;
    const currentLangInfo = languages.find(l => l.id === selectedLang) || languages[0];

    const getBgColor = () => {
        switch (theme) {
            case 'nebula': return 'bg-purple-950';
            case 'abstract': return 'bg-amber-950';
            case 'dark': return 'bg-zinc-950';
            case 'aurora': return 'bg-emerald-950';
            default: return 'bg-gray-950';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            {/* Book Container */}
            <div className={`relative w-full max-w-4xl h-[85vh] ${getBgColor()} rounded-3xl shadow-2xl overflow-hidden border border-white/20`}>

                {/* Header */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{currentLangInfo.flag} {currentLangInfo.native}</span>
                        </button>

                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-gray-900 rounded-xl border border-white/10 shadow-xl overflow-hidden min-w-[160px]">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => { setSelectedLang(lang.id); setShowLangMenu(false); }}
                                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/10 ${selectedLang === lang.id ? 'bg-gold-500/20 text-gold-300' : 'text-gray-200'}`}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.native}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                {currentPage === 0 ? (
                    /* Cover Page */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-amber-600 to-orange-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full">
                            <Book size={80} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-amber-100 mb-6">GENESIS</h2>
                        <p className="text-white/80 mb-8 max-w-md">7 Days of Creation - Telugu & Hindi Translations Available</p>
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-white text-amber-600 rounded-full font-bold text-xl flex items-center gap-2"
                        >
                            START READING <ChevronRight size={24} />
                        </button>
                    </div>
                ) : (
                    /* Story Pages */
                    <div className="h-full flex flex-col md:flex-row">
                        {/* Left: Illustration */}
                        <div className="w-full md:w-5/12 p-6 flex flex-col">
                            <Illustration theme={pageData!.theme} />
                            <div className="mt-4 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-bold uppercase mb-2">
                                    {pageData!.ref}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-white">{content?.title}</h2>
                            </div>
                        </div>

                        {/* Right: Story */}
                        <div className="flex-1 flex flex-col bg-white/5">
                            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {content?.paragraphs.map((para, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0" />
                                        <p className="text-lg text-gray-200 leading-relaxed">{para}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="p-4 border-t border-white/10 flex justify-between items-center">
                                <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="text-sm font-bold text-gray-400">{currentPage} / {totalPages}</span>
                                {currentPage < totalPages ? (
                                    <button onClick={handleNext} className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center">
                                        <ChevronRight size={28} />
                                    </button>
                                ) : (
                                    <button onClick={() => setCurrentPage(0)} className="px-5 py-3 rounded-full bg-emerald-500 text-white font-bold flex items-center gap-2">
                                        Again! <RefreshCcw size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
