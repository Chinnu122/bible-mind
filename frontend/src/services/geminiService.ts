/**
 * AI Service with Multi-Provider Fallback
 * Supports: OpenRouter (Gemini, GPT, Claude), Groq, Google AI Studio
 * Auto-switches to working API on failure
 */

// API Provider configurations
const API_PROVIDERS = [
    {
        name: 'google-ai-studio',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
        apiKey: 'AIzaSyA1m0sK7Wn_CM6FPg6R0B2T0JYDjqXVRk',
        model: 'gemini-2.0-flash',
        type: 'google'
    },
    {
        name: 'openrouter-gemini-flash',
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: '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',
        model: 'google/gemini-2.0-flash-exp:free',
        type: 'openrouter'
    },
    {
        name: 'openrouter-gemini-pro',
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: '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',
        model: 'google/gemini-pro',
        type: 'openrouter'
    },
    {
        name: 'groq',
        baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: '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',
        model: 'llama-3.3-70b-versatile',
        type: 'openai-compatible'
    }
];

let currentProviderIndex = 0;

// Types
export interface InterlinearWord {
    original: string;
    transliteration: string;
    english: string;
    telugu: string;
    hindi: string;
    grammar: string;
}

export interface InterlinearResponse {
    reference: string;
    translation_english: string;
    translation_telugu: string;
    translation_hindi: string;
    words: InterlinearWord[];
}

export interface Story {
    title: string;
    title_telugu: string;
    title_hindi: string;
    content: string;
    content_telugu: string;
    content_hindi: string;
    moral: string;
    moral_telugu: string;
    moral_hindi: string;
    characters: string[];
}

export interface StudySession {
    topic: string;
    content: string;
    content_telugu: string;
    content_hindi: string;
    references: string[];
    questions: string[];
    questions_telugu: string[];
    questions_hindi: string[];
}

export interface VocabularyItem {
    hebrew: string;
    english: string;
    telugu: string;
    hindi: string;
    occurrences: string;
}

// Cache keys
const CACHE_KEYS = {
    INTERLINEAR: 'biblemind_interlinear_cache',
    STORIES: 'biblemind_stories_cache',
    STUDIES: 'biblemind_studies_cache',
    VOCABULARY: 'biblemind_vocabulary_cache'
};

// Cache helpers
function getCache<T>(key: string, subKey: string): T | null {
    try {
        const cache = localStorage.getItem(key);
        if (cache) {
            const parsed = JSON.parse(cache);
            return parsed[subKey] || null;
        }
    } catch (e) {
        console.error('Cache read error:', e);
    }
    return null;
}

function setCache<T>(key: string, subKey: string, data: T): void {
    try {
        const cache = localStorage.getItem(key);
        const parsed = cache ? JSON.parse(cache) : {};
        parsed[subKey] = data;
        localStorage.setItem(key, JSON.stringify(parsed));
    } catch (e) {
        console.error('Cache write error:', e);
    }
}

// Generic AI call with fallback
async function callAI(prompt: string, jsonMode: boolean = true): Promise<string> {
    const maxRetries = API_PROVIDERS.length;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const provider = API_PROVIDERS[(currentProviderIndex + attempt) % API_PROVIDERS.length];

        try {
            console.log(`Trying provider: ${provider.name}`);
            let response: Response;

            if (provider.type === 'google') {
                // Google AI Studio format
                response = await fetch(
                    `${provider.baseUrl}/${provider.model}:generateContent?key=${provider.apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                responseMimeType: jsonMode ? 'application/json' : 'text/plain'
                            }
                        })
                    }
                );

                if (!response.ok) throw new Error(`Google API error: ${response.status}`);

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) throw new Error('No response from Google AI');

                // Update working provider
                currentProviderIndex = (currentProviderIndex + attempt) % API_PROVIDERS.length;
                return text;

            } else {
                // OpenRouter / OpenAI compatible format
                response = await fetch(provider.baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${provider.apiKey}`,
                        ...(provider.type === 'openrouter' && {
                            'HTTP-Referer': window.location.origin,
                            'X-Title': 'Bible Mind'
                        })
                    },
                    body: JSON.stringify({
                        model: provider.model,
                        messages: [
                            { role: 'system', content: 'You are a helpful Bible study assistant. Always respond in valid JSON format when asked.' },
                            { role: 'user', content: prompt }
                        ],
                        response_format: jsonMode ? { type: 'json_object' } : undefined
                    })
                });

                if (!response.ok) throw new Error(`API error: ${response.status}`);

                const data = await response.json();
                const text = data.choices?.[0]?.message?.content;
                if (!text) throw new Error('No response from API');

                // Update working provider
                currentProviderIndex = (currentProviderIndex + attempt) % API_PROVIDERS.length;
                return text;
            }

        } catch (error) {
            console.warn(`Provider ${provider.name} failed:`, error);
            if (attempt === maxRetries - 1) {
                throw new Error('All AI providers failed. Please try again later.');
            }
        }
    }

    throw new Error('All AI providers failed');
}

// ========== INTERLINEAR ==========
export async function fetchInterlinear(reference: string, isOldTestament: boolean, forceRefresh: boolean = false): Promise<InterlinearResponse> {
    // Check cache first (unless forceRefresh)
    if (!forceRefresh) {
        const cached = getCache<InterlinearResponse>(CACHE_KEYS.INTERLINEAR, reference);
        if (cached) {
            console.log('Returning cached interlinear for:', reference);
            return cached;
        }
    }

    const sourceLang = isOldTestament ? 'Hebrew' : 'Greek';

    const prompt = `Analyze the Bible verse ${reference}. 
Provide a word-for-word interlinear translation from ${sourceLang} to English, Telugu, and Hindi.
Return a JSON object with EXACTLY this structure:
{
  "reference": "${reference}",
  "translation_english": "full English translation",
  "translation_telugu": "full Telugu translation in Telugu script",
  "translation_hindi": "full Hindi translation in Devanagari script",
  "words": [
    {
      "original": "${sourceLang} word",
      "transliteration": "romanized form",
      "english": "English meaning",
      "telugu": "Telugu meaning in Telugu script",
      "hindi": "Hindi meaning in Devanagari script",
      "grammar": "grammatical info (noun, verb, etc)"
    }
  ]
}
Include 5-15 key words from the verse.`;

    const response = await callAI(prompt);
    const result = JSON.parse(response) as InterlinearResponse;

    // Cache the result
    setCache(CACHE_KEYS.INTERLINEAR, reference, result);

    return result;
}

// ========== KIDS STORIES ==========
export async function fetchStory(character: string, forceRefresh: boolean = false): Promise<Story> {
    // Check cache first (unless forceRefresh)
    if (!forceRefresh) {
        const cached = getCache<Story>(CACHE_KEYS.STORIES, character.toLowerCase());
        if (cached) {
            console.log('Returning cached story for:', character);
            return cached;
        }
    }

    const prompt = `Write a short, engaging children's story about the Bible character: ${character}.
The story should be suitable for kids aged 6-12, easy to understand, with simple vocabulary.
Provide the story in English, Telugu, and Hindi.
Return a JSON object with EXACTLY this structure:
{
  "title": "Story title in English",
  "title_telugu": "Story title in Telugu script",
  "title_hindi": "Story title in Devanagari script",
  "content": "The story content in English (3-4 paragraphs)",
  "content_telugu": "The story content in Telugu script",
  "content_hindi": "The story content in Devanagari script",
  "moral": "The moral lesson in English",
  "moral_telugu": "The moral lesson in Telugu script",
  "moral_hindi": "The moral lesson in Devanagari script",
  "characters": ["${character}", "other characters in the story"]
}`;

    const response = await callAI(prompt);
    const result = JSON.parse(response) as Story;

    // Cache the result
    setCache(CACHE_KEYS.STORIES, character.toLowerCase(), result);

    return result;
}

// ========== BIBLE STUDY ==========
export async function fetchStudy(topic: string, forceRefresh: boolean = false): Promise<StudySession> {
    // Check cache first (unless forceRefresh)
    if (!forceRefresh) {
        const cached = getCache<StudySession>(CACHE_KEYS.STUDIES, topic.toLowerCase());
        if (cached) {
            console.log('Returning cached study for:', topic);
            return cached;
        }
    }

    const prompt = `Create a detailed Bible study session on the topic: "${topic}".
Provide content in English, Telugu, and Hindi.
Return a JSON object with EXACTLY this structure:
{
  "topic": "${topic}",
  "content": "Detailed study content in English (3-5 paragraphs with theological insights)",
  "content_telugu": "Study content translated to Telugu script",
  "content_hindi": "Study content translated to Devanagari script",
  "references": ["Scripture reference 1", "Scripture reference 2", "...5-10 references"],
  "questions": ["Reflection question 1 in English?", "Question 2?", "...3-5 questions"],
  "questions_telugu": ["Reflection question 1 in Telugu?", "..."],
  "questions_hindi": ["Reflection question 1 in Hindi?", "..."]
}`;

    const response = await callAI(prompt);
    const result = JSON.parse(response) as StudySession;

    // Cache the result
    setCache(CACHE_KEYS.STUDIES, topic.toLowerCase(), result);

    return result;
}

// ========== VOCABULARY ==========
export async function fetchBookVocabulary(book: string): Promise<VocabularyItem[]> {
    // Check cache first
    const cached = getCache<VocabularyItem[]>(CACHE_KEYS.VOCABULARY, book.toLowerCase());
    if (cached) {
        console.log('Returning cached vocabulary for:', book);
        return cached;
    }

    const prompt = `Analyze the Hebrew vocabulary in the Old Testament book of ${book}.
Identify 20-25 key Hebrew words found in this book.
Return a JSON object with EXACTLY this structure:
{
  "vocabulary": [
    {
      "hebrew": "Hebrew word in Hebrew script",
      "english": "English translation",
      "telugu": "Telugu translation in Telugu script",
      "hindi": "Hindi translation in Devanagari",
      "occurrences": "Approximate count (e.g., '45', '100+', 'Common')"
    }
  ]
}`;

    const response = await callAI(prompt);
    const data = JSON.parse(response);
    const result = data.vocabulary as VocabularyItem[];

    // Cache the result
    setCache(CACHE_KEYS.VOCABULARY, book.toLowerCase(), result);

    return result;
}

// ========== EXPORT FUNCTIONS ==========
export function clearCache(type?: 'interlinear' | 'stories' | 'studies' | 'vocabulary'): void {
    if (type) {
        const keyMap = {
            interlinear: CACHE_KEYS.INTERLINEAR,
            stories: CACHE_KEYS.STORIES,
            studies: CACHE_KEYS.STUDIES,
            vocabulary: CACHE_KEYS.VOCABULARY
        };
        localStorage.removeItem(keyMap[type]);
    } else {
        Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
    }
}

export function getCacheStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    Object.entries(CACHE_KEYS).forEach(([name, key]) => {
        try {
            const cache = localStorage.getItem(key);
            stats[name.toLowerCase()] = cache ? Object.keys(JSON.parse(cache)).length : 0;
        } catch {
            stats[name.toLowerCase()] = 0;
        }
    });
    return stats;
}
