import React, { useState, useRef } from 'react';
import {
    Book, ChevronLeft, ChevronRight, RefreshCcw, BookOpen,
    TreeDeciduous, Cloud, Sun, Moon, Bird, Fish, Users, X, Globe, Heart, Apple, AlertTriangle, Sword
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
    // Adam and Eve Stories
    {
        page: 8, ref: "Genesis 2:7-9", theme: "adam",
        en: { title: "The Garden of Eden", paragraphs: ["God planted a beautiful garden in a place called Eden. It was the most wonderful place on Earth!", "There were rivers flowing through it, fruit trees everywhere, and every kind of flower you can imagine.", "In the middle of the garden stood two special trees: the Tree of Life and the Tree of the Knowledge of Good and Evil."] },
        te: { title: "ఏదెను తోట", paragraphs: ["దేవుడు ఏదెను అనే ప్రదేశంలో అందమైన తోటను నాటాడు. ఇది భూమిపై అత్యంత అద్భుతమైన ప్రదేశం!", "దాని గుండా నదులు ప్రవహిస్తున్నాయి, ప్రతిచోటా పండ్ల చెట్లు, మీరు ఊహించగలిగే ప్రతి రకమైన పువ్వులు ఉన్నాయి.", "తోట మధ్యలో రెండు ప్రత్యేక చెట్లు నిలబడ్డాయి: జీవ వృక్షం మరియు మంచి చెడుల జ్ఞాన వృక్షం."] },
        hi: { title: "अदन का बाग", paragraphs: ["भगवान ने अदन नामक स्थान में एक सुंदर बाग लगाया। यह पृथ्वी पर सबसे अद्भुत जगह थी!", "इसमें से नदियाँ बहती थीं, हर जगह फलों के पेड़ थे, और हर तरह के फूल थे जिनकी आप कल्पना कर सकते हैं।", "बाग के बीच में दो विशेष पेड़ खड़े थे: जीवन का पेड़ और भले बुरे के ज्ञान का पेड़।"] }
    },
    {
        page: 9, ref: "Genesis 2:15-17", theme: "adam",
        en: { title: "Adam's Special Job", paragraphs: ["God put Adam in the beautiful Garden of Eden to take care of it and tend to the plants and animals.", "God told Adam, 'You can eat fruit from any tree in the garden, except one. Do not eat from the Tree of Knowledge of Good and Evil.'", "'If you eat from that tree,' God warned, 'you will surely die.' Adam understood and promised to obey."] },
        te: { title: "ఆదాము ప్రత్యేక పని", paragraphs: ["దేవుడు ఆదామును ఏదెను తోటలో మొక్కలు మరియు జంతువులను జాగ్రత్తగా చూసుకోవడానికి ఉంచాడు.", "దేవుడు ఆదాముతో చెప్పాడు, 'నువ్వు తోటలో ఏ చెట్టు పండు అయినా తినవచ్చు, ఒకటి తప్ప. మంచి చెడుల జ్ఞాన వృక్షం నుండి తినకు.'", "'ఆ చెట్టు నుండి తింటే,' దేవుడు హెచ్చరించాడు, 'నువ్వు తప్పకుండా చనిపోతావు.' ఆదాము అర్థం చేసుకొని విధేయత చూపిస్తానని వాగ్దానం చేసాడు."] },
        hi: { title: "आदम का विशेष काम", paragraphs: ["भगवान ने आदम को सुंदर अदन के बाग में पौधों और जानवरों की देखभाल करने के लिए रखा।", "भगवान ने आदम से कहा, 'तुम बाग में किसी भी पेड़ का फल खा सकते हो, एक को छोड़कर। भले बुरे के ज्ञान के पेड़ से मत खाना।'", "'अगर तुम उस पेड़ से खाओगे,' भगवान ने चेतावनी दी, 'तुम निश्चित रूप से मर जाओगे।' आदम ने समझा और आज्ञा मानने का वादा किया।"] }
    },
    {
        page: 10, ref: "Genesis 2:18-22", theme: "eve",
        en: { title: "Eve is Created", paragraphs: ["God saw that Adam was lonely. He said, 'It is not good for man to be alone. I will make a helper perfect for him.'", "So God caused Adam to fall into a deep sleep. While he slept, God took one of his ribs and closed up the wound.", "From that rib, God made a woman. When Adam woke up and saw her, he was so happy! He named her Eve, meaning 'life.'"] },
        te: { title: "హవ్వ సృష్టి", paragraphs: ["ఆదాము ఒంటరిగా ఉన్నట్లు దేవుడు చూసాడు. అతను చెప్పాడు, 'మనిషి ఒంటరిగా ఉండటం మంచిది కాదు. అతనికి సరిపోయే సహాయకురాలిని చేస్తాను.'", "కాబట్టి దేవుడు ఆదామును గాఢ నిద్రలో పడేలా చేసాడు. అతను నిద్రపోతుండగా, దేవుడు అతని పక్కటెమకలో ఒకదాన్ని తీసుకొని గాయాన్ని మూసాడు.", "ఆ పక్కటెమక నుండి, దేవుడు స్త్రీని చేసాడు. ఆదాము మేల్కొని ఆమెను చూసినప్పుడు, అతను చాలా సంతోషించాడు! అతను ఆమెకు 'జీవితం' అనే అర్థం ఉన్న హవ్వ అని పేరు పెట్టాడు."] },
        hi: { title: "हव्वा की रचना", paragraphs: ["भगवान ने देखा कि आदम अकेला था। उसने कहा, 'मनुष्य का अकेला रहना अच्छा नहीं। मैं उसके लिए एक उचित सहायक बनाऊंगा।'", "तो भगवान ने आदम को गहरी नींद में सुला दिया। जब वह सो रहा था, भगवान ने उसकी एक पसली निकाली और घाव बंद कर दिया।", "उस पसली से, भगवान ने एक स्त्री बनाई। जब आदम जागा और उसे देखा, वह बहुत खुश हुआ! उसने उसका नाम हव्वा रखा, जिसका अर्थ है 'जीवन'।"] }
    },
    {
        page: 11, ref: "Genesis 2:23-25", theme: "eve",
        en: { title: "The First Marriage", paragraphs: ["When Adam saw Eve, he said, 'This is bone of my bones and flesh of my flesh! She shall be called Woman because she was taken out of Man.'", "Adam and Eve became the first husband and wife. They loved each other very much.", "They were both naked but felt no shame because everything was pure and perfect in the garden."] },
        te: { title: "మొదటి వివాహం", paragraphs: ["ఆదాము హవ్వను చూసినప్పుడు, అతను చెప్పాడు, 'ఇది నా ఎముకలలో ఎముక, నా మాంసంలో మాంసం! ఆమె మనిషి నుండి తీసుకోబడినందున స్త్రీ అని పిలువబడుతుంది.'", "ఆదాము మరియు హవ్వ మొదటి భార్యాభర్తలు అయ్యారు. వారు ఒకరినొకరు చాలా ప్రేమించారు.", "వారు ఇద్దరూ నగ్నంగా ఉన్నారు కానీ సిగ్గు పడలేదు ఎందుకంటే తోటలో అంతా స్వచ్ఛంగా మరియు పరిపూర్ణంగా ఉంది."] },
        hi: { title: "पहला विवाह", paragraphs: ["जब आदम ने हव्वा को देखा, उसने कहा, 'यह मेरी हड्डियों की हड्डी और मेरे मांस का मांस है! वह नारी कहलाएगी क्योंकि वह नर से ली गई थी।'", "आदम और हव्वा पहले पति-पत्नी बने। वे एक दूसरे से बहुत प्यार करते थे।", "वे दोनों नग्न थे लेकिन शर्म महसूस नहीं करते थे क्योंकि बाग में सब कुछ शुद्ध और पूर्ण था।"] }
    },
    {
        page: 12, ref: "Genesis 3:1-5", theme: "serpent",
        en: { title: "The Cunning Serpent", paragraphs: ["Now the serpent was more cunning than any other animal God had made. One day, it spoke to Eve.", "'Did God really say you cannot eat from any tree in the garden?' the serpent asked.", "Eve replied, 'We can eat from any tree except the one in the middle. If we eat or touch it, we will die.' The serpent hissed, 'You won't die! God knows if you eat it, you'll become like Him!'"] },
        te: { title: "కపటవంతమైన సర్పం", paragraphs: ["దేవుడు చేసిన ఏ జంతువు కంటే సర్పం మరింత కపటవంతమైనది. ఒక రోజు, అది హవ్వతో మాట్లాడింది.", "'దేవుడు నిజంగా తోటలో ఏ చెట్టు నుండి అయినా తినకూడదని చెప్పాడా?' సర్పం అడిగింది.", "హవ్వ జవాబిచ్చింది, 'మధ్యలో ఉన్నది తప్ప ఏ చెట్టు నుండి అయినా తినవచ్చు. తింటే లేదా తాకితే చనిపోతాము.' సర్పం బుసలు కొట్టింది, 'మీరు చనిపోరు! తింటే ఆయనలా అవుతారని దేవునికి తెలుసు!'"] },
        hi: { title: "धूर्त सांप", paragraphs: ["अब सांप भगवान द्वारा बनाए गए किसी भी जानवर से अधिक चालाक था। एक दिन, उसने हव्वा से बात की।", "'क्या भगवान ने सच में कहा कि तुम बाग के किसी भी पेड़ से नहीं खा सकती?' सांप ने पूछा।", "हव्वा ने जवाब दिया, 'हम बीच वाले को छोड़कर किसी भी पेड़ से खा सकते हैं। अगर हम खाएंगे या छुएंगे, तो मर जाएंगे।' सांप ने फुफकारा, 'तुम नहीं मरोगी! भगवान जानता है कि अगर खाओगी तो उसके जैसी बन जाओगी!'"] }
    },
    {
        page: 13, ref: "Genesis 3:6-7", theme: "fall",
        en: { title: "The Forbidden Fruit", paragraphs: ["Eve looked at the tree. The fruit looked delicious, and she wanted to be wise like God.", "She took some fruit and ate it. Then she gave some to Adam, who was with her, and he ate it too.", "Suddenly, their eyes were opened. They realized they were naked and felt ashamed. They sewed fig leaves together to cover themselves."] },
        te: { title: "నిషేధించిన పండు", paragraphs: ["హవ్వ చెట్టును చూసింది. పండు రుచిగా కనిపించింది, ఆమె దేవుని వలె తెలివిగా ఉండాలనుకుంది.", "ఆమె కొంత పండు తీసుకొని తింది. అప్పుడు ఆమె తనతో ఉన్న ఆదాముకు ఇచ్చింది, అతను కూడా తిన్నాడు.", "హఠాత్తుగా, వారి కళ్ళు తెరవబడ్డాయి. వారు నగ్నంగా ఉన్నారని గ్రహించారు మరియు సిగ్గుపడ్డారు. వారు తమను తాము కప్పుకోవడానికి అంజూర ఆకులను కుట్టారు."] },
        hi: { title: "वर्जित फल", paragraphs: ["हव्वा ने पेड़ को देखा। फल स्वादिष्ट दिख रहा था, और वह भगवान की तरह बुद्धिमान होना चाहती थी।", "उसने कुछ फल लिया और खा लिया। फिर उसने अपने साथ के आदम को दिया, और उसने भी खा लिया।", "अचानक, उनकी आँखें खुल गईं। उन्हें पता चला कि वे नग्न हैं और शर्म महसूस हुई। उन्होंने खुद को ढकने के लिए अंजीर के पत्ते सिल लिए।"] }
    },
    {
        page: 14, ref: "Genesis 3:8-13", theme: "fall",
        en: { title: "Hiding from God", paragraphs: ["That evening, Adam and Eve heard God walking in the garden. They were scared and hid among the trees.", "God called out, 'Adam, where are you?' Adam answered, 'I heard You and was afraid because I was naked, so I hid.'", "God asked, 'Did you eat from the tree I told you not to eat from?' Adam blamed Eve, and Eve blamed the serpent."] },
        te: { title: "దేవుని నుండి దాక్కోవడం", paragraphs: ["ఆ సాయంత్రం, ఆదాము మరియు హవ్వ దేవుడు తోటలో నడుస్తున్న శబ్దం విన్నారు. వారు భయపడి చెట్ల మధ్య దాక్కున్నారు.", "దేవుడు పిలిచాడు, 'ఆదామా, నువ్వు ఎక్కడ ఉన్నావు?' ఆదాము జవాబిచ్చాడు, 'నేను నిన్ను విన్నాను, నగ్నంగా ఉన్నందున భయపడ్డాను, అందుకే దాక్కున్నాను.'", "దేవుడు అడిగాడు, 'తినకూడదని చెప్పిన చెట్టు నుండి తిన్నావా?' ఆదాము హవ్వను నిందించాడు, హవ్వ సర్పాన్ని నిందించింది."] },
        hi: { title: "भगवान से छिपना", paragraphs: ["उस शाम, आदम और हव्वा ने भगवान को बाग में चलते सुना। वे डर गए और पेड़ों के बीच छिप गए।", "भगवान ने पुकारा, 'आदम, तू कहाँ है?' आदम ने जवाब दिया, 'मैंने तुझे सुना और डर गया क्योंकि मैं नग्न था, इसलिए छिप गया।'", "भगवान ने पूछा, 'क्या तूने उस पेड़ से खाया जिससे मैंने मना किया था?' आदम ने हव्वा को दोष दिया, और हव्वा ने सांप को।"] }
    },
    {
        page: 15, ref: "Genesis 3:14-24", theme: "fall",
        en: { title: "Leaving the Garden", paragraphs: ["God punished the serpent to crawl on its belly forever. He told Eve she would have pain in childbirth, and Adam would have to work hard for food.", "God made clothes of animal skin for Adam and Eve. Then, sadly, He sent them out of the Garden of Eden.", "God placed angels with flaming swords at the entrance so they could never return to the Tree of Life. But God still loved them and had a plan to save them one day."] },
        te: { title: "తోట విడిచిపెట్టడం", paragraphs: ["దేవుడు సర్పాన్ని ఎప్పటికీ పొట్ట మీద ప్రాకమని శిక్షించాడు. హవ్వకు ప్రసవంలో నొప్పి ఉంటుందని, ఆదాము ఆహారం కోసం కష్టపడాలని చెప్పాడు.", "దేవుడు ఆదాము హవ్వలకు జంతు చర్మంతో దుస్తులు చేసాడు. అప్పుడు, విచారంగా, ఆయన వారిని ఏదెను తోట నుండి బయటకు పంపాడు.", "దేవుడు ప్రవేశద్వారం వద్ద మండే కత్తులతో దేవదూతలను ఉంచాడు, వారు జీవ వృక్షం వద్దకు ఎప్పటికీ తిరిగి రాకుండా. కానీ దేవుడు ఇంకా వారిని ప్రేమించాడు మరియు ఒక రోజు వారిని రక్షించే ప్రణాళిక కలిగి ఉన్నాడు."] },
        hi: { title: "बाग छोड़ना", paragraphs: ["भगवान ने सांप को हमेशा के लिए पेट के बल रेंगने की सजा दी। उसने हव्वा से कहा कि उसे प्रसव में दर्द होगा, और आदम को भोजन के लिए कड़ी मेहनत करनी होगी।", "भगवान ने आदम और हव्वा के लिए पशु की खाल के कपड़े बनाए। फिर, दुख से, उसने उन्हें अदन के बाग से बाहर भेज दिया।", "भगवान ने प्रवेश द्वार पर जलती तलवारों वाले स्वर्गदूतों को रखा ताकि वे जीवन के पेड़ पर कभी न लौट सकें। लेकिन भगवान अभी भी उनसे प्यार करता था और एक दिन उन्हें बचाने की योजना थी।"] }
    },
];

// Theme-based illustration
const Illustration = ({ theme }: { theme: string }) => {
    const colors: Record<string, string> = {
        day1: 'from-gray-900 to-indigo-900', day2: 'from-sky-400 to-blue-500',
        day3: 'from-green-400 to-emerald-600', day4: 'from-indigo-800 to-purple-900',
        day5: 'from-blue-400 to-cyan-500', day6: 'from-amber-200 to-orange-300',
        day7: 'from-yellow-100 to-amber-200',
        adam: 'from-emerald-400 to-teal-600', eve: 'from-rose-300 to-pink-500',
        serpent: 'from-green-700 to-emerald-900', fall: 'from-red-700 to-rose-900'
    };

    const icons: Record<string, React.ReactNode> = {
        day1: <Sun size={64} className="text-yellow-300" />,
        day2: <Cloud size={64} className="text-white" />,
        day3: <TreeDeciduous size={64} className="text-green-700" />,
        day4: <div className="flex gap-2"><Sun size={48} className="text-yellow-400" /><Moon size={40} className="text-gray-200" /></div>,
        day5: <div className="flex flex-col gap-2"><Bird size={44} className="text-blue-700" /><Fish size={44} className="text-cyan-400" /></div>,
        day6: <Users size={64} className="text-amber-800" />,
        day7: <div className="text-4xl font-bold text-amber-600">zZZ</div>,
        adam: <div className="flex flex-col items-center gap-2"><TreeDeciduous size={48} className="text-white" /><span className="text-xs text-white/80">Garden of Eden</span></div>,
        eve: <div className="flex gap-3"><Users size={48} className="text-white" /><Heart size={32} className="text-red-300" /></div>,
        serpent: <AlertTriangle size={64} className="text-yellow-400" />,
        fall: <div className="flex gap-3"><Apple size={48} className="text-red-400" /><Sword size={48} className="text-orange-300" /></div>
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
