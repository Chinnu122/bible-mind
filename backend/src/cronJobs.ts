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

export const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running Hourly Verse Image Generation Task...');
        try {
            // Pick random verse
            const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];

            // 1. Generate Prompt with Gemini
            console.log(`Enhancing prompt for ${randomVerse.ref}...`);
            const enhancedPrompt = await generateImagePrompt(randomVerse.text, randomVerse.ref);

            // 2. Generate Image
            console.log(`Generating image...`);
            const imageUrl = await generateImage(enhancedPrompt, randomVerse.ref);

            if (imageUrl) {
                console.log(`Successfully generated image: ${imageUrl}`);
            } else {
                console.error('Failed to generate image.');
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
};

// Function to trigger manually for testing
export const triggerImageGen = async () => {
    const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
    const enhancedPrompt = await generateImagePrompt(randomVerse.text, randomVerse.ref);
    return await generateImage(enhancedPrompt, randomVerse.ref);
};
