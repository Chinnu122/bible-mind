export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface WordAnalysis {
  original: string;
  transliteration: string;
  strongs: string;
  grammar: string;
  meanings: {
    english: string;
    telugu: string;
    hindi: string;
    tamil: string;
  };
}

export interface VerseAnalysis {
  reference: string;
  text: string;
  words: WordAnalysis[];
  crossReferences: string[];
  commentary: string;
}

export interface StoryPage {
  pageNumber: number;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
}

export enum AppMode {
  READER = 'READER',
  STORY = 'STORY',
  SEARCH = 'SEARCH',
  NOTES = 'NOTES',
  LOGIN = 'LOGIN'
}

export interface Note {
  id: string;
  reference: string;
  content: string;
  timestamp: number;
}
