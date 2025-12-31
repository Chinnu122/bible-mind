// Quiz Data - 30 Questions per Week
// Organized by categories for comprehensive Bible knowledge testing

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: 'old_testament' | 'new_testament' | 'characters' | 'verses' | 'numbers';
}

// All quiz questions organized by category
const allQuestions: QuizQuestion[] = [
    // ==================== OLD TESTAMENT HISTORY ====================
    {
        id: 1,
        question: "Who is known as the 'Father of Many Nations'?",
        options: ["Moses", "Abraham", "David", "Solomon"],
        correctAnswer: 1,
        explanation: "In Genesis 17:5, God changes Abram's name to Abraham, meaning 'father of a multitude'.",
        category: 'characters'
    },
    {
        id: 2,
        question: "How many days did God take to create the world?",
        options: ["5 days", "6 days", "7 days", "10 days"],
        correctAnswer: 1,
        explanation: "God created the world in 6 days and rested on the 7th day (Genesis 1-2).",
        category: 'old_testament'
    },
    {
        id: 3,
        question: "Who built the ark to survive the great flood?",
        options: ["Abraham", "Moses", "Noah", "David"],
        correctAnswer: 2,
        explanation: "Noah built the ark according to God's instructions in Genesis 6-9.",
        category: 'characters'
    },
    {
        id: 4,
        question: "How many sons did Jacob have?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "Jacob had 12 sons who became the 12 tribes of Israel.",
        category: 'numbers'
    },
    {
        id: 5,
        question: "Who was sold into slavery by his brothers?",
        options: ["Benjamin", "Joseph", "Reuben", "Judah"],
        correctAnswer: 1,
        explanation: "Joseph was sold into slavery by his jealous brothers (Genesis 37).",
        category: 'characters'
    },
    {
        id: 6,
        question: "How many plagues did God send upon Egypt?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 3,
        explanation: "God sent 10 plagues upon Egypt to convince Pharaoh to let the Israelites go (Exodus 7-12).",
        category: 'numbers'
    },
    {
        id: 7,
        question: "Who parted the Red Sea?",
        options: ["Aaron", "Moses", "Joshua", "Elijah"],
        correctAnswer: 1,
        explanation: "God parted the Red Sea through Moses to let the Israelites escape from Egypt (Exodus 14).",
        category: 'characters'
    },
    {
        id: 8,
        question: "On which mountain did Moses receive the Ten Commandments?",
        options: ["Mount Carmel", "Mount Sinai", "Mount Zion", "Mount Moriah"],
        correctAnswer: 1,
        explanation: "Moses received the Ten Commandments on Mount Sinai (Exodus 19-20).",
        category: 'old_testament'
    },
    {
        id: 9,
        question: "Who led the Israelites into the Promised Land after Moses?",
        options: ["Aaron", "Caleb", "Joshua", "Samuel"],
        correctAnswer: 2,
        explanation: "Joshua led the Israelites into Canaan after Moses died (Joshua 1).",
        category: 'characters'
    },
    {
        id: 10,
        question: "Who was the strongest man in the Bible?",
        options: ["David", "Samson", "Goliath", "Joshua"],
        correctAnswer: 1,
        explanation: "Samson was given supernatural strength by God (Judges 13-16).",
        category: 'characters'
    },

    // ==================== NEW TESTAMENT STORIES ====================
    {
        id: 11,
        question: "What is the shortest verse in the Bible?",
        options: ["God is love", "Jesus wept", "Rejoice always", "Pray without ceasing"],
        correctAnswer: 1,
        explanation: "John 11:35 'Jesus wept' is the shortest verse in English translations.",
        category: 'verses'
    },
    {
        id: 12,
        question: "How many books are in the New Testament?",
        options: ["27", "39", "66", "12"],
        correctAnswer: 0,
        explanation: "There are 27 books in the New Testament and 39 in the Old Testament.",
        category: 'numbers'
    },
    {
        id: 13,
        question: "In which town was Jesus born?",
        options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"],
        correctAnswer: 2,
        explanation: "Jesus was born in Bethlehem as prophesied in Micah 5:2 (Matthew 2:1).",
        category: 'new_testament'
    },
    {
        id: 14,
        question: "How many disciples did Jesus choose?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "Jesus chose 12 disciples, also called apostles (Matthew 10:1-4).",
        category: 'numbers'
    },
    {
        id: 15,
        question: "Who baptized Jesus?",
        options: ["Peter", "Paul", "John the Baptist", "Andrew"],
        correctAnswer: 2,
        explanation: "John the Baptist baptized Jesus in the Jordan River (Matthew 3:13-17).",
        category: 'characters'
    },
    {
        id: 16,
        question: "How many loaves and fish did Jesus use to feed 5,000 people?",
        options: ["5 loaves and 2 fish", "7 loaves and 3 fish", "3 loaves and 5 fish", "2 loaves and 5 fish"],
        correctAnswer: 0,
        explanation: "Jesus fed 5,000 with 5 loaves and 2 fish (Matthew 14:17-21).",
        category: 'numbers'
    },
    {
        id: 17,
        question: "Who denied Jesus three times?",
        options: ["Judas", "Peter", "Thomas", "John"],
        correctAnswer: 1,
        explanation: "Peter denied knowing Jesus three times before the rooster crowed (Matthew 26:69-75).",
        category: 'characters'
    },
    {
        id: 18,
        question: "How many days was Jesus in the tomb?",
        options: ["1 day", "2 days", "3 days", "4 days"],
        correctAnswer: 2,
        explanation: "Jesus was in the tomb for 3 days and rose on the third day (Matthew 12:40).",
        category: 'numbers'
    },
    {
        id: 19,
        question: "Who wrote most of the letters in the New Testament?",
        options: ["Peter", "Paul", "John", "James"],
        correctAnswer: 1,
        explanation: "Paul wrote 13 letters (epistles) in the New Testament.",
        category: 'characters'
    },
    {
        id: 20,
        question: "What is the last book of the Bible?",
        options: ["Jude", "Revelation", "Malachi", "Acts"],
        correctAnswer: 1,
        explanation: "Revelation is the last book of the Bible, written by John.",
        category: 'new_testament'
    },

    // ==================== BIBLE CHARACTERS ====================
    {
        id: 21,
        question: "Who was the first king of Israel?",
        options: ["David", "Saul", "Solomon", "Samuel"],
        correctAnswer: 1,
        explanation: "Saul was anointed as the first king of Israel by Samuel (1 Samuel 10:1).",
        category: 'characters'
    },
    {
        id: 22,
        question: "Who killed Goliath?",
        options: ["Saul", "Jonathan", "David", "Samuel"],
        correctAnswer: 2,
        explanation: "Young David killed the giant Goliath with a sling and a stone (1 Samuel 17).",
        category: 'characters'
    },
    {
        id: 23,
        question: "Who was swallowed by a great fish?",
        options: ["Jonah", "Elijah", "Elisha", "Daniel"],
        correctAnswer: 0,
        explanation: "Jonah was swallowed by a great fish for 3 days and nights (Jonah 1-2).",
        category: 'characters'
    },
    {
        id: 24,
        question: "Who was thrown into the lion's den?",
        options: ["David", "Daniel", "Samson", "Elijah"],
        correctAnswer: 1,
        explanation: "Daniel was thrown into the lion's den for praying to God (Daniel 6).",
        category: 'characters'
    },
    {
        id: 25,
        question: "Who betrayed Jesus for 30 pieces of silver?",
        options: ["Peter", "Thomas", "Judas Iscariot", "Matthew"],
        correctAnswer: 2,
        explanation: "Judas Iscariot betrayed Jesus for 30 pieces of silver (Matthew 26:14-16).",
        category: 'characters'
    },
    {
        id: 26,
        question: "Who was the mother of Jesus?",
        options: ["Elizabeth", "Mary", "Martha", "Ruth"],
        correctAnswer: 1,
        explanation: "Mary, a virgin, was chosen by God to be the mother of Jesus (Luke 1:26-38).",
        category: 'characters'
    },
    {
        id: 27,
        question: "Who was the wife of Abraham?",
        options: ["Rachel", "Leah", "Sarah", "Rebekah"],
        correctAnswer: 2,
        explanation: "Sarah was the wife of Abraham and mother of Isaac (Genesis 17:15-16).",
        category: 'characters'
    },
    {
        id: 28,
        question: "Who interpreted Pharaoh's dreams?",
        options: ["Moses", "Joseph", "Daniel", "Aaron"],
        correctAnswer: 1,
        explanation: "Joseph interpreted Pharaoh's dreams about 7 years of plenty and 7 years of famine (Genesis 41).",
        category: 'characters'
    },
    {
        id: 29,
        question: "Who was the brother of Moses?",
        options: ["Joshua", "Caleb", "Aaron", "Pharaoh"],
        correctAnswer: 2,
        explanation: "Aaron was Moses' brother and the first High Priest of Israel (Exodus 4:14).",
        category: 'characters'
    },
    {
        id: 30,
        question: "Who doubted the resurrection of Jesus until he saw Him?",
        options: ["Peter", "Andrew", "Thomas", "John"],
        correctAnswer: 2,
        explanation: "Thomas doubted until Jesus appeared and showed him His wounds (John 20:24-29).",
        category: 'characters'
    },

    // ==================== KEY VERSES & MEMORY ====================
    {
        id: 31,
        question: "Complete: 'For God so loved the world that he gave his only...'",
        options: ["Son", "Spirit", "Angel", "Blessing"],
        correctAnswer: 0,
        explanation: "John 3:16 - 'For God so loved the world that he gave his only Son.'",
        category: 'verses'
    },
    {
        id: 32,
        question: "Complete: 'The Lord is my shepherd, I shall not...'",
        options: ["Fear", "Want", "Fail", "Sin"],
        correctAnswer: 1,
        explanation: "Psalm 23:1 - 'The Lord is my shepherd, I shall not want.'",
        category: 'verses'
    },
    {
        id: 33,
        question: "Complete: 'In the beginning God created the...'",
        options: ["Earth", "Man", "Heavens and the Earth", "Light"],
        correctAnswer: 2,
        explanation: "Genesis 1:1 - 'In the beginning God created the heavens and the earth.'",
        category: 'verses'
    },
    {
        id: 34,
        question: "What is referred to as 'The Greatest Commandment'?",
        options: ["Do not steal", "Love your neighbor", "Love God with all your heart", "Honor your parents"],
        correctAnswer: 2,
        explanation: "Jesus said to love God with all your heart, soul, and mind is the greatest commandment (Matthew 22:37-38).",
        category: 'verses'
    },
    {
        id: 35,
        question: "Complete: 'I can do all things through Christ who...'",
        options: ["Loves me", "Strengthens me", "Saves me", "Guides me"],
        correctAnswer: 1,
        explanation: "Philippians 4:13 - 'I can do all things through Christ who strengthens me.'",
        category: 'verses'
    },

    // ==================== NUMBERS & FACTS ====================
    {
        id: 36,
        question: "How many books are in the Bible?",
        options: ["66", "72", "39", "27"],
        correctAnswer: 0,
        explanation: "The Bible has 66 books - 39 in the Old Testament and 27 in the New Testament.",
        category: 'numbers'
    },
    {
        id: 37,
        question: "How many years did the Israelites wander in the wilderness?",
        options: ["20 years", "30 years", "40 years", "50 years"],
        correctAnswer: 2,
        explanation: "The Israelites wandered for 40 years due to their disobedience (Numbers 14:33-34).",
        category: 'numbers'
    },
    {
        id: 38,
        question: "How old was Jesus when he began his public ministry?",
        options: ["25 years", "30 years", "33 years", "35 years"],
        correctAnswer: 1,
        explanation: "Jesus was about 30 years old when he began his ministry (Luke 3:23).",
        category: 'numbers'
    },
    {
        id: 39,
        question: "How many days and nights did it rain during the flood?",
        options: ["30 days", "40 days", "50 days", "100 days"],
        correctAnswer: 1,
        explanation: "It rained for 40 days and 40 nights (Genesis 7:12).",
        category: 'numbers'
    },
    {
        id: 40,
        question: "How many books did Moses write?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
        explanation: "Moses wrote 5 books: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy (the Pentateuch).",
        category: 'numbers'
    },

    // ==================== MORE OLD TESTAMENT ====================
    {
        id: 41,
        question: "What was the name of Adam's third son?",
        options: ["Abel", "Cain", "Seth", "Enosh"],
        correctAnswer: 2,
        explanation: "Seth was born after Cain killed Abel (Genesis 4:25).",
        category: 'characters'
    },
    {
        id: 42,
        question: "Which prophet was taken up to heaven in a chariot of fire?",
        options: ["Elisha", "Isaiah", "Jeremiah", "Elijah"],
        correctAnswer: 3,
        explanation: "Elijah was taken up to heaven in a chariot of fire (2 Kings 2:11).",
        category: 'characters'
    },
    {
        id: 43,
        question: "Who was the wisest king of Israel?",
        options: ["David", "Solomon", "Saul", "Josiah"],
        correctAnswer: 1,
        explanation: "Solomon asked God for wisdom and became the wisest king (1 Kings 3:12).",
        category: 'characters'
    },
    {
        id: 44,
        question: "What did Ruth say to Naomi?",
        options: ["I will leave you", "Your God will be my God", "I will return to Moab", "I cannot follow you"],
        correctAnswer: 1,
        explanation: "Ruth's famous words: 'Your people will be my people and your God my God' (Ruth 1:16).",
        category: 'verses'
    },
    {
        id: 45,
        question: "Who was the father of King David?",
        options: ["Saul", "Jesse", "Samuel", "Boaz"],
        correctAnswer: 1,
        explanation: "Jesse was the father of David (1 Samuel 16:1).",
        category: 'characters'
    },

    // ==================== MORE NEW TESTAMENT ====================
    {
        id: 46,
        question: "What was the profession of Matthew before following Jesus?",
        options: ["Fisherman", "Tax collector", "Carpenter", "Shepherd"],
        correctAnswer: 1,
        explanation: "Matthew (Levi) was a tax collector before Jesus called him (Matthew 9:9).",
        category: 'characters'
    },
    {
        id: 47,
        question: "Where was Saul (Paul) going when he encountered Jesus?",
        options: ["Jerusalem", "Damascus", "Rome", "Antioch"],
        correctAnswer: 1,
        explanation: "Saul was on the road to Damascus to persecute Christians (Acts 9:1-6).",
        category: 'new_testament'
    },
    {
        id: 48,
        question: "How many times did Jesus appear after His resurrection?",
        options: ["Around 5 times", "Around 10 times", "Around 12 times", "Once"],
        correctAnswer: 1,
        explanation: "The Gospels and Acts record approximately 10 appearances of Jesus after His resurrection.",
        category: 'numbers'
    },
    {
        id: 49,
        question: "What was the first miracle Jesus performed?",
        options: ["Healing a blind man", "Walking on water", "Turning water into wine", "Feeding 5,000"],
        correctAnswer: 2,
        explanation: "Jesus turned water into wine at a wedding in Cana (John 2:1-11).",
        category: 'new_testament'
    },
    {
        id: 50,
        question: "Who was the first Christian martyr?",
        options: ["Peter", "Stephen", "Paul", "James"],
        correctAnswer: 1,
        explanation: "Stephen was the first Christian martyr, stoned to death (Acts 7:54-60).",
        category: 'characters'
    }
];

// Get questions for a specific week (based on week of year)
export function getWeeklyQuestions(weekNumber?: number): QuizQuestion[] {
    const week = weekNumber ?? getCurrentWeekNumber();

    // Use week number to determine starting index
    // Rotate through questions so each week gets different ones
    const startIndex = (week * 30) % allQuestions.length;

    const questions: QuizQuestion[] = [];
    for (let i = 0; i < 30; i++) {
        const index = (startIndex + i) % allQuestions.length;
        questions.push(allQuestions[index]);
    }

    return questions;
}

// Get current week number of the year
function getCurrentWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
}

// Get daily questions (5 questions per day from weekly pool)
export function getDailyQuestions(): QuizQuestion[] {
    const weeklyQuestions = getWeeklyQuestions();
    const dayOfWeek = new Date().getDay(); // 0-6

    // Each day gets 4-5 questions from the weekly pool
    const startIndex = dayOfWeek * 4;
    const endIndex = Math.min(startIndex + 5, weeklyQuestions.length);

    return weeklyQuestions.slice(startIndex, endIndex);
}

// Get all available questions
export function getAllQuestions(): QuizQuestion[] {
    return allQuestions;
}

// Get questions by category
export function getQuestionsByCategory(category: QuizQuestion['category']): QuizQuestion[] {
    return allQuestions.filter(q => q.category === category);
}

export default allQuestions;
