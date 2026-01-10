export enum AppTab {
  INTERLINEAR = 'INTERLINEAR',
  STUDY = 'STUDY',
  KIDS = 'KIDS',
  PUZZLES = 'PUZZLES',
  MIND_GAME = 'MIND_GAME'
}

export interface BibleWord {
  verse: number;
  originalWord: string;
  transliteration: string;
  englishMeaning: string;
  teluguMeaning: string;
  strongsNumber: string;
  occurrenceCount: number;
  isFirstOccurrence: boolean;
  firstOccurrenceReference?: string;
}

export interface InterlinearData {
  book: string;
  chapter: number;
  language: 'Hebrew' | 'Greek';
  words: BibleWord[];
}

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

export interface KidStory {
  title: string;
  character: string;
  storyText: string;
  moral: string;
  ageGroup: string;
}

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

export interface BibleRiddle {
  riddle: string;
  hints: string[];
  answer: string;
  acceptedAnswers: string[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
