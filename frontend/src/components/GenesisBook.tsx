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
    // Cain & Abel Stories (Pages 16-20)
    {
        page: 16, ref: "Genesis 4:1-2", theme: "cain",
        en: { title: "Two Brothers", paragraphs: ["Adam and Eve had their first son and named him Cain. Later, they had another son named Abel.", "As they grew up, Cain became a farmer who grew crops. Abel became a shepherd who cared for sheep.", "Both brothers worked hard, but they were very different from each other."] },
        te: { title: "ఇద్దరు సోదరులు", paragraphs: ["ఆదాము హవ్వలకు మొదటి కొడుకు పుట్టాడు, వారు అతనికి కయీను అని పేరు పెట్టారు. తర్వాత, వారికి హేబెలు అనే మరొక కొడుకు పుట్టాడు.", "వారు పెరిగేకొద్దీ, కయీను పంటలు పండించే రైతు అయ్యాడు. హేబెలు గొర్రెలను చూసుకునే గొర్రెల కాపరి అయ్యాడు.", "ఇద్దరు సోదరులు కష్టపడి పని చేసారు, కానీ వారు ఒకరికొకరు చాలా భిన్నంగా ఉన్నారు."] },
        hi: { title: "दो भाई", paragraphs: ["आदम और हव्वा का पहला बेटा हुआ जिसे उन्होंने कैन नाम दिया। बाद में, उनका एक और बेटा हाबिल हुआ।", "जैसे-जैसे वे बड़े हुए, कैन एक किसान बन गया जो फसल उगाता था। हाबिल एक चरवाहा बन गया जो भेड़ों की देखभाल करता था।", "दोनों भाइयों ने कड़ी मेहनत की, लेकिन वे एक दूसरे से बहुत अलग थे।"] }
    },
    {
        page: 17, ref: "Genesis 4:3-5", theme: "cain",
        en: { title: "The Offerings", paragraphs: ["One day, both brothers brought offerings to God. Cain brought some of his crops from the ground.", "Abel brought the best portions from his firstborn lambs. He gave his very best to God.", "God was pleased with Abel's offering, but not with Cain's. This made Cain very angry and jealous."] },
        te: { title: "అర్పణలు", paragraphs: ["ఒక రోజు, ఇద్దరు సోదరులు దేవునికి అర్పణలు తెచ్చారు. కయీను నేల నుండి తన పంటలో కొంత తెచ్చాడు.", "హేబెలు తన మొదటి గొర్రెపిల్లల నుండి ఉత్తమమైన భాగాలను తెచ్చాడు. అతను తన అత్యుత్తమమైనది దేవునికి ఇచ్చాడు.", "దేవుడు హేబెలు అర్పణతో సంతోషించాడు, కానీ కయీను అర్పణతో కాదు. ఇది కయీనును చాలా కోపంగా మరియు అసూయగా చేసింది."] },
        hi: { title: "भेंटें", paragraphs: ["एक दिन, दोनों भाइयों ने भगवान को भेंट चढ़ाई। कैन ने अपनी फसल में से कुछ लाया।", "हाबिल ने अपने पहलौठे मेमनों में से सबसे अच्छे हिस्से लाए। उसने अपना सर्वश्रेष्ठ भगवान को दिया।", "भगवान हाबिल की भेंट से प्रसन्न हुआ, लेकिन कैन की भेंट से नहीं। इससे कैन बहुत क्रोधित और ईर्ष्यालु हो गया।"] }
    },
    {
        page: 18, ref: "Genesis 4:6-8", theme: "cain",
        en: { title: "A Terrible Sin", paragraphs: ["God warned Cain, 'Why are you angry? If you do what is right, you will be accepted. But sin is waiting to control you.'", "But Cain did not listen. One day, he invited Abel to go out to the field with him.", "There, in a terrible rage, Cain attacked his brother Abel and killed him. It was the first murder in history."] },
        te: { title: "భయంకరమైన పాపం", paragraphs: ["దేవుడు కయీనును హెచ్చరించాడు, 'నీకు కోపం ఎందుకు? నువ్వు సరిగ్గా చేస్తే, నిన్ను అంగీకరిస్తారు. కానీ పాపం నిన్ను నియంత్రించడానికి వేచి ఉంది.'", "కానీ కయీను వినలేదు. ఒక రోజు, అతను హేబెలును తనతో పొలానికి వెళ్ళమని ఆహ్వానించాడు.", "అక్కడ, భయంకరమైన కోపంతో, కయీను తన సోదరుడు హేబెలుపై దాడి చేసి చంపాడు. ఇది చరిత్రలో మొదటి హత్య."] },
        hi: { title: "भयानक पाप", paragraphs: ["भगवान ने कैन को चेतावनी दी, 'तू क्रोधित क्यों है? यदि तू सही करेगा, तो स्वीकार किया जाएगा। लेकिन पाप तुझे नियंत्रित करने के लिए इंतजार कर रहा है।'", "लेकिन कैन ने नहीं सुना। एक दिन, उसने हाबिल को अपने साथ मैदान में जाने के लिए आमंत्रित किया।", "वहाँ, भयानक क्रोध में, कैन ने अपने भाई हाबिल पर हमला किया और उसे मार डाला। यह इतिहास की पहली हत्या थी।"] }
    },
    {
        page: 19, ref: "Genesis 4:9-12", theme: "cain",
        en: { title: "God's Question", paragraphs: ["God asked Cain, 'Where is your brother Abel?' Cain lied and said, 'I don't know. Am I my brother's keeper?'", "God said, 'What have you done? Your brother's blood cries out to me from the ground!'", "God cursed Cain: 'The ground will no longer produce crops for you. You will be a restless wanderer on the earth.'"] },
        te: { title: "దేవుని ప్రశ్న", paragraphs: ["దేవుడు కయీనును అడిగాడు, 'నీ సోదరుడు హేబెలు ఎక్కడ?' కయీను అబద్ధం చెప్పి, 'నాకు తెలియదు. నేను నా సోదరుని కాపరినా?' అన్నాడు.", "దేవుడు చెప్పాడు, 'నువ్వు ఏం చేసావు? నీ సోదరుని రక్తం నేల నుండి నాకు మొరపెడుతోంది!'", "దేవుడు కయీనును శపించాడు: 'భూమి ఇకపై నీకు పంటలు ఇవ్వదు. నువ్వు భూమిపై విశ్రాంతి లేని సంచారిగా ఉంటావు.'"] },
        hi: { title: "भगवान का प्रश्न", paragraphs: ["भगवान ने कैन से पूछा, 'तेरा भाई हाबिल कहाँ है?' कैन ने झूठ बोला, 'मुझे नहीं पता। क्या मैं अपने भाई का रखवाला हूँ?'", "भगवान ने कहा, 'तूने क्या किया? तेरे भाई का खून जमीन से मुझे पुकार रहा है!'", "भगवान ने कैन को शाप दिया: 'जमीन अब तेरे लिए फसल नहीं उगाएगी। तू पृथ्वी पर बेचैन भटकता रहेगा।'"] }
    },
    {
        page: 20, ref: "Genesis 4:13-16", theme: "cain",
        en: { title: "The Mark of Cain", paragraphs: ["Cain cried out, 'My punishment is too great! Everyone who finds me will try to kill me!'", "God showed mercy. He put a special mark on Cain so that no one would kill him.", "Cain left God's presence and went to live in the land of Nod, east of Eden. He started a family there, but he was always far from God."] },
        te: { title: "కయీను గుర్తు", paragraphs: ["కయీను మొరపెట్టాడు, 'నా శిక్ష చాలా పెద్దది! నన్ను కనుగొనే ప్రతి ఒక్కరూ నన్ను చంపడానికి ప్రయత్నిస్తారు!'", "దేవుడు దయ చూపించాడు. ఎవరూ అతన్ని చంపకుండా కయీనుపై ప్రత్యేక గుర్తు పెట్టాడు.", "కయీను దేవుని సన్నిధి విడిచి ఏదెనుకు తూర్పున నోదు దేశంలో నివసించడానికి వెళ్ళాడు. అతను అక్కడ కుటుంబాన్ని ప్రారంభించాడు, కానీ అతను ఎప్పుడూ దేవునికి దూరంగా ఉన్నాడు."] },
        hi: { title: "कैन की छाप", paragraphs: ["कैन ने रोते हुए कहा, 'मेरी सजा बहुत बड़ी है! जो कोई मुझे पाएगा वह मुझे मारने की कोशिश करेगा!'", "भगवान ने दया दिखाई। उन्होंने कैन पर एक विशेष चिह्न लगा दिया ताकि कोई उसे न मारे।", "कैन भगवान की उपस्थिति छोड़कर अदन के पूर्व में नोद देश में रहने चला गया। उसने वहाँ परिवार शुरू किया, लेकिन वह हमेशा भगवान से दूर रहा।"] }
    },
    // Noah's Flood (Pages 21-25)
    {
        page: 21, ref: "Genesis 6:5-8", theme: "noah",
        en: { title: "A Wicked World", paragraphs: ["Many years passed. People multiplied on the earth, but they became very wicked.", "God saw that every thought of people's hearts was evil all the time. He was deeply sad.", "But there was one man who was different. His name was Noah, and he walked faithfully with God."] },
        te: { title: "దుష్ట ప్రపంచం", paragraphs: ["చాలా సంవత్సరాలు గడిచాయి. భూమిపై ప్రజలు పెరిగారు, కానీ వారు చాలా దుష్టులు అయ్యారు.", "ప్రజల హృదయాల ప్రతి ఆలోచన ఎల్లప్పుడూ చెడుగా ఉందని దేవుడు చూసాడు. ఆయన చాలా బాధపడ్డాడు.", "కానీ ఒక మనిషి వేరుగా ఉన్నాడు. అతని పేరు నోవహు, అతను దేవునితో నమ్మకంగా నడిచాడు."] },
        hi: { title: "दुष्ट दुनिया", paragraphs: ["कई साल बीत गए। पृथ्वी पर लोग बढ़ गए, लेकिन वे बहुत दुष्ट हो गए।", "भगवान ने देखा कि लोगों के दिलों की हर सोच हमेशा बुरी थी। वह बहुत दुखी हुआ।", "लेकिन एक आदमी अलग था। उसका नाम नूह था, और वह भगवान के साथ विश्वासपूर्वक चलता था।"] }
    },
    {
        page: 22, ref: "Genesis 6:13-22", theme: "noah",
        en: { title: "Building the Ark", paragraphs: ["God told Noah, 'I am going to bring a flood to destroy all life. But I will save you and your family.'", "God gave Noah instructions to build a huge boat called an ark. It would be 450 feet long, 75 feet wide, and 45 feet high!", "Noah obeyed God and began building the ark, even though people laughed at him."] },
        te: { title: "ఓడ నిర్మాణం", paragraphs: ["దేవుడు నోవహుతో చెప్పాడు, 'నేను అన్ని జీవులను నాశనం చేయడానికి జలప్రళయం తీసుకురాబోతున్నాను. కానీ నిన్ను మరియు నీ కుటుంబాన్ని రక్షిస్తాను.'", "దేవుడు నోవహుకు ఓడ అనే పెద్ద పడవ నిర్మించడానికి సూచనలు ఇచ్చాడు. అది 450 అడుగుల పొడవు, 75 అడుగుల వెడల్పు, 45 అడుగుల ఎత్తు ఉంటుంది!", "ప్రజలు అతన్ని చూసి నవ్వినా, నోవహు దేవునికి విధేయుడై ఓడ నిర్మించడం ప్రారంభించాడు."] },
        hi: { title: "जहाज बनाना", paragraphs: ["भगवान ने नूह से कहा, 'मैं सब जीवन को नष्ट करने के लिए जलप्रलय लाने वाला हूँ। लेकिन मैं तुझे और तेरे परिवार को बचाऊंगा।'", "भगवान ने नूह को एक विशाल नाव बनाने के निर्देश दिए जिसे जहाज कहते हैं। यह 450 फीट लंबा, 75 फीट चौड़ा और 45 फीट ऊंचा होगा!", "नूह ने भगवान की आज्ञा मानी और जहाज बनाना शुरू किया, भले ही लोग उस पर हँसते थे।"] }
    },
    {
        page: 23, ref: "Genesis 7:1-16", theme: "noah",
        en: { title: "Into the Ark", paragraphs: ["When the ark was finished, God told Noah to bring animals into it - two of every kind, and seven pairs of clean animals.", "Noah, his wife, his three sons, and their wives entered the ark. Then all the animals came in, two by two.", "When everyone was inside, God Himself shut the door of the ark."] },
        te: { title: "ఓడలోకి", paragraphs: ["ఓడ పూర్తయినప్పుడు, దేవుడు నోవహుకు జంతువులను తీసుకురావమని చెప్పాడు - ప్రతి రకం రెండు, పరిశుద్ధ జంతువులు ఏడు జతలు.", "నోవహు, అతని భార్య, ముగ్గురు కొడుకులు మరియు వారి భార్యలు ఓడలో ప్రవేశించారు. అప్పుడు అన్ని జంతువులు రెండేసి వచ్చాయి.", "అందరూ లోపల ఉన్నప్పుడు, దేవుడు స్వయంగా ఓడ తలుపును మూసాడు."] },
        hi: { title: "जहाज में", paragraphs: ["जब जहाज तैयार हो गया, भगवान ने नूह से जानवरों को लाने को कहा - हर प्रकार के दो, और शुद्ध जानवरों के सात जोड़े।", "नूह, उसकी पत्नी, उसके तीन बेटे और उनकी पत्नियां जहाज में प्रवेश किए। फिर सभी जानवर जोड़े में आए।", "जब सब अंदर थे, भगवान ने स्वयं जहाज का दरवाजा बंद कर दिया।"] }
    },
    {
        page: 24, ref: "Genesis 7:17-24", theme: "noah",
        en: { title: "The Great Flood", paragraphs: ["Then it began to rain. For forty days and forty nights, water poured from the sky and burst from the ground.", "The water rose higher and higher until even the highest mountains were covered.", "Everything that breathed on land died. Only Noah and those with him in the ark survived."] },
        te: { title: "మహా జలప్రళయం", paragraphs: ["అప్పుడు వర్షం ప్రారంభమైంది. నలభై రోజులు నలభై రాత్రులు, ఆకాశం నుండి నీరు కురిసింది, భూమి నుండి పెల్లుబికింది.", "ఎత్తైన పర్వతాలు కూడా కప్పబడే వరకు నీరు ఎక్కువ ఎక్కువ పెరిగింది.", "భూమిపై శ్వాసించే ప్రతిదీ చనిపోయింది. నోవహు మరియు ఓడలో అతనితో ఉన్నవారు మాత్రమే బతికారు."] },
        hi: { title: "महा जलप्रलय", paragraphs: ["फिर बारिश शुरू हुई। चालीस दिन और चालीस रात, आकाश से पानी बरसा और जमीन से फूट पड़ा।", "पानी इतना ऊंचा उठा कि सबसे ऊंचे पहाड़ भी डूब गए।", "जमीन पर सांस लेने वाला सब कुछ मर गया। केवल नूह और उसके साथ जहाज में रहने वाले बचे।"] }
    },
    {
        page: 25, ref: "Genesis 8:15-22", theme: "noah",
        en: { title: "The Rainbow Promise", paragraphs: ["After the flood waters dried up, God told Noah to come out of the ark with everyone.", "Noah built an altar and thanked God. God was pleased and made a promise.", "God put a rainbow in the sky and said, 'This is my promise: I will never again destroy the earth with a flood.'"] },
        te: { title: "ఇంద్రధనస్సు వాగ్దానం", paragraphs: ["జలప్రళయ నీరు ఎండిపోయిన తర్వాత, దేవుడు నోవహును అందరితో ఓడ నుండి బయటకు రావమని చెప్పాడు.", "నోవహు బలిపీఠం నిర్మించి దేవునికి కృతజ్ఞతలు చెప్పాడు. దేవుడు సంతోషించి వాగ్దానం చేసాడు.", "దేవుడు ఆకాశంలో ఇంద్రధనస్సు ఉంచి చెప్పాడు, 'ఇది నా వాగ్దానం: జలప్రళయంతో భూమిని మళ్ళీ ఎప్పుడూ నాశనం చేయను.'"] },
        hi: { title: "इंद्रधनुष वादा", paragraphs: ["बाढ़ का पानी सूखने के बाद, भगवान ने नूह को सबके साथ जहाज से बाहर आने को कहा।", "नूह ने एक वेदी बनाई और भगवान को धन्यवाद दिया। भगवान प्रसन्न हुआ और एक वादा किया।", "भगवान ने आकाश में इंद्रधनुष रखा और कहा, 'यह मेरा वादा है: मैं कभी भी जलप्रलय से पृथ्वी को नष्ट नहीं करूंगा।'"] }
    },
    // Tower of Babel (Pages 26-30)
    {
        page: 26, ref: "Genesis 11:1-2", theme: "babel",
        en: { title: "One Language", paragraphs: ["After the flood, everyone on earth spoke the same language and used the same words.", "As people moved eastward, they found a plain in the land of Shinar and settled there.", "They learned to make bricks and tar for building. They were becoming very skilled."] },
        te: { title: "ఒకే భాష", paragraphs: ["జలప్రళయం తర్వాత, భూమిపై అందరూ ఒకే భాష మాట్లాడారు మరియు ఒకే మాటలు వాడారు.", "ప్రజలు తూర్పుకు వెళ్తుండగా, షీనారు దేశంలో మైదానం కనుగొని అక్కడ స్థిరపడ్డారు.", "వారు నిర్మాణానికి ఇటుకలు మరియు తారు చేయడం నేర్చుకున్నారు. వారు చాలా నైపుణ్యం పొందుతున్నారు."] },
        hi: { title: "एक भाषा", paragraphs: ["बाढ़ के बाद, पृथ्वी पर सभी एक ही भाषा बोलते थे और एक ही शब्दों का उपयोग करते थे।", "जैसे लोग पूर्व की ओर बढ़े, उन्होंने शिनार देश में एक मैदान पाया और वहाँ बस गए।", "उन्होंने निर्माण के लिए ईंटें और राल बनाना सीखा। वे बहुत कुशल हो रहे थे।"] }
    },
    {
        page: 27, ref: "Genesis 11:3-4", theme: "babel",
        en: { title: "Pride of Man", paragraphs: ["The people said, 'Come, let us build ourselves a city with a tower that reaches to the heavens!'", "They wanted to make a great name for themselves. They did not want to spread out as God had commanded.", "This was pride - they wanted to be as great as God, just like in the Garden of Eden."] },
        te: { title: "మానవుని గర్వం", paragraphs: ["ప్రజలు చెప్పారు, 'రండి, ఆకాశాన్ని చేరే గోపురంతో మనకు ఒక నగరాన్ని నిర్మించుకుందాం!'", "వారు తమకు గొప్ప పేరు చేసుకోవాలనుకున్నారు. దేవుడు ఆజ్ఞాపించినట్లు వ్యాప్తి చెందాలనుకోలేదు.", "ఇది గర్వం - ఏదెను తోటలో వలే, వారు దేవునంత గొప్పగా ఉండాలనుకున్నారు."] },
        hi: { title: "मनुष्य का घमंड", paragraphs: ["लोगों ने कहा, 'आओ, हम अपने लिए एक शहर और एक मीनार बनाएं जो आकाश तक पहुंचे!'", "वे अपना बड़ा नाम बनाना चाहते थे। वे भगवान की आज्ञा के अनुसार फैलना नहीं चाहते थे।", "यह घमंड था - वे अदन के बाग की तरह भगवान जितने महान बनना चाहते थे।"] }
    },
    {
        page: 28, ref: "Genesis 11:5-7", theme: "babel",
        en: { title: "God Comes Down", paragraphs: ["God came down to see the city and tower that the people were building.", "God said, 'If they can do this together, nothing will be impossible for them.'", "'Come,' said God, 'let us go down and confuse their language so they cannot understand each other.'"] },
        te: { title: "దేవుడు దిగి వచ్చాడు", paragraphs: ["ప్రజలు నిర్మిస్తున్న నగరం మరియు గోపురం చూడటానికి దేవుడు దిగి వచ్చాడు.", "దేవుడు చెప్పాడు, 'వారు ఇది కలిసి చేయగలిగితే, వారికి ఏదీ అసాధ్యం కాదు.'", "'రండి,' దేవుడు చెప్పాడు, 'వారు ఒకరినొకరు అర్థం చేసుకోలేకపోయేలా వారి భాషను తికమకపరచడానికి దిగి వెళ్దాం.'"] },
        hi: { title: "भगवान नीचे आया", paragraphs: ["भगवान उस शहर और मीनार को देखने नीचे आया जो लोग बना रहे थे।", "भगवान ने कहा, 'अगर वे यह साथ मिलकर कर सकते हैं, तो उनके लिए कुछ भी असंभव नहीं होगा।'", "'आओ,' भगवान ने कहा, 'नीचे जाएं और उनकी भाषा को भ्रमित करें ताकि वे एक दूसरे को न समझ सकें।'"] }
    },
    {
        page: 29, ref: "Genesis 11:8-9", theme: "babel",
        en: { title: "Languages Confused", paragraphs: ["Suddenly, the workers could not understand each other! One spoke one language, another spoke something completely different.", "They could no longer work together. Groups who spoke the same language formed.", "The building stopped. The place was called Babel, which means 'confused.'"] },
        te: { title: "భాషలు తికమక", paragraphs: ["హఠాత్తుగా, కార్మికులు ఒకరినొకరు అర్థం చేసుకోలేకపోయారు! ఒకరు ఒక భాష మాట్లాడారు, మరొకరు పూర్తిగా భిన్నంగా మాట్లాడారు.", "వారు ఇక కలిసి పని చేయలేకపోయారు. ఒకే భాష మాట్లాడేవారు గుంపులు ఏర్పడ్డారు.", "నిర్మాణం ఆగిపోయింది. ఆ స్థలం 'తికమక' అని అర్థం వచ్చే బాబెలు అని పిలువబడింది."] },
        hi: { title: "भाषाएं भ्रमित", paragraphs: ["अचानक, कार्यकर्ता एक दूसरे को नहीं समझ पाए! एक ने एक भाषा बोली, दूसरे ने कुछ बिल्कुल अलग।", "वे अब साथ काम नहीं कर सकते थे। एक ही भाषा बोलने वालों के समूह बने।", "निर्माण रुक गया। उस जगह का नाम बाबेल पड़ा, जिसका अर्थ है 'भ्रमित'।"] }
    },
    {
        page: 30, ref: "Genesis 11:9", theme: "babel",
        en: { title: "Scattered Across Earth", paragraphs: ["From Babel, God scattered the people across the whole earth. Different nations began.", "Each group took their new language with them. This is why today we have so many languages!", "But God's purpose continued. He chose one family to bless all nations - the family of Abraham."] },
        te: { title: "భూమి అంతటా చెదరగొట్టబడ్డారు", paragraphs: ["బాబెలు నుండి, దేవుడు ప్రజలను భూమి అంతటా చెదరగొట్టాడు. వేర్వేరు దేశాలు ప్రారంభమయ్యాయి.", "ప్రతి గుంపు తమ కొత్త భాషను తమతో తీసుకెళ్ళారు. అందుకే నేడు మనకు చాలా భాషలు ఉన్నాయి!", "కానీ దేవుని ఉద్దేశం కొనసాగింది. అన్ని దేశాలను ఆశీర్వదించడానికి ఆయన ఒక కుటుంబాన్ని ఎంచుకున్నాడు - అబ్రహాము కుటుంబం."] },
        hi: { title: "पृथ्वी पर बिखरे", paragraphs: ["बाबेल से, भगवान ने लोगों को पूरी पृथ्वी पर बिखेर दिया। विभिन्न राष्ट्र शुरू हुए।", "हर समूह अपनी नई भाषा साथ ले गया। इसीलिए आज हमारे पास इतनी भाषाएं हैं!", "लेकिन भगवान का उद्देश्य जारी रहा। उसने सभी राष्ट्रों को आशीर्वाद देने के लिए एक परिवार चुना - अब्राहम का परिवार।"] }
    },
    // Abraham's Call (Pages 31-35)
    {
        page: 31, ref: "Genesis 12:1-3", theme: "abraham",
        en: { title: "God Calls Abram", paragraphs: ["In the city of Ur, there lived a man named Abram. God spoke to him with an amazing promise.", "'Leave your country and your father's house,' God said. 'Go to a land I will show you.'", "'I will make you a great nation. I will bless you. All peoples on earth will be blessed through you.'"] },
        te: { title: "దేవుడు అబ్రామును పిలిచాడు", paragraphs: ["ఊరు అనే నగరంలో అబ్రాము అనే మనిషి ఉన్నాడు. దేవుడు అద్భుతమైన వాగ్దానంతో అతనితో మాట్లాడాడు.", "'నీ దేశాన్ని, నీ తండ్రి ఇంటిని విడిచిపెట్టు,' దేవుడు చెప్పాడు. 'నేను చూపించే దేశానికి వెళ్ళు.'", "'నిన్ను గొప్ప జాతిగా చేస్తాను. నిన్ను ఆశీర్వదిస్తాను. భూమిపై అన్ని ప్రజలు నీ ద్వారా ఆశీర్వదించబడతారు.'"] },
        hi: { title: "भगवान ने अब्राम को बुलाया", paragraphs: ["ऊर शहर में अब्राम नाम का एक आदमी रहता था। भगवान ने एक अद्भुत वादे के साथ उससे बात की।", "'अपने देश और अपने पिता का घर छोड़ दे,' भगवान ने कहा। 'उस देश में जा जो मैं तुझे दिखाऊंगा।'", "'मैं तुझे एक महान राष्ट्र बनाऊंगा। मैं तुझे आशीर्वाद दूंगा। पृथ्वी के सभी लोग तेरे द्वारा आशीर्वादित होंगे।'"] }
    },
    {
        page: 32, ref: "Genesis 12:4-9", theme: "abraham",
        en: { title: "Journey to Canaan", paragraphs: ["Abram obeyed God. At 75 years old, he packed up everything and left with his wife Sarai and nephew Lot.", "They traveled to the land of Canaan. God appeared to Abram and said, 'To your descendants I will give this land.'", "Abram built an altar there to worship God. He trusted God's promise even though he had no children yet."] },
        te: { title: "కనాను ప్రయాణం", paragraphs: ["అబ్రాము దేవునికి విధేయుడయ్యాడు. 75 ఏళ్ళ వయసులో, అతను తన భార్య శారయి మరియు మేనల్లుడు లోతుతో అన్నీ సర్దుకొని బయలుదేరాడు.", "వారు కనాను దేశానికి ప్రయాణించారు. దేవుడు అబ్రాముకు కనిపించి చెప్పాడు, 'నీ సంతానానికి ఈ దేశాన్ని ఇస్తాను.'", "అబ్రాము దేవుడిని ఆరాధించడానికి అక్కడ బలిపీఠం నిర్మించాడు. అతనికి ఇంకా పిల్లలు లేకపోయినా దేవుని వాగ్దానాన్ని నమ్మాడు."] },
        hi: { title: "कनान की यात्रा", paragraphs: ["अब्राम ने भगवान की आज्ञा मानी। 75 साल की उम्र में, उसने सब कुछ पैक किया और अपनी पत्नी सारय और भतीजे लूत के साथ निकल पड़ा।", "वे कनान देश की यात्रा पर गए। भगवान अब्राम को दिखाई दिया और कहा, 'तेरी संतान को मैं यह देश दूंगा।'", "अब्राम ने वहाँ भगवान की पूजा के लिए एक वेदी बनाई। उसने भगवान के वादे पर भरोसा किया भले ही उसके अभी तक कोई बच्चे नहीं थे।"] }
    },
    {
        page: 33, ref: "Genesis 13:5-18", theme: "abraham",
        en: { title: "Abram and Lot Separate", paragraphs: ["Both Abram and Lot became very wealthy with flocks and herds. The land couldn't support them both together.", "Abram kindly said to Lot, 'Let's not quarrel. You choose which land you want, and I'll take the other.'", "Lot chose the beautiful Jordan valley. Abram stayed in Canaan. God promised him all the land as far as he could see."] },
        te: { title: "అబ్రాము లోతు వేరుపడ్డారు", paragraphs: ["అబ్రాము లోతు ఇద్దరూ మందలు పశువులతో చాలా ధనవంతులయ్యారు. భూమి వారిద్దరినీ కలిసి భరించలేకపోయింది.", "అబ్రాము లోతుతో దయగా చెప్పాడు, 'మనం గొడవ పడవద్దు. నీకు కావలసిన భూమి ఎంచుకో, నేను మరొకటి తీసుకుంటా.'", "లోతు అందమైన యొర్దాను లోయను ఎంచుకున్నాడు. అబ్రాము కనానులో ఉన్నాడు. దేవుడు అతను చూడగలిగినంత వరకు అన్ని భూమిని వాగ్దానం చేసాడు."] },
        hi: { title: "अब्राम और लूत अलग हुए", paragraphs: ["अब्राम और लूत दोनों भेड़-बकरियों और पशुओं के साथ बहुत धनी हो गए। जमीन उन दोनों को साथ नहीं रख सकती थी।", "अब्राम ने लूत से कृपापूर्वक कहा, 'हम झगड़ा न करें। तू चुन ले कौन सी जमीन चाहिए, मैं दूसरी ले लूंगा।'", "लूत ने सुंदर यर्दन घाटी चुनी। अब्राम कनान में रहा। भगवान ने उसे जहाँ तक वह देख सकता था वह सारी जमीन देने का वादा किया।"] }
    },
    {
        page: 34, ref: "Genesis 15:1-6", theme: "abraham",
        en: { title: "Counting the Stars", paragraphs: ["Years passed, but Abram still had no children. He wondered how God's promise could come true.", "God took Abram outside at night. 'Look at the stars,' God said. 'Count them if you can.'", "'That's how many descendants you will have!' Abram believed God, and God counted it as righteousness."] },
        te: { title: "నక్షత్రాలు లెక్కించడం", paragraphs: ["సంవత్సరాలు గడిచాయి, కానీ అబ్రాముకు ఇంకా పిల్లలు లేరు. దేవుని వాగ్దానం ఎలా నిజం అవుతుందో అతను ఆశ్చర్యపోయాడు.", "దేవుడు రాత్రి అబ్రామును బయటకు తీసుకెళ్ళాడు. 'నక్షత్రాలను చూడు,' దేవుడు చెప్పాడు. 'నీకు చేతనైతే లెక్కించు.'", "'నీకు అంత మంది సంతానం ఉంటారు!' అబ్రాము దేవుడిని నమ్మాడు, దేవుడు దాన్ని నీతిగా లెక్కించాడు."] },
        hi: { title: "तारों को गिनना", paragraphs: ["साल बीत गए, लेकिन अब्राम के अभी भी कोई बच्चे नहीं थे। उसे आश्चर्य था कि भगवान का वादा कैसे सच होगा।", "भगवान ने रात को अब्राम को बाहर ले गया। 'तारों को देख,' भगवान ने कहा। 'अगर गिन सके तो गिन।'", "'तेरी संतान इतनी होगी!' अब्राम ने भगवान पर विश्वास किया, और भगवान ने इसे धार्मिकता गिना।"] }
    },
    {
        page: 35, ref: "Genesis 17:1-8", theme: "abraham",
        en: { title: "A New Name", paragraphs: ["When Abram was 99 years old, God appeared again. 'I am God Almighty. Walk before me faithfully.'", "God changed Abram's name to Abraham, meaning 'father of many nations.' His wife Sarai became Sarah.", "God promised that kings would come from Abraham's family, and the land of Canaan would belong to his descendants forever."] },
        te: { title: "కొత్త పేరు", paragraphs: ["అబ్రాము 99 ఏళ్ళ వయసులో, దేవుడు మళ్ళీ కనిపించాడు. 'నేను సర్వశక్తిమంతుడైన దేవుడిని. నా ముందు నమ్మకంగా నడువు.'", "దేవుడు అబ్రాము పేరును 'అనేక జాతుల తండ్రి' అని అర్థం వచ్చే అబ్రహాముగా మార్చాడు. అతని భార్య శారయి శారాగా మారింది.", "అబ్రహాము కుటుంబం నుండి రాజులు వస్తారని, కనాను దేశం అతని సంతానానికి ఎప్పటికీ చెందుతుందని దేవుడు వాగ్దానం చేసాడు."] },
        hi: { title: "नया नाम", paragraphs: ["जब अब्राम 99 साल का था, भगवान फिर प्रकट हुआ। 'मैं सर्वशक्तिमान भगवान हूँ। मेरे सामने विश्वासपूर्वक चल।'", "भगवान ने अब्राम का नाम बदलकर अब्राहम रखा, जिसका अर्थ है 'बहुत राष्ट्रों का पिता।' उसकी पत्नी सारय सारा बन गई।", "भगवान ने वादा किया कि अब्राहम के परिवार से राजा आएंगे, और कनान देश उसकी संतान का हमेशा के लिए होगा।"] }
    },
    // Abraham & Sarah Stories (Pages 36-40)
    {
        page: 36, ref: "Genesis 18:1-15", theme: "sarah",
        en: { title: "Three Visitors", paragraphs: ["One hot day, Abraham saw three men near his tent. He hurried to welcome them and offer food.", "One visitor was the Lord Himself! He said, 'This time next year, Sarah will have a son.'", "Sarah laughed to herself - she was 90 years old! The Lord asked, 'Is anything too hard for God?'"] },
        te: { title: "ముగ్గురు సందర్శకులు", paragraphs: ["ఒక వేడి రోజున, అబ్రహాము తన గుడారం దగ్గర ముగ్గురు మనుషులను చూసాడు. అతను వారిని స్వాగతించడానికి మరియు ఆహారం అందించడానికి తొందరపడ్డాడు.", "ఒక సందర్శకుడు ప్రభువు స్వయంగా! ఆయన చెప్పాడు, 'వచ్చే సంవత్సరం ఈ సమయానికి, శారాకు కొడుకు పుట్టాడు.'", "శారా తనలో తాను నవ్వింది - ఆమె 90 ఏళ్ళు! ప్రభువు అడిగాడు, 'దేవునికి ఏదైనా కష్టమా?'"] },
        hi: { title: "तीन आगंतुक", paragraphs: ["एक गर्म दिन, अब्राहम ने अपने तंबू के पास तीन आदमियों को देखा। वह उनका स्वागत करने और भोजन देने के लिए दौड़ पड़ा।", "एक आगंतुक स्वयं प्रभु थे! उन्होंने कहा, 'अगले साल इसी समय, सारा का एक बेटा होगा।'", "सारा मन ही मन हँसी - वह 90 साल की थी! प्रभु ने पूछा, 'क्या भगवान के लिए कुछ भी कठिन है?'"] }
    },
    {
        page: 37, ref: "Genesis 21:1-7", theme: "sarah",
        en: { title: "Isaac is Born", paragraphs: ["Just as God promised, Sarah became pregnant and gave birth to a son! Abraham was 100 years old.", "They named him Isaac, which means 'laughter.' Sarah said, 'God has brought me laughter!'", "Everyone who heard about it laughed with joy. God always keeps His promises, even when they seem impossible."] },
        te: { title: "ఇస్సాకు పుట్టాడు", paragraphs: ["దేవుడు వాగ్దానం చేసినట్లే, శారా గర్భవతి అయి కొడుకును కన్నది! అబ్రహాముకు 100 ఏళ్ళు.", "వారు అతనికి 'నవ్వు' అని అర్థం వచ్చే ఇస్సాకు అని పేరు పెట్టారు. శారా చెప్పింది, 'దేవుడు నాకు నవ్వు తెచ్చాడు!'", "దాని గురించి విన్న ప్రతి ఒక్కరూ ఆనందంతో నవ్వారు. దేవుడు అసాధ్యమని అనిపించినప్పటికీ ఎల్లప్పుడూ తన వాగ్దానాలు నిలబెట్టుకుంటాడు."] },
        hi: { title: "इसहाक का जन्म", paragraphs: ["जैसा भगवान ने वादा किया था, सारा गर्भवती हुई और उसने एक बेटे को जन्म दिया! अब्राहम 100 साल का था।", "उन्होंने उसका नाम इसहाक रखा, जिसका अर्थ है 'हँसी।' सारा ने कहा, 'भगवान ने मुझे हँसी दी है!'", "जिसने भी सुना वह खुशी से हँसा। भगवान हमेशा अपने वादे निभाता है, भले ही वे असंभव लगें।"] }
    },
    {
        page: 38, ref: "Genesis 22:1-8", theme: "abraham",
        en: { title: "The Greatest Test", paragraphs: ["God decided to test Abraham's faith. 'Take your son Isaac to Mount Moriah and offer him as a sacrifice.'", "Abraham's heart was breaking, but he trusted God. Early the next morning, he set out with Isaac.", "Isaac asked, 'Father, we have fire and wood, but where is the lamb?' Abraham replied, 'God will provide.'"] },
        te: { title: "గొప్ప పరీక్ష", paragraphs: ["దేవుడు అబ్రహాము విశ్వాసాన్ని పరీక్షించాలని నిర్ణయించుకున్నాడు. 'నీ కొడుకు ఇస్సాకును మోరియా పర్వతానికి తీసుకెళ్ళి బలిగా అర్పించు.'", "అబ్రహాము హృదయం విరిగిపోతోంది, కానీ అతను దేవుడిని నమ్మాడు. మరుసటి రోజు పొద్దున్నే, అతను ఇస్సాకుతో బయలుదేరాడు.", "ఇస్సాకు అడిగాడు, 'తండ్రీ, మనకు నిప్పు మరియు కట్టెలు ఉన్నాయి, కానీ గొర్రెపిల్ల ఎక్కడ?' అబ్రహాము జవాబిచ్చాడు, 'దేవుడు సమకూరుస్తాడు.'"] },
        hi: { title: "सबसे बड़ी परीक्षा", paragraphs: ["भगवान ने अब्राहम की विश्वास की परीक्षा लेने का फैसला किया। 'अपने बेटे इसहाक को मोरिय्याह पर्वत पर ले जा और उसे बलि के रूप में चढ़ा।'", "अब्राहम का दिल टूट रहा था, लेकिन उसने भगवान पर भरोसा किया। अगली सुबह जल्दी, वह इसहाक के साथ निकल पड़ा।", "इसहाक ने पूछा, 'पिता, हमारे पास आग और लकड़ी है, लेकिन मेमना कहाँ है?' अब्राहम ने जवाब दिया, 'भगवान प्रदान करेगा।'"] }
    },
    {
        page: 39, ref: "Genesis 22:9-14", theme: "abraham",
        en: { title: "God Provides", paragraphs: ["Abraham built an altar and laid Isaac on it. Just as he raised his knife, an angel called out, 'Abraham! Stop!'", "'Now I know you fear God, because you did not withhold your only son from me.'", "Abraham looked up and saw a ram caught in a bush. He sacrificed it instead. He named that place 'The Lord Will Provide.'"] },
        te: { title: "దేవుడు సమకూర్చాడు", paragraphs: ["అబ్రహాము బలిపీఠం నిర్మించి ఇస్సాకును దానిపై ఉంచాడు. అతను కత్తి ఎత్తినప్పుడు, దేవదూత పిలిచాడు, 'అబ్రహామా! ఆగు!'", "'నీవు నా నుండి నీ ఏకైక కొడుకును తప్పించుకోలేదు కాబట్టి, నీవు దేవునికి భయపడతావని ఇప్పుడు నాకు తెలుసు.'", "అబ్రహాము పైకి చూసి పొదలో చిక్కుకున్న పొట్టేలును చూసాడు. అతను దాని బదులుగా బలి ఇచ్చాడు. అతను ఆ స్థలానికి 'ప్రభువు సమకూర్చాడు' అని పేరు పెట్టాడు."] },
        hi: { title: "भगवान ने प्रदान किया", paragraphs: ["अब्राहम ने वेदी बनाई और इसहाक को उस पर रखा। जैसे ही उसने चाकू उठाया, एक स्वर्गदूत ने पुकारा, 'अब्राहम! रुक!'", "'अब मुझे पता है कि तू भगवान से डरता है, क्योंकि तूने अपने इकलौते बेटे को मुझसे नहीं रोका।'", "अब्राहम ने ऊपर देखा और एक मेढ़ा झाड़ी में फंसा देखा। उसने उसके बजाय उसे बलि दी। उसने उस जगह का नाम रखा 'प्रभु प्रदान करेगा।'"] }
    },
    {
        page: 40, ref: "Genesis 22:15-18", theme: "abraham",
        en: { title: "God's Blessing", paragraphs: ["God spoke again to Abraham: 'Because you obeyed me, I will surely bless you.'", "'Your descendants will be as numerous as the stars in the sky and the sand on the seashore.'", "'Through your offspring, all nations on earth will be blessed.' This promise would one day be fulfilled through Jesus!"] },
        te: { title: "దేవుని ఆశీర్వాదం", paragraphs: ["దేవుడు మళ్ళీ అబ్రహాముతో మాట్లాడాడు: 'నీవు నాకు విధేయుడయినందున, నిన్ను తప్పకుండా ఆశీర్వదిస్తాను.'", "'నీ సంతానం ఆకాశంలో నక్షత్రాలంత, సముద్ర తీరంలో ఇసుకంత అసంఖ్యాకంగా ఉంటారు.'", "'నీ సంతానం ద్వారా, భూమిపై అన్ని దేశాలు ఆశీర్వదించబడతాయి.' ఈ వాగ్దానం ఒక రోజు యేసు ద్వారా నెరవేరుతుంది!"] },
        hi: { title: "भगवान का आशीर्वाद", paragraphs: ["भगवान ने फिर अब्राहम से कहा: 'क्योंकि तूने मेरी आज्ञा मानी, मैं तुझे अवश्य आशीर्वाद दूंगा।'", "'तेरी संतान आकाश के तारों और समुद्र तट की रेत जितनी अनगिनत होगी।'", "'तेरी संतान के द्वारा, पृथ्वी के सभी राष्ट्र आशीर्वादित होंगे।' यह वादा एक दिन यीशु के माध्यम से पूरा होगा!"] }
    },
    // Isaac & Rebekah Stories (Pages 41-45)
    {
        page: 41, ref: "Genesis 24:1-14", theme: "isaac",
        en: { title: "A Wife for Isaac", paragraphs: ["Abraham was now very old. He sent his servant to find a wife for Isaac from his homeland.", "The servant prayed, 'Lord, let the right girl offer water to me and my camels.'", "Before he finished praying, a beautiful young woman named Rebekah came to the well!"] },
        te: { title: "ఇస్సాకు కోసం భార్య", paragraphs: ["అబ్రహాము ఇప్పుడు చాలా వృద్ధుడు. అతను తన స్వదేశం నుండి ఇస్సాకుకు భార్యను కనుగొనడానికి తన సేవకుడిని పంపాడు.", "సేవకుడు ప్రార్థించాడు, 'ప్రభూ, సరైన అమ్మాయి నాకు మరియు నా ఒంటెలకు నీరు అందించనీ.'", "అతను ప్రార్థన ముగించకముందే, రిబ్కా అనే అందమైన యువతి బావికి వచ్చింది!"] },
        hi: { title: "इसहाक के लिए पत्नी", paragraphs: ["अब्राहम अब बहुत बूढ़ा था। उसने अपने सेवक को अपनी मातृभूमि से इसहाक के लिए पत्नी खोजने भेजा।", "सेवक ने प्रार्थना की, 'प्रभु, सही लड़की मुझे और मेरे ऊंटों को पानी पिलाए।'", "प्रार्थना खत्म होने से पहले, रिबका नाम की एक सुंदर युवती कुएं पर आई!"] }
    },
    {
        page: 42, ref: "Genesis 24:15-27", theme: "isaac",
        en: { title: "Rebekah's Kindness", paragraphs: ["Rebekah offered the servant a drink, then said, 'I'll draw water for your camels too!'", "She worked hard to water all ten camels. The servant knew God had answered his prayer.", "He gave Rebekah beautiful gold jewelry and asked about her family."] },
        te: { title: "రిబ్కా దయ", paragraphs: ["రిబ్కా సేవకుడికి నీరు అందించింది, అప్పుడు చెప్పింది, 'మీ ఒంటెలకు కూడా నీరు తీస్తాను!'", "పది ఒంటెలకు నీరు ఇవ్వడానికి ఆమె కష్టపడింది. దేవుడు తన ప్రార్థనకు జవాబిచ్చాడని సేవకుడికి తెలుసు.", "అతను రిబ్కాకు అందమైన బంగారు ఆభరణాలు ఇచ్చి ఆమె కుటుంబం గురించి అడిగాడు."] },
        hi: { title: "रिबका की दयालुता", paragraphs: ["रिबका ने सेवक को पानी पिलाया, फिर कहा, 'मैं तुम्हारे ऊंटों के लिए भी पानी निकालूंगी!'", "उसने सभी दस ऊंटों को पानी पिलाने के लिए कड़ी मेहनत की। सेवक जान गया कि भगवान ने उसकी प्रार्थना सुन ली।", "उसने रिबका को सुंदर सोने के गहने दिए और उसके परिवार के बारे में पूछा।"] }
    },
    {
        page: 43, ref: "Genesis 24:50-67", theme: "isaac",
        en: { title: "Isaac and Rebekah Meet", paragraphs: ["Rebekah agreed to go with the servant to marry Isaac. Her family blessed her.", "When they arrived, Isaac was in the field. He saw the camels coming.", "Isaac and Rebekah met and fell in love. They were married, and Isaac was comforted after his mother's death."] },
        te: { title: "ఇస్సాకు రిబ్కా కలిసారు", paragraphs: ["రిబ్కా ఇస్సాకును పెళ్లి చేసుకోవడానికి సేవకుడితో వెళ్లడానికి అంగీకరించింది. ఆమె కుటుంబం ఆమెను ఆశీర్వదించింది.", "వారు చేరుకున్నప్పుడు, ఇస్సాకు పొలంలో ఉన్నాడు. ఒంటెలు వస్తున్నట్లు అతను చూసాడు.", "ఇస్సాకు రిబ్కాలు కలిసారు మరియు ప్రేమలో పడ్డారు. వారు పెళ్లి చేసుకున్నారు, తన తల్లి మరణం తర్వాత ఇస్సాకు ఓదార్పు పొందాడు."] },
        hi: { title: "इसहाक और रिबका मिले", paragraphs: ["रिबका इसहाक से शादी करने के लिए सेवक के साथ जाने को राजी हो गई। उसके परिवार ने उसे आशीर्वाद दिया।", "जब वे पहुंचे, इसहाक खेत में था। उसने ऊंटों को आते देखा।", "इसहाक और रिबका मिले और प्यार हो गया। उनकी शादी हो गई, और अपनी माँ की मृत्यु के बाद इसहाक को सांत्वना मिली।"] }
    },
    {
        page: 44, ref: "Genesis 25:19-26", theme: "isaac",
        en: { title: "Twin Brothers", paragraphs: ["Rebekah was unable to have children. Isaac prayed for her, and God answered.", "Rebekah became pregnant with twins! They struggled inside her. God told her the older would serve the younger.", "The first baby was red and hairy - they named him Esau. The second held Esau's heel - they named him Jacob."] },
        te: { title: "కవల సోదరులు", paragraphs: ["రిబ్కాకు పిల్లలు కలగలేదు. ఇస్సాకు ఆమె కోసం ప్రార్థించాడు, దేవుడు జవాబిచ్చాడు.", "రిబ్కా కవలలతో గర్భవతి అయింది! వారు ఆమె లోపల పోరాడారు. పెద్దవాడు చిన్నవాడికి సేవ చేస్తాడని దేవుడు ఆమెకు చెప్పాడు.", "మొదటి బిడ్డ ఎరుపు మరియు రోమాలతో ఉన్నాడు - వారు అతనికి ఏశావు అని పేరు పెట్టారు. రెండవ బిడ్డ ఏశావు మడమను పట్టుకున్నాడు - వారు అతనికి యాకోబు అని పేరు పెట్టారు."] },
        hi: { title: "जुड़वां भाई", paragraphs: ["रिबका के बच्चे नहीं हो पा रहे थे। इसहाक ने उसके लिए प्रार्थना की, और भगवान ने सुनी।", "रिबका जुड़वां बच्चों से गर्भवती हुई! वे उसके अंदर संघर्ष कर रहे थे। भगवान ने उसे बताया कि बड़ा छोटे की सेवा करेगा।", "पहला बच्चा लाल और बालों वाला था - उन्होंने उसका नाम एसाव रखा। दूसरे ने एसाव की एड़ी पकड़ी थी - उन्होंने उसका नाम याकूब रखा।"] }
    },
    {
        page: 45, ref: "Genesis 25:29-34", theme: "isaac",
        en: { title: "The Birthright Sold", paragraphs: ["One day, Esau came home from hunting very hungry. Jacob was cooking stew.", "Esau said, 'Give me some of that stew!' Jacob replied, 'First sell me your birthright.'", "Esau foolishly agreed. He traded his special rights as firstborn for one bowl of stew!"] },
        te: { title: "జ్యేష్ఠత్వం అమ్మబడింది", paragraphs: ["ఒక రోజు, ఏశావు వేటాడి చాలా ఆకలితో ఇంటికి వచ్చాడు. యాకోబు పులుసు వండుతున్నాడు.", "ఏశావు చెప్పాడు, 'ఆ పులుసులో కొంచెం నాకు ఇవ్వు!' యాకోబు జవాబిచ్చాడు, 'ముందు నీ జ్యేష్ఠత్వం నాకు అమ్ము.'", "ఏశావు మూర్ఖంగా అంగీకరించాడు. అతను ఒక గిన్నె పులుసు కోసం పెద్దవాడిగా తన ప్రత్యేక హక్కులను వదులుకున్నాడు!"] },
        hi: { title: "जन्मसिद्ध अधिकार बेचा", paragraphs: ["एक दिन, एसाव शिकार से बहुत भूखा घर आया। याकूब स्टू बना रहा था।", "एसाव ने कहा, 'मुझे वह स्टू दे!' याकूब ने जवाब दिया, 'पहले मुझे अपना जन्मसिद्ध अधिकार बेच दे।'", "एसाव ने मूर्खता से सहमत हो गया। उसने एक कटोरी स्टू के लिए पहलौठे के अपने विशेष अधिकार बेच दिए!"] }
    },
    // Jacob's Journey (Pages 46-50)
    {
        page: 46, ref: "Genesis 27:1-29", theme: "jacob",
        en: { title: "Jacob's Deception", paragraphs: ["When Isaac was old and blind, he wanted to bless Esau before he died.", "But Rebekah helped Jacob trick Isaac. Jacob dressed in Esau's clothes and wore goat skin on his arms.", "Isaac was fooled and gave Jacob the blessing meant for Esau. This would cause many problems."] },
        te: { title: "యాకోబు మోసం", paragraphs: ["ఇస్సాకు వృద్ధుడు మరియు అంధుడు అయినప్పుడు, చనిపోయే ముందు ఏశావును ఆశీర్వదించాలనుకున్నాడు.", "కానీ రిబ్కా యాకోబుకు ఇస్సాకును మోసం చేయడానికి సహాయం చేసింది. యాకోబు ఏశావు బట్టలు వేసుకొని చేతులపై మేక చర్మం ధరించాడు.", "ఇస్సాకు మోసపోయి ఏశావు కోసం ఉద్దేశించిన ఆశీర్వాదం యాకోబుకు ఇచ్చాడు. ఇది చాలా సమస్యలకు కారణమవుతుంది."] },
        hi: { title: "याकूब का धोखा", paragraphs: ["जब इसहाक बूढ़ा और अंधा था, वह मरने से पहले एसाव को आशीर्वाद देना चाहता था।", "लेकिन रिबका ने याकूब को इसहाक को धोखा देने में मदद की। याकूब ने एसाव के कपड़े पहने और अपनी बाहों पर बकरी की खाल लगाई।", "इसहाक धोखा खा गया और एसाव के लिए तय आशीर्वाद याकूब को दे दिया। इससे कई समस्याएं होंगी।"] }
    },
    {
        page: 47, ref: "Genesis 28:10-15", theme: "jacob",
        en: { title: "Jacob's Ladder", paragraphs: ["Esau was furious and wanted to kill Jacob. So Jacob fled to his uncle Laban's house.", "One night, using a stone as a pillow, Jacob had a dream. He saw a stairway to heaven with angels going up and down!", "God stood at the top and said, 'I am with you. I will bless you and bring you back to this land.'"] },
        te: { title: "యాకోబు నిచ్చెన", paragraphs: ["ఏశావు చాలా కోపంగా ఉన్నాడు మరియు యాకోబును చంపాలనుకున్నాడు. అందుకే యాకోబు తన మేనమామ లాబాను ఇంటికి పారిపోయాడు.", "ఒక రాత్రి, రాయిని దిండుగా ఉపయోగించి, యాకోబు కల కన్నాడు. దేవదూతలు పైకి క్రిందికి వెళ్తూ ఆకాశానికి మెట్లు చూసాడు!", "దేవుడు పైన నిలబడి చెప్పాడు, 'నేను నీతో ఉన్నాను. నిన్ను ఆశీర్వదిస్తాను, ఈ దేశానికి తిరిగి తీసుకువస్తాను.'"] },
        hi: { title: "याकूब की सीढ़ी", paragraphs: ["एसाव बहुत गुस्सा था और याकूब को मारना चाहता था। इसलिए याकूब अपने मामा लाबान के घर भाग गया।", "एक रात, पत्थर को तकिया बनाकर, याकूब ने सपना देखा। उसने स्वर्ग तक जाती सीढ़ी देखी जिस पर स्वर्गदूत ऊपर-नीचे जा रहे थे!", "भगवान ऊपर खड़ा था और बोला, 'मैं तेरे साथ हूँ। मैं तुझे आशीर्वाद दूंगा और इस देश में वापस लाऊंगा।'"] }
    },
    {
        page: 48, ref: "Genesis 29:16-30", theme: "jacob",
        en: { title: "Rachel and Leah", paragraphs: ["Jacob arrived at Laban's house and fell in love with his daughter Rachel.", "He agreed to work seven years to marry her. But Laban tricked him and gave him Leah instead!", "Jacob had to work seven more years for Rachel. Now he knew how it felt to be deceived."] },
        te: { title: "రాహేలు మరియు లేయా", paragraphs: ["యాకోబు లాబాను ఇంటికి చేరుకొని అతని కుమార్తె రాహేలును ప్రేమించాడు.", "ఆమెను పెళ్లి చేసుకోవడానికి ఏడు సంవత్సరాలు పని చేయడానికి అంగీకరించాడు. కానీ లాబాను అతన్ని మోసం చేసి లేయాను ఇచ్చాడు!", "రాహేలు కోసం యాకోబు మరో ఏడు సంవత్సరాలు పని చేయాల్సి వచ్చింది. ఇప్పుడు మోసం ఎలా ఉంటుందో అతనికి తెలిసింది."] },
        hi: { title: "राहेल और लिआ", paragraphs: ["याकूब लाबान के घर पहुंचा और उसकी बेटी राहेल से प्यार हो गया।", "उसने राहेल से शादी करने के लिए सात साल काम करने का वादा किया। लेकिन लाबान ने उसे धोखा दिया और इसके बजाय लिआ दे दी!", "याकूब को राहेल के लिए सात और साल काम करना पड़ा। अब उसे पता चला कि धोखा खाना कैसा लगता है।"] }
    },
    {
        page: 49, ref: "Genesis 32:22-30", theme: "jacob",
        en: { title: "Wrestling with God", paragraphs: ["After twenty years, Jacob was returning home. He was afraid to face Esau.", "That night, a man wrestled with Jacob until dawn. Jacob refused to let go until he was blessed.", "The man changed Jacob's name to Israel, meaning 'he struggles with God.' Jacob realized he had wrestled with God Himself!"] },
        te: { title: "దేవునితో పోరాటం", paragraphs: ["ఇరవై సంవత్సరాల తర్వాత, యాకోబు ఇంటికి తిరిగి వస్తున్నాడు. ఏశావును ఎదుర్కోవడానికి భయపడ్డాడు.", "ఆ రాత్రి, ఒక మనిషి తెల్లవారు వరకు యాకోబుతో పోరాడాడు. ఆశీర్వాదం పొందే వరకు యాకోబు వదలలేదు.", "ఆ మనిషి యాకోబు పేరును 'దేవునితో పోరాడతాడు' అని అర్థం వచ్చే ఇశ్రాయేలుగా మార్చాడు. దేవునితోనే పోరాడానని యాకోబు గ్రహించాడు!"] },
        hi: { title: "भगवान से कुश्ती", paragraphs: ["बीस साल बाद, याकूब घर लौट रहा था। वह एसाव का सामना करने से डर रहा था।", "उस रात, एक आदमी ने सुबह तक याकूब से कुश्ती की। याकूब ने आशीर्वाद मिलने तक उसे नहीं छोड़ा।", "उस आदमी ने याकूब का नाम इस्राएल रख दिया, जिसका अर्थ है 'वह भगवान से लड़ता है।' याकूब को पता चला कि उसने स्वयं भगवान से कुश्ती की थी!"] }
    },
    {
        page: 50, ref: "Genesis 33:1-11", theme: "jacob",
        en: { title: "Brothers Reunited", paragraphs: ["The next day, Jacob saw Esau coming with 400 men. He bowed down seven times as he approached.", "But Esau ran to Jacob and hugged him! He had forgiven his brother. They both wept with joy.", "Jacob's family became the twelve tribes of Israel. God's promise to Abraham was being fulfilled through them."] },
        te: { title: "సోదరులు తిరిగి కలిసారు", paragraphs: ["మరుసటి రోజు, యాకోబు 400 మంది మనుషులతో ఏశావు వస్తున్నట్లు చూసాడు. అతను సమీపించేటప్పుడు ఏడు సార్లు సాగిలపడ్డాడు.", "కానీ ఏశావు యాకోబు వద్దకు పరిగెత్తి అతన్ని కౌగిలించుకున్నాడు! అతను తన సోదరుడిని క్షమించాడు. ఇద్దరూ ఆనందంతో ఏడ్చారు.", "యాకోబు కుటుంబం ఇశ్రాయేలు పన్నెండు గోత్రాలు అయింది. వారి ద్వారా అబ్రహాముకు దేవుని వాగ్దానం నెరవేరుతోంది."] },
        hi: { title: "भाई फिर मिले", paragraphs: ["अगले दिन, याकूब ने एसाव को 400 आदमियों के साथ आते देखा। वह पास आते हुए सात बार झुका।", "लेकिन एसाव याकूब की ओर दौड़ा और उसे गले लगा लिया! उसने अपने भाई को माफ कर दिया था। दोनों खुशी से रोए।", "याकूब का परिवार इस्राएल के बारह गोत्र बना। अब्राहम से भगवान का वादा उनके द्वारा पूरा हो रहा था।"] }
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
        serpent: 'from-green-700 to-emerald-900', fall: 'from-red-700 to-rose-900',
        cain: 'from-red-800 to-red-950', noah: 'from-blue-600 to-cyan-800',
        babel: 'from-amber-600 to-orange-800', abraham: 'from-amber-400 to-yellow-600',
        sarah: 'from-pink-400 to-rose-600', isaac: 'from-teal-400 to-cyan-600',
        jacob: 'from-violet-500 to-purple-700'
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
        fall: <div className="flex gap-3"><Apple size={48} className="text-red-400" /><Sword size={48} className="text-orange-300" /></div>,
        cain: <div className="flex flex-col items-center"><AlertTriangle size={48} className="text-red-300" /><span className="text-xs text-white/80">Cain & Abel</span></div>,
        noah: <div className="flex flex-col items-center"><Cloud size={48} className="text-white" /><span className="text-xs text-white/80">Noah's Ark</span></div>,
        babel: <div className="flex flex-col items-center"><TreeDeciduous size={48} className="text-amber-200" /><span className="text-xs text-white/80">Tower of Babel</span></div>,
        abraham: <div className="flex flex-col items-center"><Sun size={48} className="text-yellow-200" /><span className="text-xs text-white/80">Abraham</span></div>,
        sarah: <div className="flex gap-3"><Users size={48} className="text-white" /><Heart size={32} className="text-pink-200" /></div>,
        isaac: <div className="flex flex-col items-center"><Moon size={48} className="text-cyan-200" /><span className="text-xs text-white/80">Isaac</span></div>,
        jacob: <div className="flex flex-col items-center"><Users size={48} className="text-purple-200" /><span className="text-xs text-white/80">Jacob</span></div>
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
