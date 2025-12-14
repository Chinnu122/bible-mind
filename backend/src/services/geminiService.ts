import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const generateImagePrompt = async (verseText: string, verseReference: string): Promise<string> => {
    try {
        const prompt = `Create a highly detailed, artistic, and photorealistic AI image generation prompt based on this Bible verse: "${verseText}" (${verseReference}). 
        The prompt should be descriptive, mentioning lighting, style (e.g., cinematic, oil painting, ethereal), and mood. 
        Keep the prompt under 100 words. Return ONLY the prompt text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().replace(/\n/g, ' ').trim();
    } catch (error) {
        console.error("Error generating prompt with Gemini:", error);
        return `An ethereal and spiritual representation of ${verseReference}: ${verseText}, cinematic lighting, 8k resolution.`;
    }
};
