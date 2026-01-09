import { GoogleGenAI, Type } from "@google/genai";
import { InterlinearResponse, Story, DailyContent, StudySession, VocabularyItem } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchInterlinear = async (reference: string, isOldTestament: boolean): Promise<InterlinearResponse> => {
  const ai = getAI();
  const sourceLang = isOldTestament ? "Hebrew" : "Greek";
  
  const prompt = `
    Analyze the Bible verse ${reference}. 
    Provide a word-for-word interlinear translation from ${sourceLang} to English and Telugu.
    Return a JSON object with:
    - reference: string
    - translation_english: string (full sentence)
    - translation_telugu: string (full sentence)
    - words: array of objects { original, transliteration, english, telugu, grammar }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            translation_english: { type: Type.STRING },
            translation_telugu: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  english: { type: Type.STRING },
                  telugu: { type: Type.STRING },
                  grammar: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as InterlinearResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const fetchDailyContent = async (): Promise<DailyContent> => {
  const ai = getAI();
  const prompt = `
    Generate a daily Bible devotional content.
    Include:
    1. A Verse of the Day (random, encouraging) with English and Telugu translations.
    2. A Character of the Day (Biblical figure) with a brief summary and key reference.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: {
            type: Type.OBJECT,
            properties: {
              reference: { type: Type.STRING },
              text_english: { type: Type.STRING },
              text_telugu: { type: Type.STRING },
            },
          },
          character: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              summary: { type: Type.STRING },
              key_reference: { type: Type.STRING },
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  return JSON.parse(text) as DailyContent;
};

export const fetchStory = async (character: string): Promise<Story> => {
  const ai = getAI();
  const prompt = `
    Write a short, engaging children's story about the Bible character: ${character}.
    The story should be suitable for kids, easy to understand.
    Include a title, the story content (mix of English/Telugu or just English with Telugu keywords), a moral lesson, and list of characters involved.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          moral: { type: Type.STRING },
          characters: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  return JSON.parse(text) as Story;
};

export const fetchStudy = async (topic: string): Promise<StudySession> => {
  const ai = getAI();
  const prompt = `
    Create a detailed, long-format Bible study session on the topic: "${topic}".
    Include:
    - Detailed content/commentary
    - 5-10 Scriptural references
    - 3-5 Reflection questions
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for deeper reasoning
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          content: { type: Type.STRING },
          references: { type: Type.ARRAY, items: { type: Type.STRING } },
          questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  return JSON.parse(text) as StudySession;
};

export const fetchBookVocabulary = async (book: string): Promise<VocabularyItem[]> => {
  const ai = getAI();
  const prompt = `
    Analyze the Hebrew vocabulary in the Old Testament book of ${book}.
    Identify 25-30 key Hebrew words found in this book.
    For each word, provide:
    1. The Hebrew word (in Hebrew script)
    2. English translation
    3. Telugu translation
    4. Hindi translation
    5. Approximate number of occurrences in the Hebrew Bible (e.g., "500+", "Common", "5").

    Return a JSON object with a "vocabulary" property containing an array of these words.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hebrew: { type: Type.STRING },
                english: { type: Type.STRING },
                telugu: { type: Type.STRING },
                hindi: { type: Type.STRING },
                occurrences: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  const data = JSON.parse(text);
  return data.vocabulary as VocabularyItem[];
};
