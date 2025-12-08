// Bible Book Interface
export interface BibleBook {
  bookId: number;
  bookName: string;
  hebrewName: string;
  hebrewTransliteration: string;
  hebrewMeaning: string;
  greekName: string;
  greekTransliteration: string;
  greekMeaning: string;
  chapterCount: number;
  verseCount: number;
  shortName: string;
  usxCode: string;
  testament: 'old' | 'new';
}

// Bible Verse Interface
export interface BibleVerse {
  id: number;
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  webText: string;           // World English Bible
  kjvText: string;           // King James Version
  hebrewText: string;        // Leningrad Codex
  jpsText: string;           // Jewish Publication Society
  greekText: string;         // Codex Alexandrinus
  brentonText: string;       // Brenton's English Translation
  samaritanText: string;     // Samaritan Pentateuch
  samaritanEnglish: string;  // Samaritan English
  onkelosAramaic: string;    // Targum Onkelos
  onkelosEnglish: string;    // Targum Onkelos English
}

// Strong's Definition Interface
export interface StrongsDefinition {
  strongsNumber: string;
  word: string;
  gloss: string;
  language: 'H' | 'A' | 'G'; // Hebrew, Aramaic, Greek
  partOfSpeech: string;
  gender: string;
  occurrences: number;
  firstOccurrence: string;
  rootWord: string;
}

// Person in the Bible
export interface BiblePerson {
  personId: string;
  name: string;
  hebrewName: string;
  greekName: string;
  meaning: string;
  description: string;
}

// Place in the Bible
export interface BiblePlace {
  placeId: string;
  name: string;
  hebrewName: string;
  greekName: string;
  meaning: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: number;
}

// Search Query
export interface SearchQuery {
  q: string;
  book?: string;
  chapter?: number;
  testament?: 'old' | 'new';
  limit?: number;
  page?: number;
}

// Verse with parsed words
export interface ParsedWord {
  text: string;
  strongs?: string;
  original?: string;
  transliteration?: string;
  meaning?: string;
  language?: 'hebrew' | 'greek' | 'aramaic';
}

export interface EnrichedVerse extends BibleVerse {
  words?: ParsedWord[];
  crossReferences?: string[];
  persons?: BiblePerson[];
  places?: BiblePlace[];
}
