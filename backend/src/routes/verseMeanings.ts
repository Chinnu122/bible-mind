import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';

const router = Router();

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY_GPT;

interface WordMeaning {
    word: string;
    strongsNumber: string;
    transliteration: string;
    meaning: string;
    teluguMeaning: string;
    occurrences: number;
    firstReference: string;
}

/**
 * GET /api/verse-meanings/:bookId/:chapter/:verse
 * Get AI-generated word meanings for a verse (cached)
 */
router.get('/:bookId/:chapter/:verse', async (req: Request, res: Response) => {
    try {
        const bookId = parseInt(req.params.bookId);
        const chapter = parseInt(req.params.chapter);
        const verse = parseInt(req.params.verse);

        if (isNaN(bookId) || isNaN(chapter) || isNaN(verse)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        // Check cache first
        const cached = await prisma.verseWordMeaning.findUnique({
            where: {
                bookId_chapter_verse: { bookId, chapter, verse }
            }
        });

        if (cached) {
            return res.json({
                success: true,
                cached: true,
                data: cached.wordMeanings,
                generatedAt: cached.generatedAt
            });
        }

        // Get the verse from database
        const verseData = await prisma.verse.findUnique({
            where: {
                bookId_chapter_verse: { bookId, chapter, verse }
            },
            include: { book: true }
        });

        if (!verseData) {
            return res.status(404).json({ error: 'Verse not found' });
        }

        const isOT = bookId <= 39;
        const originalText = isOT ? verseData.hebrewText : verseData.greekText;
        const translations = verseData.translations as any;
        const kjvText = translations?.kjv || '';

        if (!originalText) {
            return res.status(404).json({ error: 'Original text not available for this verse' });
        }

        // Generate meanings using AI
        const wordMeanings = await generateWordMeanings(
            originalText,
            kjvText,
            isOT ? 'Hebrew' : 'Greek',
            verseData.book.bookName,
            chapter,
            verse
        );

        // Cache the result
        const savedMeaning = await prisma.verseWordMeaning.create({
            data: {
                bookId,
                chapter,
                verse,
                wordMeanings: wordMeanings as any,
                modelUsed: 'gpt-4o-mini'
            }
        });

        return res.json({
            success: true,
            cached: false,
            data: wordMeanings,
            generatedAt: savedMeaning.generatedAt
        });

    } catch (error: any) {
        console.error('Error getting verse meanings:', error);
        return res.status(500).json({ error: error.message || 'Failed to get verse meanings' });
    }
});

/**
 * Generate word meanings using OpenRouter AI
 */
async function generateWordMeanings(
    originalText: string,
    englishText: string,
    language: 'Hebrew' | 'Greek',
    bookName: string,
    chapter: number,
    verse: number
): Promise<WordMeaning[]> {

    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured');
    }

    const prompt = `You are a Biblical Hebrew and Greek scholar. Analyze this ${language} verse and provide the ORIGINAL meaning of each significant word (not just translations).

Verse: ${bookName} ${chapter}:${verse}
Original ${language}: ${originalText}
English (KJV): ${englishText}

For each significant word (skip common particles like "and", "the" in ${language}), provide:
1. The original ${language} word
2. Strong's number (H for Hebrew, G for Greek)
3. Transliteration (how to pronounce)
4. Original meaning (the core meaning in the original language, not just English translation)
5. Telugu meaning (తెలుగు అర్థం)
6. Approximate occurrences in the Bible
7. First biblical reference where this word appears

Return as a JSON array with objects having these exact fields:
{
  "word": "${language} word",
  "strongsNumber": "H1234 or G1234",
  "transliteration": "pronunciation",
  "meaning": "original core meaning in English",
  "teluguMeaning": "తెలుగు అర్థం",
  "occurrences": 100,
  "firstReference": "Genesis 1:1"
}

Return ONLY the JSON array, no explanation or markdown.`;

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://bible-mind.vercel.app',
            'X-Title': 'Bible Mind - Word Meanings'
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Biblical languages expert. Return only valid JSON arrays, no markdown or explanations.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('OpenRouter API error:', errText);
        throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json() as {
        choices?: Array<{
            message?: {
                content?: string;
            };
        }>;
    };
    const content = data.choices?.[0]?.message?.content || '[]';

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    try {
        const meanings = JSON.parse(jsonStr);
        return Array.isArray(meanings) ? meanings : [];
    } catch (e) {
        console.error('Failed to parse AI response:', content);
        return [];
    }
}

export default router;
