/**
 * AI Prompt Generation Service
 * Uses OpenRouter API for generating image prompts
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenRouter client
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://biblemind.app',
        'X-Title': 'Bible Mind'
    }
});

// Model for fast text generation
const MODEL = 'google/gemini-2.0-flash-001';

export const generateImagePrompt = async (verseText: string, verseReference: string): Promise<string> => {
    try {
        // Check if API key is configured
        if (!process.env.OPENROUTER_API_KEY) {
            console.warn('[AI] OPENROUTER_API_KEY not configured, using fallback prompt');
            return `An ethereal and spiritual representation of ${verseReference}: ${verseText}, cinematic lighting, soft golden glow, 8k resolution, hyper-detailed, divine atmosphere.`;
        }

        const prompt = `Create a highly detailed, artistic, and photorealistic AI image generation prompt based on this Bible verse: "${verseText}" (${verseReference}). 
        The prompt should be descriptive, mentioning lighting, style (e.g., cinematic, oil painting, ethereal), and mood. 
        Keep the prompt under 100 words. Return ONLY the prompt text.`;

        const response = await openrouter.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at creating detailed prompts for AI image generation. Return ONLY the prompt text, no explanations.'
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.8
        });

        const text = response.choices[0]?.message?.content || '';
        return text.replace(/\n/g, ' ').trim() ||
            `An ethereal and spiritual representation of ${verseReference}: ${verseText}, cinematic lighting, 8k resolution.`;
    } catch (error) {
        console.error("[AI] Error generating prompt with OpenRouter:", error);
        return `An ethereal and spiritual representation of ${verseReference}: ${verseText}, cinematic lighting, soft golden glow, 8k resolution, hyper-detailed, divine atmosphere.`;
    }
};
