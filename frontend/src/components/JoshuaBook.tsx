import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw,
    Sword, Shield, Mountain, Sun, Star, X, Globe, Map
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

const joshuaStories: StoryPage[] = [
    {
        page: 1, ref: "Joshua 1:1-9", theme: "commission",
        en: { title: "Joshua's Commission", paragraphs: ["After Moses died, God spoke to Joshua: 'Moses my servant is dead. Now you must lead the people.'", "'Be strong and courageous! I will give you every place where you set your foot.'", "'Do not be afraid. Keep my law always on your lips. Then you will be prosperous and successful.'"] },
        te: { title: "యెహోషువ నియామకం", paragraphs: ["మోషే చనిపోయిన తర్వాత, దేవుడు యెహోషువతో మాట్లాడాడు: 'నా సేవకుడు మోషే చనిపోయాడు. ఇప్పుడు నీవు ప్రజలను నడిపించాలి.'", "'బలంగా మరియు ధైర్యంగా ఉండు! నీ పాదం మోపే ప్రతి స్థలాన్ని నేను నీకు ఇస్తాను.'", "'భయపడకు. నా చట్టాన్ని ఎల్లప్పుడూ నీ పెదవులపై ఉంచు. అప్పుడు నీవు వర్ధిల్లుతావు మరియు విజయం సాధిస్తావు.'"] },
        hi: { title: "यहोशू की नियुक्ति", paragraphs: ["मूसा के मरने के बाद, परमेश्वर ने यहोशू से कहा: 'मेरा दास मूसा मर गया है। अब तुझे लोगों की अगुवाई करनी है।'", "'मजबूत और साहसी बन! जहाँ कहीं तेरा पाँव पड़े वह स्थान मैं तुझे दूंगा।'", "'मत डर। मेरी व्यवस्था को हमेशा अपने होठों पर रख। तब तू समृद्ध और सफल होगा।'"] }
    },
    {
        page: 2, ref: "Joshua 2:1-14", theme: "rahab",
        en: { title: "Rahab and the Spies", paragraphs: ["Joshua sent two spies to explore Jericho. They stayed at the house of a woman named Rahab.", "Rahab hid them on her roof and helped them escape. 'I know the Lord has given you this land.'", "She asked them to spare her family when they attacked. They promised to save everyone in her house."] },
        te: { title: "రాహాబు మరియు వేగులు", paragraphs: ["యెరికో అన్వేషించడానికి యెహోషువ ఇద్దరు వేగులను పంపాడు. వారు రాహాబు అనే స్త్రీ ఇంట్లో ఉన్నారు.", "రాహాబు వారిని తన ఇంటిమీద దాచి తప్పించుకోవడానికి సహాయం చేసింది. 'యెహోవా మీకు ఈ దేశాన్ని ఇచ్చాడని నాకు తెలుసు.'", "వారు దాడి చేసినప్పుడు తన కుటుంబాన్ని విడిచిపెట్టమని ఆమె అడిగింది. వారు ఆమె ఇంట్లో ఉన్న అందరినీ రక్షిస్తామని వాగ్దానం చేశారు."] },
        hi: { title: "राहब और जासूस", paragraphs: ["यहोशू ने यरीहो की जासूसी करने के लिए दो जासूस भेजे। वे राहब नाम की एक स्त्री के घर में रहे।", "राहब ने उन्हें अपनी छत पर छिपाया और भागने में मदद की। 'मुझे पता है कि यहोवा ने तुम्हें यह देश दिया है।'", "उसने उनसे हमले के समय अपने परिवार को बचाने को कहा। उन्होंने उसके घर में सबको बचाने का वादा किया।"] }
    },
    {
        page: 3, ref: "Joshua 3:14-17", theme: "jordan",
        en: { title: "Crossing the Jordan", paragraphs: ["The time came to enter the Promised Land. The Jordan River was flooding!", "When the priests carrying the Ark stepped into the water, it stopped flowing.", "All Israel crossed on dry ground - just like when God parted the Red Sea for their parents!"] },
        te: { title: "యొర్దాను దాటడం", paragraphs: ["వాగ్దాన దేశంలో ప్రవేశించే సమయం వచ్చింది. యొర్దాను నది వరదతో ఉంది!", "మందసం మోసే యాజకులు నీటిలో అడుగు పెట్టినప్పుడు, అది ప్రవహించడం ఆగిపోయింది.", "ఇశ్రాయేలు అంతా ఎండిన నేలపై దాటింది - వారి తల్లిదండ్రుల కోసం దేవుడు ఎర్ర సముద్రాన్ని చీల్చినప్పటి లాగే!"] },
        hi: { title: "यर्दन पार करना", paragraphs: ["वादा किए गए देश में प्रवेश करने का समय आ गया। यर्दन नदी में बाढ़ थी!", "जब संदूक उठाने वाले याजकों ने पानी में कदम रखा, पानी बहना बंद हो गया।", "सारा इस्राएल सूखी जमीन पर पार हो गया - जैसे परमेश्वर ने उनके माता-पिता के लिए लाल सागर को चीरा था!"] }
    },
    {
        page: 4, ref: "Joshua 5:13-15", theme: "commander",
        en: { title: "The Commander of the Lord's Army", paragraphs: ["Near Jericho, Joshua saw a man with a drawn sword. 'Are you for us or our enemies?'", "'Neither,' the man replied. 'I am the commander of the army of the Lord.'", "Joshua fell facedown in worship. 'Take off your sandals, for this place is holy.'"] },
        te: { title: "యెహోవా సైన్యాధిపతి", paragraphs: ["యెరికో సమీపంలో, యెహోషువ దూసిన కత్తితో ఒక వ్యక్తిని చూసాడు. 'నీవు మాకా మా శత్రువులకా?'", "'ఏదీ కాదు,' వ్యక్తి జవాబిచ్చాడు. 'నేను యెహోవా సైన్యాధిపతిని.'", "యెహోషువ ముఖం మీద పడి ఆరాధించాడు. 'నీ చెప్పులు తీసెయ్యి, ఈ స్థలం పవిత్రమైనది.'"] },
        hi: { title: "यहोवा की सेना का सेनापति", paragraphs: ["यरीहो के पास, यहोशू ने खींची हुई तलवार वाले एक व्यक्ति को देखा। 'तू हमारी ओर है या हमारे शत्रुओं की?'", "'न यह न वह,' उस व्यक्ति ने उत्तर दिया। 'मैं यहोवा की सेना का सेनापति हूँ।'", "यहोशू ने मुँह के बल गिरकर दण्डवत किया। 'अपने जूते उतार, क्योंकि यह स्थान पवित्र है।'"] }
    },
    {
        page: 5, ref: "Joshua 6:1-5", theme: "jericho_plan",
        en: { title: "God's Strange Battle Plan", paragraphs: ["Jericho was locked up tight. No one went in or out. The walls were massive!", "God said, 'March around the city once each day for six days. Seven priests will blow trumpets.'", "'On the seventh day, march seven times. Then shout! The walls will fall down flat.'"] },
        te: { title: "దేవుని వింత యుద్ధ ప్రణాళిక", paragraphs: ["యెరికో గట్టిగా మూసివేయబడింది. ఎవరూ లోపలికి లేదా బయటకు వెళ్ళలేదు. గోడలు భారీగా ఉన్నాయి!", "దేవుడు చెప్పాడు, 'ఆరు రోజులు రోజుకు ఒకసారి నగరం చుట్టూ నడవండి. ఏడుగురు యాజకులు బాకాలు ఊదుతారు.'", "'ఏడవ రోజున, ఏడుసార్లు నడవండి. అప్పుడు కేకలు వేయండి! గోడలు కూలిపోతాయి.'"] },
        hi: { title: "परमेश्वर की अजीब युद्ध योजना", paragraphs: ["यरीहो कसकर बंद था। कोई अंदर या बाहर नहीं जाता था। दीवारें विशाल थीं!", "परमेश्वर ने कहा, 'छह दिन हर दिन एक बार शहर के चारों ओर चलो। सात याजक तुरहियाँ बजाएंगे।'", "'सातवें दिन, सात बार चलो। फिर जयजयकार करो! दीवारें गिर जाएंगी।'"] }
    },
    {
        page: 6, ref: "Joshua 6:15-21", theme: "jericho_fall",
        en: { title: "The Walls Fall Down", paragraphs: ["On the seventh day, Israel marched around Jericho seven times. The priests blew the trumpets.", "Joshua commanded, 'Shout! The Lord has given you the city!'", "The people shouted, and the walls collapsed! Israel charged in and captured the city. Only Rahab and her family were saved."] },
        te: { title: "గోడలు కూలిపోయాయి", paragraphs: ["ఏడవ రోజున, ఇశ్రాయేలు యెరికో చుట్టూ ఏడుసార్లు నడిచింది. యాజకులు బాకాలు ఊదారు.", "యెహోషువ ఆజ్ఞాపించాడు, 'కేకలు వేయండి! యెహోవా మీకు నగరాన్ని ఇచ్చారు!'", "ప్రజలు కేకలు వేశారు, గోడలు కూలిపోయాయి! ఇశ్రాయేలు లోనికి దూసుకొని నగరాన్ని స్వాధీనం చేసుకుంది. రాహాబు మరియు ఆమె కుటుంబం మాత్రమే రక్షించబడ్డారు."] },
        hi: { title: "दीवारें गिर गईं", paragraphs: ["सातवें दिन, इस्राएल ने यरीहो के चारों ओर सात बार चक्कर लगाया। याजकों ने तुरहियाँ बजाईं।", "यहोशू ने आज्ञा दी, 'जयजयकार करो! यहोवा ने तुम्हें शहर दे दिया है!'", "लोगों ने जयजयकार किया, और दीवारें ढह गईं! इस्राएल ने धावा बोलकर शहर पर कब्जा कर लिया। केवल राहब और उसका परिवार बचाया गया।"] }
    },
    {
        page: 7, ref: "Joshua 7:1-12", theme: "achan",
        en: { title: "Achan's Sin", paragraphs: ["Israel attacked a small town called Ai but was defeated! Joshua was confused.", "God revealed that someone had stolen forbidden items from Jericho.", "A man named Achan had hidden silver, gold, and a robe. His sin brought defeat to all Israel."] },
        te: { title: "ఆకాను పాపం", paragraphs: ["ఇశ్రాయేలు ఆయీ అనే చిన్న పట్టణంపై దాడి చేసింది కానీ ఓడిపోయింది! యెహోషువ అయోమయంలో పడ్డాడు.", "యెరికో నుండి ఎవరో నిషేధించిన వస్తువులు దొంగిలించారని దేవుడు బయలుపరిచాడు.", "ఆకాను అనే వ్యక్తి వెండి, బంగారం మరియు అంగీని దాచాడు. అతని పాపం ఇశ్రాయేలు అంతటికీ ఓటమి తెచ్చింది."] },
        hi: { title: "आकान का पाप", paragraphs: ["इस्राएल ने ऐ नाम के एक छोटे शहर पर हमला किया लेकिन हार गया! यहोशू भ्रमित था।", "परमेश्वर ने प्रकट किया कि किसी ने यरीहो से निषिद्ध वस्तुएं चुराई थीं।", "आकान नाम के एक व्यक्ति ने चाँदी, सोना और एक वस्त्र छिपाया था। उसके पाप ने सारे इस्राएल को हार दिलाई।"] }
    },
    {
        page: 8, ref: "Joshua 8:1-29", theme: "ai",
        en: { title: "Victory at Ai", paragraphs: ["After dealing with Achan's sin, God said, 'Don't be afraid. Attack Ai again.'", "Joshua set an ambush. Some soldiers attacked from the front while others hid behind the city.", "When Ai's soldiers chased the first group, the hidden soldiers captured the city. Israel won!"] },
        te: { title: "ఆయీ వద్ద విజయం", paragraphs: ["ఆకాను పాపాన్ని పరిష్కరించిన తర్వాత, దేవుడు చెప్పాడు, 'భయపడకు. ఆయీపై మళ్ళీ దాడి చేయి.'", "యెహోషువ పొంచి ఉండడానికి ఏర్పాటు చేసాడు. కొంతమంది సైనికులు ముందు నుండి దాడి చేశారు, మిగతా వారు నగరం వెనుక దాచుకున్నారు.", "ఆయీ సైనికులు మొదటి గుంపును తరిమినప్పుడు, దాక్కున్న సైనికులు నగరాన్ని స్వాధీనం చేసుకున్నారు. ఇశ్రాయేలు గెలిచింది!"] },
        hi: { title: "ऐ पर विजय", paragraphs: ["आकान के पाप का निपटारा करने के बाद, परमेश्वर ने कहा, 'मत डर। ऐ पर फिर से हमला कर।'", "यहोशू ने घात लगाई। कुछ सैनिकों ने सामने से हमला किया जबकि अन्य शहर के पीछे छिपे रहे।", "जब ऐ के सैनिकों ने पहले दल का पीछा किया, छिपे सैनिकों ने शहर पर कब्जा कर लिया। इस्राएल जीत गया!"] }
    },
    {
        page: 9, ref: "Joshua 9:3-15", theme: "gibeonites",
        en: { title: "The Gibeonite Deception", paragraphs: ["The people of Gibeon heard what Joshua did and came up with a trick.", "They dressed in worn-out clothes and carried dry, moldy bread. 'We've traveled from far away to make peace.'", "Joshua made a treaty with them without asking God. Three days later, he discovered they were neighbors!"] },
        te: { title: "గిబియోనీయుల మోసం", paragraphs: ["యెహోషువ ఏమి చేసాడో గిబియోను ప్రజలు విన్నారు మరియు ఒక ఉపాయం వేశారు.", "వారు చిరిగిన దుస్తులు వేసుకొని, ఎండిపోయిన బూజు పట్టిన రొట్టెలు తెచ్చారు. 'మేము సంధి చేసుకోవడానికి చాలా దూరం నుండి ప్రయాణించాము.'", "యెహోషువ దేవుడిని అడగకుండా వారితో ఒప్పందం చేసుకున్నాడు. మూడు రోజుల తర్వాత, వారు పొరుగువారని కనుగొన్నాడు!"] },
        hi: { title: "गिबोनियों का छल", paragraphs: ["गिबोन के लोगों ने सुना कि यहोशू ने क्या किया और एक चाल सोची।", "उन्होंने फटे कपड़े पहने और सूखी, फफूंदी लगी रोटी लाए। 'हम संधि करने के लिए बहुत दूर से आए हैं।'", "यहोशू ने परमेश्वर से पूछे बिना उनके साथ संधि की। तीन दिन बाद, उसे पता चला कि वे पड़ोसी थे!"] }
    },
    {
        page: 10, ref: "Joshua 10:12-14", theme: "sun",
        en: { title: "The Sun Stands Still", paragraphs: ["Five kings attacked Gibeon, and Israel came to help. The battle was fierce.", "Joshua prayed, 'Sun, stand still over Gibeon!' And the sun stopped moving for about a full day!", "There has never been a day like it, when the Lord fought for Israel in such an amazing way."] },
        te: { title: "సూర్యుడు నిలిచిపోయాడు", paragraphs: ["ఐదుగురు రాజులు గిబియోనుపై దాడి చేశారు, ఇశ్రాయేలు సహాయానికి వచ్చింది. యుద్ధం తీవ్రంగా ఉంది.", "యెహోషువ ప్రార్థించాడు, 'సూర్యుడా, గిబియోను మీద నిలిచిపో!' మరియు సూర్యుడు దాదాపు పూర్తి రోజు కదలకుండా ఆగిపోయాడు!", "యెహోవా ఇశ్రాయేలు కోసం అంత అద్భుతంగా పోరాడిన అలాంటి రోజు ఎప్పుడూ లేదు."] },
        hi: { title: "सूर्य ठहर गया", paragraphs: ["पाँच राजाओं ने गिबोन पर हमला किया, और इस्राएल मदद के लिए आया। लड़ाई भयंकर थी।", "यहोशू ने प्रार्थना की, 'हे सूर्य, गिबोन पर ठहर जा!' और सूर्य लगभग पूरे दिन के लिए रुक गया!", "ऐसा दिन पहले कभी नहीं हुआ था, जब यहोवा ने इस्राएल के लिए इतने अद्भुत तरीके से लड़ाई लड़ी।"] }
    },
    {
        page: 11, ref: "Joshua 11:16-23", theme: "conquest",
        en: { title: "Conquering the Land", paragraphs: ["Joshua took the whole land - the hill country, the Negev, and all the land of Goshen.", "He defeated 31 kings in all! The land had rest from war.", "God had kept His promise. The land promised to Abraham, Isaac, and Jacob was now Israel's home."] },
        te: { title: "భూమిని జయించడం", paragraphs: ["యెహోషువ మొత్తం భూమిని తీసుకున్నాడు - కొండ ప్రాంతం, నెగేవ్ మరియు గోషెను భూమి అంతా.", "అతను మొత్తం 31 మంది రాజులను ఓడించాడు! భూమికి యుద్ధం నుండి విశ్రాంతి వచ్చింది.", "దేవుడు తన వాగ్దానం నిలబెట్టుకున్నాడు. అబ్రహాము, ఇస్సాకు మరియు యాకోబులకు వాగ్దానం చేసిన భూమి ఇప్పుడు ఇశ్రాయేలు ఇల్లు."] },
        hi: { title: "देश को जीतना", paragraphs: ["यहोशू ने सारा देश ले लिया - पहाड़ी देश, नेगेव, और गोशेन का सारा देश।", "उसने कुल 31 राजाओं को हराया! देश को युद्ध से विश्राम मिला।", "परमेश्वर ने अपना वादा निभाया। अब्राहम, इसहाक और याकूब से वादा किया गया देश अब इस्राएल का घर था।"] }
    },
    {
        page: 12, ref: "Joshua 13:1-7", theme: "division",
        en: { title: "Dividing the Land", paragraphs: ["Joshua was now old. God said, 'There is still much land to be taken, but divide it now.'", "Each tribe received its own portion of the Promised Land.", "The land was divided by casting lots before the Lord at Shiloh."] },
        te: { title: "భూమిని విభజించడం", paragraphs: ["యెహోషువ ఇప్పుడు వృద్ధుడు. దేవుడు చెప్పాడు, 'ఇంకా చాలా భూమి తీసుకోవాలి, కానీ ఇప్పుడు విభజించు.'", "ప్రతి గోత్రానికి వాగ్దాన దేశంలో దాని స్వంత భాగం లభించింది.", "షిలోహులో యెహోవా ముందు చీట్లు వేసి భూమి విభజించబడింది."] },
        hi: { title: "देश का विभाजन", paragraphs: ["यहोशू अब बूढ़ा था। परमेश्वर ने कहा, 'अभी भी बहुत देश लेना बाकी है, लेकिन अब इसे बाँट दो।'", "हर गोत्र को वादा किए गए देश का अपना हिस्सा मिला।", "शीलो में यहोवा के सामने चिट्ठियाँ डालकर देश बाँटा गया।"] }
    },
    {
        page: 13, ref: "Joshua 14:6-15", theme: "caleb",
        en: { title: "Caleb's Inheritance", paragraphs: ["Caleb came to Joshua. 'I was forty when Moses sent me to spy out the land. Now I'm eighty-five!'", "'I'm still as strong as I was then! Give me this mountain with its giants.'", "Joshua blessed Caleb and gave him Hebron. Caleb drove out the giants because he wholly followed the Lord."] },
        te: { title: "కాలేబు వారసత్వం", paragraphs: ["కాలేబు యెహోషువ వద్దకు వచ్చాడు. 'మోషే నన్ను భూమిని అన్వేషించడానికి పంపినప్పుడు నాకు నలభై. ఇప్పుడు నాకు ఎనభై ఐదు!'", "'అప్పటి వలే నేను ఇప్పుడూ బలంగా ఉన్నాను! రాక్షసులతో ఉన్న ఈ పర్వతాన్ని నాకు ఇవ్వు.'", "యెహోషువ కాలేబును ఆశీర్వదించి అతనికి హెబ్రోనును ఇచ్చాడు. కాలేబు యెహోవాను పూర్తిగా అనుసరించినందున రాక్షసులను తరిమేసాడు."] },
        hi: { title: "कालेब की विरासत", paragraphs: ["कालेब यहोशू के पास आया। 'जब मूसा ने मुझे देश की जासूसी के लिए भेजा तब मैं चालीस का था। अब मैं पचासी का हूँ!'", "'मैं अब भी उतना ही मजबूत हूँ जितना तब था! मुझे यह पहाड़ दो जहाँ दानव हैं।'", "यहोशू ने कालेब को आशीर्वाद दिया और उसे हेब्रोन दिया। कालेब ने दानवों को खदेड़ दिया क्योंकि उसने यहोवा का पूरी तरह अनुसरण किया।"] }
    },
    {
        page: 14, ref: "Joshua 20:1-9", theme: "refuge",
        en: { title: "Cities of Refuge", paragraphs: ["God told Joshua to set up cities of refuge - safe places for people who accidentally killed someone.", "If someone was being chased for revenge, they could run to these cities and be protected.", "This showed God's justice and mercy working together."] },
        te: { title: "ఆశ్రయ నగరాలు", paragraphs: ["ఆశ్రయ నగరాలను ఏర్పాటు చేయమని దేవుడు యెహోషువకు చెప్పాడు - అనుకోకుండా ఎవరినైనా చంపిన వ్యక్తులకు సురక్షిత స్థలాలు.", "ఎవరైనా ప్రతీకారం కోసం తరమబడితే, వారు ఈ నగరాలకు పరుగెత్తి రక్షించబడగలరు.", "ఇది దేవుని న్యాయం మరియు దయ కలిసి పనిచేయడం చూపించింది."] },
        hi: { title: "शरण नगर", paragraphs: ["परमेश्वर ने यहोशू को शरण नगर स्थापित करने को कहा - उन लोगों के लिए सुरक्षित स्थान जिन्होंने गलती से किसी को मार दिया।", "अगर किसी का बदला लेने के लिए पीछा किया जा रहा था, वे इन शहरों में भाग सकते थे और सुरक्षित हो सकते थे।", "इसने परमेश्वर के न्याय और दया को एक साथ काम करते दिखाया।"] }
    },
    {
        page: 15, ref: "Joshua 21:43-45", theme: "fulfilled",
        en: { title: "All Promises Fulfilled", paragraphs: ["So the Lord gave Israel all the land He had promised to their ancestors.", "They took possession of it and settled there. God gave them rest from their enemies.", "'Not one word of all the good promises the Lord made failed. Every one was fulfilled.'"] },
        te: { title: "అన్ని వాగ్దానాలు నెరవేర్చబడ్డాయి", paragraphs: ["కాబట్టి యెహోవా వారి పూర్వీకులకు వాగ్దానం చేసిన భూమి అంతటినీ ఇశ్రాయేలుకు ఇచ్చాడు.", "వారు దానిని స్వాధీనం చేసుకొని అక్కడ స్థిరపడ్డారు. దేవుడు వారి శత్రువుల నుండి వారికి విశ్రాంతి ఇచ్చాడు.", "'యెహోవా చేసిన మంచి వాగ్దానాలన్నిటిలో ఒక్క మాట కూడా విఫలం కాలేదు. ప్రతి ఒక్కటి నెరవేర్చబడింది.'"] },
        hi: { title: "सभी वादे पूरे हुए", paragraphs: ["इस प्रकार यहोवा ने इस्राएल को वह सारा देश दिया जो उसने उनके पूर्वजों से वादा किया था।", "उन्होंने उस पर अधिकार कर लिया और वहाँ बस गए। परमेश्वर ने उन्हें उनके शत्रुओं से विश्राम दिया।", "'यहोवा के सभी अच्छे वादों में से एक भी वचन व्यर्थ नहीं गया। हर एक पूरा हुआ।'"] }
    },
    {
        page: 16, ref: "Joshua 22:1-6", theme: "transjordan",
        en: { title: "The Eastern Tribes Return", paragraphs: ["The tribes of Reuben, Gad, and half of Manasseh had fought alongside the other tribes.", "Now Joshua sent them back to their land on the east side of the Jordan River.", "'Be very careful to keep God's commands and love Him with all your heart.'"] },
        te: { title: "తూర్పు గోత్రాలు తిరిగి వెళ్ళాయి", paragraphs: ["రూబేను, గాదు మరియు సగం మనష్షే గోత్రాలు ఇతర గోత్రాలతో కలిసి పోరాడాయి.", "ఇప్పుడు యెహోషువ వారిని యొర్దాను నది తూర్పు వైపున వారి భూమికి తిరిగి పంపాడు.", "'దేవుని ఆజ్ఞలను పాటించడంలో చాలా జాగ్రత్తగా ఉండండి మరియు మీ పూర్ణ హృదయంతో ఆయనను ప్రేమించండి.'"] },
        hi: { title: "पूर्वी गोत्र लौटे", paragraphs: ["रूबेन, गाद और आधे मनश्शे के गोत्रों ने अन्य गोत्रों के साथ मिलकर लड़ाई लड़ी थी।", "अब यहोशू ने उन्हें यर्दन नदी के पूर्वी किनारे पर उनकी भूमि में वापस भेजा।", "'परमेश्वर की आज्ञाओं का पालन करने में बहुत सावधान रहो और उससे अपने पूरे मन से प्रेम करो।'"] }
    },
    {
        page: 17, ref: "Joshua 23:1-11", theme: "farewell",
        en: { title: "Joshua's Farewell Address", paragraphs: ["When Joshua was very old, he gathered all the leaders of Israel.", "'You have seen everything the Lord has done for you. He has fought for you.'", "'Be very strong. Hold fast to everything written in the Book of the Law of Moses.'"] },
        te: { title: "యెహోషువ వీడ్కోలు ప్రసంగం", paragraphs: ["యెహోషువ చాలా వృద్ధుడైనప్పుడు, అతను ఇశ్రాయేలు నాయకులందరినీ సమావేశపరిచాడు.", "'యెహోవా మీ కోసం చేసినదంతా మీరు చూశారు. ఆయన మీ కోసం పోరాడాడు.'", "'చాలా బలంగా ఉండండి. మోషే ధర్మశాస్త్ర గ్రంథంలో వ్రాసిన ప్రతిదానిని గట్టిగా పట్టుకోండి.'"] },
        hi: { title: "यहोशू का विदाई भाषण", paragraphs: ["जब यहोशू बहुत बूढ़ा था, उसने इस्राएल के सभी प्रधानों को इकट्ठा किया।", "'तुमने वह सब देखा है जो यहोवा ने तुम्हारे लिए किया है। वह तुम्हारे लिए लड़ा है।'", "'बहुत मजबूत बनो। मूसा की व्यवस्था की पुस्तक में लिखी हर बात को थामे रहो।'"] }
    },
    {
        page: 18, ref: "Joshua 24:14-18", theme: "choose",
        en: { title: "Choose This Day", paragraphs: ["Joshua challenged the people: 'Fear the Lord and serve Him with all faithfulness.'", "'But if serving the Lord seems undesirable, choose today whom you will serve.'", "'But as for me and my household, we will serve the Lord!' The people answered, 'We too will serve the Lord!'"] },
        te: { title: "ఈ రోజు ఎంచుకోండి", paragraphs: ["యెహోషువ ప్రజలకు సవాలు విసిరాడు: 'యెహోవాను భయపడి పూర్తి నమ్మకంతో ఆయనను సేవించండి.'", "'కానీ యెహోవాను సేవించడం అనిష్టమైతే, మీరు ఎవరిని సేవిస్తారో ఈ రోజు ఎంచుకోండి.'", "'కానీ నేను మరియు నా ఇంటివారు యెహోవాను సేవిస్తాము!' ప్రజలు జవాబిచ్చారు, 'మేము కూడా యెహోవాను సేవిస్తాము!'"] },
        hi: { title: "आज चुन लो", paragraphs: ["यहोशू ने लोगों को चुनौती दी: 'यहोवा का भय मानो और पूरी विश्वासयोग्यता से उसकी सेवा करो।'", "'लेकिन अगर यहोवा की सेवा करना अनुचित लगे, आज चुन लो कि किसकी सेवा करोगे।'", "'लेकिन मैं और मेरा घराना, हम यहोवा की सेवा करेंगे!' लोगों ने उत्तर दिया, 'हम भी यहोवा की सेवा करेंगे!'"] }
    },
    {
        page: 19, ref: "Joshua 24:29-31", theme: "death_joshua",
        en: { title: "Joshua's Death", paragraphs: ["Joshua son of Nun, the servant of the Lord, died at the age of 110.", "He was buried in the land of his inheritance at Timnath Serah.", "Israel served the Lord throughout Joshua's lifetime and the lifetime of the elders who outlived him."] },
        te: { title: "యెహోషువ మరణం", paragraphs: ["యెహోవా సేవకుడు నూను కుమారుడు యెహోషువ 110 సంవత్సరాల వయసులో చనిపోయాడు.", "అతను తిమ్నత్ సేరాలో తన వారసత్వ భూమిలో సమాధి చేయబడ్డాడు.", "యెహోషువ జీవితకాలంలో మరియు అతని తర్వాత బతికిన పెద్దల జీవితకాలంలో ఇశ్రాయేలు యెహోవాను సేవించింది."] },
        hi: { title: "यहोशू की मृत्यु", paragraphs: ["यहोवा का दास नून का पुत्र यहोशू 110 वर्ष की आयु में मर गया।", "वह तिम्नत-सेरह में अपनी विरासत की भूमि में दफनाया गया।", "इस्राएल ने यहोशू के जीवन भर और उन पुरनियों के जीवन भर यहोवा की सेवा की जो उसके बाद जीवित रहे।"] }
    },
    {
        page: 20, ref: "Joshua 24:32", theme: "bones",
        en: { title: "Joseph's Bones", paragraphs: ["The bones of Joseph, which Israel brought up from Egypt, were buried at Shechem.", "This fulfilled Joseph's request from long ago: 'Carry my bones up from this place.'", "The story of Joshua ends with God's faithfulness proven across generations. Every promise was kept!"] },
        te: { title: "యోసేపు ఎముకలు", paragraphs: ["ఇశ్రాయేలు ఐగుప్తు నుండి తెచ్చిన యోసేపు ఎముకలు షెకెములో సమాధి చేయబడ్డాయి.", "ఇది చాలా కాలం క్రితం యోసేపు కోరిక నెరవేర్చింది: 'ఈ స్థలం నుండి నా ఎముకలను తీసుకెళ్ళండి.'", "తరాల అంతటా దేవుని విశ్వాసం నిరూపించబడి యెహోషువ కథ ముగుస్తుంది. ప్రతి వాగ్దానం నిలబెట్టుకోబడింది!"] },
        hi: { title: "यूसुफ की हड्डियाँ", paragraphs: ["यूसुफ की हड्डियाँ, जिन्हें इस्राएल मिस्र से लाया था, शकेम में दफनाई गईं।", "इसने बहुत पहले यूसुफ की इच्छा पूरी की: 'मेरी हड्डियों को इस स्थान से ले जाना।'", "यहोशू की कहानी पीढ़ियों में परमेश्वर की विश्वासयोग्यता साबित होने के साथ समाप्त होती है। हर वादा निभाया गया!"] }
    }
];

const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        commission: 'from-blue-600 to-indigo-700', rahab: 'from-rose-500 to-pink-600',
        jordan: 'from-blue-500 to-cyan-600', commander: 'from-gold-500 to-amber-600',
        jericho_plan: 'from-amber-500 to-orange-600', jericho_fall: 'from-red-600 to-orange-700',
        achan: 'from-red-700 to-rose-800', ai: 'from-green-600 to-emerald-700',
        gibeonites: 'from-amber-600 to-yellow-700', sun: 'from-yellow-500 to-orange-600',
        conquest: 'from-green-500 to-teal-600', division: 'from-amber-500 to-gold-600',
        caleb: 'from-emerald-500 to-green-600', refuge: 'from-blue-500 to-indigo-600',
        fulfilled: 'from-gold-400 to-amber-500', transjordan: 'from-teal-500 to-cyan-600',
        farewell: 'from-purple-600 to-indigo-700', choose: 'from-red-500 to-rose-600',
        death_joshua: 'from-gray-600 to-slate-700', bones: 'from-amber-600 to-orange-700'
    };

    const icons: Record<string, React.ReactNode> = {
        commission: <Sword size={64} className="text-blue-200" />,
        rahab: <Shield size={64} className="text-rose-200" />,
        jordan: <Mountain size={64} className="text-cyan-200" />,
        commander: <Sword size={64} className="text-gold-200" />,
        jericho_plan: <Map size={64} className="text-amber-200" />,
        jericho_fall: <Mountain size={64} className="text-red-200" />,
        achan: <Shield size={64} className="text-red-200" />,
        ai: <Sword size={64} className="text-green-200" />,
        gibeonites: <Map size={64} className="text-amber-200" />,
        sun: <Sun size={64} className="text-yellow-200" />,
        conquest: <Sword size={64} className="text-green-200" />,
        division: <Map size={64} className="text-gold-200" />,
        caleb: <Mountain size={64} className="text-emerald-200" />,
        refuge: <Shield size={64} className="text-blue-200" />,
        fulfilled: <Star size={64} className="text-gold-200" />,
        transjordan: <Map size={64} className="text-teal-200" />,
        farewell: <Star size={64} className="text-purple-200" />,
        choose: <Star size={64} className="text-red-200" />,
        death_joshua: <Star size={64} className="text-gray-200" />,
        bones: <Star size={64} className="text-amber-200" />
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <Book size={64} className="text-white" />}
        </div>
    );
};

interface JoshuaBookProps {
    onBack: () => void;
}

export default function JoshuaBook({ onBack }: JoshuaBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const totalPages = joshuaStories.length;
    const handleNext = () => { if (currentPage < totalPages) { setCurrentPage(c => c + 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handlePrev = () => { if (currentPage > 0) { setCurrentPage(c => c - 1); if (contentRef.current) contentRef.current.scrollTop = 0; } };
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => { touchEndX.current = e.changedTouches[0].clientX; const d = touchStartX.current - touchEndX.current; if (d > 50) handleNext(); else if (d < -50) handlePrev(); };

    const pageData = currentPage > 0 ? joshuaStories[currentPage - 1] : null;
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
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-green-600 to-emerald-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full"><Sword size={80} className="text-white" /></div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-green-100 mb-6">JOSHUA</h2>
                        <p className="text-white/80 mb-8 max-w-md">Conquest of Canaan, Jericho & The Promised Land - Telugu & Hindi Available</p>
                        <button onClick={handleNext} className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-xl flex items-center gap-2">START READING <ChevronRight size={24} /></button>
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
