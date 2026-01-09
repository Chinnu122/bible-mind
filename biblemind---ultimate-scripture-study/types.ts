export interface User {
  id: string;
  name: string;
  email: string;
  savedVerses: string[];
}

export interface InterlinearWord {
  original: string;
  transliteration: string;
  english: string;
  telugu: string;
  grammar: string;
}

export interface InterlinearResponse {
  reference: string;
  words: InterlinearWord[];
  translation_english: string;
  translation_telugu: string;
}

export interface Story {
  title: string;
  content: string;
  moral: string;
  characters: string[];
}

export interface DailyContent {
  verse: {
    reference: string;
    text_english: string;
    text_telugu: string;
  };
  character: {
    name: string;
    summary: string;
    key_reference: string;
  };
}

export interface StudySession {
  topic: string;
  content: string;
  references: string[];
  questions: string[];
}

export interface Note {
  id: string;
  timestamp: number;
  reference: string;
  content: string;
}

export interface VocabularyItem {
  hebrew: string;
  english: string;
  telugu: string;
  hindi: string;
  occurrences: string;
}
