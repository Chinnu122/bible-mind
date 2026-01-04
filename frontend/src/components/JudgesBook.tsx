import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw,
    Sword, Shield, Flame, Sun, Star, X, Globe, Users
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

type Language = 'en' | 'te' | 'hi';

const languages: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

interface StoryPage {
    page: number;
    ref: string;
    theme: string;
    en: { title: string; paragraphs: string[] };
    te: { title: string; paragraphs: string[] };
    hi: { title: string; paragraphs: string[] };
}

const judgesStories: StoryPage[] = [
    {
        page: 1, ref: "Judges 2:10-19", theme: "cycle",
        en: { title: "The Dark Cycle", paragraphs: ["After Joshua's generation died, a new generation arose who didn't know the Lord.", "They did evil, worshiped idols, and forgot God. So enemies oppressed them.", "When they cried out, God raised up judges to save them. But then they forgot again. This cycle repeated."] },
        te: { title: "చీకటి చక్రం", paragraphs: ["యెహోషువ తరం చనిపోయిన తర్వాత, యెహోవాను తెలియని కొత్త తరం పెరిగింది.", "వారు చెడు చేశారు, విగ్రహాలను పూజించారు, దేవుడిని మరచిపోయారు. కాబట్టి శత్రువులు వారిని అణచివేశారు.", "వారు మొరపెట్టినప్పుడు, దేవుడు వారిని రక్షించడానికి న్యాయాధిపతులను లేపాడు. కానీ మళ్ళీ మరచిపోయారు. ఈ చక్రం పునరావృతమైంది."] },
        hi: { title: "अंधेरे का चक्र", paragraphs: ["यहोशू की पीढ़ी के मरने के बाद, एक नई पीढ़ी उठी जो यहोवा को नहीं जानती थी।", "उन्होंने बुराई की, मूर्तियों की पूजा की, और परमेश्वर को भूल गए। इसलिए शत्रुओं ने उन्हें सताया।", "जब वे पुकारे, परमेश्वर ने उन्हें बचाने के लिए न्यायियों को उठाया। लेकिन फिर वे भूल गए। यह चक्र दोहराता रहा।"] }
    },
    {
        page: 2, ref: "Judges 3:7-11", theme: "othniel",
        en: { title: "Othniel the First Judge", paragraphs: ["Israel forgot God and served idols. So God allowed the king of Aram to oppress them for eight years.", "Israel cried out to God, and He raised up Othniel, Caleb's nephew, as a deliverer.", "The Spirit of the Lord came upon Othniel. He won the battle, and the land had peace for forty years."] },
        te: { title: "మొదటి న్యాయాధిపతి ఒత్నీయేలు", paragraphs: ["ఇశ్రాయేలు దేవుడిని మరచి విగ్రహాలను సేవించింది. కాబట్టి దేవుడు ఆరాము రాజును ఎనిమిది సంవత్సరాలు వారిని అణచివేయనిచ్చాడు.", "ఇశ్రాయేలు దేవునికి మొరపెట్టింది, విమోచకునిగా కాలేబు మేనల్లుడు ఒత్నీయేలును ఆయన లేపాడు.", "యెహోవా ఆత్మ ఒత్నీయేలు మీదికి వచ్చింది. అతను యుద్ధంలో గెలిచాడు, నలభై సంవత్సరాలు భూమికి శాంతి వచ్చింది."] },
        hi: { title: "पहला न्यायी ओत्नीएल", paragraphs: ["इस्राएल ने परमेश्वर को भुला दिया और मूर्तियों की सेवा की। इसलिए परमेश्वर ने अराम के राजा को आठ साल उन पर अत्याचार करने दिया।", "इस्राएल ने परमेश्वर को पुकारा, और उसने कालेब के भतीजे ओत्नीएल को छुड़ाने वाले के रूप में उठाया।", "यहोवा का आत्मा ओत्नीएल पर आया। उसने युद्ध जीता, और देश में चालीस साल शांति रही।"] }
    },
    {
        page: 3, ref: "Judges 3:12-30", theme: "ehud",
        en: { title: "Ehud the Left-Handed", paragraphs: ["Israel sinned again, and Moab oppressed them for eighteen years.", "God raised up Ehud, a left-handed man. He hid a sword on his right side where no one would check.", "Ehud killed the fat king of Moab and rallied Israel to defeat their enemies. Peace lasted eighty years."] },
        te: { title: "ఎడమచేతి వాడు ఏహూదు", paragraphs: ["ఇశ్రాయేలు మళ్ళీ పాపం చేసింది, మోయాబు పద్దెనిమిది సంవత్సరాలు వారిని అణచివేసింది.", "దేవుడు ఎడమచేతి వాడు ఏహూదును లేపాడు. అతను ఎవరూ తనిఖీ చేయని తన కుడివైపు కత్తి దాచాడు.", "ఏహూదు మోయాబు లావుగా ఉన్న రాజును చంపి ఇశ్రాయేలును వారి శత్రువులను ఓడించడానికి సమీకరించాడు. ఎనభై సంవత్సరాలు శాంతి ఉంది."] },
        hi: { title: "बाएं हाथ का एहूद", paragraphs: ["इस्राएल ने फिर पाप किया, और मोआब ने अठारह साल उन पर अत्याचार किया।", "परमेश्वर ने बाएं हाथ के एहूद को उठाया। उसने अपनी दाहिनी ओर तलवार छिपाई जहाँ कोई जांच नहीं करता।", "एहूद ने मोआब के मोटे राजा को मारा और इस्राएल को शत्रुओं को हराने के लिए इकट्ठा किया। अस्सी साल शांति रही।"] }
    },
    {
        page: 4, ref: "Judges 4:1-10", theme: "deborah",
        en: { title: "Deborah the Prophetess", paragraphs: ["After Ehud died, Israel sinned again. The Canaanite king Jabin oppressed them for twenty years.", "Deborah was a prophetess and judge. She sat under a palm tree and the people came to her for decisions.", "She summoned Barak and said, 'God commands you to fight Sisera.' Barak said, 'I'll go only if you go with me.'"] },
        te: { title: "ప్రవక్తినా దెబోరా", paragraphs: ["ఏహూదు చనిపోయిన తర్వాత, ఇశ్రాయేలు మళ్ళీ పాపం చేసింది. కనానీయ రాజు యాబీను ఇరవై సంవత్సరాలు వారిని అణచివేశాడు.", "దెబోరా ప్రవక్తిని మరియు న్యాయాధిపతి. ఆమె ఒక ఖర్జూర చెట్టు కింద కూర్చుని ప్రజలు తీర్పుల కోసం ఆమె వద్దకు వచ్చారు.", "ఆమె బారాకును పిలిచి చెప్పింది, 'సీసెరాతో పోరాడమని దేవుడు ఆజ్ఞాపిస్తున్నాడు.' బారాకు చెప్పాడు, 'నీవు నాతో వస్తేనే వెళ్తాను.'"] },
        hi: { title: "भविष्यवक्ता दबोरा", paragraphs: ["एहूद के मरने के बाद, इस्राएल ने फिर पाप किया। कनानी राजा याबीन ने बीस साल उन पर अत्याचार किया।", "दबोरा एक भविष्यवक्ता और न्यायी थी। वह खजूर के पेड़ के नीचे बैठती थी और लोग फैसलों के लिए उसके पास आते थे।", "उसने बाराक को बुलाकर कहा, 'परमेश्वर तुझे सीसरा से लड़ने की आज्ञा देता है।' बाराक ने कहा, 'तू मेरे साथ चले तो ही जाऊंगा।'"] }
    },
    {
        page: 5, ref: "Judges 4:14-22", theme: "jael",
        en: { title: "Jael and Sisera", paragraphs: ["Deborah went with Barak. The Lord confused Sisera's army, and Israel won the battle.", "Sisera fled and hid in the tent of a woman named Jael. She gave him milk and covered him.", "When he slept, Jael drove a tent peg through his head, killing him. A woman brought down the mighty commander!"] },
        te: { title: "యాయేలు మరియు సీసెరా", paragraphs: ["దెబోరా బారాకుతో వెళ్ళింది. యెహోవా సీసెరా సైన్యాన్ని తికమకపరిచాడు, ఇశ్రాయేలు యుద్ధంలో గెలిచింది.", "సీసెరా పారిపోయి యాయేలు అనే స్త్రీ గుడారంలో దాక్కున్నాడు. ఆమె అతనికి పాలు ఇచ్చి కప్పింది.", "అతను నిద్రపోయినప్పుడు, యాయేలు అతని తల గుండా గుడారపు మేకు కొట్టి చంపింది. ఒక స్త్రీ శక్తివంతమైన సేనాపతిని కూల్చివేసింది!"] },
        hi: { title: "याएल और सीसरा", paragraphs: ["दबोरा बाराक के साथ गई। यहोवा ने सीसरा की सेना को भ्रमित किया, और इस्राएल ने युद्ध जीता।", "सीसरा भाग गया और याएल नाम की एक स्त्री के तंबू में छिप गया। उसने उसे दूध दिया और ढक दिया।", "जब वह सो गया, याएल ने उसके सिर में तंबू की खूंटी ठोक दी और उसे मार डाला। एक स्त्री ने शक्तिशाली सेनापति को गिरा दिया!"] }
    },
    {
        page: 6, ref: "Judges 6:1-16", theme: "gideon_call",
        en: { title: "God Calls Gideon", paragraphs: ["Israel sinned again, and Midian oppressed them for seven years. The Midianites destroyed their crops.", "An angel found Gideon hiding in a winepress, threshing wheat. 'The Lord is with you, mighty warrior!'", "Gideon protested, 'I'm the weakest!' But God promised, 'I will be with you, and you will strike down Midian.'"] },
        te: { title: "దేవుడు గిద్యోనును పిలిచాడు", paragraphs: ["ఇశ్రాయేలు మళ్ళీ పాపం చేసింది, మిద్యాను ఏడు సంవత్సరాలు వారిని అణచివేసింది. మిద్యానీయులు వారి పంటలను నాశనం చేశారు.", "ఒక దేవదూత గోధుమలు నలుస్తూ ద్రాక్షతొట్టిలో దాక్కున్న గిద్యోనును కనుగొన్నాడు. 'యెహోవా నీతో ఉన్నాడు, శక్తివంతమైన యోధుడా!'", "గిద్యోను నిరసించాడు, 'నేను బలహీనుడను!' కానీ దేవుడు వాగ్దానం చేసాడు, 'నేను నీతో ఉంటాను, నీవు మిద్యానును హతమారుస్తావు.'"] },
        hi: { title: "परमेश्वर ने गिदोन को बुलाया", paragraphs: ["इस्राएल ने फिर पाप किया, और मिद्यान ने सात साल उन पर अत्याचार किया। मिद्यानियों ने उनकी फसलें नष्ट कीं।", "एक स्वर्गदूत ने गिदोन को दाखरस कुंड में छिपकर गेहूं झाड़ते पाया। 'यहोवा तेरे साथ है, शूरवीर!'", "गिदोन ने विरोध किया, 'मैं सबसे कमजोर हूँ!' लेकिन परमेश्वर ने वादा किया, 'मैं तेरे साथ रहूंगा, और तू मिद्यान को मारेगा।'"] }
    },
    {
        page: 7, ref: "Judges 6:36-40", theme: "fleece",
        en: { title: "The Fleece Test", paragraphs: ["Gideon wanted to be sure of God's call. He put a wool fleece on the ground.", "'If the fleece is wet but the ground is dry, I'll know you will save Israel.' It happened!", "Then he asked the opposite - dry fleece, wet ground. God did it again. Gideon was sure."] },
        te: { title: "గొర్రె బొచ్చు పరీక్ష", paragraphs: ["గిద్యోను దేవుని పిలుపు గురించి నిశ్చయంగా ఉండాలనుకున్నాడు. అతను గొర్రె బొచ్చును నేలపై పెట్టాడు.", "'బొచ్చు తడిగా ఉండి నేల పొడిగా ఉంటే, నీవు ఇశ్రాయేలును రక్షిస్తావని తెలుస్తుంది.' అది జరిగింది!", "అప్పుడు అతను వ్యతిరేకంగా అడిగాడు - పొడి బొచ్చు, తడిగా ఉన్న నేల. దేవుడు మళ్ళీ చేసాడు. గిద్యోను నిశ్చయమయ్యాడు."] },
        hi: { title: "ऊन की परीक्षा", paragraphs: ["गिदोन परमेश्वर की बुलाहट के बारे में निश्चित होना चाहता था। उसने जमीन पर ऊन की मींढ़ रखी।", "'अगर मींढ़ गीली हो और जमीन सूखी, तो मुझे पता चलेगा कि तू इस्राएल को बचाएगा।' ऐसा हुआ!", "फिर उसने उल्टा माँगा - सूखी मींढ़, गीली जमीन। परमेश्वर ने फिर किया। गिदोन निश्चित हो गया।"] }
    },
    {
        page: 8, ref: "Judges 7:1-8", theme: "three_hundred",
        en: { title: "The Three Hundred", paragraphs: ["Gideon gathered 32,000 soldiers. But God said, 'Too many! I want Israel to know I saved them, not their army.'", "First, 22,000 fearful men went home. Still too many! God tested them at the water.", "Only 300 men lapped water from their hands - alert and ready. 'With these 300, I will save you.'"] },
        te: { title: "మూడు వందల మంది", paragraphs: ["గిద్యోను 32,000 మంది సైనికులను సమీకరించాడు. కానీ దేవుడు చెప్పాడు, 'చాలా మంది! వారి సైన్యం కాదు, నేను వారిని రక్షించానని ఇశ్రాయేలుకు తెలియాలనుకుంటున్నాను.'", "మొదట, 22,000 మంది భయపడిన వారు ఇంటికి వెళ్ళారు. ఇంకా చాలా మంది! దేవుడు వారిని నీటి వద్ద పరీక్షించాడు.", "కేవలం 300 మంది తమ చేతుల నుండి నీరు త్రాగారు - అప్రమత్తంగా మరియు సిద్ధంగా. 'ఈ 300 మందితో, నేను నిన్ను రక్షిస్తాను.'"] },
        hi: { title: "तीन सौ", paragraphs: ["गिदोन ने 32,000 सैनिक इकट्ठे किए। लेकिन परमेश्वर ने कहा, 'बहुत ज्यादा! मैं चाहता हूँ कि इस्राएल जाने कि मैंने उन्हें बचाया, उनकी सेना ने नहीं।'", "पहले, 22,000 डरे हुए लोग घर गए। फिर भी बहुत! परमेश्वर ने उन्हें पानी पर परखा।", "केवल 300 आदमियों ने अपने हाथों से पानी चाटा - सतर्क और तैयार। 'इन 300 के साथ, मैं तुझे बचाऊंगा।'"] }
    },
    {
        page: 9, ref: "Judges 7:16-22", theme: "torches",
        en: { title: "Torches and Trumpets", paragraphs: ["Gideon gave each man a trumpet, a jar, and a torch hidden inside the jar.", "At midnight, they surrounded the Midianite camp. At Gideon's signal, they blew trumpets and broke the jars.", "The torches blazed! They shouted, 'A sword for the Lord and for Gideon!' The enemy panicked and destroyed each other."] },
        te: { title: "దివిటీలు మరియు బాకాలు", paragraphs: ["గిద్యోను ప్రతి వ్యక్తికి ఒక బాకా, ఒక కుండ మరియు కుండ లోపల దాచిన దివిటీ ఇచ్చాడు.", "అర్ధరాత్రి, వారు మిద్యాను శిబిరాన్ని చుట్టుముట్టారు. గిద్యోను సంకేతం వద్ద, వారు బాకాలు ఊది కుండలను పగలగొట్టారు.", "దివిటీలు మండాయి! వారు అరిచారు, 'యెహోవాకు మరియు గిద్యోనుకు ఖడ్గం!' శత్రువు భయపడి ఒకరినొకరు చంపుకున్నారు."] },
        hi: { title: "मशालें और तुरहियाँ", paragraphs: ["गिदोन ने हर आदमी को एक तुरही, एक घड़ा, और घड़े के अंदर छिपी मशाल दी।", "आधी रात को, उन्होंने मिद्यानी छावनी को घेर लिया। गिदोन के संकेत पर, उन्होंने तुरहियाँ बजाईं और घड़े तोड़े।", "मशालें भड़कीं! वे चिल्लाए, 'यहोवा और गिदोन की तलवार!' शत्रु घबरा गया और एक दूसरे को मार डाला।"] }
    },
    {
        page: 10, ref: "Judges 11:1-11, 29-40", theme: "jephthah",
        en: { title: "Jephthah's Vow", paragraphs: ["Jephthah was rejected by his family but became a mighty warrior. Gilead asked him to lead them against Ammon.", "He made a foolish vow: 'If I win, I'll sacrifice whatever comes out of my house first.'", "Tragically, his only daughter came out dancing. Jephthah kept his rash vow - a sad reminder to be careful with our words."] },
        te: { title: "యెప్తా మొక్కుబడి", paragraphs: ["యెప్తా తన కుటుంబం ద్వారా తిరస్కరించబడ్డాడు కానీ శక్తివంతమైన యోధుడు అయ్యాడు. అమ్మోనీయులకు వ్యతిరేకంగా వారిని నడిపించమని గిలాదు అతన్ని అడిగింది.", "అతను మూర్ఖమైన మొక్కుబడి చేసాడు: 'నేను గెలిస్తే, నా ఇంటి నుండి మొదట వచ్చేదాన్ని బలి ఇస్తాను.'", "విషాదకరంగా, అతని ఏకైక కుమార్తె నాట్యం చేస్తూ బయటకు వచ్చింది. యెప్తా తన తొందరపాటు మొక్కుబడి నిలబెట్టుకున్నాడు - మన మాటల పట్ల జాగ్రత్తగా ఉండమని విచారకరమైన గుర్తు."] },
        hi: { title: "यिफ्तह की मन्नत", paragraphs: ["यिफ्तह को उसके परिवार ने ठुकरा दिया था लेकिन वह एक शक्तिशाली योद्धा बना। गिलाद ने उसे अम्मोन के विरुद्ध उनकी अगुवाई करने को कहा।", "उसने एक मूर्खतापूर्ण मन्नत मानी: 'अगर मैं जीता, तो जो पहले मेरे घर से निकलेगा उसे मैं बलि चढ़ाऊंगा।'", "दुखद रूप से, उसकी इकलौती बेटी नाचती हुई बाहर आई। यिफ्तह ने अपनी जल्दबाजी की मन्नत पूरी की - अपने शब्दों के साथ सावधान रहने की दुखद याद।"] }
    },
    {
        page: 11, ref: "Judges 13:1-5, 24-25", theme: "samson_birth",
        en: { title: "Samson's Birth", paragraphs: ["Israel sinned again, and the Philistines ruled them for forty years.", "An angel appeared to a barren woman: 'You will have a son. He will be a Nazirite - never cut his hair or drink wine.'", "Samson was born, and even as a child, the Spirit of the Lord began to stir in him."] },
        te: { title: "సమ్సోను జననం", paragraphs: ["ఇశ్రాయేలు మళ్ళీ పాపం చేసింది, ఫిలిష్తీయులు నలభై సంవత్సరాలు వారిని పాలించారు.", "ఒక దేవదూత గొడ్రాలైన స్త్రీకి కనిపించాడు: 'నీకు కొడుకు పుడతాడు. అతను నాజీరీయుడు అవుతాడు - అతని జుట్టు ఎప్పుడూ కత్తిరించకూడదు లేదా ద్రాక్షారసం త్రాగకూడదు.'", "సమ్సోను పుట్టాడు, పిల్లవాడిగా కూడా, యెహోవా ఆత్మ అతనిలో కదలడం ప్రారంభించింది."] },
        hi: { title: "शिमशोन का जन्म", paragraphs: ["इस्राएल ने फिर पाप किया, और पलिश्तियों ने चालीस साल उन पर राज किया।", "एक स्वर्गदूत एक बांझ स्त्री को दिखाई दिया: 'तेरा एक बेटा होगा। वह नाज़ीर होगा - उसके बाल कभी न कटें और वह दाखमधु न पिए।'", "शिमशोन पैदा हुआ, और बचपन से ही, यहोवा का आत्मा उसमें काम करने लगा।"] }
    },
    {
        page: 12, ref: "Judges 14:5-9", theme: "lion",
        en: { title: "Samson and the Lion", paragraphs: ["As Samson walked toward Timnah, a young lion roared at him.", "The Spirit of the Lord came upon him powerfully, and he tore the lion apart with his bare hands!", "Later, he found bees and honey in the lion's carcass - which led to his famous riddle."] },
        te: { title: "సమ్సోను మరియు సింహం", paragraphs: ["సమ్సోను తిమ్నావైపు నడుస్తుండగా, ఒక యువ సింహం అతని మీద గర్జించింది.", "యెహోవా ఆత్మ అతని మీదికి శక్తివంతంగా వచ్చింది, అతను తన వట్టి చేతులతో సింహాన్ని చీల్చివేసాడు!", "తర్వాత, అతను సింహం కళేబరంలో తేనెటీగలు మరియు తేనె కనుగొన్నాడు - ఇది అతని ప్రసిద్ధ పొడుపుకథకు దారితీసింది."] },
        hi: { title: "शिमशोन और शेर", paragraphs: ["जब शिमशोन तिम्ना की ओर जा रहा था, एक जवान शेर उस पर दहाड़ा।", "यहोवा का आत्मा उस पर शक्तिशाली रूप से आया, और उसने शेर को खाली हाथों से फाड़ डाला!", "बाद में, उसे शेर के शव में मधुमक्खियाँ और शहद मिला - जिससे उसकी प्रसिद्ध पहेली बनी।"] }
    },
    {
        page: 13, ref: "Judges 15:14-17", theme: "jawbone",
        en: { title: "The Jawbone", paragraphs: ["The Philistines captured Samson, but the Spirit of the Lord came upon him.", "He snapped the ropes binding him like thread! He found a donkey's jawbone nearby.", "With that jawbone, Samson struck down 1,000 Philistines! God's power through one man was incredible."] },
        te: { title: "దవడ ఎముక", paragraphs: ["ఫిలిష్తీయులు సమ్సోనును బంధించారు, కానీ యెహోవా ఆత్మ అతని మీదికి వచ్చింది.", "అతన్ని కట్టిన తాళ్ళను దారంలా తెంచేసాడు! అతను సమీపంలో గాడిద దవడ ఎముక కనుగొన్నాడు.", "ఆ దవడ ఎముకతో, సమ్సోను 1,000 మంది ఫిలిష్తీయులను హతమార్చాడు! ఒక్క వ్యక్తి ద్వారా దేవుని శక్తి అద్భుతమైనది."] },
        hi: { title: "जबड़े की हड्डी", paragraphs: ["पलिश्तियों ने शिमशोन को पकड़ लिया, लेकिन यहोवा का आत्मा उस पर आया।", "उसने उसे बांधने वाली रस्सियों को धागे की तरह तोड़ डाला! उसने पास में एक गधे की जबड़े की हड्डी पाई।", "उस जबड़े की हड्डी से, शिमशोन ने 1,000 पलिश्तियों को मार गिराया! एक व्यक्ति के माध्यम से परमेश्वर की शक्ति अविश्वसनीय थी।"] }
    },
    {
        page: 14, ref: "Judges 16:4-17", theme: "delilah",
        en: { title: "Samson and Delilah", paragraphs: ["Samson fell in love with a Philistine woman named Delilah. The Philistines paid her to find his secret.", "Three times she asked; three times he lied about his strength. But she kept pressing.", "Finally, he told her the truth: 'My hair has never been cut. I am a Nazirite. If cut, my strength will leave.'"] },
        te: { title: "సమ్సోను మరియు దెలీలా", paragraphs: ["సమ్సోను దెలీలా అనే ఫిలిష్తీయ స్త్రీని ప్రేమించాడు. అతని రహస్యం కనుగొనడానికి ఫిలిష్తీయులు ఆమెకు డబ్బు ఇచ్చారు.", "ఆమె మూడుసార్లు అడిగింది; మూడుసార్లు అతను తన బలం గురించి అబద్ధం చెప్పాడు. కానీ ఆమె ఒత్తిడి చేస్తూనే ఉంది.", "చివరకు, అతను ఆమెకు నిజం చెప్పాడు: 'నా జుట్టు ఎప్పుడూ కత్తిరించబడలేదు. నేను నాజీరీయుడను. కత్తిరిస్తే, నా బలం పోతుంది.'"] },
        hi: { title: "शिमशोन और दलीला", paragraphs: ["शिमशोन दलीला नाम की एक पलिश्ती स्त्री से प्रेम करने लगा। पलिश्तियों ने उसे उसका रहस्य जानने के लिए पैसे दिए।", "उसने तीन बार पूछा; तीन बार उसने अपनी ताकत के बारे में झूठ बोला। लेकिन वह दबाव डालती रही।", "अंत में, उसने उसे सच बताया: 'मेरे बाल कभी नहीं कटे। मैं नाज़ीर हूँ। अगर कटे, तो मेरी ताकत चली जाएगी।'"] }
    },
    {
        page: 15, ref: "Judges 16:18-22", theme: "captured",
        en: { title: "Samson Captured", paragraphs: ["Delilah had his hair cut while he slept. His strength left him, and he didn't even realize it!", "The Philistines captured him, gouged out his eyes, and made him grind grain in prison.", "But his hair began to grow back..."] },
        te: { title: "సమ్సోను పట్టుబడ్డాడు", paragraphs: ["అతను నిద్రపోతుండగా దెలీలా అతని జుట్టు కత్తిరించేలా చేసింది. అతని బలం పోయింది, అతనికి తెలియనేలేదు!", "ఫిలిష్తీయులు అతన్ని పట్టుకొని, కళ్ళు పీకి, జైలులో ధాన్యం విసిరించారు.", "కానీ అతని జుట్టు తిరిగి పెరగడం ప్రారంభించింది..."] },
        hi: { title: "शिमशोन पकड़ा गया", paragraphs: ["दलीला ने उसके सोते समय उसके बाल कटवा दिए। उसकी ताकत चली गई, और उसे पता भी नहीं चला!", "पलिश्तियों ने उसे पकड़ लिया, उसकी आँखें निकाल दीं, और उसे जेल में अनाज पिसवाया।", "लेकिन उसके बाल फिर से बढ़ने लगे..."] }
    },
    {
        page: 16, ref: "Judges 16:23-30", theme: "final_strength",
        en: { title: "Samson's Final Act", paragraphs: ["The Philistines gathered in their temple to celebrate and mock Samson.", "Samson prayed, 'Lord, remember me! Strengthen me one more time!'", "He pushed against the pillars with all his might. The temple collapsed, killing more Philistines than he had killed in his entire life!"] },
        te: { title: "సమ్సోను చివరి కార్యం", paragraphs: ["ఫిలిష్తీయులు సమ్సోనును వేడుకచేసి ఎగతాళి చేయడానికి వారి ఆలయంలో సమావేశమయ్యారు.", "సమ్సోను ప్రార్థించాడు, 'ప్రభూ, నన్ను గుర్తుంచుకో! ఒక్కసారి మరింత బలపరచు!'", "అతను తన పూర్తి శక్తితో స్తంభాలపై నెట్టాడు. ఆలయం కూలిపోయి, అతని జీవితమంతటిలో చంపిన దాని కంటే ఎక్కువ మంది ఫిలిష్తీయులను చంపింది!"] },
        hi: { title: "शिमशोन का अंतिम कार्य", paragraphs: ["पलिश्ती शिमशोन का मज़ाक उड़ाने और जश्न मनाने के लिए अपने मंदिर में इकट्ठा हुए।", "शिमशोन ने प्रार्थना की, 'हे प्रभु, मुझे याद कर! एक बार और मुझे मजबूत कर!'", "उसने पूरी ताकत से खंभों को धकेला। मंदिर ढह गया, अपने पूरे जीवन में जितने पलिश्तियों को मारा था उससे ज्यादा को मार डाला!"] }
    },
    {
        page: 17, ref: "Judges 17:6", theme: "chaos",
        en: { title: "Everyone Did What Was Right", paragraphs: ["The book of Judges shows what happens when people forget God.", "'In those days Israel had no king; everyone did as they saw fit.'", "Without God as their guide, people made terrible choices and suffered the consequences."] },
        te: { title: "ప్రతి ఒక్కరూ తమకు సరైనది చేశారు", paragraphs: ["ప్రజలు దేవుడిని మరచిపోయినప్పుడు ఏమి జరుగుతుందో న్యాయాధిపతుల పుస్తకం చూపిస్తుంది.", "'ఆ రోజుల్లో ఇశ్రాయేలులో రాజు లేడు; ప్రతి ఒక్కరూ తమకు సరైనది చేశారు.'", "దేవుడు వారి మార్గదర్శిగా లేకుండా, ప్రజలు భయంకరమైన నిర్ణయాలు తీసుకొని పరిణామాలు అనుభవించారు."] },
        hi: { title: "हर कोई वही करता था जो उसे सही लगता", paragraphs: ["न्यायियों की पुस्तक दिखाती है कि जब लोग परमेश्वर को भूल जाते हैं तो क्या होता है।", "'उन दिनों इस्राएल में कोई राजा नहीं था; हर कोई वही करता था जो उसे ठीक लगता था।'", "परमेश्वर को अपना मार्गदर्शक बनाए बिना, लोगों ने भयानक फैसले किए और परिणाम भुगते।"] }
    },
    {
        page: 18, ref: "Judges 19-21", theme: "tragedy",
        en: { title: "Dark Days", paragraphs: ["The end of Judges contains some of the darkest stories in the Bible.", "A terrible crime led to a civil war that nearly destroyed the tribe of Benjamin.", "Without godly leadership, Israel fell into moral chaos. They desperately needed a king who would follow God."] },
        te: { title: "చీకటి రోజులు", paragraphs: ["న్యాయాధిపతుల ముగింపులో బైబిల్లోని కొన్ని చీకటి కథలు ఉన్నాయి.", "ఒక భయంకరమైన నేరం బెన్యామీను గోత్రాన్ని దాదాపు నాశనం చేసిన అంతర్యుద్ధానికి దారితీసింది.", "దైవభక్తిగల నాయకత్వం లేకుండా, ఇశ్రాయేలు నైతిక గందరగోళంలో పడింది. వారికి దేవుడిని అనుసరించే రాజు అత్యవసరంగా అవసరం."] },
        hi: { title: "अंधेरे दिन", paragraphs: ["न्यायियों के अंत में बाइबल की कुछ सबसे अंधेरी कहानियाँ हैं।", "एक भयानक अपराध ने एक गृहयुद्ध को जन्म दिया जिसने लगभग बिन्यामीन के गोत्र को नष्ट कर दिया।", "धर्मी नेतृत्व के बिना, इस्राएल नैतिक अराजकता में गिर गया। उन्हें एक राजा की सख्त जरूरत थी जो परमेश्वर का अनुसरण करे।"] }
    },
    {
        page: 19, ref: "Judges 2:7-10", theme: "remember",
        en: { title: "The Danger of Forgetting", paragraphs: ["Each generation must learn to follow God for themselves. Faith cannot be inherited.", "When the elders who saw God's miracles died, the next generation forgot.", "The lesson of Judges: We must teach each generation about God's faithfulness and pass on living faith."] },
        te: { title: "మరచిపోవడం ప్రమాదం", paragraphs: ["ప్రతి తరం తమకు తాముగా దేవుడిని అనుసరించడం నేర్చుకోవాలి. విశ్వాసం వారసత్వంగా రాదు.", "దేవుని అద్భుతాలు చూసిన పెద్దలు చనిపోయినప్పుడు, తదుపరి తరం మరచిపోయింది.", "న్యాయాధిపతుల పాఠం: మనం దేవుని విశ్వాసం గురించి ప్రతి తరానికి బోధించాలి మరియు జీవించే విశ్వాసాన్ని అందించాలి."] },
        hi: { title: "भूलने का खतरा", paragraphs: ["हर पीढ़ी को खुद परमेश्वर का अनुसरण करना सीखना चाहिए। विश्वास विरासत में नहीं मिल सकता।", "जब परमेश्वर के चमत्कार देखने वाले पुरनिये मर गए, अगली पीढ़ी भूल गई।", "न्यायियों का सबक: हमें हर पीढ़ी को परमेश्वर की विश्वासयोग्यता के बारे में सिखाना चाहिए और जीवित विश्वास देना चाहिए।"] }
    },
    {
        page: 20, ref: "Judges 21:25", theme: "hope",
        en: { title: "Looking Forward", paragraphs: ["Judges ends in darkness, but it's not the end of the story!", "God would soon raise up Samuel, and then David - a king after God's own heart.", "Through all the chaos, God was still working His plan to save the world through Jesus, David's descendant."] },
        te: { title: "ముందుకు చూస్తూ", paragraphs: ["న్యాయాధిపతులు చీకటిలో ముగుస్తుంది, కానీ ఇది కథ ముగింపు కాదు!", "దేవుడు త్వరలో సమూయేలును, తర్వాత దావీదును - దేవుని హృదయం ప్రకారం రాజును లేపుతాడు.", "అన్ని గందరగోళం ద్వారా, దావీదు సంతానమైన యేసు ద్వారా ప్రపంచాన్ని రక్షించే తన ప్రణాళికను దేవుడు ఇంకా పని చేస్తున్నాడు."] },
        hi: { title: "आगे देखना", paragraphs: ["न्यायियों अंधेरे में समाप्त होती है, लेकिन यह कहानी का अंत नहीं है!", "परमेश्वर जल्द ही शमूएल को उठाएगा, और फिर दाऊद को - परमेश्वर के मन के अनुसार एक राजा।", "सारी अराजकता में, परमेश्वर अभी भी दाऊद के वंशज यीशु के माध्यम से दुनिया को बचाने की अपनी योजना पर काम कर रहा था।"] }
    }
];

const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        cycle: 'from-gray-600 to-slate-700', othniel: 'from-blue-600 to-indigo-700',
        ehud: 'from-red-600 to-rose-700', deborah: 'from-purple-500 to-pink-600',
        jael: 'from-red-500 to-orange-600', gideon_call: 'from-amber-500 to-yellow-600',
        fleece: 'from-gray-400 to-slate-500', three_hundred: 'from-gold-500 to-amber-600',
        torches: 'from-orange-500 to-red-600', jephthah: 'from-red-700 to-rose-800',
        samson_birth: 'from-blue-500 to-indigo-600', lion: 'from-amber-600 to-orange-700',
        jawbone: 'from-red-600 to-rose-700', delilah: 'from-pink-500 to-rose-600',
        captured: 'from-gray-700 to-slate-800', final_strength: 'from-amber-500 to-gold-600',
        chaos: 'from-red-800 to-gray-900', tragedy: 'from-gray-800 to-slate-900',
        remember: 'from-blue-600 to-cyan-700', hope: 'from-green-500 to-emerald-600'
    };

    const icons: Record<string, React.ReactNode> = {
        cycle: <Users size={64} className="text-gray-200" />,
        othniel: <Sword size={64} className="text-blue-200" />,
        ehud: <Sword size={64} className="text-red-200" />,
        deborah: <Star size={64} className="text-purple-200" />,
        jael: <Shield size={64} className="text-red-200" />,
        gideon_call: <Sun size={64} className="text-amber-200" />,
        fleece: <Star size={64} className="text-gray-200" />,
        three_hundred: <Users size={64} className="text-gold-200" />,
        torches: <Flame size={64} className="text-orange-200" />,
        jephthah: <Sword size={64} className="text-red-200" />,
        samson_birth: <Star size={64} className="text-blue-200" />,
        lion: <Shield size={64} className="text-amber-200" />,
        jawbone: <Sword size={64} className="text-red-200" />,
        delilah: <Users size={64} className="text-pink-200" />,
        captured: <Shield size={64} className="text-gray-200" />,
        final_strength: <Flame size={64} className="text-gold-200" />,
        chaos: <Users size={64} className="text-red-200" />,
        tragedy: <Shield size={64} className="text-gray-200" />,
        remember: <Star size={64} className="text-blue-200" />,
        hope: <Sun size={64} className="text-green-200" />
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <Book size={64} className="text-white" />}
        </div>
    );
};

interface JudgesBookProps {
    onBack: () => void;
}

export default function JudgesBook({ onBack }: JudgesBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const totalPages = judgesStories.length;
    const handleNext = () => { if (currentPage < totalPages) { setCurrentPage(c => c + 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handlePrev = () => { if (currentPage > 0) { setCurrentPage(c => c - 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => { touchEndX.current = e.changedTouches[0].clientX; const d = touchStartX.current - touchEndX.current; if (d > 50) handleNext(); else if (d < -50) handlePrev(); };

    const pageData = currentPage > 0 ? judgesStories[currentPage - 1] : null;
    const content = pageData ? pageData[selectedLang] : null;
    const currentLangInfo = languages.find(l => l.id === selectedLang) || languages[0];
    const getBgColor = () => { switch (theme) { case 'nebula': return 'bg-purple-950'; case 'abstract': return 'bg-amber-950'; case 'dark': return 'bg-zinc-950'; case 'aurora': return 'bg-emerald-950'; default: return 'bg-gray-950'; } };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={onBack} />
            <div className={`relative w-full max-w-4xl h-[85vh] ${getBgColor()} rounded-3xl shadow-2xl overflow-hidden border border-white/20`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm"><Globe className="w-4 h-4" /><span>{currentLangInfo.flag} {currentLangInfo.native}</span></button>
                        {showLangMenu && (<div className="absolute top-full right-0 mt-2 bg-gray-900 rounded-xl border border-white/10 shadow-xl overflow-hidden min-w-[160px]">{languages.map((lang) => (<button key={lang.id} onClick={() => { setSelectedLang(lang.id); setShowLangMenu(false); }} className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/10 ${selectedLang === lang.id ? 'bg-gold-500/20 text-gold-300' : 'text-gray-200'}`}><span>{lang.flag}</span><span>{lang.native}</span></button>))}</div>)}
                    </div>
                    <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X className="w-6 h-6 text-white" /></button>
                </div>

                {currentPage === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-amber-600 to-orange-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full"><Shield size={80} className="text-white" /></div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-amber-100 mb-6">JUDGES</h2>
                        <p className="text-white/80 mb-8 max-w-md">Deborah, Gideon, Samson & Israel's Cycle - Telugu & Hindi Available</p>
                        <button onClick={handleNext} className="px-8 py-4 bg-white text-amber-600 rounded-full font-bold text-xl flex items-center gap-2">START READING <ChevronRight size={24} /></button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col md:flex-row">
                        <div className="w-full md:w-5/12 p-6 flex flex-col">
                            <Illustration theme={pageData!.theme} />
                            <div className="mt-4 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-bold uppercase mb-2">{pageData!.ref}</span>
                                <h2 className="text-2xl md:text-3xl font-black text-white">{content?.title}</h2>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col bg-white/5">
                            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-4">{content?.paragraphs.map((para, idx) => (<div key={idx} className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0" /><p className="text-lg text-gray-200 leading-relaxed">{para}</p></div>))}</div>
                            <div className="p-4 border-t border-white/10 flex justify-between items-center">
                                <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <span className="text-sm font-bold text-gray-400">{currentPage} / {totalPages}</span>
                                {currentPage < totalPages ? (<button onClick={handleNext} className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center"><ChevronRight size={28} /></button>) : (<button onClick={() => setCurrentPage(0)} className="px-5 py-3 rounded-full bg-emerald-500 text-white font-bold flex items-center gap-2">Again! <RefreshCcw size={18} /></button>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
