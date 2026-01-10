import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Users } from 'lucide-react';

interface KidsStoriesViewProps {
    onBack?: () => void;
}

interface StoryData {
    name: string;
    emoji: string;
    color: string;
    description: string;
    title: string;
    content: string;
    moral: string;
    characters: string[];
}

const STORIES: StoryData[] = [
    {
        name: 'David',
        emoji: '👑',
        color: 'from-amber-500/20 to-yellow-500/20',
        description: 'The Shepherd King',
        title: 'David and Goliath',
        content: `Long ago in Israel, there lived a young shepherd boy named David. He had a kind heart and loved to sing praises to God while watching his sheep.

One day, a giant named Goliath challenged the army of Israel. Everyone was afraid! But David wasn't scared. He said, "God will help me!"

David picked up five smooth stones and went to face the giant. Goliath laughed at the small boy. But David said, "You come with a sword, but I come in the name of the Lord!"

David swung his sling and the stone hit Goliath right on the forehead. The giant fell down! David's faith in God helped him win.`,
        moral: 'With faith in God, we can overcome any challenge, no matter how big it seems.',
        characters: ['David', 'Goliath', 'King Saul']
    },
    {
        name: 'Moses',
        emoji: '🌊',
        color: 'from-blue-500/20 to-cyan-500/20',
        description: 'Parted the Red Sea',
        title: 'Moses and the Red Sea',
        content: `Moses was leading God's people out of Egypt. Pharaoh's army was chasing them!

The people reached the Red Sea and had nowhere to go. They were very scared. But Moses trusted God.

God told Moses to stretch out his staff over the sea. When he did, an amazing thing happened! The waters split apart, making a dry path through the middle.

All the people walked safely through on dry ground. When the army tried to follow, the waters came back together. God saved His people!`,
        moral: 'God always makes a way for those who trust in Him, even when things seem impossible.',
        characters: ['Moses', 'Pharaoh', 'Israelites']
    },
    {
        name: 'Noah',
        emoji: '🚢',
        color: 'from-sky-500/20 to-blue-500/20',
        description: 'Builder of the Ark',
        title: 'Noah and the Ark',
        content: `Noah was a good man who loved God. One day, God told Noah to build a big boat called an ark.

People laughed at Noah. "Why build a boat on dry land?" But Noah obeyed God and kept building.

When the ark was ready, God sent animals two by two - lions, elephants, birds, and more! Then rain started falling. It rained for 40 days and nights!

The ark floated safely on the water. When the rain stopped, Noah sent out a dove. It came back with an olive leaf! The flood was over. God put a rainbow in the sky as a promise.`,
        moral: 'When we obey God even when others don\'t understand, He will always keep us safe.',
        characters: ['Noah', 'Mrs. Noah', 'Animals']
    },
    {
        name: 'Daniel',
        emoji: '🦁',
        color: 'from-orange-500/20 to-amber-500/20',
        description: 'Survived the Lion\'s Den',
        title: 'Daniel in the Lions\' Den',
        content: `Daniel prayed to God three times every day. Some jealous men made a law that no one could pray to anyone except the king.

Daniel kept praying to God anyway. The king was sad, but he had to punish Daniel. They threw Daniel into a den full of hungry lions!

The king couldn't sleep all night. In the morning, he ran to the den. "Daniel! Did your God save you?"

Daniel answered, "My God sent an angel to shut the lions' mouths! They didn't hurt me!" The king was so happy. He made everyone respect Daniel's God.`,
        moral: 'God protects those who are faithful to Him, even in the most dangerous situations.',
        characters: ['Daniel', 'King Darius', 'Lions']
    },
    {
        name: 'Jonah',
        emoji: '🐋',
        color: 'from-teal-500/20 to-emerald-500/20',
        description: 'Swallowed by a Fish',
        title: 'Jonah and the Big Fish',
        content: `God told Jonah to go to Nineveh and tell the people to stop being bad. But Jonah was scared and ran away on a ship!

A big storm came. The sailors were afraid. Jonah knew the storm was because he ran from God. "Throw me into the sea!" he said.

When they did, the storm stopped. God sent a huge fish to swallow Jonah! For three days, Jonah prayed inside the fish.

The fish spit Jonah onto the beach. This time, Jonah obeyed God and went to Nineveh. The people listened and changed their ways!`,
        moral: 'We cannot run from God. It\'s always better to obey Him the first time.',
        characters: ['Jonah', 'Sailors', 'People of Nineveh']
    },
    {
        name: 'Joseph',
        emoji: '🌈',
        color: 'from-red-500/20 to-orange-500/20',
        description: 'Dreamer with Colorful Coat',
        title: 'Joseph\'s Colorful Coat',
        content: `Joseph's father gave him a beautiful coat of many colors. His brothers were jealous and sold him to traders going to Egypt.

In Egypt, Joseph worked hard. Even when bad things happened, he trusted God. God gave Joseph the ability to understand dreams.

One day, the king had a strange dream. Joseph explained it meant seven good years would come, then seven bad years of no food.

The king made Joseph second in charge of all Egypt! When the bad years came, guess who came to buy food? Joseph's brothers! Joseph forgave them and brought his whole family to Egypt.`,
        moral: 'God can turn bad situations into something good. Always trust His plan.',
        characters: ['Joseph', 'Jacob', 'Brothers', 'Pharaoh']
    }
];

export default function KidsStoriesView({ onBack }: KidsStoriesViewProps) {
    const [selectedChar, setSelectedChar] = useState<string | null>(null);

    const story = STORIES.find(s => s.name === selectedChar);

    const handleBack = () => {
        setSelectedChar(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-between mb-4">
                    {onBack && !selectedChar && (
                        <button onClick={onBack} className="flex items-center gap-2 text-gold-400 hover:text-gold-300">
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                    )}
                    <div className="flex-1" />
                    <div className="text-xs text-slate-500">
                        {STORIES.length} stories available
                    </div>
                </div>

                {!selectedChar && (
                    <>
                        <h2 className="text-3xl md:text-4xl font-serif text-gold-300 mb-2 flex items-center justify-center gap-3">
                            <Sparkles className="w-8 h-8 text-gold-400" />
                            Bible Kids Storybook
                            <Sparkles className="w-8 h-8 text-gold-400" />
                        </h2>
                        <p className="text-slate-400">Choose a hero to hear their adventure!</p>
                    </>
                )}
            </div>

            {/* Character Grid */}
            {!selectedChar && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {STORIES.map((char) => (
                        <motion.button
                            key={char.name}
                            onClick={() => setSelectedChar(char.name)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${char.color} border border-white/10 hover:border-gold-500/50 p-6 text-left transition-all group`}
                        >
                            <div className="text-4xl mb-3">{char.emoji}</div>
                            <h3 className="text-xl font-bold text-white mb-1">{char.name}</h3>
                            <p className="text-sm text-slate-300 opacity-75">{char.description}</p>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Story Display */}
            <AnimatePresence>
                {story && selectedChar && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Characters
                        </button>

                        {/* Storybook Card */}
                        <div className="bg-[#fff9e6] text-slate-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Top Decorative Bar */}
                            <div className="h-3 bg-gradient-to-r from-amber-500 via-gold-500 to-amber-500" />

                            {/* Content */}
                            <div className="p-8 md:p-12">
                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-serif text-amber-800 mb-6 text-center">
                                    {story.title}
                                </h1>

                                {/* Characters */}
                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {story.characters.map((char, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm border border-amber-200"
                                        >
                                            <Users className="w-3 h-3 inline mr-1" />
                                            {char}
                                        </span>
                                    ))}
                                </div>

                                {/* Story Content */}
                                <div className="prose prose-lg prose-amber max-w-none mb-8">
                                    {story.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-slate-700 leading-relaxed mb-4 text-lg">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Moral */}
                                <div className="bg-amber-100 rounded-xl p-6 border-2 border-amber-200">
                                    <h4 className="font-bold text-amber-800 uppercase text-sm tracking-wide mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Lesson for Us
                                    </h4>
                                    <p className="italic text-amber-900 font-medium text-lg">
                                        {story.moral}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
