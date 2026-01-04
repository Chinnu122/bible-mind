import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw,
    Flame, Cross, Scale, Calendar, Heart, X, Globe
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

const leviticusStories: StoryPage[] = [
    {
        page: 1, ref: "Leviticus 1:1-9", theme: "burnt",
        en: { title: "The Burnt Offering", paragraphs: ["God called Moses from the Tent of Meeting and gave him instructions for the people.", "When someone wanted to show complete devotion to God, they would bring a perfect animal as a burnt offering.", "The whole animal was burned on the altar, sending a sweet aroma to heaven. It showed that the person belonged completely to God."] },
        te: { title: "దహనబలి", paragraphs: ["దేవుడు సన్నిధి గుడారం నుండి మోషేను పిలిచి ప్రజలకు సూచనలు ఇచ్చాడు.", "ఎవరైనా దేవునికి పూర్తి భక్తి చూపించాలనుకున్నప్పుడు, వారు దహనబలిగా పరిపూర్ణ జంతువును తీసుకువచ్చేవారు.", "మొత్తం జంతువు బలిపీఠంపై కాల్చబడింది, పరలోకానికి సువాసన పంపింది. అది వ్యక్తి పూర్తిగా దేవునికి చెందినవాడని చూపించింది."] },
        hi: { title: "होमबलि", paragraphs: ["परमेश्वर ने मिलापवाले तम्बू से मूसा को बुलाया और लोगों को निर्देश दिए।", "जब कोई परमेश्वर के प्रति पूर्ण समर्पण दिखाना चाहता था, वे होमबलि के रूप में एक पूर्ण पशु लाते थे।", "पूरा पशु वेदी पर जलाया जाता था, स्वर्ग को सुगंध भेजता था। यह दिखाता था कि वह व्यक्ति पूरी तरह परमेश्वर का है।"] }
    },
    {
        page: 2, ref: "Leviticus 2:1-16", theme: "grain",
        en: { title: "The Grain Offering", paragraphs: ["God also taught about grain offerings - gifts of fine flour, oil, and frankincense.", "Part of it was burned on the altar, and the rest was given to the priests to eat.", "This offering showed thankfulness for God's daily provision and blessings."] },
        te: { title: "ధాన్యార్పణ", paragraphs: ["దేవుడు ధాన్యార్పణల గురించి కూడా బోధించాడు - మెత్తని పిండి, నూనె మరియు సాంబ్రాణి బహుమతులు.", "దానిలో కొంత భాగం బలిపీఠంపై కాల్చబడింది, మిగిలినది యాజకులకు తినడానికి ఇవ్వబడింది.", "ఈ అర్పణ దేవుని రోజువారీ సేవకత్వం మరియు ఆశీర్వాదాలకు కృతజ్ఞతను చూపించింది."] },
        hi: { title: "अन्नबलि", paragraphs: ["परमेश्वर ने अन्नबलि के बारे में भी सिखाया - बारीक आटा, तेल और लोबान के उपहार।", "इसका एक भाग वेदी पर जलाया जाता था, और बाकी याजकों को खाने के लिए दिया जाता था।", "यह बलि परमेश्वर के दैनिक प्रावधान और आशीर्वादों के लिए धन्यवाद दिखाती थी।"] }
    },
    {
        page: 3, ref: "Leviticus 3:1-17", theme: "peace",
        en: { title: "The Peace Offering", paragraphs: ["The peace offering was a celebration! It showed friendship between God and His people.", "The worshiper, the priests, and God all shared in this offering together.", "It was like having a special meal with your best friend - celebrating the good relationship."] },
        te: { title: "శాంతి బలి", paragraphs: ["శాంతి బలి ఒక వేడుక! ఇది దేవుడు మరియు ఆయన ప్రజల మధ్య స్నేహాన్ని చూపించింది.", "ఆరాధకుడు, యాజకులు మరియు దేవుడు అందరూ ఈ అర్పణలో కలిసి పంచుకున్నారు.", "ఇది మీ మంచి స్నేహితుడితో ప్రత్యేక భోజనం చేయడం వంటిది - మంచి సంబంధాన్ని వేడుకగా జరుపుకోవడం."] },
        hi: { title: "मेलबलि", paragraphs: ["मेलबलि एक उत्सव था! यह परमेश्वर और उसके लोगों के बीच मित्रता दिखाती थी।", "उपासक, याजक और परमेश्वर सभी इस बलि में एक साथ भागीदार होते थे।", "यह अपने सबसे अच्छे दोस्त के साथ विशेष भोजन करने जैसा था - अच्छे रिश्ते का जश्न मनाना।"] }
    },
    {
        page: 4, ref: "Leviticus 4:1-12", theme: "sin",
        en: { title: "The Sin Offering", paragraphs: ["What if someone sinned by accident? God provided a way to be forgiven!", "The sin offering showed that sin is serious, but God's love provides a way back to Him.", "The blood of the sacrifice covered the sin, pointing forward to Jesus who would take away all sins."] },
        te: { title: "పాప పరిహారార్థ బలి", paragraphs: ["ఎవరైనా అనుకోకుండా పాపం చేస్తే ఏమి? దేవుడు క్షమించబడే మార్గం అందించాడు!", "పాప పరిహారార్థ బలి పాపం తీవ్రమైనదని చూపించింది, కానీ దేవుని ప్రేమ ఆయన వద్దకు తిరిగి రావడానికి మార్గం అందిస్తుంది.", "బలి రక్తం పాపాన్ని కప్పింది, అన్ని పాపాలను తీసివేసే యేసును సూచించింది."] },
        hi: { title: "पापबलि", paragraphs: ["अगर कोई गलती से पाप करे तो क्या होगा? परमेश्वर ने क्षमा पाने का रास्ता दिया!", "पापबलि ने दिखाया कि पाप गंभीर है, लेकिन परमेश्वर का प्रेम उसके पास वापस आने का रास्ता देता है।", "बलि का रक्त पाप को ढक देता था, यीशु की ओर इशारा करता था जो सभी पापों को दूर करेंगे।"] }
    },
    {
        page: 5, ref: "Leviticus 5:14-19", theme: "guilt",
        en: { title: "The Guilt Offering", paragraphs: ["Sometimes people cheated others or took what wasn't theirs. The guilt offering was for these sins.", "The person had to pay back what they took, plus add one-fifth more!", "Then they brought a ram as a sacrifice. God wanted people to make things right with others too."] },
        te: { title: "అపరాధ బలి", paragraphs: ["కొన్నిసార్లు ప్రజలు ఇతరులను మోసం చేశారు లేదా వారిది కానిది తీసుకున్నారు. అపరాధ బలి ఈ పాపాల కోసం.", "వ్యక్తి తీసుకున్నది తిరిగి చెల్లించాలి, మరియు ఐదవ వంతు ఎక్కువ జోడించాలి!", "అప్పుడు వారు బలిగా పొట్టేలును తెచ్చారు. ప్రజలు ఇతరులతో కూడా విషయాలు సరిచేయాలని దేవుడు కోరుకున్నాడు."] },
        hi: { title: "दोषबलि", paragraphs: ["कभी-कभी लोग दूसरों को धोखा देते थे या जो उनका नहीं था वह लेते थे। दोषबलि इन पापों के लिए थी।", "व्यक्ति को जो लिया था वह वापस करना होता था, साथ में पांचवां हिस्सा और जोड़ना होता था!", "फिर वे बलि के रूप में मेढ़ा लाते थे। परमेश्वर चाहता था कि लोग दूसरों के साथ भी चीजें सही करें।"] }
    },
    {
        page: 6, ref: "Leviticus 8:1-13", theme: "priests",
        en: { title: "Aaron's Ordination", paragraphs: ["God chose Aaron and his sons to be priests - special servants who would help the people worship.", "Moses washed them with water, dressed them in special clothes, and anointed them with oil.", "They were set apart for God's holy work, serving as a bridge between God and the people."] },
        te: { title: "అహరోను ప్రతిష్ఠాపన", paragraphs: ["దేవుడు అహరోను మరియు అతని కుమారులను యాజకులుగా ఎంచుకున్నాడు - ప్రజలు ఆరాధించడంలో సహాయపడే ప్రత్యేక సేవకులు.", "మోషే వారిని నీటితో కడిగి, ప్రత్యేక దుస్తులు వేసి, నూనెతో అభిషేకించాడు.", "వారు దేవుని పవిత్ర పనికి ప్రత్యేకించబడ్డారు, దేవునికి మరియు ప్రజలకు మధ్య వారధిగా పనిచేస్తారు."] },
        hi: { title: "हारून का अभिषेक", paragraphs: ["परमेश्वर ने हारून और उसके बेटों को याजक होने के लिए चुना - विशेष सेवक जो लोगों की उपासना में मदद करेंगे।", "मूसा ने उन्हें पानी से धोया, विशेष कपड़े पहनाए, और तेल से अभिषेक किया।", "वे परमेश्वर के पवित्र काम के लिए अलग किए गए, परमेश्वर और लोगों के बीच पुल का काम करते हुए।"] }
    },
    {
        page: 7, ref: "Leviticus 9:22-24", theme: "fire",
        en: { title: "Fire from Heaven", paragraphs: ["On the eighth day, Aaron blessed the people. Then something amazing happened!", "Fire came down from heaven and burned up the offering on the altar!", "When the people saw this, they shouted with joy and fell on their faces, worshiping God."] },
        te: { title: "ఆకాశం నుండి అగ్ని", paragraphs: ["ఎనిమిదవ రోజున, అహరోను ప్రజలను ఆశీర్వదించాడు. అప్పుడు ఆశ్చర్యకరమైన విషయం జరిగింది!", "ఆకాశం నుండి అగ్ని దిగి వచ్చి బలిపీఠంపై అర్పణను కాల్చివేసింది!", "ప్రజలు ఇది చూసినప్పుడు, వారు ఆనందంతో కేకలు వేసి, దేవుడిని ఆరాధిస్తూ ముఖం మీద పడ్డారు."] },
        hi: { title: "स्वर्ग से आग", paragraphs: ["आठवें दिन, हारून ने लोगों को आशीर्वाद दिया। फिर कुछ अद्भुत हुआ!", "स्वर्ग से आग उतरी और वेदी पर बलि को जला दिया!", "जब लोगों ने यह देखा, वे खुशी से चिल्लाए और परमेश्वर की उपासना करते हुए मुँह के बल गिर पड़े।"] }
    },
    {
        page: 8, ref: "Leviticus 10:1-3", theme: "nadab",
        en: { title: "Nadab and Abihu", paragraphs: ["Aaron's sons Nadab and Abihu made a terrible mistake. They offered 'strange fire' that God had not commanded.", "Fire came from God and they died. It was a solemn warning about taking worship seriously.", "God said, 'Among those who approach me I will be proved holy.' We must always respect God."] },
        te: { title: "నాదాబు మరియు అబీహు", paragraphs: ["అహరోను కుమారులు నాదాబు మరియు అబీహు భయంకరమైన తప్పు చేశారు. దేవుడు ఆజ్ఞాపించని 'అన్య అగ్ని' అర్పించారు.", "దేవుని నుండి అగ్ని వచ్చి వారు చనిపోయారు. ఇది ఆరాధనను తీవ్రంగా తీసుకోవడం గురించి గంభీరమైన హెచ్చరిక.", "దేవుడు చెప్పాడు, 'నా సమీపంలోకి వచ్చేవారిలో నేను పవిత్రునిగా నిరూపించబడతాను.' మనం ఎల్లప్పుడూ దేవుడిని గౌరవించాలి."] },
        hi: { title: "नादाब और अबीहू", paragraphs: ["हारून के बेटे नादाब और अबीहू ने एक भयानक गलती की। उन्होंने 'अजनबी आग' चढ़ाई जो परमेश्वर ने आज्ञा नहीं दी थी।", "परमेश्वर की ओर से आग आई और वे मर गए। यह उपासना को गंभीरता से लेने के बारे में एक गंभीर चेतावनी थी।", "परमेश्वर ने कहा, 'जो मेरे समीप आते हैं उनमें मैं पवित्र ठहरूंगा।' हमें हमेशा परमेश्वर का आदर करना चाहिए।"] }
    },
    {
        page: 9, ref: "Leviticus 11:1-8", theme: "food",
        en: { title: "Clean and Unclean Foods", paragraphs: ["God gave rules about what animals could be eaten. Some were 'clean' and some were 'unclean.'", "Animals that chew cud and have split hooves (like cattle and sheep) were clean.", "These rules taught the people to make careful choices and be set apart for God."] },
        te: { title: "శుభ్రమైన మరియు అశుభ్రమైన ఆహారాలు", paragraphs: ["ఏ జంతువులను తినవచ్చో దేవుడు నియమాలు ఇచ్చాడు. కొన్ని 'శుభ్రమైనవి' మరియు కొన్ని 'అశుభ్రమైనవి.'", "నెమరువేసి చీలిన గిట్టలు ఉన్న జంతువులు (పశువులు మరియు గొర్రెల వంటివి) శుభ్రమైనవి.", "ఈ నియమాలు ప్రజలకు జాగ్రత్తగా ఎంపికలు చేయడం మరియు దేవుని కోసం ప్రత్యేకంగా ఉండటం నేర్పించాయి."] },
        hi: { title: "शुद्ध और अशुद्ध भोजन", paragraphs: ["परमेश्वर ने नियम दिए कि कौन से जानवर खाए जा सकते हैं। कुछ 'शुद्ध' थे और कुछ 'अशुद्ध।'", "जो जानवर जुगाली करते हैं और चिरे खुर वाले हैं (जैसे गाय और भेड़) वे शुद्ध थे।", "ये नियम लोगों को सावधानी से चुनाव करना और परमेश्वर के लिए अलग रहना सिखाते थे।"] }
    },
    {
        page: 10, ref: "Leviticus 16:1-10", theme: "atonement",
        en: { title: "The Day of Atonement", paragraphs: ["Once a year, on the most holy day, the high priest entered the Most Holy Place.", "He brought blood to cover the sins of all the people. Two goats were used.", "One was sacrificed, and the other was sent away into the wilderness, carrying the people's sins far away."] },
        te: { title: "ప్రాయశ్చిత్త దినం", paragraphs: ["సంవత్సరానికి ఒకసారి, అత్యంత పవిత్రమైన రోజున, ప్రధాన యాజకుడు అతి పవిత్ర స్థలంలో ప్రవేశించాడు.", "అతను ప్రజలందరి పాపాలను కప్పడానికి రక్తం తెచ్చాడు. రెండు మేకలు ఉపయోగించబడ్డాయి.", "ఒకటి బలి ఇవ్వబడింది, మరియు మరొకటి ప్రజల పాపాలను దూరంగా మోసుకెళ్తూ అరణ్యంలోకి పంపబడింది."] },
        hi: { title: "प्रायश्चित्त का दिन", paragraphs: ["साल में एक बार, सबसे पवित्र दिन पर, महायाजक परमपवित्र स्थान में प्रवेश करता था।", "वह सभी लोगों के पापों को ढकने के लिए रक्त लाता था। दो बकरे उपयोग किए जाते थे।", "एक की बलि दी जाती थी, और दूसरे को जंगल में भेज दिया जाता था, लोगों के पापों को दूर ले जाता हुआ।"] }
    },
    {
        page: 11, ref: "Leviticus 16:29-34", theme: "atonement",
        en: { title: "The Scapegoat", paragraphs: ["The priest placed his hands on the living goat's head and confessed all the people's sins.", "Then the goat was sent into the wilderness, never to return. The sins were gone!", "This beautiful picture showed how one day Jesus would take our sins away completely."] },
        te: { title: "బలిపశువు", paragraphs: ["యాజకుడు ప్రాణంతో ఉన్న మేక తలపై తన చేతులు ఉంచి ప్రజలందరి పాపాలను ఒప్పుకున్నాడు.", "అప్పుడు మేక అరణ్యంలోకి పంపబడింది, తిరిగి రాదు. పాపాలు పోయాయి!", "ఈ అందమైన చిత్రం ఒక రోజు యేసు మన పాపాలను పూర్తిగా తీసివేస్తాడని చూపించింది."] },
        hi: { title: "बलि का बकरा", paragraphs: ["याजक जीवित बकरे के सिर पर अपने हाथ रखता था और सभी लोगों के पापों को स्वीकार करता था।", "फिर बकरे को जंगल में भेज दिया जाता था, फिर कभी न लौटने के लिए। पाप चले गए!", "इस सुंदर तस्वीर ने दिखाया कि एक दिन यीशु हमारे पापों को पूरी तरह से दूर ले जाएंगे।"] }
    },
    {
        page: 12, ref: "Leviticus 19:1-4", theme: "holy",
        en: { title: "Be Holy", paragraphs: ["God spoke to all the people: 'Be holy, because I, the Lord your God, am holy.'", "This meant living differently from the nations around them. They were God's special people!", "Holiness wasn't just about rituals - it was about how they treated each other every day."] },
        te: { title: "పవిత్రంగా ఉండండి", paragraphs: ["దేవుడు ప్రజలందరితో మాట్లాడాడు: 'పవిత్రంగా ఉండండి, ఎందుకంటే నేను, మీ దేవుడైన యెహోవాను, పవిత్రుడను.'", "దీని అర్థం వారి చుట్టూ ఉన్న దేశాల కంటే భిన్నంగా జీవించడం. వారు దేవుని ప్రత్యేక ప్రజలు!", "పవిత్రత కేవలం ఆచారాల గురించి కాదు - వారు ప్రతిరోజూ ఒకరినొకరు ఎలా చూసుకున్నారు అనే దాని గురించి."] },
        hi: { title: "पवित्र बनो", paragraphs: ["परमेश्वर ने सभी लोगों से कहा: 'पवित्र बनो, क्योंकि मैं तुम्हारा परमेश्वर यहोवा पवित्र हूँ।'", "इसका मतलब था उनके आसपास के राष्ट्रों से अलग तरीके से जीना। वे परमेश्वर के विशेष लोग थे!", "पवित्रता केवल अनुष्ठानों के बारे में नहीं थी - यह इस बारे में थी कि वे हर दिन एक दूसरे के साथ कैसा व्यवहार करते थे।"] }
    },
    {
        page: 13, ref: "Leviticus 19:9-10", theme: "gleaning",
        en: { title: "Care for the Poor", paragraphs: ["God commanded: 'When you harvest, don't collect every last grain. Leave some for the poor.'", "The corners of the fields were left for widows, orphans, and foreigners to gather.", "God cared about the poor and wanted His people to share their blessings."] },
        te: { title: "పేదల కోసం శ్రద్ధ", paragraphs: ["దేవుడు ఆజ్ఞాపించాడు: 'మీరు పంట కోసినప్పుడు, ప్రతి ధాన్యాన్ని సేకరించకండి. కొంత పేదవారికి వదిలేయండి.'", "పొలాల మూలలు విధవలు, అనాథలు మరియు విదేశీయులు సేకరించడానికి వదిలివేయబడ్డాయి.", "దేవుడు పేదవారి గురించి శ్రద్ధ వహించాడు మరియు ఆయన ప్రజలు తమ ఆశీర్వాదాలను పంచుకోవాలని కోరుకున్నాడు."] },
        hi: { title: "गरीबों की देखभाल", paragraphs: ["परमेश्वर ने आज्ञा दी: 'जब तुम फसल काटो, हर दाना इकट्ठा मत करो। कुछ गरीबों के लिए छोड़ दो।'", "खेतों के कोने विधवाओं, अनाथों और विदेशियों के लिए इकट्ठा करने को छोड़े जाते थे।", "परमेश्वर गरीबों की परवाह करता था और चाहता था कि उसके लोग अपने आशीर्वाद बांटें।"] }
    },
    {
        page: 14, ref: "Leviticus 19:17-18", theme: "love",
        en: { title: "Love Your Neighbor", paragraphs: ["God said, 'Do not hate your brother in your heart. Love your neighbor as yourself.'", "This commandment was so important that Jesus later called it one of the greatest!", "True worship of God always includes loving the people around us."] },
        te: { title: "మీ పొరుగువారిని ప్రేమించండి", paragraphs: ["దేవుడు చెప్పాడు, 'మీ హృదయంలో మీ సోదరుడిని ద్వేషించకండి. మిమ్మల్ని మీరు ప్రేమించుకున్నట్లు మీ పొరుగువారిని ప్రేమించండి.'", "ఈ ఆజ్ఞ చాలా ముఖ్యమైనది, యేసు దీన్ని గొప్పవాటిలో ఒకటిగా పిలిచాడు!", "దేవునికి నిజమైన ఆరాధన ఎల్లప్పుడూ మన చుట్టూ ఉన్న ప్రజలను ప్రేమించడం కలిగి ఉంటుంది."] },
        hi: { title: "अपने पड़ोसी से प्रेम करो", paragraphs: ["परमेश्वर ने कहा, 'अपने भाई से अपने मन में बैर मत रखो। अपने पड़ोसी से अपने समान प्रेम करो।'", "यह आज्ञा इतनी महत्वपूर्ण थी कि बाद में यीशु ने इसे सबसे बड़ी आज्ञाओं में से एक कहा!", "परमेश्वर की सच्ची उपासना में हमेशा हमारे आसपास के लोगों से प्रेम करना शामिल है।"] }
    },
    {
        page: 15, ref: "Leviticus 23:1-3", theme: "sabbath",
        en: { title: "The Sabbath Rest", paragraphs: ["Every seventh day was set apart as a day of complete rest - the Sabbath.", "No work was to be done. It was a holy day for gathering together and worshiping God.", "The Sabbath reminded people that God rested on the seventh day of creation."] },
        te: { title: "విశ్రాంతి దినం", paragraphs: ["ప్రతి ఏడవ రోజు పూర్తి విశ్రాంతి రోజుగా ప్రత్యేకించబడింది - విశ్రాంతి దినం.", "ఏ పని చేయకూడదు. ఇది కలిసి సమావేశమై దేవుడిని ఆరాధించే పవిత్ర దినం.", "విశ్రాంతి దినం దేవుడు సృష్టి ఏడవ రోజున విశ్రాంతి తీసుకున్నాడని ప్రజలకు గుర్తు చేసింది."] },
        hi: { title: "सब्त का विश्राम", paragraphs: ["हर सातवां दिन पूर्ण विश्राम के दिन के रूप में अलग किया गया था - सब्त।", "कोई काम नहीं करना था। यह एक साथ इकट्ठा होने और परमेश्वर की उपासना करने का पवित्र दिन था।", "सब्त ने लोगों को याद दिलाया कि परमेश्वर ने सृष्टि के सातवें दिन विश्राम किया था।"] }
    },
    {
        page: 16, ref: "Leviticus 23:4-8", theme: "passover",
        en: { title: "The Passover", paragraphs: ["In the first month, on the fourteenth day, came Passover - remembering when God freed Israel from Egypt.", "For seven days they ate unleavened bread, remembering how quickly they had to leave.", "This feast pointed forward to Jesus, our Passover Lamb, who sets us free from sin."] },
        te: { title: "పస్కా పండుగ", paragraphs: ["మొదటి నెలలో, పద్నాల్గవ రోజున, పస్కా వచ్చింది - దేవుడు ఇశ్రాయేలును ఐగుప్తు నుండి విడిపించినప్పుడు గుర్తు చేసుకోవడం.", "ఏడు రోజులు వారు పులియని రొట్టెలు తిన్నారు, వారు ఎంత త్వరగా బయలుదేరాల్సి వచ్చిందో గుర్తు చేసుకున్నారు.", "ఈ పండుగ మన పస్కా గొర్రెపిల్ల అయిన యేసును సూచించింది, ఆయన మనలను పాపం నుండి విడిపిస్తాడు."] },
        hi: { title: "फसह", paragraphs: ["पहले महीने में, चौदहवें दिन, फसह आता था - याद करते हुए जब परमेश्वर ने इस्राएल को मिस्र से छुड़ाया।", "सात दिन वे अखमीरी रोटी खाते थे, याद करते हुए कि उन्हें कितनी जल्दी निकलना पड़ा था।", "यह पर्व यीशु की ओर इशारा करता था, हमारा फसह का मेमना, जो हमें पाप से मुक्त करता है।"] }
    },
    {
        page: 17, ref: "Leviticus 23:15-22", theme: "weeks",
        en: { title: "The Feast of Weeks", paragraphs: ["Fifty days after Passover came the Feast of Weeks, celebrating the grain harvest.", "The people brought the firstfruits of their harvest to God, thanking Him for His provision.", "This feast is also called Pentecost - the day when God poured out His Holy Spirit!"] },
        te: { title: "వారాల పండుగ", paragraphs: ["పస్కా తర్వాత యాభై రోజులకు వారాల పండుగ వచ్చింది, ధాన్యం పంట వేడుకను జరుపుకుంది.", "ప్రజలు తమ పంట ప్రథమ ఫలాలను దేవునికి తెచ్చారు, ఆయన సేవకత్వానికి కృతజ్ఞతలు చెప్పారు.", "ఈ పండుగను పెంతెకొస్తు అని కూడా పిలుస్తారు - దేవుడు తన పరిశుద్ధాత్మను కుమ్మరించిన రోజు!"] },
        hi: { title: "सप्ताहों का पर्व", paragraphs: ["फसह के पचास दिन बाद सप्ताहों का पर्व आता था, अनाज की फसल का जश्न मनाता हुआ।", "लोग अपनी फसल के पहले फल परमेश्वर के पास लाते थे, उसके प्रावधान के लिए धन्यवाद देते हुए।", "इस पर्व को पिन्तेकुस्त भी कहा जाता है - वह दिन जब परमेश्वर ने अपना पवित्र आत्मा उंडेला!"] }
    },
    {
        page: 18, ref: "Leviticus 23:33-43", theme: "booths",
        en: { title: "The Feast of Booths", paragraphs: ["In the seventh month, the people celebrated the Feast of Booths for seven days.", "They built temporary shelters and lived in them, remembering their time in the wilderness.", "It was a joyful celebration of God's faithfulness through all their wanderings."] },
        te: { title: "పర్ణశాలల పండుగ", paragraphs: ["ఏడవ నెలలో, ప్రజలు ఏడు రోజులు పర్ణశాలల పండుగను జరుపుకున్నారు.", "వారు తాత్కాలిక ఆశ్రయాలు నిర్మించుకొని వాటిలో నివసించారు, అరణ్యంలో తమ సమయాన్ని గుర్తు చేసుకున్నారు.", "వారి సంచారం అంతటా దేవుని విశ్వాసాన్ని ఆనందంగా జరుపుకున్నారు."] },
        hi: { title: "झोंपड़ियों का पर्व", paragraphs: ["सातवें महीने में, लोग सात दिनों के लिए झोंपड़ियों का पर्व मनाते थे।", "वे अस्थायी आश्रय बनाते थे और उनमें रहते थे, जंगल में अपने समय को याद करते हुए।", "यह उनकी सारी भटकन में परमेश्वर की विश्वासयोग्यता का खुशी का जश्न था।"] }
    },
    {
        page: 19, ref: "Leviticus 25:1-7", theme: "sabbath_year",
        en: { title: "The Sabbath Year", paragraphs: ["Every seventh year, the land itself was given rest. No planting or harvesting was allowed.", "The people trusted God to provide enough in the sixth year for three years!", "This taught them to rely on God, not just their own work."] },
        te: { title: "విశ్రాంతి సంవత్సరం", paragraphs: ["ప్రతి ఏడవ సంవత్సరం, భూమికి విశ్రాంతి ఇవ్వబడింది. నాటడం లేదా పంట కోయడం అనుమతించబడలేదు.", "ప్రజలు ఆరవ సంవత్సరంలో మూడు సంవత్సరాలకు సరిపడా దేవుడు అందిస్తాడని నమ్మారు!", "ఇది వారికి తమ స్వంత పని మీద కాకుండా దేవుని మీద ఆధారపడాలని నేర్పించింది."] },
        hi: { title: "विश्राम वर्ष", paragraphs: ["हर सातवें वर्ष, भूमि को विश्राम दिया जाता था। बोना या काटना अनुमति नहीं थी।", "लोग भरोसा करते थे कि परमेश्वर छठे वर्ष में तीन साल के लिए पर्याप्त देगा!", "इसने उन्हें सिखाया कि केवल अपने काम पर नहीं, बल्कि परमेश्वर पर निर्भर रहें।"] }
    },
    {
        page: 20, ref: "Leviticus 25:8-17", theme: "jubilee",
        en: { title: "The Year of Jubilee", paragraphs: ["Every fiftieth year was the Jubilee - a year of freedom and restoration!", "All debts were forgiven, all slaves set free, and all land returned to the original families.", "It was a picture of God's ultimate plan to restore everything and set everyone free through Jesus."] },
        te: { title: "సునాద సంవత్సరం", paragraphs: ["ప్రతి యాభయ్యవ సంవత్సరం సునాదం - స్వాతంత్ర్యం మరియు పునరుద్ధరణ సంవత్సరం!", "అన్ని అప్పులు క్షమించబడ్డాయి, అన్ని బానిసలు విడుదల చేయబడ్డారు, మరియు అన్ని భూమి అసలు కుటుంబాలకు తిరిగి ఇవ్వబడింది.", "ఇది యేసు ద్వారా అన్నింటినీ పునరుద్ధరించి అందరినీ విడిపించే దేవుని అంతిమ ప్రణాళిక యొక్క చిత్రం."] },
        hi: { title: "जुबली का वर्ष", paragraphs: ["हर पचासवां वर्ष जुबली था - स्वतंत्रता और पुनर्स्थापना का वर्ष!", "सभी कर्ज माफ किए जाते थे, सभी दास मुक्त किए जाते थे, और सभी भूमि मूल परिवारों को वापस की जाती थी।", "यह यीशु के द्वारा सब कुछ बहाल करने और सबको मुक्त करने की परमेश्वर की अंतिम योजना की तस्वीर थी।"] }
    }
];

const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        burnt: 'from-orange-600 to-red-700', grain: 'from-amber-500 to-yellow-600',
        peace: 'from-green-500 to-emerald-600', sin: 'from-red-700 to-rose-900',
        guilt: 'from-purple-600 to-indigo-800', priests: 'from-gold-500 to-amber-600',
        fire: 'from-orange-500 to-red-600', nadab: 'from-red-800 to-gray-900',
        food: 'from-green-600 to-teal-700', atonement: 'from-purple-700 to-indigo-900',
        holy: 'from-blue-600 to-indigo-700', gleaning: 'from-amber-400 to-green-500',
        love: 'from-pink-500 to-rose-600', sabbath: 'from-indigo-600 to-purple-700',
        passover: 'from-red-600 to-amber-700', weeks: 'from-yellow-500 to-amber-600',
        booths: 'from-green-600 to-emerald-700', sabbath_year: 'from-teal-500 to-cyan-600',
        jubilee: 'from-gold-400 to-amber-500'
    };

    const icons: Record<string, React.ReactNode> = {
        burnt: <Flame size={64} className="text-orange-200" />,
        grain: <Scale size={64} className="text-yellow-200" />,
        peace: <Heart size={64} className="text-green-200" />,
        sin: <Cross size={64} className="text-red-200" />,
        guilt: <Scale size={64} className="text-purple-200" />,
        priests: <Cross size={64} className="text-amber-200" />,
        fire: <Flame size={64} className="text-yellow-200" />,
        nadab: <Flame size={64} className="text-red-300" />,
        food: <Scale size={64} className="text-green-200" />,
        atonement: <Cross size={64} className="text-purple-200" />,
        holy: <Flame size={64} className="text-blue-200" />,
        gleaning: <Heart size={64} className="text-amber-200" />,
        love: <Heart size={64} className="text-pink-200" />,
        sabbath: <Calendar size={64} className="text-indigo-200" />,
        passover: <Cross size={64} className="text-red-200" />,
        weeks: <Calendar size={64} className="text-yellow-200" />,
        booths: <Calendar size={64} className="text-green-200" />,
        sabbath_year: <Calendar size={64} className="text-teal-200" />,
        jubilee: <Heart size={64} className="text-gold-200" />
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <Book size={64} className="text-white" />}
        </div>
    );
};

interface LeviticusBookProps {
    onClose: () => void;
}

export default function LeviticusBook({ onClose }: LeviticusBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const totalPages = leviticusStories.length;

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

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (swipeDistance > minSwipeDistance) {
            handleNext();
        } else if (swipeDistance < -minSwipeDistance) {
            handlePrev();
        }
    };

    const pageData = currentPage > 0 ? leviticusStories[currentPage - 1] : null;
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
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            <div
                className={`relative w-full max-w-4xl h-[85vh] ${getBgColor()} rounded-3xl shadow-2xl overflow-hidden border border-white/20`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
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

                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {currentPage === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-orange-600 to-red-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full">
                            <Flame size={80} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-orange-100 mb-6">LEVITICUS</h2>
                        <p className="text-white/80 mb-8 max-w-md">Holiness Laws, Offerings & Feasts - Telugu & Hindi Available</p>
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-xl flex items-center gap-2"
                        >
                            START READING <ChevronRight size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col md:flex-row">
                        <div className="w-full md:w-5/12 p-6 flex flex-col">
                            <Illustration theme={pageData!.theme} />
                            <div className="mt-4 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-bold uppercase mb-2">
                                    {pageData!.ref}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-white">{content?.title}</h2>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col bg-white/5">
                            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {content?.paragraphs.map((para, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0" />
                                        <p className="text-lg text-gray-200 leading-relaxed">{para}</p>
                                    </div>
                                ))}
                            </div>

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
