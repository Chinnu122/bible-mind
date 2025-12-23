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
type Language = 'en' | 'te' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ko' | 'ta' | 'ml';

const languages: { id: Language; name: string; native: string; flag: string }[] = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { id: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { id: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { id: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { id: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { id: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
    { id: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
    { id: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
];

// Translations for titles (first 10 pages as example, rest fallback to English)
const translations: Record<Language, Record<number, { title: string; paragraphs: string[] }>> = {
    en: {}, // English is the default in genesisStories
    te: {
        1: { title: "ఆరంభంలో", paragraphs: ["ప్రపంచం ప్రారంభమయ్యే ముందు, భూమి, ఆకాశం, సముద్రం లేదు. అంతా చీకటిగా, ఖాళీగా ఉంది. మీకు తెలిసిన అత్యంత నిశ్శబ్దమైన రాత్రి కంటే నిశ్శబ్దంగా ఉంది.", "కానీ దేవుడు అక్కడ ఉన్నాడు. దేవుడు అందమైనది తయారు చేయడానికి అద్భుతమైన ప్రణాళిక కలిగి ఉన్నాడు!", "దేవుడు 'వెలుగు కలుగును గాక!' అని చెప్పాడు. అకస్మాత్తుగా—ఫ్లాష్!—ప్రకాశవంతమైన, అందమైన వెలుగు కనిపించింది. దేవుడు వెలుగును 'పగలు' అని, చీకటిని 'రాత్రి' అని పిలిచాడు. అది మొదటి రోజు."] },
        2: { title: "ఆకాశం మరియు నీరు", paragraphs: ["రెండవ రోజున, ప్రపంచం ఇంకా నీటితో కప్పబడి ఉంది. కాబట్టి దేవుడు మళ్ళీ మాట్లాడాడు.", "అతను నీటిని వేరు చేయడానికి పెద్ద, నీలం స్థలం చేసాడు. కొంత నీటిని పైకి మేఘాలు చేయడానికి నెట్టాడు, కొన్ని నీటిని సముద్రాల కోసం క్రింద ఉంచాడు.", "అతను ఆ స్థలాన్ని 'ఆకాశం' అని పిలిచాడు. ఇప్పుడు గాలి వీచడానికి మరియు మేఘాలు తేలడానికి స్థలం ఉంది!"] },
        3: { title: "భూమి మరియు మొక్కలు", paragraphs: ["మూడవ రోజున, దేవుడు క్రింద ఉన్న నీటికి ఒకచోట చేరమని చెప్పాడు. సముద్రం నుండి పొడి నేల బయటకు వచ్చింది! అతను పొడి నేలను 'భూమి' అని, నీటిని 'సముద్రాలు' అని పిలిచాడు.", "అప్పుడు దేవుడు 'భూమి మొక్కలు పెరగనీ!' అని చెప్పాడు.", "అకస్మాత్తుగా, గడ్డి కొండలను ఆకుపచ్చగా మార్చింది. మట్టి నుండి పొడవైన చెట్లు పెరిగాయి, ప్రతిచోటా రంగురంగుల పువ్వులు విరిసాయి. ప్రపంచం తోటలా కనిపించడం మొదలైంది."] },
    },
    hi: {
        1: { title: "आदि में", paragraphs: ["दुनिया शुरू होने से पहले, कोई पृथ्वी नहीं थी, कोई आकाश नहीं था, और कोई समुद्र नहीं था। सब कुछ अंधेरा और खाली था। यह आपकी जानी हुई सबसे शांत रात से भी ज़्यादा शांत था।", "लेकिन भगवान वहाँ थे। और भगवान के पास कुछ सुंदर बनाने की अद्भुत योजना थी!", "भगवान ने कहा, 'प्रकाश हो!' और अचानक—फ्लैश!—उज्ज्वल, सुंदर प्रकाश प्रकट हुआ। भगवान ने प्रकाश को 'दिन' और अंधकार को 'रात' कहा। यह पहला दिन था।"] },
        2: { title: "आकाश और जल", paragraphs: ["दूसरे दिन, दुनिया अभी भी पानी से ढकी हुई थी। इसलिए भगवान ने फिर से बात की।", "उसने पानी को अलग करने के लिए एक बड़ा, नीला स्थान बनाया। उसने कुछ पानी को ऊपर धकेल कर बादल बनाए, और कुछ पानी को समुद्रों के लिए नीचे रखा।", "उसने उस स्थान को 'आकाश' कहा। अब हवा चलने और बादलों के तैरने के लिए जगह थी!"] },
    },
    es: {
        1: { title: "En el Principio", paragraphs: ["Antes de que comenzara el mundo, no había tierra, ni cielo, ni mar. Todo estaba oscuro y vacío. Era más silencioso que la noche más silenciosa que hayas conocido.", "¡Pero Dios estaba allí! ¡Y Dios tenía un plan maravilloso para hacer algo hermoso!", "Dios dijo: '¡Que haya luz!' Y de repente—¡FLASH!—apareció una luz brillante y hermosa. Dios llamó a la luz 'Día' y a la oscuridad 'Noche'. Ese fue el primer día."] },
        2: { title: "Cielo y Aguas", paragraphs: ["En el segundo día, el mundo todavía estaba cubierto de agua. Entonces Dios habló de nuevo.", "Hizo un gran espacio azul para separar el agua. Empujó un poco de agua hacia arriba para hacer nubes, y mantuvo un poco de agua abajo para los océanos.", "Llamó al espacio 'Cielo'. ¡Ahora había un lugar para que el viento soplara y las nubes flotaran!"] },
    },
    fr: {
        1: { title: "Au Commencement", paragraphs: ["Avant que le monde ne commence, il n'y avait ni terre, ni ciel, ni mer. Tout était sombre et vide. C'était plus silencieux que la nuit la plus silencieuse que vous ayez connue.", "Mais Dieu était là. Et Dieu avait un plan merveilleux pour créer quelque chose de beau!", "Dieu dit: 'Que la lumière soit!' Et soudain—FLASH!—une belle lumière brillante apparut. Dieu appela la lumière 'Jour' et les ténèbres 'Nuit'. C'était le tout premier jour."] },
    },
    de: {
        1: { title: "Am Anfang", paragraphs: ["Bevor die Welt begann, gab es keine Erde, keinen Himmel und kein Meer. Alles war dunkel und leer. Es war stiller als die stillste Nacht, die du je gekannt hast.", "Aber Gott war da. Und Gott hatte einen wunderbaren Plan, etwas Schönes zu machen!", "Gott sprach: 'Es werde Licht!' Und plötzlich—BLITZ!—erschien helles, schönes Licht. Gott nannte das Licht 'Tag' und die Finsternis 'Nacht'. Das war der allererste Tag."] },
    },
    pt: {
        1: { title: "No Princípio", paragraphs: ["Antes do mundo começar, não havia terra, céu ou mar. Tudo era escuro e vazio. Era mais silencioso que a noite mais silenciosa que você já conheceu.", "Mas Deus estava lá. E Deus tinha um plano maravilhoso para fazer algo lindo!", "Deus disse: 'Haja luz!' E de repente—FLASH!—uma luz brilhante e bonita apareceu. Deus chamou a luz de 'Dia' e a escuridão de 'Noite'. Esse foi o primeiro dia."] },
    },
    zh: {
        1: { title: "起初", paragraphs: ["在世界开始之前，没有地球，没有天空，没有海洋。一切都是黑暗和空虚的。比你所知道的最安静的夜晚还要安静。", "但神在那里。神有一个美好的计划，要创造美丽的东西！", "神说：'要有光！'突然——闪光！——明亮美丽的光出现了。神称光为'白昼'，称黑暗为'夜晚'。这是第一天。"] },
    },
    ko: {
        1: { title: "태초에", paragraphs: ["세상이 시작되기 전, 땅도 없고, 하늘도 없고, 바다도 없었습니다. 모든 것이 어둡고 비어 있었습니다. 당신이 아는 가장 조용한 밤보다 더 조용했습니다.", "그러나 하나님이 계셨습니다. 그리고 하나님은 아름다운 것을 만들 멋진 계획을 가지고 계셨습니다!", "하나님이 '빛이 있으라!' 하시니 갑자기—번쩍!—밝고 아름다운 빛이 나타났습니다. 하나님이 빛을 '낮'이라 하시고 어둠을 '밤'이라 하셨습니다. 이것이 첫째 날이었습니다."] },
    },
    ta: {
        1: { title: "ஆதியிலே", paragraphs: ["உலகம் தொடங்குவதற்கு முன், பூமி இல்லை, வானம் இல்லை, கடல் இல்லை. எல்லாம் இருளாகவும் வெறுமையாகவும் இருந்தது. நீங்கள் அறிந்த மிக அமைதியான இரவை விட அமைதியாக இருந்தது.", "ஆனால் கடவுள் அங்கே இருந்தார். அழகான ஒன்றை உருவாக்க கடவுளுக்கு அற்புதமான திட்டம் இருந்தது!", "கடவுள் 'வெளிச்சம் உண்டாகட்டும்!' என்று சொன்னார். திடீரென—பிரகாசம்!—பிரகாசமான, அழகான ஒளி தோன்றியது. கடவுள் ஒளியை 'பகல்' என்றும் இருளை 'இரவு' என்றும் அழைத்தார். அது முதல் நாள்."] },
    },
    ml: {
        1: { title: "ആദിയിൽ", paragraphs: ["ലോകം ആരംഭിക്കുന്നതിന് മുമ്പ്, ഭൂമിയില്ല, ആകാശമില്ല, കടലില്ല. എല്ലാം ഇരുട്ടും ശൂന്യവുമായിരുന്നു. നിങ്ങൾക്കറിയാവുന്ന ഏറ്റവും നിശ്ശബ്ദമായ രാത്രിയേക്കാൾ നിശ്ശബ്ദമായിരുന്നു.", "എന്നാൽ ദൈവം അവിടെ ഉണ്ടായിരുന്നു. സുന്ദരമായ എന്തെങ്കിലും ഉണ്ടാക്കാൻ ദൈവത്തിന് അത്ഭുതകരമായ ഒരു പദ്ധതി ഉണ്ടായിരുന്നു!", "ദൈവം 'വെളിച്ചം ഉണ്ടാകട്ടെ!' എന്ന് പറഞ്ഞു. പെട്ടെന്ന്—ഫ്ലാഷ്!—തിളക്കമുള്ള, മനോഹരമായ വെളിച്ചം പ്രത്യക്ഷപ്പെട്ടു. ദൈവം വെളിച്ചത്തെ 'പകൽ' എന്നും ഇരുട്ടിനെ 'രാത്രി' എന്നും വിളിച്ചു. അതായിരുന്നു ഒന്നാം ദിവസം."] },
    },
};

// --- Data: 50 Pages of Genesis ---
const genesisStories = [
    // --- CREATION (Pages 1-7) ---
    { page: 1, title: "In the Beginning", ref: "Genesis 1:1-5", theme: "day1", paragraphs: ["Before the world began, there was no earth, no sky, and no sea. Everything was dark and empty. It was quieter than the quietest night you've ever known.", "But God was there. And God had a wonderful plan to make something beautiful!", "God said, 'Let there be light!' And suddenly—FLASH!—bright, beautiful light appeared. God called the light 'Day' and the darkness 'Night.' That was the very first day."] },
    { page: 2, title: "Sky and Waters", ref: "Genesis 1:6-8", theme: "day2", paragraphs: ["On the second day, the world was still covered in water. So God spoke again.", "He made a big, blue space to separate the water. He pushed some water up high to make clouds, and kept some water down low for the oceans.", "He called the space 'Sky.' Now there was a place for the wind to blow and clouds to float!"] },
    { page: 3, title: "Land and Plants", ref: "Genesis 1:9-13", theme: "day3", paragraphs: ["On the third day, God told the water below to gather together. Dry ground popped up from the ocean! He called the dry ground 'Land' and the water 'Seas.'", "Then God said, 'Let the land grow plants!'", "Suddenly, grass turned the hills green. Tall trees grew out of the dirt, and colorful flowers bloomed everywhere. The world was starting to look like a garden."] },
    { page: 4, title: "Sun, Moon, and Stars", ref: "Genesis 1:14-19", theme: "day4", paragraphs: ["The world had plants, but it needed lights to help tell time. So on the fourth day, God made lights in the sky.", "He made the big, golden Sun to warm the day. Then He made the silvery Moon to watch over the night.", "He also scattered millions of twinkling stars across the darkness like diamond dust. Now the sky was full of light!"] },
    { page: 5, title: "Fish and Birds", ref: "Genesis 1:20-23", theme: "day5", paragraphs: ["On the fifth day, God looked at the quiet oceans and the empty sky. He said, 'Let them be filled with living things!'", "Splash! Whales, dolphins, and little fish began to swim in the sea. Flap! Eagles, robins, and parrots soared into the sky.", "The world became noisy with splashing fins and singing wings. God saw that it was good."] },
    { page: 6, title: "Animals and Man", ref: "Genesis 1:24-31", theme: "day6", paragraphs: ["On the sixth day, God made animals for the land. Elephants, lions, puppies, and cows appeared!", "Then God did something very special. He scooped up dust from the ground and made a man named Adam. God breathed life into him.", "Adam was different from the animals. He was made in God's image to be God's friend and to take care of this new world."] },
    { page: 7, title: "A Day of Rest", ref: "Genesis 2:1-3", theme: "day7", paragraphs: ["By the seventh day, the whole universe was finished. It was perfect. The stars twinkled, the rivers flowed, and Adam walked in the garden.", "So God rested. He didn't rest because He was tired, but to show that the work was done and it was good.", "He made the seventh day a special, holy day for rest and happiness."] },

    // --- ADAM & EVE (Pages 8-12) ---
    { page: 8, title: "The Garden of Eden", ref: "Genesis 2:8-14", theme: "garden", paragraphs: ["God made a special home for Adam called the Garden of Eden. It was the most beautiful park ever.", "There were crystal clear rivers and trees full of yummy fruit. In the middle stood two special trees: The Tree of Life and the Tree of Knowledge of Good and Evil.", "Adam had a fun job: he was the gardener! He took care of the plants and enjoyed the beautiful world."] },
    { page: 9, title: "Naming the Animals", ref: "Genesis 2:19-20", theme: "naming", paragraphs: ["God brought all the animals to Adam to see what he would call them.", "Adam looked at a tall creature and said, 'Giraffe!' He looked at a bouncy one and said, 'Kangaroo!'", "But while Adam was naming them, he noticed something. The birds had partners. The lions had partners. But Adam was all alone. There was no one like him."] },
    { page: 10, title: "The First Woman", ref: "Genesis 2:21-25", theme: "eve", paragraphs: ["God said, 'It is not good for man to be alone.' So God put Adam into a deep sleep.", "While Adam slept, God took a rib from Adam's side and made a woman. Her name was Eve.", "When Adam woke up, he was so happy! 'Finally!' he cheered. 'Someone just like me!' Now Adam and Eve could be best friends and helpers."] },
    { page: 11, title: "The Sneaky Trick", ref: "Genesis 3:1-7", theme: "fall", paragraphs: ["God gave Adam and Eve one rule: 'Don't eat from the Tree of Knowledge, or you will die.'", "But a sneaky snake came to Eve. 'Did God really say that?' he hissed. 'If you eat it, you'll be smart like God!'", "Eve looked at the fruit. It looked tasty. She forgot God's warning and took a bite. She gave some to Adam, and he ate it too. Suddenly, they felt shame for the first time."] },
    { page: 12, title: "Leaving Home", ref: "Genesis 3:23-24", theme: "gate", paragraphs: ["Because they disobeyed, sin entered the world. They couldn't stay in the perfect garden anymore.", "God made them clothes and sent them out. He put an angel with a flaming sword at the gate to guard the Tree of Life.", "It was a sad day, but God made a promise. He promised that one day, a Rescuer would come to defeat the snake and fix what was broken."] },

    // --- NOAH (Pages 13-16) ---
    { page: 13, title: "A Big Boat", ref: "Genesis 6:13-22", theme: "hammer", paragraphs: ["Years passed, and people forgot about God. They were fighting and mean. But one man named Noah loved God.", "God told Noah, 'I'm going to wash the world clean with a flood. Build a giant boat—an Ark!'", "It was hard work. People laughed at Noah for building a boat on dry land. But Noah kept sawing and hammering because he trusted God."] },
    { page: 14, title: "Two by Two", ref: "Genesis 7:1-9", theme: "ark_animals", paragraphs: ["When the Ark was finished, God called the animals. They came marching two by two!", "Big lions, tiny mice, slow turtles, and hopping bunnies all went up the ramp. Noah and his family went inside too.", "Then, God shut the door tight. The dark clouds gathered, and the first drops of rain began to fall."] },
    { page: 15, title: "The Great Flood", ref: "Genesis 7:17-24", theme: "flood", paragraphs: ["It rained for 40 days and 40 nights! The water rose higher than the houses, higher than the trees, and even higher than the mountains.", "Outside, the world was covered in water. But inside the Ark, Noah and the animals were safe and dry.", "God had not forgotten them. He steered the boat through the storm."] },
    { page: 16, title: "The Rainbow Promise", ref: "Genesis 9:12-17", theme: "rainbow", paragraphs: ["Finally, the rain stopped. Noah sent out a dove, and it came back with an olive leaf. Land was dry!", "Noah and his family came out and thanked God. Then, God painted a giant, colorful rainbow across the sky.", "God said, 'This rainbow is my promise. I will never flood the whole earth again.' It was a new beginning."] },

    // --- TOWER OF BABEL (Page 17) ---
    { page: 17, title: "The Tower of Babel", ref: "Genesis 11:1-9", theme: "babel", paragraphs: ["Later, people said, 'Let's build a tower that reaches the sky! We will be famous and stay here forever.'", "But God wanted people to live all over the world, not just in one spot. And He knew they were being proud.", "So God mixed up their languages. One person asked for a brick, but the other heard 'Pass the spoon!' It was confusing! They stopped building and moved away."] },

    // --- ABRAHAM (Pages 18-24) ---
    { page: 18, title: "Abraham's Journey", ref: "Genesis 12:1-4", theme: "tent", paragraphs: ["God chose a man named Abraham. God said, 'Leave your home and go to a land I will show you.'", "Abraham didn't have a map. He didn't know where he was going. But he packed his tents and camels.", "He took his wife Sarah and his nephew Lot. They walked for weeks, trusting that God was leading them to a special place."] },
    { page: 19, title: "Counting Stars", ref: "Genesis 15:5-6", theme: "stars", paragraphs: ["Abraham was old and had no children. He wondered if God's promise of a big family was real.", "One night, God took Abraham outside. 'Look up!' God said. 'Count the stars. That is how many children and grandchildren you will have!'", "Abraham looked at the millions of twinkling stars. Even though it seemed impossible, he believed God."] },
    { page: 20, title: "The Three Visitors", ref: "Genesis 18:1-15", theme: "visitors", paragraphs: ["One hot day, three mysterious visitors came to Abraham's tent. Abraham rushed to give them food and water.", "One visitor said, 'By this time next year, your wife Sarah will have a son.'", "Sarah was listening inside the tent. She laughed! 'I am 90 years old!' she thought. 'That's impossible!' But nothing is too hard for God."] },
    { page: 21, title: "Sodom and Gomorrah", ref: "Genesis 19", theme: "fire", paragraphs: ["Abraham's nephew Lot lived in a city called Sodom. It was a very bad place where people did wicked things.", "God decided to destroy the city, but He sent angels to save Lot first. The angels told Lot, 'Run! Don't look back!'", "Lot and his daughters ran away just in time. But Lot's wife looked back, and she turned into a pillar of salt!"] },
    { page: 22, title: "Baby Isaac", ref: "Genesis 21:1-7", theme: "baby", paragraphs: ["Just as God promised, Sarah had a baby boy! They named him Isaac, which means 'Laughter.'", "The tent was filled with joy. Abraham and Sarah were the oldest parents ever, but they were so happy.", "Isaac grew up hearing stories about how God always keeps His promises."] },
    { page: 23, title: "The Hardest Test", ref: "Genesis 22:1-14", theme: "mountain", paragraphs: ["When Isaac was a boy, God tested Abraham. 'Take your son to the mountain and give him to Me,' God said.", "Abraham was sad and confused, but he trusted God. He climbed the mountain. Just as he was about to give up Isaac, an angel yelled, 'STOP!'", "God saw that Abraham loved Him most of all. God provided a ram in the bushes to take Isaac's place. Isaac was safe!"] },
    { page: 24, title: "A Wife for Isaac", ref: "Genesis 24", theme: "well", paragraphs: ["When Isaac grew up, Abraham sent a servant to find a wife who loved God. The servant prayed by a well.", "A girl named Rebekah came out. She was kind and offered water to the servant and all his thirsty camels!", "The servant knew she was the one. Rebekah agreed to go with him. When Isaac saw her, he loved her immediately."] },

    // --- JACOB (Pages 25-32) ---
    { page: 25, title: "The Twins", ref: "Genesis 25:19-26", theme: "twins", paragraphs: ["Isaac and Rebekah had twin boys. They were very different!", "Esau was born first. He was red and hairy and loved to hunt outdoors.", "Jacob was born second, holding onto Esau's heel! He was smooth-skinned and liked to stay home."] },
    { page: 26, title: "The Bowl of Stew", ref: "Genesis 25:29-34", theme: "stew", paragraphs: ["One day, Esau came home from hunting. He was super hungry! 'Give me some of that red stew!' he grumbled.", "Jacob said, 'I'll give you stew if you give me your birthright (the special rights of the oldest son).'", "Esau didn't care about the future, only his tummy. So he traded his special blessing for a bowl of soup. What a bad trade!"] },
    { page: 27, title: "The Stolen Blessing", ref: "Genesis 27", theme: "trick", paragraphs: ["When their father Isaac was old and blind, it was time to give the family blessing. He called for Esau.", "But Rebekah helped Jacob trick Isaac. Jacob wore Esau's clothes and put goat fur on his arms to feel hairy.", "Isaac thought Jacob was Esau and gave him the blessing! When Esau found out, he was furious. Jacob had to run away."] },
    { page: 28, title: "Jacob's Ladder", ref: "Genesis 28:10-22", theme: "ladder", paragraphs: ["Jacob was lonely and scared, running from his brother. He slept on the ground with a rock for a pillow.", "That night, he dreamed of a ladder reaching to heaven, with angels going up and down.", "God stood at the top and said, 'I am with you. I will protect you.' Jacob realized he wasn't alone."] },
    { page: 29, title: "Working for Love", ref: "Genesis 29", theme: "heart_work", paragraphs: ["Jacob arrived at his uncle Laban's house. He met a beautiful girl named Rachel and fell in love.", "Laban said, 'Work for me for seven years, and you can marry Rachel.' Jacob worked hard, and the years felt like days because he loved her.", "But Laban tricked Jacob! On the wedding day, he gave him Leah, the older sister, instead. Jacob had to work seven more years for Rachel."] },
    { page: 30, title: "Time to Go Home", ref: "Genesis 31", theme: "camel_run", paragraphs: ["Jacob stayed with Laban for many years. He now had a huge family—12 sons and one daughter!", "He also had many sheep and goats. But Laban was not always nice, and God told Jacob, 'It is time to go back home.'", "Jacob packed up everything. He was nervous. Would his brother Esau still be angry about the stolen blessing?"] },
    { page: 31, title: "Wrestling with God", ref: "Genesis 32:22-32", theme: "wrestle", paragraphs: ["The night before meeting Esau, Jacob was alone by a river. A mysterious man appeared and wrestled with him!", "They wrestled all night. The man touched Jacob's hip, hurting it, but Jacob wouldn't let go. 'Bless me!' Jacob cried.", "The man blessed him and changed his name to 'Israel.' Jacob realized he had wrestled with God Himself."] },
    { page: 32, title: "Brothers Hug", ref: "Genesis 33", theme: "hug", paragraphs: ["The next morning, Jacob saw Esau coming with 400 men! Jacob was terrified. He bowed down low.", "But Esau ran to him... and hugged him! Esau wasn't angry anymore. He was just happy to see his brother.", "They cried together. God had softened Esau's heart. The family was at peace."] },

    // --- JOSEPH (Pages 33-50) ---
    { page: 33, title: "The Dreamer", ref: "Genesis 37:1-11", theme: "coat", paragraphs: ["Jacob had 12 sons, but he loved Joseph the most. He gave Joseph a beautiful, colorful coat.", "Joseph had strange dreams. 'I dreamed your bundles of wheat bowed to mine!' he told his brothers.", "His brothers were jealous. 'Does he think he is our king?' they grumbled. They hated Joseph's dreams and his fancy coat."] },
    { page: 34, title: "Into the Pit", ref: "Genesis 37:12-24", theme: "pit", paragraphs: ["One day, the brothers saw Joseph coming in his bright coat. 'Here comes the dreamer,' they sneered.", "They grabbed him and threw him into a deep, dry pit. Joseph cried for help, but they ignored him.", "They saw traders going to Egypt. 'Let's sell him!' they said. So Joseph was sold as a slave, taken far away from his father."] },
    { page: 35, title: "Sold in Egypt", ref: "Genesis 39:1-6", theme: "pyramid", paragraphs: ["In Egypt, Joseph was sold to a man named Potiphar. It was a strange land with strange language.", "But God was with Joseph. Everything Joseph did went well. Potiphar saw this and put Joseph in charge of his whole house.", "Joseph worked hard and was honest, even though he missed his home."] },
    { page: 36, title: "Thrown in Prison", ref: "Genesis 39:7-20", theme: "prison", paragraphs: ["Potiphar's wife told a terrible lie about Joseph because he wouldn't do something wrong.", "Potiphar believed her and threw Joseph into prison. It was dark and lonely.", "But even in jail, God was there. The jailer liked Joseph and put him in charge of the other prisoners."] },
    { page: 37, title: "Dreams in Jail", ref: "Genesis 40", theme: "cup", paragraphs: ["Two of the King's servants were in jail with Joseph. They both had weird dreams.", "God helped Joseph explain the dreams. He told the cupbearer, 'You will get your job back!' He told the baker, 'You will not.'", "It happened just like Joseph said. But the cupbearer forgot about Joseph and left him in jail for two more years."] },
    { page: 38, title: "The King's Nightmare", ref: "Genesis 41:1-8", theme: "cow_dream", paragraphs: ["One night, Pharaoh, the King of Egypt, had a scary dream. Seven fat cows were eaten by seven skinny cows!", "He woke up and slept again. Then he dreamed of seven healthy stalks of corn eaten by seven dried-up ones.", "None of his magicians could explain it. Pharaoh was worried."] },
    { page: 39, title: "Joseph to the Rescue", ref: "Genesis 41:9-36", theme: "lightbulb", paragraphs: ["The cupbearer finally remembered Joseph! 'There is a man in jail who understands dreams,' he said.", "Joseph was cleaned up and brought to Pharaoh. 'God gives the answer,' Joseph said.", "'The dreams mean seven years of lots of food, then seven years of hunger. You need to save food now!'"] },
    { page: 40, title: "A New Ruler", ref: "Genesis 41:37-45", theme: "crown", paragraphs: ["Pharaoh was amazed. 'Who is as wise as this man?' he asked. He took a ring off his finger and gave it to Joseph.", "He made Joseph the ruler over all Egypt! Only Pharaoh was higher than him.", "They dressed Joseph in fine robes and gave him a gold chain. The slave boy was now a Prince."] },
    { page: 41, title: "Saving the Grain", ref: "Genesis 41:46-57", theme: "wheat", paragraphs: ["For seven good years, Joseph gathered food. He filled huge barns with grain, more than the sand of the sea.", "Then, the seven bad years came. The crops died. People were hungry.", "But thanks to Joseph, Egypt had bread! People from other lands came to buy food from Joseph."] },
    { page: 42, title: "Brothers Return", ref: "Genesis 42:1-8", theme: "kneel", paragraphs: ["Back home, Jacob's family was hungry. Jacob sent ten sons to Egypt to buy grain.", "They bowed down to the ruler of Egypt. They didn't know it was Joseph! But Joseph knew them.", "He remembered his dream about the bowing wheat. It was coming true!"] },
    { page: 43, title: "The Test", ref: "Genesis 42:9-24", theme: "eye", paragraphs: ["Joseph acted like a stranger. 'You are spies!' he said roughly. 'No, we are brothers!' they cried.", "Joseph put them in prison for three days to test them. Then he said, 'Bring your youngest brother Benjamin to prove you are honest.'", "He kept one brother, Simeon, in jail and sent the rest home with food. The brothers were scared."] },
    { page: 44, title: "The Silver Cup", ref: "Genesis 44", theme: "silver_cup", paragraphs: ["Later, the brothers came back with Benjamin. Joseph had a feast for them, but he wasn't ready to tell them yet.", "He secretly put his silver cup in Benjamin's sack. When they left, Joseph's guards stopped them. 'Thieves!' they shouted.", "They found the cup in Benjamin's sack! The brothers were terrified. They knew Benjamin was their father's favorite."] },
    { page: 45, title: "Judah's Plea", ref: "Genesis 44:18-34", theme: "shield", paragraphs: ["The brothers tore their clothes in sadness. They went back to Joseph.", "Judah, one of the brothers, stepped forward. 'Please,' he begged. 'Take me as a slave instead of Benjamin. If he doesn't return, our father will die of a broken heart.'", "Joseph saw that they had changed. They weren't selfish anymore. They loved their father and brother."] },
    { page: 46, title: "I Am Joseph!", ref: "Genesis 45:1-8", theme: "cry", paragraphs: ["Joseph couldn't hold it in. 'Leave us!' he told his servants. Then he broke down crying.", "'I am Joseph!' he told his brothers. 'Is my father alive?'", "The brothers were shocked and terrified. But Joseph said, 'Don't be afraid. You meant it for evil, but God meant it for good, to save many lives.'"] },
    { page: 47, title: "The Good News", ref: "Genesis 45:9-28", theme: "wagons", paragraphs: ["Joseph hugged his brothers. He gave them new clothes and wagons to move their families.", "'Go get our father!' Joseph said. 'There are still five years of hunger left. You will live near me in Egypt.'", "When they told Jacob 'Joseph is alive!', he didn't believe it at first. But when he saw the wagons, his spirit revived."] },
    { page: 48, title: "Jacob Goes to Egypt", ref: "Genesis 46", theme: "travel", paragraphs: ["Jacob packed everything he owned. On the way, God spoke to him: 'Do not be afraid to go to Egypt. I will make you a great nation there.'", "The whole family—70 people—traveled to Egypt.", "Joseph rode his chariot to meet them. When he saw his old father, he ran to him and wept for a long time."] },
    { page: 49, title: "A Home in Goshen", ref: "Genesis 47", theme: "home", paragraphs: ["Pharaoh welcomed Joseph's family. He gave them the best land in Egypt, called Goshen.", "They had grass for their sheep and plenty of food. Jacob met Pharaoh and blessed him.", "The family was safe and together again. God had used Joseph's hard journey to save everyone."] },
    { page: 50, title: "The Promise Continues", ref: "Genesis 50", theme: "sunset", paragraphs: ["Jacob lived to be very old. Before he died, he blessed all his sons and grandsons.", "Joseph also lived a long, happy life. He told his brothers, 'God will surely bring you back to the land He promised Abraham.'", "The book of Genesis ends in Egypt, but God's great story was just beginning."] }
];

// Theme-based illustration component
const Illustration = ({ theme }: { theme: string }) => {
    const getColors = () => {
        const colorMap: Record<string, string> = {
            day1: 'from-gray-900 to-indigo-900', day2: 'from-sky-400 to-blue-500', day3: 'from-green-400 to-emerald-600',
            day4: 'from-indigo-800 to-purple-900', day5: 'from-blue-400 to-cyan-500', day6: 'from-amber-200 to-orange-300',
            day7: 'from-yellow-100 to-amber-200', garden: 'from-emerald-400 to-green-600', naming: 'from-lime-300 to-green-400',
            eve: 'from-rose-200 to-pink-300', fall: 'from-stone-400 to-gray-500', gate: 'from-orange-300 to-red-400',
            hammer: 'from-orange-200 to-amber-400', ark_animals: 'from-yellow-300 to-amber-400', flood: 'from-blue-600 to-indigo-700',
            rainbow: 'from-sky-300 to-violet-400', babel: 'from-orange-400 to-red-500', tent: 'from-amber-200 to-orange-300',
            stars: 'from-slate-900 to-indigo-950', visitors: 'from-yellow-100 to-amber-200', fire: 'from-red-400 to-orange-500',
            baby: 'from-pink-200 to-rose-300', mountain: 'from-gray-400 to-slate-500', well: 'from-cyan-200 to-teal-400',
            twins: 'from-amber-300 to-orange-400', stew: 'from-red-800 to-red-900', trick: 'from-zinc-300 to-gray-400',
            ladder: 'from-violet-300 to-purple-500', heart_work: 'from-pink-300 to-rose-400', camel_run: 'from-orange-200 to-amber-300',
            wrestle: 'from-purple-700 to-violet-800', hug: 'from-green-300 to-emerald-400', coat: 'from-red-300 via-yellow-300 to-blue-300',
            pit: 'from-stone-500 to-gray-600', pyramid: 'from-yellow-400 to-amber-500', prison: 'from-gray-700 to-slate-800',
            cup: 'from-gray-300 to-slate-400', cow_dream: 'from-green-800 to-emerald-900', lightbulb: 'from-yellow-200 to-amber-300',
            crown: 'from-amber-400 to-yellow-500', wheat: 'from-yellow-500 to-amber-600', kneel: 'from-slate-400 to-gray-500',
            eye: 'from-blue-800 to-indigo-900', silver_cup: 'from-slate-300 to-gray-400', shield: 'from-blue-200 to-cyan-300',
            cry: 'from-blue-100 to-sky-200', wagons: 'from-amber-100 to-orange-200', travel: 'from-green-200 to-teal-300',
            home: 'from-emerald-200 to-green-300', sunset: 'from-orange-400 to-red-500'
        };
        return colorMap[theme] || 'from-gray-300 to-gray-400';
    };

    const getIcon = () => {
        const size = 64;
        const iconMap: Record<string, React.ReactNode> = {
            day1: <div className="flex items-center gap-4"><div className="w-12 h-12 bg-black rounded-full border-2 border-white/30" /><Sun size={size} className="text-yellow-300" /></div>,
            day2: <div className="flex flex-col items-center"><Cloud size={size} className="text-white" /><div className="w-24 h-3 bg-blue-400 mt-2 rounded-full opacity-60" /></div>,
            day3: <div className="flex items-end gap-2"><TreeDeciduous size={56} className="text-green-700" /><Sprout size={36} className="text-green-500" /></div>,
            day4: <div className="flex items-center gap-3"><Sun size={50} className="text-yellow-400" /><Moon size={40} className="text-gray-200" /></div>,
            day5: <div className="flex flex-col items-center gap-2"><Bird size={44} className="text-blue-700" /><Fish size={44} className="text-cyan-400" /></div>,
            day6: <Users size={size} className="text-amber-800" />,
            day7: <div className="text-5xl font-bold text-amber-600">zZZ</div>,
            garden: <div className="flex"><TreeDeciduous size={size} className="text-emerald-600" /><TreeDeciduous size={48} className="text-green-500 -ml-4" /></div>,
            naming: <div className="text-5xl">🦒</div>,
            eve: <Users size={size} className="text-rose-400" />,
            fall: <div className="relative"><TreeDeciduous size={size} className="text-green-800" /><div className="absolute bottom-0 right-0 text-4xl">🐍</div></div>,
            gate: <div className="flex items-center gap-2"><Flame size={48} className="text-orange-400 animate-pulse" /><Castle size={48} className="text-stone-500" /></div>,
            hammer: <Hammer size={size} className="text-amber-800" />,
            ark_animals: <div className="text-5xl">🐘🦁</div>,
            flood: <Droplets size={size} className="text-white animate-bounce" />,
            rainbow: <Rainbow size={72} className="text-violet-500" />,
            babel: <Castle size={size} className="text-orange-700" />,
            tent: <Tent size={size} className="text-orange-800" />,
            stars: <div className="flex gap-2"><Star size={28} className="text-white animate-pulse" /><Star size={44} className="text-yellow-200" /><Star size={28} className="text-white animate-pulse" /></div>,
            visitors: <Users size={size} className="text-yellow-600" />,
            fire: <Flame size={size} className="text-red-500 animate-pulse" />,
            baby: <Baby size={size} className="text-rose-400" />,
            mountain: <Mountain size={size} className="text-stone-500" />,
            well: <div className="w-16 h-16 border-6 border-stone-400 rounded-full bg-blue-300" />,
            twins: <Users size={size} className="text-amber-700" />,
            stew: <div className="text-5xl">🍲</div>,
            trick: <div className="text-5xl">👻</div>,
            ladder: <div className="flex flex-col gap-1">{[1, 2, 3, 4].map(i => <div key={i} className="w-14 h-2 bg-yellow-400 rounded" />)}</div>,
            heart_work: <Heart size={size} className="text-pink-400 animate-pulse" />,
            camel_run: <div className="text-5xl">🐪</div>,
            wrestle: <div className="flex"><Users size={size} className="text-purple-200" /><Zap size={36} className="text-yellow-300 animate-pulse" /></div>,
            hug: <Users size={size} className="text-green-600" />,
            coat: <Gift size={size} className="text-white" />,
            pit: <div className="w-16 h-16 bg-stone-700 rounded-full shadow-inner" />,
            pyramid: <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[56px] border-b-yellow-600" />,
            prison: <div className="flex gap-2">{[1, 2, 3].map(i => <div key={i} className="w-3 h-16 bg-gray-400 rounded" />)}</div>,
            cup: <div className="text-4xl">🍷</div>,
            cow_dream: <div className="text-5xl">🐄</div>,
            lightbulb: <Sun size={size} className="text-yellow-500" />,
            crown: <Crown size={size} className="text-amber-500" />,
            wheat: <Wheat size={size} className="text-yellow-700" />,
            kneel: <Users size={size} className="text-slate-500" />,
            eye: <div className="w-16 h-10 bg-white rounded-full flex items-center justify-center"><div className="w-6 h-6 bg-blue-800 rounded-full" /></div>,
            silver_cup: <div className="text-5xl grayscale">🏆</div>,
            shield: <Shield size={size} className="text-blue-400" />,
            cry: <Droplets size={size} className="text-blue-300" />,
            wagons: <div className="text-5xl">🛒</div>,
            travel: <Map size={size} className="text-green-700" />,
            home: <Tent size={size} className="text-emerald-600" />,
            sunset: <div className="relative"><Sun size={size} className="text-orange-500" /><div className="absolute bottom-0 w-full h-3 bg-orange-700 opacity-50" /></div>
        };
        return iconMap[theme] || <BookOpen size={size} className="text-gray-500" />;
    };

    return (
        <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${getColors()} flex items-center justify-center shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/5" />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 drop-shadow-xl"
            >
                {getIcon()}
            </motion.div>
        </div>
    );
};

// Book Cover Component
const BookCover = ({ onStart }: { onStart: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8 p-6 bg-white/20 rounded-full backdrop-blur-sm z-10"
        >
            <Book size={80} className="text-white drop-shadow-lg" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg z-10">THE BOOK OF</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-amber-100 z-10">GENESIS</h2>
        <div className="bg-white/90 text-amber-800 p-4 rounded-xl shadow-lg max-w-sm mb-8 z-10">
            <p className="font-bold">50 Stories: Creation • Noah • Abraham • Jacob • Joseph</p>
        </div>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-4 bg-white text-amber-600 rounded-full font-black text-xl shadow-xl flex items-center gap-3 z-10"
        >
            START READING <ChevronRight size={24} strokeWidth={3} />
        </motion.button>
    </motion.div>
);

interface GenesisBookProps {
    onClose: () => void;
}

export default function GenesisBook({ onClose }: GenesisBookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const { theme } = useSettings();
    const totalPages = genesisStories.length;
    const contentRef = useRef<HTMLDivElement>(null);

    const handleNext = () => {
        if (currentPage <= totalPages) {
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

    const basePageData = currentPage > 0 ? genesisStories[currentPage - 1] : null;

    // Get translated content or fallback to English
    const getTranslatedContent = () => {
        if (!basePageData) return null;

        const langTranslations = translations[selectedLang];
        const pageTranslation = langTranslations[basePageData.page];

        if (pageTranslation) {
            return {
                ...basePageData,
                title: pageTranslation.title,
                paragraphs: pageTranslation.paragraphs,
            };
        }

        return basePageData; // Fallback to English
    };

    const pageData = getTranslatedContent();

    const currentLangInfo = languages.find(l => l.id === selectedLang) || languages[0];

    // Theme-based background
    const getBgClass = () => {
        switch (theme) {
            case 'nebula': return 'from-purple-900 to-pink-900';
            case 'abstract': return 'from-amber-900 to-orange-900';
            case 'dark': return 'from-zinc-900 to-slate-900';
            case 'aurora': return 'from-emerald-900 to-teal-900';
            default: return 'from-purple-900 to-pink-900';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Book Container */}
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className={`relative w-full max-w-4xl h-[85vh] bg-gray-900 bg-gradient-to-br ${getBgClass()} backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20`}
            >
                {/* Header Controls */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white text-sm"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{currentLangInfo.flag} {currentLangInfo.native}</span>
                        </button>

                        <AnimatePresence>
                            {showLangMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden min-w-[180px] max-h-[300px] overflow-y-auto"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => { setSelectedLang(lang.id); setShowLangMenu(false); }}
                                            className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-white/10 transition-colors ${selectedLang === lang.id ? 'bg-gold-500/20 text-gold-300' : 'text-gray-200'}`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <div>
                                                <div className="font-medium">{lang.native}</div>
                                                <div className="text-xs text-gray-400">{lang.name}</div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {currentPage === 0 ? (
                        <motion.div key="cover" className="h-full p-6">
                            <BookCover onStart={handleNext} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="h-full flex flex-col md:flex-row"
                        >
                            {/* Left: Illustration & Title */}
                            <div className="w-full md:w-5/12 p-6 flex flex-col">
                                <Illustration theme={pageData!.theme} />
                                <div className="mt-4 text-center md:text-left">
                                    <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
                                        {pageData!.ref}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                        {pageData!.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Right: Story Text */}
                            <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm">
                                <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {pageData!.paragraphs.map((para, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.15 }}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-gold-400 mt-2.5 flex-shrink-0" />
                                            <p className="text-lg text-gray-200 leading-relaxed">{para}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                                    <button
                                        onClick={handlePrev}
                                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <span className="text-sm font-bold text-gray-400">
                                        {currentPage} / {totalPages}
                                    </span>

                                    {currentPage < totalPages ? (
                                        <button
                                            onClick={handleNext}
                                            className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 text-black shadow-lg flex items-center justify-center transition-all"
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage(0)}
                                            className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold flex items-center gap-2"
                                        >
                                            Again! <RefreshCcw size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
