import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw,
    Users, Compass, Mountain, Cloud, Star, X, Globe, Map
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

const numbersStories: StoryPage[] = [
    {
        page: 1, ref: "Numbers 1:1-4", theme: "census",
        en: { title: "Counting the People", paragraphs: ["God told Moses to count all the men of Israel who could fight in an army.", "The count was taken by tribes, with a leader from each tribe helping.", "This showed that God had a plan for His people and knew each one by name."] },
        te: { title: "ప్రజలను లెక్కించడం", paragraphs: ["సైన్యంలో పోరాడగల ఇశ్రాయేలు పురుషులందరినీ లెక్కించమని దేవుడు మోషేకు చెప్పాడు.", "ప్రతి గోత్రం నుండి ఒక నాయకుడు సహాయం చేస్తూ గోత్రాల వారీగా లెక్క తీసుకోబడింది.", "దేవునికి తన ప్రజల కోసం ఒక ప్రణాళిక ఉందని మరియు ప్రతి ఒక్కరిని పేరుతో తెలుసునని ఇది చూపించింది."] },
        hi: { title: "लोगों की गिनती", paragraphs: ["परमेश्वर ने मूसा को इस्राएल के उन सभी पुरुषों को गिनने को कहा जो सेना में लड़ सकते थे।", "हर गोत्र से एक प्रधान की मदद से गोत्र के अनुसार गिनती की गई।", "इससे पता चला कि परमेश्वर की अपने लोगों के लिए योजना थी और वह हर एक को नाम से जानता था।"] }
    },
    {
        page: 2, ref: "Numbers 2:1-34", theme: "camp",
        en: { title: "The Camp Arrangement", paragraphs: ["God organized the camp in a special way. Each tribe had its own place around the Tabernacle.", "The Levites camped closest to protect the holy tent. The other tribes surrounded them.", "God's dwelling was in the center - He was always at the heart of His people."] },
        te: { title: "శిబిరం ఏర్పాటు", paragraphs: ["దేవుడు శిబిరాన్ని ప్రత్యేక పద్ధతిలో ఏర్పాటు చేశాడు. ప్రతి గోత్రానికి గుడారం చుట్టూ దాని స్వంత స్థలం ఉంది.", "పవిత్ర గుడారాన్ని రక్షించడానికి లేవీయులు సమీపంలో శిబిరం వేశారు. ఇతర గోత్రాలు వారిని చుట్టుముట్టాయి.", "దేవుని నివాసం మధ్యలో ఉంది - ఆయన ఎల్లప్పుడూ తన ప్రజల హృదయంలో ఉన్నాడు."] },
        hi: { title: "छावनी की व्यवस्था", paragraphs: ["परमेश्वर ने छावनी को एक विशेष तरीके से व्यवस्थित किया। हर गोत्र का तम्बू के चारों ओर अपना स्थान था।", "लेवियों ने पवित्र तम्बू की रक्षा के लिए सबसे पास डेरा डाला। अन्य गोत्र उन्हें घेरे हुए थे।", "परमेश्वर का निवास केंद्र में था - वह हमेशा अपने लोगों के दिल में था।"] }
    },
    {
        page: 3, ref: "Numbers 6:22-27", theme: "blessing",
        en: { title: "The Priestly Blessing", paragraphs: ["God gave Aaron a beautiful blessing to speak over the people.", "'The Lord bless you and keep you. The Lord make His face shine on you and be gracious to you.'", "'The Lord turn His face toward you and give you peace.' This blessing is still used today!"] },
        te: { title: "యాజక ఆశీర్వాదం", paragraphs: ["ప్రజలపై చెప్పడానికి దేవుడు అహరోనుకు అందమైన ఆశీర్వాదం ఇచ్చాడు.", "'యెహోవా నిన్ను ఆశీర్వదించి నిన్ను కాపాడును గాక. యెహోవా తన ముఖకాంతిని నీపై ప్రకాశింపజేసి నీయెడల కృపగలవాడై ఉండును గాక.'", "'యెహోవా తన ముఖమును నీమీదికి ఎత్తి నీకు సమాధానము అనుగ్రహించును గాక.' ఈ ఆశీర్వాదం ఇప్పటికీ వాడబడుతోంది!"] },
        hi: { title: "याजकीय आशीर्वाद", paragraphs: ["परमेश्वर ने हारून को लोगों पर बोलने के लिए एक सुंदर आशीर्वाद दिया।", "'यहोवा तुझे आशीष दे और तेरी रक्षा करे। यहोवा अपना मुख तुझ पर प्रकाशमान करे और तुझ पर अनुग्रह करे।'", "'यहोवा अपना मुख तेरी ओर उठाए और तुझे शांति दे।' यह आशीर्वाद आज भी उपयोग किया जाता है!"] }
    },
    {
        page: 4, ref: "Numbers 9:15-23", theme: "cloud",
        en: { title: "The Cloud and Fire", paragraphs: ["A cloud covered the Tabernacle during the day, and fire appeared at night.", "When the cloud moved, the people packed up and followed. When it stopped, they camped.", "God was leading His people every step of the way through the wilderness."] },
        te: { title: "మేఘం మరియు అగ్ని", paragraphs: ["పగటిపూట మేఘం గుడారాన్ని కప్పింది, రాత్రి అగ్ని కనిపించింది.", "మేఘం కదిలినప్పుడు, ప్రజలు సామాను సర్దుకొని అనుసరించారు. అది ఆగినప్పుడు, వారు శిబిరం వేశారు.", "దేవుడు అరణ్యం ద్వారా ప్రతి అడుగులో తన ప్రజలను నడిపించాడు."] },
        hi: { title: "बादल और आग", paragraphs: ["दिन में एक बादल तम्बू को ढकता था, और रात में आग दिखाई देती थी।", "जब बादल चलता, लोग सामान बांधते और पीछे चलते। जब रुकता, वे डेरा डालते।", "परमेश्वर जंगल में हर कदम पर अपने लोगों की अगुवाई कर रहा था।"] }
    },
    {
        page: 5, ref: "Numbers 11:1-6", theme: "complain",
        en: { title: "The People Complain", paragraphs: ["Instead of being thankful, the people started complaining about everything.", "'We're tired of manna! We want meat! We remember the fish in Egypt!'", "Their grumbling made God angry. They had forgotten all He had done for them."] },
        te: { title: "ప్రజలు ఫిర్యాదు చేశారు", paragraphs: ["కృతజ్ఞత చూపే బదులు, ప్రజలు ప్రతిదాని గురించి ఫిర్యాదు చేయడం ప్రారంభించారు.", "'మాకు మన్నా విసుగు! మాకు మాంసం కావాలి! ఐగుప్తులో చేపలు గుర్తున్నాయి!'", "వారి గొణుగుడు దేవునికి కోపం తెప్పించింది. ఆయన వారికి చేసినదంతా వారు మరచిపోయారు."] },
        hi: { title: "लोगों की शिकायत", paragraphs: ["आभारी होने के बजाय, लोगों ने हर चीज़ के बारे में शिकायत करना शुरू कर दिया।", "'मन्ना से थक गए! हमें मांस चाहिए! मिस्र की मछली याद है!'", "उनकी बड़बड़ाहट से परमेश्वर क्रोधित हुआ। वे भूल गए थे कि उसने उनके लिए क्या किया था।"] }
    },
    {
        page: 6, ref: "Numbers 11:31-34", theme: "quail",
        en: { title: "Quail from Heaven", paragraphs: ["God sent so many quail that they covered the ground three feet deep!", "The people gathered and gathered, but those who were greedy got sick.", "God gave them what they wanted, but their greed brought punishment."] },
        te: { title: "ఆకాశం నుండి పూరేళ్ళు", paragraphs: ["దేవుడు చాలా పూరేళ్ళు పంపాడు, అవి నేలను మూడు అడుగుల లోతు కప్పాయి!", "ప్రజలు సేకరించారు మరియు సేకరించారు, కానీ అత్యాశపరులు అనారోగ్యానికి గురయ్యారు.", "దేవుడు వారు కోరుకున్నది ఇచ్చాడు, కానీ వారి అత్యాశ శిక్షను తెచ్చింది."] },
        hi: { title: "स्वर्ग से बटेर", paragraphs: ["परमेश्वर ने इतने बटेर भेजे कि वे तीन फीट गहरे जमीन को ढक गए!", "लोगों ने इकट्ठा किया और इकट्ठा किया, लेकिन जो लालची थे वे बीमार पड़ गए।", "परमेश्वर ने उन्हें वह दिया जो वे चाहते थे, लेकिन उनके लालच ने सजा लाई।"] }
    },
    {
        page: 7, ref: "Numbers 12:1-15", theme: "miriam",
        en: { title: "Miriam's Jealousy", paragraphs: ["Miriam and Aaron spoke against Moses because of his Cushite wife.", "God was angry. 'Moses is faithful in all my house. How dare you speak against him?'", "Miriam was struck with leprosy but healed after Moses prayed for her."] },
        te: { title: "మిర్యాము అసూయ", paragraphs: ["మిర్యాము మరియు అహరోను మోషే కూషీ భార్య కారణంగా అతనికి వ్యతిరేకంగా మాట్లాడారు.", "దేవుడు కోపగించుకున్నాడు. 'మోషే నా ఇంటిలో నమ్మకస్తుడు. అతనికి వ్యతిరేకంగా మాట్లాడే ధైర్యం ఎలా వచ్చింది?'", "మిర్యామును కుష్ఠువ్యాధి కొట్టింది కానీ మోషే ఆమె కోసం ప్రార్థించిన తర్వాత స్వస్థత పొందింది."] },
        hi: { title: "मरियम की ईर्ष्या", paragraphs: ["मरियम और हारून ने मूसा की कूशी पत्नी के कारण उसके विरुद्ध बातें कीं।", "परमेश्वर क्रोधित हुआ। 'मूसा मेरे पूरे घर में विश्वासयोग्य है। तुम्हारी हिम्मत कैसे हुई उसके विरुद्ध बोलने की?'", "मरियम को कोढ़ हो गया लेकिन मूसा की प्रार्थना के बाद चंगी हो गई।"] }
    },
    {
        page: 8, ref: "Numbers 13:1-3, 17-27", theme: "spies",
        en: { title: "The Twelve Spies", paragraphs: ["Moses sent twelve men to explore the Promised Land - one from each tribe.", "They spent forty days exploring. The land was beautiful with wonderful fruit!", "They even brought back a cluster of grapes so big it took two men to carry!"] },
        te: { title: "పన్నెండు మంది వేగులు", paragraphs: ["వాగ్దాన దేశాన్ని అన్వేషించడానికి మోషే పన్నెండు మందిని పంపాడు - ప్రతి గోత్రం నుండి ఒకరు.", "వారు నలభై రోజులు అన్వేషించారు. భూమి అద్భుతమైన పండ్లతో అందంగా ఉంది!", "వారు రెండు మంది మోయాల్సిన పెద్ద ద్రాక్షగుత్తిని కూడా తెచ్చారు!"] },
        hi: { title: "बारह जासूस", paragraphs: ["मूसा ने वादा किए गए देश की जासूसी करने के लिए बारह आदमियों को भेजा - हर गोत्र से एक।", "उन्होंने चालीस दिन खोज की। देश अद्भुत फलों के साथ सुंदर था!", "वे अंगूर का एक गुच्छा भी लाए जो इतना बड़ा था कि दो आदमियों को उठाना पड़ा!"] }
    },
    {
        page: 9, ref: "Numbers 13:28-33", theme: "giants",
        en: { title: "Giants in the Land", paragraphs: ["But ten of the spies were afraid. 'The people there are giants! We looked like grasshoppers!'", "'The cities have huge walls. We can never defeat them!'", "Their fear was bigger than their faith in God."] },
        te: { title: "దేశంలో రాక్షసులు", paragraphs: ["కానీ పది మంది వేగులు భయపడ్డారు. 'అక్కడ ప్రజలు రాక్షసులు! మేము మిడతల్లా కనిపించాము!'", "'నగరాలకు పెద్ద గోడలు ఉన్నాయి. మనం వారిని ఎప్పటికీ ఓడించలేము!'", "దేవునిపై వారి విశ్వాసం కంటే వారి భయం పెద్దది."] },
        hi: { title: "देश में दानव", paragraphs: ["लेकिन दस जासूस डर गए। 'वहाँ के लोग दानव हैं! हम टिड्डों जैसे दिखे!'", "'शहरों की विशाल दीवारें हैं। हम उन्हें कभी नहीं हरा सकते!'", "उनका डर परमेश्वर पर उनके विश्वास से बड़ा था।"] }
    },
    {
        page: 10, ref: "Numbers 14:1-9", theme: "caleb",
        en: { title: "Caleb and Joshua's Faith", paragraphs: ["But two spies had faith - Caleb and Joshua. 'Don't be afraid! God is with us!'", "'The land is wonderful! With God's help, we can certainly take it!'", "Sadly, the people listened to the ten fearful spies instead."] },
        te: { title: "కాలేబు మరియు యెహోషువ విశ్వాసం", paragraphs: ["కానీ ఇద్దరు వేగులకు విశ్వాసం ఉంది - కాలేబు మరియు యెహోషువ. 'భయపడకండి! దేవుడు మనతో ఉన్నాడు!'", "'భూమి అద్భుతమైనది! దేవుని సహాయంతో, మనం తప్పకుండా తీసుకోగలము!'", "విచారకరంగా, ప్రజలు భయపడిన పది మంది వేగుల మాట వినారు."] },
        hi: { title: "कालेब और यहोशू का विश्वास", paragraphs: ["लेकिन दो जासूसों में विश्वास था - कालेब और यहोशू। 'डरो मत! परमेश्वर हमारे साथ है!'", "'देश अद्भुत है! परमेश्वर की मदद से, हम निश्चित रूप से इसे ले सकते हैं!'", "दुख की बात, लोगों ने डरे हुए दस जासूसों की सुनी।"] }
    },
    {
        page: 11, ref: "Numbers 14:26-35", theme: "wandering",
        en: { title: "Forty Years of Wandering", paragraphs: ["Because of their lack of faith, God said they would wander in the wilderness for forty years.", "Everyone over twenty years old (except Caleb and Joshua) would die in the desert.", "One year for each day the spies explored - that was God's judgment."] },
        te: { title: "నలభై సంవత్సరాల సంచారం", paragraphs: ["వారి విశ్వాసలేమి కారణంగా, వారు నలభై సంవత్సరాలు అరణ్యంలో తిరుగుతారని దేవుడు చెప్పాడు.", "ఇరవై సంవత్సరాలకు మించిన ప్రతి ఒక్కరూ (కాలేబు మరియు యెహోషువ తప్ప) ఎడారిలో చనిపోతారు.", "వేగులు అన్వేషించిన ప్రతి రోజుకు ఒక సంవత్సరం - ఇది దేవుని తీర్పు."] },
        hi: { title: "चालीस साल भटकना", paragraphs: ["उनके विश्वास की कमी के कारण, परमेश्वर ने कहा कि वे चालीस साल जंगल में भटकेंगे।", "बीस साल से ऊपर के सभी (कालेब और यहोशू को छोड़कर) रेगिस्तान में मर जाएंगे।", "जासूसों ने जितने दिन खोज की, हर दिन के लिए एक साल - यह परमेश्वर का न्याय था।"] }
    },
    {
        page: 12, ref: "Numbers 16:1-3, 31-35", theme: "korah",
        en: { title: "Korah's Rebellion", paragraphs: ["A man named Korah and 250 leaders rebelled against Moses and Aaron.", "'You've gone too far! All the congregation is holy. Why do you set yourselves above us?'", "The ground opened up and swallowed Korah. Fire consumed the 250 rebels."] },
        te: { title: "కోరహు తిరుగుబాటు", paragraphs: ["కోరహు అనే వ్యక్తి మరియు 250 మంది నాయకులు మోషే మరియు అహరోనుపై తిరుగుబాటు చేశారు.", "'మీరు చాలా దూరం వెళ్ళారు! మొత్తం సమాజం పవిత్రమైనది. మీరు మిమ్మల్ని మా కంటే ఎత్తుగా ఎందుకు పెట్టుకుంటారు?'", "భూమి తెరుచుకొని కోరహును మింగివేసింది. 250 మంది తిరుగుబాటుదారులను అగ్ని దహించింది."] },
        hi: { title: "कोरह का विद्रोह", paragraphs: ["कोरह नाम के एक व्यक्ति और 250 प्रधानों ने मूसा और हारून के विरुद्ध विद्रोह किया।", "'तुम बहुत आगे बढ़ गए! सारी मण्डली पवित्र है। तुम खुद को हमसे ऊपर क्यों रखते हो?'", "भूमि खुल गई और कोरह को निगल गई। आग ने 250 विद्रोहियों को भस्म कर दिया।"] }
    },
    {
        page: 13, ref: "Numbers 17:1-11", theme: "rod",
        en: { title: "Aaron's Rod Buds", paragraphs: ["To show who God had chosen, Moses collected a staff from each tribal leader.", "Only Aaron's staff sprouted overnight - it grew leaves, flowers, and almonds!", "This proved that God had chosen Aaron's family to serve as priests."] },
        te: { title: "అహరోను కర్ర చిగురించింది", paragraphs: ["దేవుడు ఎవరిని ఎంచుకున్నాడో చూపించడానికి, మోషే ప్రతి గోత్ర నాయకుడి నుండి ఒక కర్రను సేకరించాడు.", "అహరోను కర్ర మాత్రమే రాత్రిపూట చిగురించింది - అది ఆకులు, పువ్వులు మరియు బాదం కాసింది!", "దేవుడు యాజకులుగా సేవ చేయడానికి అహరోను కుటుంబాన్ని ఎంచుకున్నాడని ఇది నిరూపించింది."] },
        hi: { title: "हारून की लाठी में कलियाँ", paragraphs: ["परमेश्वर ने किसे चुना है यह दिखाने के लिए, मूसा ने हर गोत्र के प्रधान से एक लाठी इकट्ठी की।", "केवल हारून की लाठी रातोंरात अंकुरित हुई - उसमें पत्ते, फूल और बादाम उगे!", "इसने साबित किया कि परमेश्वर ने याजकों के रूप में सेवा करने के लिए हारून के परिवार को चुना था।"] }
    },
    {
        page: 14, ref: "Numbers 20:1-13", theme: "rock",
        en: { title: "Water from the Rock", paragraphs: ["The people complained again about having no water. God told Moses to speak to a rock.", "But Moses was angry and struck the rock twice with his staff instead.", "Water flowed out, but God said Moses couldn't enter the Promised Land because of his disobedience."] },
        te: { title: "బండ నుండి నీరు", paragraphs: ["ప్రజలు మళ్ళీ నీరు లేదని ఫిర్యాదు చేశారు. దేవుడు మోషేకు బండతో మాట్లాడమని చెప్పాడు.", "కానీ మోషే కోపంగా ఉండి బదులుగా తన కర్రతో బండను రెండుసార్లు కొట్టాడు.", "నీరు ప్రవహించింది, కానీ అతని అవిధేయత కారణంగా మోషే వాగ్దాన దేశంలో ప్రవేశించలేడని దేవుడు చెప్పాడు."] },
        hi: { title: "चट्टान से पानी", paragraphs: ["लोगों ने फिर से पानी न होने की शिकायत की। परमेश्वर ने मूसा को एक चट्टान से बोलने को कहा।", "लेकिन मूसा क्रोधित था और उसने बजाय इसके अपनी लाठी से चट्टान को दो बार मारा।", "पानी निकला, लेकिन परमेश्वर ने कहा कि मूसा अपनी अवज्ञा के कारण वादा किए गए देश में प्रवेश नहीं कर सकता।"] }
    },
    {
        page: 15, ref: "Numbers 21:4-9", theme: "serpent",
        en: { title: "The Bronze Serpent", paragraphs: ["The people complained again, and God sent poisonous snakes. Many were bitten and died.", "God told Moses to make a bronze snake and put it on a pole. Anyone who looked at it would live!", "Jesus said this pointed to Him - when we look to Him on the cross, we are saved."] },
        te: { title: "ఇత్తడి సర్పం", paragraphs: ["ప్రజలు మళ్ళీ ఫిర్యాదు చేశారు, దేవుడు విషపూరిత పాములను పంపాడు. చాలా మంది కాటు వేయబడి చనిపోయారు.", "దేవుడు మోషేకు ఇత్తడి సర్పం చేసి స్తంభంపై పెట్టమని చెప్పాడు. దానిని చూసిన ఎవరైనా బతికారు!", "ఇది తనను సూచిస్తుందని యేసు చెప్పాడు - మనం సిలువపై ఆయనను చూసినప్పుడు, మనం రక్షించబడతాము."] },
        hi: { title: "पीतल का साँप", paragraphs: ["लोगों ने फिर शिकायत की, और परमेश्वर ने जहरीले साँप भेजे। कई लोग काटे गए और मर गए।", "परमेश्वर ने मूसा को एक पीतल का साँप बनाकर खम्भे पर लगाने को कहा। जो कोई इसे देखता वह जीवित रहता!", "यीशु ने कहा यह उसकी ओर इशारा करता है - जब हम क्रूस पर उसे देखते हैं, हम बचाए जाते हैं।"] }
    },
    {
        page: 16, ref: "Numbers 22:1-6", theme: "balaam",
        en: { title: "Balak Calls Balaam", paragraphs: ["Balak, king of Moab, was afraid of Israel. He sent for a prophet named Balaam.", "'Come and curse this people for me. They are too powerful!'", "Balak promised Balaam great rewards if he would curse Israel."] },
        te: { title: "బాలాకు బిలామును పిలిచాడు", paragraphs: ["మోయాబు రాజు బాలాకు ఇశ్రాయేలుకు భయపడ్డాడు. అతను బిలాము అనే ప్రవక్తను పిలిపించాడు.", "'ఈ ప్రజలను నా కోసం శపించు. వారు చాలా శక్తివంతులు!'", "బిలాము ఇశ్రాయేలును శపిస్తే బాలాకు గొప్ప బహుమతులు వాగ్దానం చేసాడు."] },
        hi: { title: "बालाक ने बिलाम को बुलाया", paragraphs: ["मोआब का राजा बालाक इस्राएल से डर गया। उसने बिलाम नाम के एक नबी को बुलावा भेजा।", "'आओ और इन लोगों को मेरे लिए शाप दो। वे बहुत शक्तिशाली हैं!'", "बालाक ने बिलाम को बड़े इनाम का वादा किया अगर वह इस्राएल को शाप दे।"] }
    },
    {
        page: 17, ref: "Numbers 22:21-35", theme: "donkey",
        en: { title: "Balaam's Donkey Speaks", paragraphs: ["Balaam went with Balak's messengers, but God sent an angel to stop him.", "The donkey saw the angel and refused to move. Balaam beat her.", "Then God opened the donkey's mouth! She said, 'Why did you beat me?' Balaam's eyes were opened to see the angel."] },
        te: { title: "బిలాము గాడిద మాట్లాడింది", paragraphs: ["బిలాము బాలాకు దూతలతో వెళ్ళాడు, కానీ దేవుడు అతన్ని ఆపడానికి దేవదూతను పంపాడు.", "గాడిద దేవదూతను చూసి కదలడానికి నిరాకరించింది. బిలాము ఆమెను కొట్టాడు.", "అప్పుడు దేవుడు గాడిద నోటిని తెరిచాడు! ఆమె అడిగింది, 'నన్ను ఎందుకు కొట్టావు?' బిలాము కళ్ళు తెరువబడి దేవదూతను చూసాడు."] },
        hi: { title: "बिलाम की गधी बोली", paragraphs: ["बिलाम बालाक के दूतों के साथ गया, लेकिन परमेश्वर ने उसे रोकने के लिए एक स्वर्गदूत भेजा।", "गधी ने स्वर्गदूत को देखा और चलने से मना कर दिया। बिलाम ने उसे मारा।", "फिर परमेश्वर ने गधी का मुँह खोला! उसने कहा, 'तूने मुझे क्यों मारा?' बिलाम की आँखें खुलीं और उसने स्वर्गदूत देखा।"] }
    },
    {
        page: 18, ref: "Numbers 23:19-20", theme: "blessing_balaam",
        en: { title: "Blessing Instead of Curse", paragraphs: ["When Balaam tried to curse Israel, only blessings came out!", "'God is not a man that He should lie. He has blessed, and I cannot reverse it.'", "Three times Balak tried, and three times Balaam blessed Israel instead."] },
        te: { title: "శాపానికి బదులు ఆశీర్వాదం", paragraphs: ["బిలాము ఇశ్రాయేలును శపించడానికి ప్రయత్నించినప్పుడు, ఆశీర్వాదాలు మాత్రమే వచ్చాయి!", "'దేవుడు అబద్ధం చెప్పే మనిషి కాదు. ఆయన ఆశీర్వదించాడు, నేను దానిని తిరగందోలలేను.'", "బాలాకు మూడుసార్లు ప్రయత్నించాడు, మూడుసార్లు బిలాము ఇశ్రాయేలును ఆశీర్వదించాడు."] },
        hi: { title: "शाप के बजाय आशीर्वाद", paragraphs: ["जब बिलाम ने इस्राएल को शाप देने की कोशिश की, केवल आशीर्वाद निकले!", "'परमेश्वर मनुष्य नहीं कि झूठ बोले। उसने आशीर्वाद दिया है, मैं इसे उलट नहीं सकता।'", "बालाक ने तीन बार कोशिश की, और तीनों बार बिलाम ने इस्राएल को आशीर्वाद दिया।"] }
    },
    {
        page: 19, ref: "Numbers 27:12-23", theme: "joshua",
        en: { title: "Joshua Chosen as Leader", paragraphs: ["God told Moses he would soon die. Moses asked God to choose a new leader.", "God chose Joshua, who had the Spirit of God in him.", "Moses laid his hands on Joshua, passing the leadership to him. Joshua would lead Israel into the Promised Land."] },
        te: { title: "యెహోషువ నాయకుడిగా ఎంపిక", paragraphs: ["త్వరలో చనిపోతావని దేవుడు మోషేకు చెప్పాడు. కొత్త నాయకుడిని ఎంచుకోమని మోషే దేవుడిని అడిగాడు.", "దేవుడు యెహోషువను ఎంచుకున్నాడు, అతనిలో దేవుని ఆత్మ ఉంది.", "మోషే యెహోషువపై తన చేతులు ఉంచి, నాయకత్వాన్ని అతనికి అప్పగించాడు. యెహోషువ ఇశ్రాయేలును వాగ్దాన దేశంలోకి నడిపిస్తాడు."] },
        hi: { title: "यहोशू नेता चुना गया", paragraphs: ["परमेश्वर ने मूसा को बताया कि वह जल्द मर जाएगा। मूसा ने परमेश्वर से एक नया नेता चुनने को कहा।", "परमेश्वर ने यहोशू को चुना, जिसमें परमेश्वर का आत्मा था।", "मूसा ने यहोशू पर अपने हाथ रखे, नेतृत्व उसे सौंप दिया। यहोशू इस्राएल को वादा किए गए देश में ले जाएगा।"] }
    },
    {
        page: 20, ref: "Numbers 33:50-56", theme: "promise",
        en: { title: "Ready for the Promised Land", paragraphs: ["After forty years of wandering, the new generation stood at the edge of Canaan.", "God gave them final instructions for taking the land and living there.", "The wilderness journey was ending. A new chapter was about to begin!"] },
        te: { title: "వాగ్దాన దేశానికి సిద్ధం", paragraphs: ["నలభై సంవత్సరాల సంచారం తర్వాత, కొత్త తరం కనాను అంచున నిలబడింది.", "భూమిని స్వాధీనం చేసుకోవడానికి మరియు అక్కడ జీవించడానికి దేవుడు వారికి చివరి సూచనలు ఇచ్చాడు.", "అరణ్య ప్రయాణం ముగుస్తోంది. కొత్త అధ్యాయం ప్రారంభం కాబోతోంది!"] },
        hi: { title: "वादा किए गए देश के लिए तैयार", paragraphs: ["चालीस साल भटकने के बाद, नई पीढ़ी कनान की सीमा पर खड़ी थी।", "परमेश्वर ने उन्हें देश लेने और वहाँ रहने के लिए अंतिम निर्देश दिए।", "जंगल की यात्रा समाप्त हो रही थी। एक नया अध्याय शुरू होने वाला था!"] }
    }
];

const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        census: 'from-blue-600 to-indigo-700', camp: 'from-amber-500 to-orange-600',
        blessing: 'from-gold-400 to-amber-500', cloud: 'from-slate-500 to-gray-700',
        complain: 'from-red-600 to-rose-700', quail: 'from-amber-600 to-yellow-700',
        miriam: 'from-pink-500 to-rose-600', spies: 'from-green-600 to-emerald-700',
        giants: 'from-red-700 to-rose-800', caleb: 'from-emerald-500 to-green-600',
        wandering: 'from-amber-600 to-orange-700', korah: 'from-red-800 to-rose-900',
        rod: 'from-pink-400 to-rose-500', rock: 'from-blue-600 to-cyan-700',
        serpent: 'from-green-700 to-emerald-800', balaam: 'from-purple-600 to-indigo-700',
        donkey: 'from-amber-500 to-yellow-600', blessing_balaam: 'from-gold-500 to-amber-600',
        joshua: 'from-blue-500 to-indigo-600', promise: 'from-green-500 to-emerald-600'
    };

    const icons: Record<string, React.ReactNode> = {
        census: <Users size={64} className="text-blue-200" />,
        camp: <Map size={64} className="text-amber-200" />,
        blessing: <Star size={64} className="text-gold-200" />,
        cloud: <Cloud size={64} className="text-gray-200" />,
        complain: <Users size={64} className="text-red-200" />,
        quail: <Cloud size={64} className="text-amber-200" />,
        miriam: <Users size={64} className="text-pink-200" />,
        spies: <Compass size={64} className="text-green-200" />,
        giants: <Mountain size={64} className="text-red-200" />,
        caleb: <Compass size={64} className="text-emerald-200" />,
        wandering: <Compass size={64} className="text-amber-200" />,
        korah: <Mountain size={64} className="text-red-200" />,
        rod: <Star size={64} className="text-pink-200" />,
        rock: <Mountain size={64} className="text-blue-200" />,
        serpent: <Star size={64} className="text-green-200" />,
        balaam: <Users size={64} className="text-purple-200" />,
        donkey: <Users size={64} className="text-amber-200" />,
        blessing_balaam: <Star size={64} className="text-gold-200" />,
        joshua: <Compass size={64} className="text-blue-200" />,
        promise: <Mountain size={64} className="text-green-200" />
    };

    return (
        <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${colors[theme] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
            {icons[theme] || <Book size={64} className="text-white" />}
        </div>
    );
};

interface NumbersBookProps {
    onBack: () => void;
}

export default function NumbersBook({ onBack }: NumbersBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const totalPages = numbersStories.length;

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

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX.current - touchEndX.current;
        if (swipeDistance > 50) handleNext();
        else if (swipeDistance < -50) handlePrev();
    };

    const pageData = currentPage > 0 ? numbersStories[currentPage - 1] : null;
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
            <div className="absolute inset-0 bg-black/80" onClick={onBack} />
            <div className={`relative w-full max-w-4xl h-[85vh] ${getBgColor()} rounded-3xl shadow-2xl overflow-hidden border border-white/20`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm">
                            <Globe className="w-4 h-4" /><span>{currentLangInfo.flag} {currentLangInfo.native}</span>
                        </button>
                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-gray-900 rounded-xl border border-white/10 shadow-xl overflow-hidden min-w-[160px]">
                                {languages.map((lang) => (
                                    <button key={lang.id} onClick={() => { setSelectedLang(lang.id); setShowLangMenu(false); }}
                                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/10 ${selectedLang === lang.id ? 'bg-gold-500/20 text-gold-300' : 'text-gray-200'}`}>
                                        <span>{lang.flag}</span><span>{lang.native}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X className="w-6 h-6 text-white" /></button>
                </div>

                {currentPage === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-teal-600 to-cyan-700">
                        <div className="mb-6 p-6 bg-white/20 rounded-full"><Users size={80} className="text-white" /></div>
                        <h1 className="text-4xl font-black text-white mb-2">THE BOOK OF</h1>
                        <h2 className="text-3xl font-bold text-teal-100 mb-6">NUMBERS</h2>
                        <p className="text-white/80 mb-8 max-w-md">Wilderness Journey, 12 Spies & Balaam - Telugu & Hindi Available</p>
                        <button onClick={handleNext} className="px-8 py-4 bg-white text-teal-600 rounded-full font-bold text-xl flex items-center gap-2">
                            START READING <ChevronRight size={24} />
                        </button>
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
                            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {content?.paragraphs.map((para, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0" />
                                        <p className="text-lg text-gray-200 leading-relaxed">{para}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-white/10 flex justify-between items-center">
                                <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <span className="text-sm font-bold text-gray-400">{currentPage} / {totalPages}</span>
                                {currentPage < totalPages ? (
                                    <button onClick={handleNext} className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center"><ChevronRight size={28} /></button>
                                ) : (
                                    <button onClick={() => setCurrentPage(0)} className="px-5 py-3 rounded-full bg-emerald-500 text-white font-bold flex items-center gap-2">Again! <RefreshCcw size={18} /></button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
