import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw,
    Heart, Scroll, Mountain, Crown, Star, X, Globe, BookOpen
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

const deuteronomyStories: StoryPage[] = [
    {
        page: 1, ref: "Deuteronomy 1:1-8", theme: "review",
        en: { title: "Moses Reviews the Journey", paragraphs: ["Moses stood before all of Israel. After forty years of wandering, they were finally at the border of the Promised Land.", "He began to remind them of everything that had happened since they left Egypt.", "'The Lord your God has blessed you and watched over you through the wilderness.'"] },
        te: { title: "మోషే ప్రయాణాన్ని సమీక్షించాడు", paragraphs: ["మోషే ఇశ్రాయేలు అంతటి ముందు నిలబడ్డాడు. నలభై సంవత్సరాల సంచారం తర్వాత, వారు చివరకు వాగ్దాన దేశం సరిహద్దులో ఉన్నారు.", "ఐగుప్తు నుండి బయలుదేరిన తర్వాత జరిగిన ప్రతిదానినీ గుర్తు చేయడం ప్రారంభించాడు.", "'మీ దేవుడైన యెహోవా మిమ్మల్ని ఆశీర్వదించి అరణ్యం ద్వారా మిమ్మల్ని కాపాడాడు.'"] },
        hi: { title: "मूसा ने यात्रा की समीक्षा की", paragraphs: ["मूसा सारे इस्राएल के सामने खड़ा हुआ। चालीस साल भटकने के बाद, वे अंततः वादा किए गए देश की सीमा पर थे।", "उसने उन्हें मिस्र छोड़ने के बाद से जो कुछ हुआ था वह याद दिलाना शुरू किया।", "'तुम्हारे परमेश्वर यहोवा ने तुम्हें आशीष दी है और जंगल में तुम्हारी देखभाल की है।'"] }
    },
    {
        page: 2, ref: "Deuteronomy 4:1-9", theme: "obey",
        en: { title: "Obey God's Commands", paragraphs: ["Moses urged the people: 'Follow God's laws carefully so you may live and prosper.'", "'Don't add to what I command you, and don't take away from it.'", "'Teach these things to your children and grandchildren. Never forget what you have seen.'"] },
        te: { title: "దేవుని ఆజ్ఞలకు విధేయత చూపండి", paragraphs: ["మోషే ప్రజలను కోరాడు: 'మీరు జీవించి వర్ధిల్లడానికి దేవుని చట్టాలను జాగ్రత్తగా పాటించండి.'", "'నేను మీకు ఆజ్ఞాపించేదానికి జోడించకండి, దాని నుండి తీసివేయకండి.'", "'ఈ విషయాలను మీ పిల్లలకు మరియు మనవళ్ళకు నేర్పించండి. మీరు చూసినది ఎప్పటికీ మరచిపోకండి.'"] },
        hi: { title: "परमेश्वर की आज्ञाओं का पालन करो", paragraphs: ["मूसा ने लोगों से आग्रह किया: 'परमेश्वर के नियमों का सावधानी से पालन करो ताकि तुम जीवित रहो और समृद्ध हो।'", "'जो मैं तुम्हें आज्ञा देता हूँ उसमें कुछ न जोड़ो और न घटाओ।'", "'इन बातों को अपने बच्चों और पोते-पोतियों को सिखाओ। जो तुमने देखा है वह कभी न भूलो।'"] }
    },
    {
        page: 3, ref: "Deuteronomy 5:1-21", theme: "ten",
        en: { title: "The Ten Commandments Repeated", paragraphs: ["Moses repeated the Ten Commandments that God gave at Mount Sinai.", "These were the foundation of living as God's holy people.", "Love God above all else, and love your neighbor as yourself - these summarize all the laws."] },
        te: { title: "పది ఆజ్ఞలు పునరావృతం", paragraphs: ["సీనాయి పర్వతంలో దేవుడు ఇచ్చిన పది ఆజ్ఞలను మోషే పునరావృతం చేశాడు.", "ఇవి దేవుని పవిత్ర ప్రజలుగా జీవించడానికి పునాది.", "దేవుడిని అన్నిటి కంటే ఎక్కువగా ప్రేమించండి, మిమ్మల్ని మీరు ప్రేమించుకున్నట్లు మీ పొరుగువారిని ప్రేమించండి - ఇవి అన్ని చట్టాలను సంగ్రహిస్తాయి."] },
        hi: { title: "दस आज्ञाएं दोहराई गईं", paragraphs: ["मूसा ने सीनै पर्वत पर परमेश्वर द्वारा दी गई दस आज्ञाओं को दोहराया।", "ये परमेश्वर के पवित्र लोगों के रूप में जीने की नींव थीं।", "परमेश्वर से सबसे ज्यादा प्रेम करो, और अपने पड़ोसी से अपने समान प्रेम करो - ये सभी नियमों का सार हैं।"] }
    },
    {
        page: 4, ref: "Deuteronomy 6:4-9", theme: "shema",
        en: { title: "The Shema - Hear O Israel", paragraphs: ["'Hear, O Israel: The Lord our God, the Lord is one.'", "'Love the Lord your God with all your heart, with all your soul, and with all your strength.'", "'Write these words on your doorposts. Talk about them when you wake up and when you sleep.'"] },
        te: { title: "షెమా - ఓ ఇశ్రాయేలూ విను", paragraphs: ["'ఓ ఇశ్రాయేలూ విను: మన దేవుడైన యెహోవా ఒక్కడే యెహోవా.'", "'నీ దేవుడైన యెహోవాను నీ పూర్ణ హృదయంతో, నీ పూర్ణ ఆత్మతో, నీ పూర్ణ శక్తితో ప్రేమించు.'", "'ఈ మాటలను నీ ద్వారబంధాలపై వ్రాయి. నీవు మేల్కొనేటప్పుడు మరియు నిద్రపోయేటప్పుడు వాటి గురించి మాట్లాడు.'"] },
        hi: { title: "शमा - सुन हे इस्राएल", paragraphs: ["'सुन, हे इस्राएल: हमारा परमेश्वर यहोवा एक ही यहोवा है।'", "'अपने परमेश्वर यहोवा से अपने सारे मन, अपने सारे प्राण और अपनी सारी शक्ति से प्रेम करो।'", "'इन वचनों को अपने द्वार की चौखटों पर लिखो। जब जागो और जब सोओ तब इनकी चर्चा करो।'"] }
    },
    {
        page: 5, ref: "Deuteronomy 7:6-11", theme: "chosen",
        en: { title: "A Chosen People", paragraphs: ["'You are a holy people, chosen by God. Of all nations, He chose you to be His treasured possession.'", "'Not because you were numerous - you were the smallest! But because God loves you and keeps His promises.'", "'Know that the Lord is faithful. He keeps His covenant for a thousand generations.'"] },
        te: { title: "ఎంపిక చేయబడిన ప్రజలు", paragraphs: ["'మీరు దేవుడు ఎంచుకున్న పవిత్ర ప్రజలు. అన్ని దేశాల నుండి, ఆయన తన అమూల్యమైన సొత్తుగా మిమ్మల్ని ఎంచుకున్నాడు.'", "'మీరు చాలా మంది ఉన్నందున కాదు - మీరు చిన్నవారు! కానీ దేవుడు మిమ్మల్ని ప్రేమించి తన వాగ్దానాలు నిలబెట్టుకుంటాడు కాబట్టి.'", "'యెహోవా నమ్మదగినవాడని తెలుసుకోండి. ఆయన వెయ్యి తరాలకు తన నిబంధన నిలబెట్టుకుంటాడు.'"] },
        hi: { title: "चुने हुए लोग", paragraphs: ["'तुम परमेश्वर द्वारा चुने गए पवित्र लोग हो। सभी राष्ट्रों में से, उसने तुम्हें अपनी अनमोल सम्पत्ति होने के लिए चुना।'", "'इसलिए नहीं कि तुम बहुत थे - तुम सबसे छोटे थे! बल्कि इसलिए कि परमेश्वर तुमसे प्रेम करता है और अपने वादे निभाता है।'", "'जानो कि यहोवा विश्वासयोग्य है। वह हजार पीढ़ियों तक अपनी वाचा निभाता है।'"] }
    },
    {
        page: 6, ref: "Deuteronomy 8:1-10", theme: "manna",
        en: { title: "Remember God's Provision", paragraphs: ["'Remember how God led you through the wilderness for forty years, to humble and test you.'", "'He fed you with manna to teach you that man does not live by bread alone, but by every word from God.'", "'When you eat and are satisfied, praise the Lord for the good land He has given you.'"] },
        te: { title: "దేవుని సేవకత్వాన్ని గుర్తుంచుకోండి", paragraphs: ["'మిమ్మల్ని తగ్గించడానికి మరియు పరీక్షించడానికి దేవుడు నలభై సంవత్సరాలు అరణ్యం ద్వారా మిమ్మల్ని ఎలా నడిపించాడో గుర్తుంచుకోండి.'", "'మనిషి రొట్టెతో మాత్రమే కాదు, దేవుని నుండి వచ్చే ప్రతి మాటతో జీవిస్తాడని మీకు నేర్పించడానికి ఆయన మిమ్మల్ని మన్నాతో పోషించాడు.'", "'మీరు తినేటప్పుడు మరియు తృప్తి పొందినప్పుడు, ఆయన మీకు ఇచ్చిన మంచి భూమికి యెహోవాను స్తుతించండి.'"] },
        hi: { title: "परमेश्वर के प्रावधान को याद करो", paragraphs: ["'याद करो कि परमेश्वर ने तुम्हें नम्र और परखने के लिए चालीस साल जंगल में कैसे चलाया।'", "'उसने तुम्हें मन्ना खिलाया यह सिखाने के लिए कि मनुष्य केवल रोटी से नहीं, बल्कि परमेश्वर के हर वचन से जीवित रहता है।'", "'जब तुम खाओ और तृप्त हो, तो उस अच्छी भूमि के लिए यहोवा की स्तुति करो जो उसने तुम्हें दी है।'"] }
    },
    {
        page: 7, ref: "Deuteronomy 10:12-22", theme: "fear",
        en: { title: "What God Requires", paragraphs: ["'What does the Lord ask of you? To fear Him, walk in His ways, love Him, and serve Him with all your heart.'", "'Circumcise your hearts - don't be stubborn anymore.'", "'God is mighty and awesome. He defends the orphan and widow and loves the foreigner.'"] },
        te: { title: "దేవుడు ఏమి కోరుతాడు", paragraphs: ["'యెహోవా నిన్ను ఏమి అడుగుతాడు? ఆయనకు భయపడమని, ఆయన మార్గాల్లో నడవమని, ఆయనను ప్రేమించమని, నీ పూర్ణ హృదయంతో ఆయనను సేవించమని.'", "'మీ హృదయాలకు సున్నతి చేయండి - ఇకపై మొండిగా ఉండకండి.'", "'దేవుడు శక్తివంతుడు మరియు భయంకరుడు. ఆయన అనాథులను మరియు విధవలను రక్షిస్తాడు మరియు పరదేశిని ప్రేమిస్తాడు.'"] },
        hi: { title: "परमेश्वर क्या चाहता है", paragraphs: ["'यहोवा तुमसे क्या माँगता है? उससे डरो, उसके मार्गों पर चलो, उससे प्रेम करो, और अपने पूरे मन से उसकी सेवा करो।'", "'अपने हृदयों का खतना करो - अब जिद्दी मत बनो।'", "'परमेश्वर शक्तिशाली और भयानक है। वह अनाथ और विधवा की रक्षा करता है और परदेशी से प्रेम करता है।'"] }
    },
    {
        page: 8, ref: "Deuteronomy 11:18-21", theme: "teach",
        en: { title: "Teaching the Next Generation", paragraphs: ["'Fix these words in your hearts and minds. Tie them as symbols on your hands and foreheads.'", "'Teach them to your children. Talk about them at home and on the road, morning and night.'", "'Write them on your doorframes and gates.'"] },
        te: { title: "తదుపరి తరానికి బోధించడం", paragraphs: ["'ఈ మాటలను మీ హృదయాలలో మరియు మనస్సులలో స్థిరపరచుకోండి. వాటిని మీ చేతులపై మరియు నుదుటిపై గుర్తులుగా కట్టుకోండి.'", "'వాటిని మీ పిల్లలకు నేర్పించండి. ఇంట్లో మరియు రోడ్డులో, ఉదయం మరియు రాత్రి వాటి గురించి మాట్లాడండి.'", "'వాటిని మీ ద్వారబంధాలపై మరియు గేట్లపై వ్రాయండి.'"] },
        hi: { title: "अगली पीढ़ी को सिखाना", paragraphs: ["'इन वचनों को अपने हृदय और मन में बैठा लो। इन्हें अपने हाथों और माथे पर चिह्न के रूप में बाँधो।'", "'इन्हें अपने बच्चों को सिखाओ। घर में और रास्ते में, सुबह और रात इनकी चर्चा करो।'", "'इन्हें अपनी चौखटों और फाटकों पर लिखो।'"] }
    },
    {
        page: 9, ref: "Deuteronomy 15:1-11", theme: "debt",
        en: { title: "Canceling Debts", paragraphs: ["Every seventh year, debts were to be canceled. No Israelite should remain in poverty.", "'Give generously to the poor. Don't be hardhearted or tightfisted.'", "'There will always be poor among you, so I command you to be openhanded.'"] },
        te: { title: "అప్పులు రద్దు చేయడం", paragraphs: ["ప్రతి ఏడవ సంవత్సరం, అప్పులు రద్దు చేయబడాలి. ఇశ్రాయేలీయుడు ఎవరూ పేదరికంలో ఉండకూడదు.", "'పేదలకు ఉదారంగా ఇవ్వండి. కఠిన హృదయులు లేదా పిసినారులు కాకండి.'", "'మీలో ఎల్లప్పుడూ పేదవారు ఉంటారు, కాబట్టి ఉదారంగా ఉండమని నేను ఆజ్ఞాపిస్తున్నాను.'"] },
        hi: { title: "कर्ज रद्द करना", paragraphs: ["हर सातवें साल, कर्ज रद्द किए जाने थे। कोई इस्राएली गरीबी में न रहे।", "'गरीबों को उदारता से दो। कठोर हृदय या कंजूस मत बनो।'", "'तुम्हारे बीच हमेशा गरीब रहेंगे, इसलिए मैं तुम्हें उदार होने की आज्ञा देता हूँ।'"] }
    },
    {
        page: 10, ref: "Deuteronomy 17:14-20", theme: "king",
        en: { title: "Rules for Future Kings", paragraphs: ["Moses gave rules for when Israel would have a king. The king must be chosen by God.", "'He must not collect many horses, wives, or silver and gold for himself.'", "'He must write a copy of God's law and read it every day, so he doesn't think himself better than others.'"] },
        te: { title: "భవిష్యత్ రాజులకు నియమాలు", paragraphs: ["ఇశ్రాయేలుకు రాజు ఉన్నప్పుడు మోషే నియమాలు ఇచ్చాడు. రాజు దేవునిచే ఎంపిక చేయబడాలి.", "'అతను తనకు చాలా గుర్రాలు, భార్యలు లేదా వెండి బంగారం సేకరించకూడదు.'", "'అతను దేవుని చట్టం ప్రతిని వ్రాసి ప్రతిరోజూ చదవాలి, తద్వారా అతను తనను తాను ఇతరులకంటే మెరుగ్గా భావించడు.'"] },
        hi: { title: "भविष्य के राजाओं के लिए नियम", paragraphs: ["मूसा ने नियम दिए जब इस्राएल के पास राजा होगा। राजा परमेश्वर द्वारा चुना जाना चाहिए।", "'वह अपने लिए बहुत घोड़े, पत्नियाँ, या चाँदी-सोना इकट्ठा न करे।'", "'वह परमेश्वर की व्यवस्था की एक प्रति लिखे और हर दिन पढ़े, ताकि वह खुद को दूसरों से बेहतर न समझे।'"] }
    },
    {
        page: 11, ref: "Deuteronomy 18:15-19", theme: "prophet",
        en: { title: "A Prophet Like Moses", paragraphs: ["'The Lord will raise up a prophet like me from among your own people. You must listen to him.'", "This was a promise pointing to Jesus - the greatest prophet!", "'Anyone who does not listen to My words, spoken by that prophet, will answer to Me.'"] },
        te: { title: "మోషే వంటి ప్రవక్త", paragraphs: ["'యెహోవా మీ స్వంత ప్రజల నుండి నాలాంటి ప్రవక్తను లేపుతాడు. మీరు అతని మాట వినాలి.'", "ఇది యేసును సూచించే వాగ్దానం - గొప్ప ప్రవక్త!", "'ఆ ప్రవక్త ద్వారా చెప్పబడిన నా మాటలు వినని ఎవరైనా నాకు జవాబుదారీ అవుతారు.'"] },
        hi: { title: "मूसा जैसा भविष्यवक्ता", paragraphs: ["'यहोवा तुम्हारे अपने लोगों में से मेरे जैसा एक भविष्यवक्ता उठाएगा। तुम्हें उसकी सुननी चाहिए।'", "यह यीशु की ओर इशारा करने वाला वादा था - सबसे महान भविष्यवक्ता!", "'जो कोई उस भविष्यवक्ता द्वारा बोले गए मेरे वचनों को नहीं सुनेगा, वह मुझे जवाब देगा।'"] }
    },
    {
        page: 12, ref: "Deuteronomy 28:1-14", theme: "blessings",
        en: { title: "Blessings for Obedience", paragraphs: ["'If you fully obey the Lord, He will set you high above all nations.'", "'You will be blessed in the city and in the country. Your children and crops will be blessed.'", "'The Lord will make you the head, not the tail. You will always be on top, never on the bottom.'"] },
        te: { title: "విధేయతకు ఆశీర్వాదాలు", paragraphs: ["'మీరు యెహోవాకు పూర్తిగా విధేయత చూపిస్తే, ఆయన మిమ్మల్ని అన్ని దేశాలకంటే ఉన్నతంగా ఉంచుతాడు.'", "'మీరు నగరంలో మరియు గ్రామంలో ఆశీర్వదించబడతారు. మీ పిల్లలు మరియు పంటలు ఆశీర్వదించబడతారు.'", "'యెహోవా మిమ్మల్ని తలగా చేస్తాడు, తోకగా కాదు. మీరు ఎల్లప్పుడూ పైన ఉంటారు, క్రింద ఎప్పటికీ ఉండరు.'"] },
        hi: { title: "आज्ञाकारिता के लिए आशीर्वाद", paragraphs: ["'यदि तुम यहोवा की पूरी तरह आज्ञा मानोगे, वह तुम्हें सभी राष्ट्रों से ऊपर रखेगा।'", "'तुम शहर में और देश में धन्य होगे। तुम्हारे बच्चे और फसलें धन्य होंगी।'", "'यहोवा तुम्हें सिर बनाएगा, पूँछ नहीं। तुम हमेशा ऊपर रहोगे, कभी नीचे नहीं।'"] }
    },
    {
        page: 13, ref: "Deuteronomy 28:15-68", theme: "curses",
        en: { title: "Warnings of Disobedience", paragraphs: ["Moses also warned what would happen if they disobeyed God.", "'Curses will come upon you - in the city, in the country, in your work, and in your health.'", "'These things will happen if you forget the Lord your God.' The choice was theirs."] },
        te: { title: "అవిధేయత హెచ్చరికలు", paragraphs: ["వారు దేవునికి అవిధేయత చూపిస్తే ఏమి జరుగుతుందో మోషే కూడా హెచ్చరించాడు.", "'శాపాలు మీపైకి వస్తాయి - నగరంలో, గ్రామంలో, మీ పనిలో మరియు మీ ఆరోగ్యంలో.'", "'మీరు మీ దేవుడైన యెహోవాను మరచిపోతే ఈ విషయాలు జరుగుతాయి.' ఎంపిక వారిదే."] },
        hi: { title: "अवज्ञा की चेतावनियाँ", paragraphs: ["मूसा ने यह भी चेतावनी दी कि अगर वे परमेश्वर की अवज्ञा करेंगे तो क्या होगा।", "'शाप तुम पर आएंगे - शहर में, देश में, तुम्हारे काम में, और तुम्हारे स्वास्थ्य में।'", "'ये बातें होंगी यदि तुम अपने परमेश्वर यहोवा को भूल जाओगे।' चुनाव उनका था।"] }
    },
    {
        page: 14, ref: "Deuteronomy 29:1-15", theme: "covenant",
        en: { title: "Renewing the Covenant", paragraphs: ["Moses gathered all Israel to renew the covenant with God.", "'You have seen everything God did in Egypt and in the wilderness.'", "'Today you stand before the Lord to enter His covenant - from leaders to children, even future generations.'"] },
        te: { title: "నిబంధన పునరుద్ధరణ", paragraphs: ["దేవునితో నిబంధనను పునరుద్ధరించడానికి మోషే ఇశ్రాయేలు అందరినీ సమావేశపరిచాడు.", "'ఐగుప్తులో మరియు అరణ్యంలో దేవుడు చేసినదంతా మీరు చూశారు.'", "'నాయకుల నుండి పిల్లల వరకు, భవిష్యత్ తరాల వరకు, ఆయన నిబంధనలో ప్రవేశించడానికి ఈ రోజు మీరు యెహోవా ముందు నిలబడ్డారు.'"] },
        hi: { title: "वाचा का नवीनीकरण", paragraphs: ["मूसा ने परमेश्वर के साथ वाचा का नवीनीकरण करने के लिए सारे इस्राएल को इकट्ठा किया।", "'तुमने वह सब देखा है जो परमेश्वर ने मिस्र में और जंगल में किया।'", "'आज तुम उसकी वाचा में प्रवेश करने के लिए यहोवा के सामने खड़े हो - प्रधानों से लेकर बच्चों तक, यहाँ तक कि भविष्य की पीढ़ियाँ भी।'"] }
    },
    {
        page: 15, ref: "Deuteronomy 30:11-20", theme: "choice",
        en: { title: "Choose Life", paragraphs: ["'This command is not too hard for you. It's not far away in heaven or across the sea.'", "'It's in your mouth and in your heart, so you may obey it.'", "'I set before you today life and death, blessing and curse. Choose life, so you and your children may live!'"] },
        te: { title: "జీవాన్ని ఎంచుకోండి", paragraphs: ["'ఈ ఆజ్ఞ మీకు చాలా కష్టమైనది కాదు. ఇది పరలోకంలో దూరంగా లేదా సముద్రం అవతల లేదు.'", "'ఇది మీ నోటిలో మరియు మీ హృదయంలో ఉంది, మీరు దానికి విధేయత చూపవచ్చు.'", "'ఈ రోజు మీ ముందు జీవితం మరియు మరణం, ఆశీర్వాదం మరియు శాపం ఉంచుతున్నాను. జీవాన్ని ఎంచుకోండి, మీరు మరియు మీ పిల్లలు బతకడానికి!'"] },
        hi: { title: "जीवन चुनो", paragraphs: ["'यह आज्ञा तुम्हारे लिए बहुत कठिन नहीं है। यह स्वर्ग में दूर या समुद्र के पार नहीं है।'", "'यह तुम्हारे मुँह में और तुम्हारे हृदय में है, ताकि तुम इसका पालन कर सको।'", "'मैं आज तुम्हारे सामने जीवन और मृत्यु, आशीर्वाद और शाप रखता हूँ। जीवन चुनो, ताकि तुम और तुम्हारे बच्चे जीवित रहें!'"] }
    },
    {
        page: 16, ref: "Deuteronomy 31:1-8", theme: "transition",
        en: { title: "Joshua Takes Over", paragraphs: ["Moses said, 'I am now 120 years old. I can no longer lead you. The Lord has said I cannot cross the Jordan.'", "'Joshua will lead you. Be strong and courageous! Don't be afraid.'", "'The Lord Himself goes before you. He will never leave you or forsake you.'"] },
        te: { title: "యెహోషువ బాధ్యత తీసుకున్నాడు", paragraphs: ["మోషే చెప్పాడు, 'నాకు ఇప్పుడు 120 సంవత్సరాలు. నేను ఇకపై మిమ్మల్ని నడిపించలేను. నేను యొర్దాను దాటలేనని యెహోవా చెప్పాడు.'", "'యెహోషువ మిమ్మల్ని నడిపిస్తాడు. బలంగా మరియు ధైర్యంగా ఉండండి! భయపడకండి.'", "'యెహోవా స్వయంగా మీ ముందు వెళ్తాడు. ఆయన మిమ్మల్ని ఎప్పటికీ విడిచిపెట్టడు లేదా వదిలివేయడు.'"] },
        hi: { title: "यहोशू ने संभाला", paragraphs: ["मूसा ने कहा, 'मैं अब 120 साल का हूँ। मैं अब तुम्हारी अगुवाई नहीं कर सकता। यहोवा ने कहा है मैं यर्दन पार नहीं कर सकता।'", "'यहोशू तुम्हारी अगुवाई करेगा। मजबूत और साहसी बनो! डरो मत।'", "'यहोवा स्वयं तुम्हारे आगे जाता है। वह तुम्हें कभी न छोड़ेगा न त्यागेगा।'"] }
    },
    {
        page: 17, ref: "Deuteronomy 32:1-12", theme: "song",
        en: { title: "The Song of Moses", paragraphs: ["Moses taught the people a song to remember God's faithfulness.", "'Listen, heavens! Hear, earth! Let my teaching fall like rain.'", "'The Lord found them in a desert land. He shielded them and cared for them like the apple of His eye.'"] },
        te: { title: "మోషే పాట", paragraphs: ["దేవుని విశ్వాసాన్ని గుర్తుంచుకోవడానికి మోషే ప్రజలకు ఒక పాట నేర్పించాడు.", "'వినండి, ఆకాశాలు! వినండి, భూమీ! నా బోధన వర్షంలా పడనీ.'", "'యెహోవా వారిని ఎడారి భూమిలో కనుగొన్నాడు. ఆయన వారిని కాపాడాడు మరియు తన కంటి గుడ్డులా వారిని జాగ్రత్తగా చూసుకున్నాడు.'"] },
        hi: { title: "मूसा का गीत", paragraphs: ["मूसा ने लोगों को परमेश्वर की विश्वासयोग्यता याद रखने के लिए एक गीत सिखाया।", "'सुनो, हे आकाश! सुन, हे पृथ्वी! मेरी शिक्षा वर्षा की तरह गिरे।'", "'यहोवा ने उन्हें एक निर्जन भूमि में पाया। उसने उनकी ढाल बनकर रक्षा की और अपनी आँख की पुतली की तरह उनकी देखभाल की।'"] }
    },
    {
        page: 18, ref: "Deuteronomy 33:1-29", theme: "bless_tribes",
        en: { title: "Moses Blesses the Tribes", paragraphs: ["Before his death, Moses blessed each of the twelve tribes of Israel.", "Each blessing was unique, speaking to their future and role in God's plan.", "'There is no one like the God of Israel, who rides across the heavens to help you.'"] },
        te: { title: "మోషే గోత్రాలను ఆశీర్వదించాడు", paragraphs: ["తన మరణానికి ముందు, మోషే ఇశ్రాయేలు పన్నెండు గోత్రాలలో ప్రతిదానిని ఆశీర్వదించాడు.", "ప్రతి ఆశీర్వాదం ప్రత్యేకమైనది, వారి భవిష్యత్తు మరియు దేవుని ప్రణాళికలో పాత్ర గురించి మాట్లాడింది.", "'ఇశ్రాయేలు దేవుని వంటివారు ఎవరూ లేరు, ఆయన మీకు సహాయం చేయడానికి ఆకాశాలలో వేగంగా వెళ్తాడు.'"] },
        hi: { title: "मूसा ने गोत्रों को आशीर्वाद दिया", paragraphs: ["अपनी मृत्यु से पहले, मूसा ने इस्राएल के बारह गोत्रों में से हर एक को आशीर्वाद दिया।", "हर आशीर्वाद अद्वितीय था, उनके भविष्य और परमेश्वर की योजना में भूमिका के बारे में बात करता था।", "'इस्राएल के परमेश्वर जैसा कोई नहीं, जो तुम्हारी सहायता के लिए आकाशों में सवार होता है।'"] }
    },
    {
        page: 19, ref: "Deuteronomy 34:1-8", theme: "death",
        en: { title: "Moses Views the Land", paragraphs: ["God took Moses to the top of Mount Nebo. 'Look at the land I promised to Abraham, Isaac, and Jacob.'", "Moses could see from Gilead to the Western Sea, and all the way to Zoar.", "Then Moses, the servant of the Lord, died there. He was 120 years old, and his eyes were still bright."] },
        te: { title: "మోషే భూమిని చూసాడు", paragraphs: ["దేవుడు మోషేను నెబో పర్వతం శిఖరానికి తీసుకెళ్ళాడు. 'నేను అబ్రహాము, ఇస్సాకు, యాకోబులకు వాగ్దానం చేసిన భూమిని చూడు.'", "మోషే గిలాదు నుండి పశ్చిమ సముద్రం వరకు, జోయరు వరకు చూడగలిగాడు.", "అప్పుడు యెహోవా సేవకుడు మోషే అక్కడ చనిపోయాడు. అతనికి 120 సంవత్సరాలు, అతని కళ్ళు ఇంకా ప్రకాశవంతంగా ఉన్నాయి."] },
        hi: { title: "मूसा ने देश देखा", paragraphs: ["परमेश्वर मूसा को नबो पर्वत की चोटी पर ले गया। 'वह देश देख जो मैंने अब्राहम, इसहाक और याकूब से वादा किया था।'", "मूसा गिलाद से पश्चिमी समुद्र तक, और सोअर तक देख सकता था।", "फिर यहोवा का दास मूसा वहीं मर गया। वह 120 साल का था, और उसकी आँखें अभी भी चमकदार थीं।"] }
    },
    {
        page: 20, ref: "Deuteronomy 34:9-12", theme: "legacy",
        en: { title: "The Greatest Prophet", paragraphs: ["Joshua was filled with the spirit of wisdom because Moses had laid hands on him. The people followed Joshua.", "There has never been a prophet like Moses, whom the Lord knew face to face.", "No one else did such mighty miracles in Egypt, or performed such awesome deeds before all Israel."] },
        te: { title: "గొప్ప ప్రవక్త", paragraphs: ["మోషే తన చేతులు ఉంచినందున యెహోషువ జ్ఞాన ఆత్మతో నింపబడ్డాడు. ప్రజలు యెహోషువను అనుసరించారు.", "యెహోవా ముఖాముఖిగా తెలిసిన మోషే వంటి ప్రవక్త ఎప్పుడూ లేడు.", "ఐగుప్తులో అలాంటి శక్తివంతమైన అద్భుతాలు లేదా ఇశ్రాయేలు అందరి ముందు అలాంటి అద్భుతమైన కార్యాలు ఎవరూ చేయలేదు."] },
        hi: { title: "सबसे महान भविष्यवक्ता", paragraphs: ["यहोशू बुद्धि की आत्मा से भर गया क्योंकि मूसा ने उस पर हाथ रखे थे। लोगों ने यहोशू का अनुसरण किया।", "मूसा जैसा भविष्यवक्ता कभी नहीं हुआ, जिसे यहोवा आमने-सामने जानता था।", "किसी और ने मिस्र में ऐसे शक्तिशाली चमत्कार या सारे इस्राएल के सामने ऐसे अद्भुत काम नहीं किए।"] }
    }
];

const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        review: 'from-amber-600 to-orange-700', obey: 'from-blue-600 to-indigo-700',
        ten: 'from-amber-500 to-yellow-600', shema: 'from-red-600 to-rose-700',
        chosen: 'from-gold-500 to-amber-600', manna: 'from-amber-400 to-yellow-500',
        fear: 'from-purple-600 to-indigo-700', teach: 'from-green-600 to-emerald-700',
        debt: 'from-teal-500 to-cyan-600', king: 'from-purple-700 to-indigo-800',
        prophet: 'from-blue-500 to-indigo-600', blessings: 'from-green-500 to-emerald-600',
        curses: 'from-red-700 to-rose-800', covenant: 'from-amber-600 to-orange-700',
        choice: 'from-green-600 to-teal-700', transition: 'from-blue-600 to-cyan-700',
        song: 'from-purple-500 to-pink-600', bless_tribes: 'from-gold-400 to-amber-500',
        death: 'from-gray-600 to-slate-700', legacy: 'from-amber-500 to-gold-600'
    };

    const icons: Record<string, React.ReactNode> = {
        review: <BookOpen size={64} className="text-amber-200" />,
        obey: <Scroll size={64} className="text-blue-200" />,
        ten: <Scroll size={64} className="text-amber-200" />,
        shema: <Heart size={64} className="text-red-200" />,
        chosen: <Star size={64} className="text-gold-200" />,
        manna: <Star size={64} className="text-amber-200" />,
        fear: <Heart size={64} className="text-purple-200" />,
        teach: <BookOpen size={64} className="text-green-200" />,
        debt: <Heart size={64} className="text-teal-200" />,
        king: <Crown size={64} className="text-purple-200" />,
        prophet: <Star size={64} className="text-blue-200" />,
        blessings: <Star size={64} className="text-green-200" />,
        curses: <Mountain size={64} className="text-red-200" />,
        covenant: <Scroll size={64} className="text-amber-200" />,
        choice: <Heart size={64} className="text-green-200" />,
        transition: <Star size={64} className="text-blue-200" />,
        song: <Star size={64} className="text-purple-200" />,
        bless_tribes: <Star size={64} className="text-gold-200" />,
        death: <Mountain size={64} className="text-gray-200" />,
        legacy: <Crown size={64} className="text-amber-200" />
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <Book size={64} className="text-white" />}
        </div>
    );
};

interface DeuteronomyBookProps {
    onBack: () => void;
}

export default function DeuteronomyBook({ onBack }: DeuteronomyBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const totalPages = deuteronomyStories.length;

    const handleNext = () => { if (currentPage < totalPages) { setCurrentPage(c => c + 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handlePrev = () => { if (currentPage > 0) { setCurrentPage(c => c - 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => { touchEndX.current = e.changedTouches[0].clientX; const d = touchStartX.current - touchEndX.current; if (d > 50) handleNext(); else if (d < -50) handlePrev(); };

    const pageData = currentPage > 0 ? deuteronomyStories[currentPage - 1] : null;
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
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-purple-600 to-indigo-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full"><Scroll size={80} className="text-white" /></div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-purple-100 mb-6">DEUTERONOMY</h2>
                        <p className="text-white/80 mb-8 max-w-md">Moses' Farewell Speeches & Covenant Renewal - Telugu & Hindi Available</p>
                        <button onClick={handleNext} className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-xl flex items-center gap-2">START READING <ChevronRight size={24} /></button>
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
