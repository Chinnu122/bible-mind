import cron from 'node-cron';
import { generateImagePrompt } from './services/geminiService';
import { generateImage } from './services/imageGenService';
import fs from 'fs';
import path from 'path';

// Simple list of verses to pick from (can be expanded or fetched from DB)
const VERSES = [
    { text: "In the beginning God created the heavens and the earth.", ref: "Genesis 1:1" },
    { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
    { text: "For I know the plans I have for you, declares the Lord.", ref: "Jeremiah 29:11" },
    { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { text: "But those who hope in the Lord will renew their strength.", ref: "Isaiah 40:31" },
    { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" },
    { text: "The heavens declare the glory of God; the skies proclaim the work of his hands.", ref: "Psalm 19:1" },
    { text: "Be still, and know that I am God.", ref: "Psalm 46:10" }
];

type DailyVerseMeta = {
    date: string; // YYYY-MM-DD
    generatedAt: string; // ISO
    verse: { text: string; ref: string };
    imageUrl: string | null;
    prompt?: string;
};

const getIsoDate = (d = new Date()): string => d.toISOString().split('T')[0];

const getDayOfYear = (d = new Date()): number => {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const findPublicDir = (): string => {
    // dev: running from backend/
    let p = path.join(process.cwd(), 'public');
    if (fs.existsSync(p)) return p;

    // dev: running from repo root
    p = path.join(process.cwd(), 'backend', 'public');
    if (fs.existsSync(p)) return p;

    // prod: dist
    return path.join(__dirname, '../public');
};

export const DAILY_VERSE_META_PATH = path.join(findPublicDir(), 'daily_verse.json');

const pickDailyVerse = (date = new Date()): { text: string; ref: string } => {
    // deterministic rotation so "today" is stable across restarts
    const idx = (getDayOfYear(date) - 1) % VERSES.length;
    return VERSES[idx];
};

export const readDailyVerseMeta = (): DailyVerseMeta | null => {
    try {
        if (!fs.existsSync(DAILY_VERSE_META_PATH)) return null;
        const raw = fs.readFileSync(DAILY_VERSE_META_PATH, 'utf-8');
        return JSON.parse(raw) as DailyVerseMeta;
    } catch {
        return null;
    }
};

const writeDailyVerseMeta = (meta: DailyVerseMeta) => {
    fs.mkdirSync(path.dirname(DAILY_VERSE_META_PATH), { recursive: true });
    fs.writeFileSync(DAILY_VERSE_META_PATH, JSON.stringify(meta, null, 2), 'utf-8');
};

export const ensureDailyVerseImage = async (): Promise<DailyVerseMeta> => {
    const today = getIsoDate();
    const existing = readDailyVerseMeta();
    if (existing?.date === today && existing.imageUrl) {
        return existing;
    }

    const verse = pickDailyVerse(new Date());

    console.log(`Generating DAILY verse image for ${today} (${verse.ref})...`);
    const enhancedPrompt = await generateImagePrompt(verse.text, verse.ref);
    const imageUrl = await generateImage(enhancedPrompt, verse.ref);

    const meta: DailyVerseMeta = {
        date: today,
        generatedAt: new Date().toISOString(),
        verse,
        imageUrl,
        prompt: enhancedPrompt
    };

    writeDailyVerseMeta(meta);
    return meta;
};

export const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Ensure we have today's verse image on boot (covers missed cron runs)
    ensureDailyVerseImage().catch((e) => console.error('Daily verse bootstrap failed:', e));

    // Run once per day (00:10)
    cron.schedule('10 0 * * *', async () => {
        console.log('Running Daily Verse Image Generation Task...');
        try {
            const meta = await ensureDailyVerseImage();
            if (meta.imageUrl) {
                console.log(`Daily verse ready: ${meta.verse.ref} -> ${meta.imageUrl}`);
            } else {
                console.error('Daily verse image generation failed (imageUrl null).');
            }
        } catch (error) {
            console.error('Error in daily cron job:', error);
        }
    });
};

// Function to trigger manually for testing
export const triggerImageGen = async () => {
    const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
    const enhancedPrompt = await generateImagePrompt(randomVerse.text, randomVerse.ref);
    return await generateImage(enhancedPrompt, randomVerse.ref);
};
