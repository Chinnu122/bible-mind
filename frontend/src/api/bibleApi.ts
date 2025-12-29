export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface BibleBook {
  bookId: number;
  bookName: string;
  hebrewName: string;
  hebrewTransliteration: string;
  hebrewMeaning: string;
  greekName: string;
  greekTransliteration: string;
  chapterCount: number;
  verseCount: number;
  shortName: string;
  testament: 'old' | 'new';
}

export interface BibleVerse {
  id: number;
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  webText: string;
  kjvText: string;
  hebrewText: string;
  jpsText: string;
  greekText: string;
  brentonText: string;
  reference?: string;
}

export interface TeluguVerse {
  verse: number;
  teluguText: string;
}

export interface StrongsDefinition {
  strongsNumber: string;
  word: string;
  gloss: string;
  english: string;
  telugu: string;
  language: string;
  partOfSpeech: string;
  gender: string;
  occurrences: number;
  firstOccurrence: string;
  rootWord: string;
  pos?: string;
  root?: string;
  testament?: string;
}

// Local dictionary entry from JSON
interface DictionaryEntry {
  strongs: string;
  word: string;
  testament: string;
  language: string;
  pos: string;
  english: string;
  telugu: string;
  occurrences: number;
  gloss?: string;
  root?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
  };
}

// Cache for the local dictionary
let cachedDictionary: Record<string, DictionaryEntry> | null = null;
let wordIndex: Map<string, string[]> | null = null; // Map word -> [strongs numbers]

// Load local dictionary from JSON
async function loadLocalDictionary(): Promise<Record<string, DictionaryEntry>> {
  if (cachedDictionary) return cachedDictionary;

  try {
    const response = await fetch('/data/strongs_dictionary.json');
    if (!response.ok) {
      console.error('Failed to load strongs dictionary:', response.statusText);
      return {};
    }
    cachedDictionary = await response.json();

    // Build word index for fast lookups
    wordIndex = new Map();
    for (const [strongsNum, entry] of Object.entries(cachedDictionary || {})) {
      const word = entry.word?.toLowerCase().trim();
      if (word) {
        if (!wordIndex.has(word)) {
          wordIndex.set(word, []);
        }
        wordIndex.get(word)!.push(strongsNum);
      }
    }

    console.log(`📖 Loaded ${Object.keys(cachedDictionary || {}).length} Strong's entries`);
    return cachedDictionary || {};
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return {};
  }
}

// Convert dictionary entry to StrongsDefinition
function entryToDefinition(entry: DictionaryEntry): StrongsDefinition {
  return {
    strongsNumber: entry.strongs,
    word: entry.word,
    gloss: entry.gloss || entry.english,
    english: entry.english,
    telugu: entry.telugu,
    language: entry.language,
    partOfSpeech: entry.pos,
    pos: entry.pos,
    gender: '',
    occurrences: entry.occurrences,
    firstOccurrence: '',
    rootWord: entry.root || '',
    root: entry.root,
    testament: entry.testament
  };
}

class BibleAPI {
  public baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Pre-load dictionary
    loadLocalDictionary();
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
  }

  // Books
  async getBooks(): Promise<BibleBook[]> {
    return this.fetch<BibleBook[]>('/books');
  }

  async getBook(bookId: number | string): Promise<BibleBook> {
    return this.fetch<BibleBook>(`/books/${bookId}`);
  }

  // Verses
  async getChapter(bookId: number | string, chapter: number): Promise<{ book: string; chapter: number; verses: BibleVerse[] }> {
    return this.fetch(`/verses/${bookId}/${chapter}`);
  }

  async getVerse(bookId: number | string, chapter: number, verse: number): Promise<BibleVerse> {
    return this.fetch<BibleVerse>(`/verses/${bookId}/${chapter}/${verse}`);
  }

  async getTeluguChapter(bookId: number | string, chapter: number): Promise<{ bookId: number; chapter: number; verses: TeluguVerse[] }> {
    return this.fetch(`/telugu/${bookId}/${chapter}`);
  }

  // Strong's - Now uses local dictionary
  async getStrongs(number: string): Promise<StrongsDefinition | null> {
    const dict = await loadLocalDictionary();
    const entry = dict[number];
    if (entry) {
      return entryToDefinition(entry);
    }
    return null;
  }

  // Search by original word (Hebrew/Greek) - Uses local dictionary
  async searchStrongs(query: string): Promise<StrongsDefinition[]> {
    const dict = await loadLocalDictionary();
    const results: StrongsDefinition[] = [];

    // Clean the query - remove punctuation and vowel points for Hebrew
    const cleanQuery = query.replace(/[^\u0590-\u05FF\u0370-\u03FF\u0041-\u007A]/g, '').toLowerCase();

    // First try exact match
    if (wordIndex?.has(cleanQuery)) {
      const strongsNums = wordIndex.get(cleanQuery)!;
      for (const sn of strongsNums) {
        const entry = dict[sn];
        if (entry) results.push(entryToDefinition(entry));
      }
    }

    // Then search by partial match
    if (results.length === 0) {
      for (const [_, entry] of Object.entries(dict)) {
        const entryWord = entry.word?.toLowerCase().trim() || '';
        if (entryWord.includes(cleanQuery) || cleanQuery.includes(entryWord)) {
          results.push(entryToDefinition(entry));
          if (results.length >= 10) break;
        }
      }
    }

    // Then search by Strong's number
    if (results.length === 0 && (query.startsWith('H') || query.startsWith('G') || query.startsWith('A'))) {
      const entry = dict[query.toUpperCase()];
      if (entry) results.push(entryToDefinition(entry));
    }

    return results;
  }

  async getAllStrongs(): Promise<StrongsDefinition[]> {
    const dict = await loadLocalDictionary();
    return Object.values(dict).map(entryToDefinition);
  }

  // Get dictionary statistics
  async getDictionaryStats(): Promise<{ hebrew: number; greek: number; aramaic: number; total: number; withTelugu: number }> {
    const dict = await loadLocalDictionary();
    const entries = Object.values(dict);
    return {
      hebrew: entries.filter(e => e.strongs?.startsWith('H')).length,
      greek: entries.filter(e => e.strongs?.startsWith('G')).length,
      aramaic: entries.filter(e => e.strongs?.startsWith('A')).length,
      total: entries.length,
      withTelugu: entries.filter(e => e.telugu).length
    };
  }

  // Search
  async searchVerses(query: string, limit: number = 20): Promise<BibleVerse[]> {
    return this.fetch<BibleVerse[]>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}

export const bibleAPI = new BibleAPI();

