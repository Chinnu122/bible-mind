import { GoogleGenAI, Type } from "@google/genai";
import { VerseAnalysis, StoryPage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to validate key presence (in a real app, we'd handle this better)
const checkKey = () => {
  if (!apiKey) throw new Error("API Key is missing. Please set process.env.API_KEY");
};

export const analyzeVerse = async (book: string, chapter: string, verse: string): Promise<VerseAnalysis> => {
  checkKey();
  
  const prompt = `
    Analyze ${book} ${chapter}:${verse}. 
    It is from the ${book === 'Matthew' || book === 'Mark' || book === 'Luke' || book === 'John' || book === 'Acts' || book === 'Romans' || book.includes('Corinthians') || book.includes('Galatians') || book.includes('Ephesians') || book.includes('Philippians') || book.includes('Colossians') || book.includes('Thessalonians') || book.includes('Timothy') || book.includes('Titus') || book.includes('Philemon') || book.includes('Hebrews') || book.includes('James') || book.includes('Peter') || book.includes('John') || book === 'Jude' || book === 'Revelation' ? 'New Testament (Greek)' : 'Old Testament (Hebrew)'}.
    
    Provide a JSON response with:
    1. The full verse text in English.
    2. A word-for-word breakdown. For each word include:
       - original word (Hebrew/Greek script)
       - transliteration
       - Strong's number
       - basic grammar/morphology
       - meaning in English, Telugu, Hindi, and Tamil.
    3. 3-5 Cross references.
    4. A brief theological commentary.

    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            text: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  strongs: { type: Type.STRING },
                  grammar: { type: Type.STRING },
                  meanings: {
                    type: Type.OBJECT,
                    properties: {
                      english: { type: Type.STRING },
                      telugu: { type: Type.STRING },
                      hindi: { type: Type.STRING },
                      tamil: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            crossReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
            commentary: { type: Type.STRING }
          }
        }
      }
    });
    
    return JSON.parse(response.text || '{}') as VerseAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateStoryPage = async (book: string, pageNum: number, previousContext: string = ''): Promise<StoryPage> => {
  checkKey();

  const prompt = `
    You are writing a children's storybook based on the Bible book of ${book}.
    We are currently on page ${pageNum}.
    Previous context: ${previousContext || "Start of the story."}
    
    Write the content for Page ${pageNum} (approx 100-150 words). Simple language, engaging for kids.
    Also provide a descriptive image prompt for this specific scene to generate a visual.
    
    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          content: { type: Type.STRING },
          imagePrompt: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}') as StoryPage;
};

export const generateStoryImage = async (imagePrompt: string): Promise<string> => {
  checkKey();
  try {
    // Using gemini-2.5-flash-image as requested for visuals (nano banana)
    // Note: The prompt says "Call generateContent to generate images... output response may contain both image and text parts"
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A colorful, gentle, children's book illustration style. ${imagePrompt}` }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return ''; // Fallback or placeholder handling in UI
  } catch (e) {
    console.error("Image gen failed", e);
    return 'https://picsum.photos/400/300'; // Fallback
  }
};

export const searchBible = async (query: string): Promise<any[]> => {
  checkKey();
  // Using generic search via LLM because of multilingual requirements (Roman Telugu etc)
  const prompt = `
    Search the Bible for: "${query}".
    The query might be in English, Telugu, Hindi, Tamil, or transliterated (Roman Telugu/Hindi).
    Identify the intent and find 5 relevant Bible passages.
    Return JSON array of { reference: string, text: string, relevance: string }.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            text: { type: Type.STRING },
            relevance: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
