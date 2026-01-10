/**
 * OpenRouter AI Service
 * Uses OpenRouter API for AI content generation
 * Each generated content is cached in PostgreSQL
 */

import OpenAI from 'openai';

// Initialize OpenRouter client (uses OpenAI-compatible API)
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://biblemind.app',
        'X-Title': 'Bible Mind'
    }
});

// Models to use
const MODEL_FAST = 'google/gemini-2.0-flash-001';
const MODEL_PRO = 'google/gemini-2.0-flash-001';

// Old Testament books for Hebrew/Greek detection
const OLD_TESTAMENT_BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
    'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
    'Zechariah', 'Malachi'
];

// ============================================
// INTERLINEAR ANALYSIS
// ============================================

export interface InterlinearWord {
    verse: number;
    originalWord: string;
    transliteration: string;
    englishMeaning: string;
    teluguMeaning: string;
    hindiMeaning: string;
    strongsNumber: string;
    occurrenceCount: number;
    isFirstOccurrence: boolean;
    firstOccurrenceReference?: string;
}

export interface InterlinearData {
    book: string;
    chapter: number;
    language: 'Hebrew' | 'Greek';
    words: InterlinearWord[];
}

export async function generateInterlinear(book: string, chapter: number): Promise<InterlinearData> {
    const isOldTestament = OLD_TESTAMENT_BOOKS.includes(book);
    const language = isOldTestament ? 'Hebrew' : 'Greek';

    const prompt = `Analyze ${book} Chapter ${chapter}. 
Provide a COMPLETE word-by-word breakdown for EVERY word in this chapter.
Do not skip any verses. Do not summarize.

For each word, provide:
- v: Verse number
- o: Original ${language} word
- t: English transliteration
- e: English definition (literal)
- te: Telugu definition (Must be in Telugu script)
- hi: Hindi definition (Must be in Devanagari script)
- s: Strong's Number
- c: Total occurrences in the Bible
- f: Is this the first occurrence? (boolean)
- r: Reference of first occurrence (e.g. "Gen 1:1") if f is true, else empty string.

Return JSON format: { "words": [ { v, o, t, e, te, hi, s, c, f, r }, ... ] }`;

    try {
        const response = await openrouter.chat.completions.create({
            model: MODEL_FAST,
            messages: [
                {
                    role: 'system',
                    content: 'You are a biblical linguist expert. Output complete datasets without truncation. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 16000,
            temperature: 0.3
        });

        const text = response.choices[0]?.message?.content || '{ "words": [] }';
        const parsed = JSON.parse(text);

        // Map shortened keys to full interface
        const mappedWords: InterlinearWord[] = (parsed.words || []).map((w: any) => ({
            verse: w.v,
            originalWord: w.o,
            transliteration: w.t,
            englishMeaning: w.e,
            teluguMeaning: w.te || '',
            hindiMeaning: w.hi || '',
            strongsNumber: w.s,
            occurrenceCount: w.c,
            isFirstOccurrence: w.f,
            firstOccurrenceReference: w.r || ''
        }));

        return {
            book,
            chapter,
            language,
            words: mappedWords
        };
    } catch (error) {
        console.error('Interlinear generation error:', error);
        throw new Error('Failed to generate interlinear analysis');
    }
}

// ============================================
// BIBLE STUDY
// ============================================

export interface StudyPoint {
    point: string;
    reference: string;
}

export interface BibleStudyData {
    title: string;
    mainPassage: string;
    introduction: string;
    keyPoints: StudyPoint[];
    crossReferences: string[];
    conclusion: string;
}

export async function generateBibleStudy(topic: string): Promise<BibleStudyData> {
    const prompt = `Create a detailed sermon or bible study outline on: "${topic}". 
Include a main passage, introduction, structured key points with references, cross-references, and a conclusion.

Return JSON format:
{
  "title": "Study Title",
  "mainPassage": "Book Chapter:Verse",
  "introduction": "Opening paragraph",
  "keyPoints": [{ "point": "Key insight", "reference": "Scripture reference" }],
  "crossReferences": ["Related verses"],
  "conclusion": "Closing thoughts"
}`;

    try {
        const response = await openrouter.chat.completions.create({
            model: MODEL_PRO,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful theology professor. Provide biblically accurate and structurally sound study notes. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 4000,
            temperature: 0.7
        });

        const text = response.choices[0]?.message?.content || '{}';
        return JSON.parse(text) as BibleStudyData;
    } catch (error) {
        console.error('Bible study generation error:', error);
        throw new Error('Failed to generate bible study');
    }
}

// ============================================
// KIDS STORY
// ============================================

export interface KidStory {
    title: string;
    character: string;
    storyText: string;
    moral: string;
    ageGroup: string;
}

export async function generateKidStory(character: string): Promise<KidStory> {
    const prompt = `Write a short, engaging Bible story about ${character} suitable for children ages 5-10. 
Include a moral lesson. Make it fun, colorful, and easy to understand.

Return JSON format:
{
  "title": "Story Title",
  "character": "${character}",
  "storyText": "The full story text with multiple paragraphs separated by \\n",
  "moral": "The moral lesson",
  "ageGroup": "5-10 years"
}`;

    try {
        const response = await openrouter.chat.completions.create({
            model: MODEL_FAST,
            messages: [
                {
                    role: 'system',
                    content: 'You are a Sunday School teacher. Write simple, inspiring, and safe stories for kids. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
            temperature: 0.8
        });

        const text = response.choices[0]?.message?.content || '{}';
        return JSON.parse(text) as KidStory;
    } catch (error) {
        console.error('Kid story generation error:', error);
        throw new Error('Failed to generate kid story');
    }
}

// ============================================
// QUIZ / PUZZLES
// ============================================

export interface PuzzleQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface PuzzleGame {
    topic: string;
    questions: PuzzleQuestion[];
}

export async function generateQuiz(topic?: string): Promise<PuzzleGame> {
    const quizTopic = topic || 'General Bible Knowledge';
    const prompt = `Create a Bible trivia game about "${quizTopic}" with 5 multiple choice questions.
Each question should have 4 options with one correct answer.

Return JSON format:
{
  "topic": "${quizTopic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B"
    }
  ]
}`;

    try {
        const response = await openrouter.chat.completions.create({
            model: MODEL_FAST,
            messages: [
                {
                    role: 'system',
                    content: 'You are a Bible quiz master. Create engaging and educational questions. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
            temperature: 0.7
        });

        const text = response.choices[0]?.message?.content || '{}';
        return JSON.parse(text) as PuzzleGame;
    } catch (error) {
        console.error('Quiz generation error:', error);
        throw new Error('Failed to generate quiz');
    }
}

// ============================================
// RIDDLE / MIND GAME
// ============================================

export interface BibleRiddle {
    riddle: string;
    hints: string[];
    answer: string;
    acceptedAnswers: string[];
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export async function generateRiddle(): Promise<BibleRiddle> {
    const prompt = `Create a challenging biblical riddle about a person, place, or object from the Bible.
The riddle should be poetic or cryptic.
Provide 3 hints that get progressively easier.
Provide the answer and a list of accepted variations of the answer (e.g. "Simon Peter", "Peter").
Provide a short explanation or scripture reference.
Assign a difficulty level.

Return JSON format:
{
  "riddle": "The cryptic riddle text",
  "hints": ["First hint", "Second hint", "Third hint"],
  "answer": "The Answer",
  "acceptedAnswers": ["The Answer", "Alternate name", "Another variation"],
  "explanation": "Brief explanation with scripture reference",
  "difficulty": "Medium"
}`;

    try {
        const response = await openrouter.chat.completions.create({
            model: MODEL_FAST,
            messages: [
                {
                    role: 'system',
                    content: 'You are a biblical riddle master. Create engaging and educational riddles. Return only valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 1000,
            temperature: 0.9
        });

        const text = response.choices[0]?.message?.content || '{}';
        return JSON.parse(text) as BibleRiddle;
    } catch (error) {
        console.error('Riddle generation error:', error);
        throw new Error('Failed to generate riddle');
    }
}

// Hash function for riddle uniqueness
export function hashRiddle(riddle: string): string {
    let hash = 0;
    for (let i = 0; i < riddle.length; i++) {
        const char = riddle.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}
