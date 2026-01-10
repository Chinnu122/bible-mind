import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InterlinearData, BibleStudyData, KidStory, PuzzleGame, BibleRiddle } from '../types';

const apiKey = process.env.API_KEY || '';

// Fallback if API key is missing to prevent crash, though functionality will fail.
const ai = new GoogleGenAI({ apiKey });

const modelFlash = 'gemini-3-flash-preview';
const modelPro = 'gemini-3-pro-preview';

export const getInterlinearAnalysis = async (book: string, chapter: number): Promise<InterlinearData> => {
  const isOldTestament = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'].includes(book);
  
  const language = isOldTestament ? 'Hebrew' : 'Greek';
  
  // prompt: Explicitly request ALL words.
  const prompt = `
    Analyze ${book} Chapter ${chapter}. 
    Provide a COMPLETE word-for-word breakdown for EVERY SINGLE word in this chapter.
    Do not skip any verses. Do not summarize. 
    I need the raw data for the entire chapter for a translation project.
    
    For each word, map to the following keys:
    - v: Verse number
    - o: Original ${language} word
    - t: English transliteration
    - e: English definition (literal)
    - tm: Telugu definition (Must be in Telugu script)
    - s: Strong's Number
    - c: Total occurrences in the Bible
    - f: Is this the first occurrence? (boolean)
    - r: Reference of first occurrence (e.g. "Gen 1:1") if f is true, else empty string.
    
    Return strict JSON.
  `;

  // Schema with shortened keys to save output tokens, allowing for more words per response.
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      words: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            v: { type: Type.INTEGER },
            o: { type: Type.STRING },
            t: { type: Type.STRING },
            e: { type: Type.STRING },
            tm: { type: Type.STRING },
            s: { type: Type.STRING },
            c: { type: Type.INTEGER },
            f: { type: Type.BOOLEAN },
            r: { type: Type.STRING },
          },
          required: ['v', 'o', 't', 'e', 'tm', 's', 'c', 'f']
        }
      }
    },
    required: ['words']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        // Increased token budget guidance implies we want a long response
        thinkingConfig: { thinkingBudget: 1024 }, 
        systemInstruction: "You are a biblical linguist. Output complete datasets without truncation."
      }
    });

    const text = response.text || '{ "words": [] }';
    const parsed = JSON.parse(text);
    
    // Map shortened keys back to full interface
    const mappedWords = parsed.words.map((w: any) => ({
      verse: w.v,
      originalWord: w.o,
      transliteration: w.t,
      englishMeaning: w.e,
      teluguMeaning: w.tm,
      strongsNumber: w.s,
      occurrenceCount: w.c,
      isFirstOccurrence: w.f,
      firstOccurrenceReference: w.r
    }));
    
    return {
      book,
      chapter,
      language,
      words: mappedWords
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Attempt fallback without thinking budget if it fails (older models/compatibility)
    try {
       const responseFallback = await ai.models.generateContent({
        model: modelFlash,
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: schema }
      });
      const text = responseFallback.text || '{ "words": [] }';
      const parsed = JSON.parse(text);
       const mappedWords = parsed.words.map((w: any) => ({
        verse: w.v,
        originalWord: w.o,
        transliteration: w.t,
        englishMeaning: w.e,
        teluguMeaning: w.tm,
        strongsNumber: w.s,
        occurrenceCount: w.c,
        isFirstOccurrence: w.f,
        firstOccurrenceReference: w.r
      }));
      return { book, chapter, language, words: mappedWords };
    } catch (e2) {
       throw new Error("Failed to fetch interlinear data.");
    }
  }
};

export const getBibleStudy = async (topic: string): Promise<BibleStudyData> => {
  const prompt = `Create a detailed sermon or bible study outline on: "${topic}". Include a main passage, introduction, structured key points with references, cross-references, and a conclusion.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      mainPassage: { type: Type.STRING },
      introduction: { type: Type.STRING },
      keyPoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            point: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ['point', 'reference']
        }
      },
      crossReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
      conclusion: { type: Type.STRING }
    },
    required: ['title', 'mainPassage', 'introduction', 'keyPoints', 'crossReferences', 'conclusion']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelPro,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "You are a helpful theology professor. Provide biblically accurate and structurally sound study notes."
      }
    });
    
    const text = response.text || '{}';
    return JSON.parse(text) as BibleStudyData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch study data.");
  }
};

export const getKidStory = async (character: string): Promise<KidStory> => {
  const prompt = `Write a short, engaging Bible story about ${character} suitable for children. Include a moral lesson.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      character: { type: Type.STRING },
      storyText: { type: Type.STRING },
      moral: { type: Type.STRING },
      ageGroup: { type: Type.STRING }
    },
    required: ['title', 'character', 'storyText', 'moral', 'ageGroup']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "You are a Sunday School teacher. Write simple, inspiring, and safe stories for kids."
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as KidStory;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate story.");
  }
};

export const getBiblePuzzle = async (): Promise<PuzzleGame> => {
  const prompt = `Create a Bible trivia game with 5 multiple choice questions.`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING }
          },
          required: ['id', 'question', 'options', 'correctAnswer']
        }
      }
    },
    required: ['topic', 'questions']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as PuzzleGame;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate puzzle.");
  }
};

export const getBibleRiddle = async (): Promise<BibleRiddle> => {
  const prompt = `
    Create a challenging biblical riddle about a person, place, or object from the Bible.
    The riddle should be poetic or cryptic.
    Provide 3 hints that get progressively easier.
    Provide the answer and a list of accepted variations of the answer (e.g. "Simon Peter", "Peter").
    Provide a short explanation or scripture reference.
    Assign a difficulty level.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      riddle: { type: Type.STRING },
      hints: { type: Type.ARRAY, items: { type: Type.STRING } },
      answer: { type: Type.STRING },
      acceptedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
      explanation: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] }
    },
    required: ['riddle', 'hints', 'answer', 'acceptedAnswers', 'explanation', 'difficulty']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as BibleRiddle;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate riddle.");
  }
};
