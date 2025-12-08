const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export interface StrongsDefinition {
  strongsNumber: string;
  word: string;
  gloss: string;
  language: string;
  partOfSpeech: string;
  gender: string;
  occurrences: number;
  firstOccurrence: string;
  rootWord: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
  };
}

class BibleAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
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

  // Strong's
  async getStrongs(number: string): Promise<StrongsDefinition> {
    return this.fetch<StrongsDefinition>(`/strongs/${number}`);
  }

  async searchStrongs(query: string): Promise<StrongsDefinition[]> {
    return this.fetch<StrongsDefinition[]>(`/search/strongs?q=${encodeURIComponent(query)}`);
  }

  // Search
  async searchVerses(query: string, limit: number = 20): Promise<BibleVerse[]> {
    return this.fetch<BibleVerse[]>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}

export const bibleAPI = new BibleAPI();
