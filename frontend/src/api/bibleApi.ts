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

export interface TeluguSingleVerse {
  bookId: number;
  chapter: number;
  verse: number;
  teluguText: string;
  reference: string;
  teluguReference: string;
}

export interface CrossReference {
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  reference: string;
  votes: number;
}

export interface CrossReferencesResponse {
  sourceVerse: {
    bookId: number;
    chapter: number;
    verse: number;
    reference: string;
  };
  crossReferences: CrossReference[];
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
let strippedWordIndex: Map<string, string[]> | null = null; // Map stripped word -> [strongs numbers]

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
    strippedWordIndex = new Map();
    for (const [strongsNum, entry] of Object.entries(cachedDictionary || {})) {
      const word = entry.word?.toLowerCase().trim() || '';
      if (word) {
        // Regular word index
        if (!wordIndex.has(word)) {
          wordIndex.set(word, []);
        }
        wordIndex.get(word)!.push(strongsNum);

        // Stripped vowel index (for Hebrew)
        const stripped = stripHebrewVowels(word);
        if (stripped && stripped !== word) {
          if (!strippedWordIndex.has(stripped)) {
            strippedWordIndex.set(stripped, []);
          }
          strippedWordIndex.get(stripped)!.push(strongsNum);
        }
      }
    }

    console.log(`📖 Loaded ${Object.keys(cachedDictionary || {}).length} Strong's entries, ${wordIndex.size} word index, ${strippedWordIndex.size} stripped index`);
    return cachedDictionary || {};
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return {};
  }
}

// Helper to strip Hebrew vowel points (Nikud)
function stripHebrewVowels(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, "");
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

  async getTeluguVerse(bookId: number | string, chapter: number, verse: number): Promise<TeluguSingleVerse> {
    return this.fetch(`/telugu/${bookId}/${chapter}/${verse}`);
  }

  async getCrossReferences(bookId: number | string, chapter: number, verse: number, limit: number = 8): Promise<CrossReferencesResponse> {
    return this.fetch(`/cross-references/${bookId}/${chapter}/${verse}?limit=${limit}`);
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
    const results: { def: StrongsDefinition; score: number }[] = [];

    // Clean the query - remove punctuation
    const cleanQueryRaw = query.replace(/[^\u0590-\u05FF\u0370-\u03FF\u0041-\u007A]/g, '').toLowerCase();
    const cleanQueryStripped = stripHebrewVowels(cleanQueryRaw);

    // Skip if too short (likely punctuation only)
    if (cleanQueryStripped.length < 1) return [];

    // First try exact match (using wordIndex which maps cleanWord -> [strongsNums])
    if (wordIndex?.has(cleanQueryRaw)) {
      const strongsNums = wordIndex.get(cleanQueryRaw)!;
      for (const sn of strongsNums) {
        const entry = dict[sn];
        if (entry) results.push({ def: entryToDefinition(entry), score: 100 });
      }
    }

    // If exact match found with high confidence, return immediately
    if (results.length > 0 && results[0].score === 100) {
      return results.map(r => r.def);
    }

    // Try stripped vowel index (for Hebrew)
    if (strippedWordIndex?.has(cleanQueryStripped)) {
      const strongsNums = strippedWordIndex.get(cleanQueryStripped)!;
      for (const sn of strongsNums) {
        const entry = dict[sn];
        if (entry && !results.some(r => r.def.strongsNumber === sn)) {
          results.push({ def: entryToDefinition(entry), score: 98 });
        }
      }
    }

    // If stripped match found, return immediately
    if (results.length > 0) {
      return results.map(r => r.def);
    }

    // Search by matching stripped vowels
    for (const [_, entry] of Object.entries(dict)) {
      if (results.length >= 5) break; // Limit results per query

      const entryWord = entry.word?.toLowerCase().trim() || '';
      const entryWordStripped = stripHebrewVowels(entryWord);

      // Skip if entry word is empty
      if (!entryWordStripped) continue;

      // Calculate length ratio for confidence scoring
      const lenQuery = cleanQueryStripped.length;
      const lenEntry = entryWordStripped.length;
      const lenRatio = Math.min(lenQuery, lenEntry) / Math.max(lenQuery, lenEntry);

      // Check 1: Exact match with stripped vowels (Score: 95)
      if (entryWordStripped === cleanQueryStripped) {
        // Avoid duplicates
        if (!results.some(r => r.def.strongsNumber === entry.strongs)) {
          results.push({ def: entryToDefinition(entry), score: 95 });
        }
        continue;
      }

      // Check 2: Query starts with entry word (prefix match)
      // Only allow if entry is at least 70% of query length
      if (lenRatio >= 0.7 && cleanQueryStripped.startsWith(entryWordStripped) && entryWordStripped.length >= 2) {
        if (!results.some(r => r.def.strongsNumber === entry.strongs)) {
          results.push({ def: entryToDefinition(entry), score: 80 * lenRatio });
        }
        continue;
      }

      // Check 3: Entry starts with query (query is root of entry)
      // Only allow if query is at least 70% of entry length
      if (lenRatio >= 0.7 && entryWordStripped.startsWith(cleanQueryStripped) && cleanQueryStripped.length >= 2) {
        if (!results.some(r => r.def.strongsNumber === entry.strongs)) {
          results.push({ def: entryToDefinition(entry), score: 75 * lenRatio });
        }
        continue;
      }

      // NOTE: Removed substring matching - too many false positives
    }

    // Search by Strong's number directly
    if (results.length === 0 && (query.startsWith('H') || query.startsWith('G') || query.startsWith('A'))) {
      const entry = dict[query.toUpperCase()];
      if (entry) results.push({ def: entryToDefinition(entry), score: 100 });
    }

    // Sort by score (highest first) and return
    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.def);
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

  // Telugu Search - Supports Roman transliteration (e.g., "devudu" -> "దేవుడు")
  async searchTeluguVerses(query: string, limit: number = 50): Promise<{
    bookId: number;
    chapter: number;
    verse: number;
    teluguText: string;
    englishName: string;
    teluguName: string;
    reference: string;
    matchedWord?: string;
  }[]> {
    // Roman to Telugu transliteration mapping for common words
    const romanToTelugu: Record<string, string[]> = {
      'devudu': ['దేవుడు', 'దేవుని', 'దేవునికి', 'దేవా'],
      'yesu': ['యేసు', 'యేసును', 'యేసుని', 'యేసుక్రీస్తు'],
      'krishtu': ['క్రీస్తు', 'క్రీస్తును', 'క్రీస్తుని'],
      'prema': ['ప్రేమ', 'ప్రేమించు', 'ప్రేమించెను'],
      'parishuddha': ['పరిశుద్ధ', 'పరిశుద్ధాత్మ'],
      'atma': ['ఆత్మ', 'ఆత్మను'],
      'prabhu': ['ప్రభువు', 'ప్రభువా', 'ప్రభుని'],
      'rakshana': ['రక్షణ', 'రక్షించు'],
      'viswasam': ['విశ్వాసం', 'విశ్వసించు', 'విశ్వాసము'],
      'aakaasam': ['ఆకాశం', 'ఆకాశము'],
      'bhumi': ['భూమి', 'భూమిని'],
      'neethi': ['నీతి', 'నీతిమంతుడు'],
      'krupa': ['కృప', 'కృపచేత'],
      'santosham': ['సంతోషం', 'సంతోషము'],
      'shaanthi': ['శాంతి', 'శాంతిని'],
      'samadhanam': ['సమాధానం', 'సమాధానము'],
      'jeevanam': ['జీవం', 'జీవము', 'జీవించు'],
      'maranam': ['మరణం', 'మరణము'],
      'papam': ['పాపం', 'పాపము', 'పాపి'],
      'kshamapana': ['క్షమాపణ', 'క్షమించు'],
      'nammakam': ['నమ్మకం', 'నమ్మము'],
      'sthotram': ['స్తోత్రం', 'స్తోత్రము', 'స్తుతి'],
      'aaradhana': ['ఆరాధన', 'ఆరాధించు'],
      'prarthana': ['ప్రార్థన', 'ప్రార్థించు'],
      'vaakyam': ['వాక్యం', 'వాక్యము'],
      'biblu': ['బైబిలు', 'బైబిల్'],
      'sanghamu': ['సంఘం', 'సంఘము'],
    };

    try {
      // First try local offline search
      const localResults = await this.searchTeluguLocal(query, romanToTelugu, limit);
      if (localResults.length > 0) {
        return localResults;
      }

      // Fallback to API if local search returns nothing
      const response = await fetch(`${this.baseUrl}/telugu/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Telugu search error:', error);
      return [];
    }
  }

  // Local Telugu search using offline data
  private async searchTeluguLocal(
    query: string,
    romanToTelugu: Record<string, string[]>,
    limit: number
  ): Promise<{
    bookId: number;
    chapter: number;
    verse: number;
    teluguText: string;
    englishName: string;
    teluguName: string;
    reference: string;
    matchedWord?: string;
  }[]> {
    const results: {
      bookId: number;
      chapter: number;
      verse: number;
      teluguText: string;
      englishName: string;
      teluguName: string;
      reference: string;
      matchedWord?: string;
    }[] = [];

    // Convert Roman to Telugu if applicable
    const queryLower = query.toLowerCase().trim();
    let searchTerms: string[] = [query];

    // Check if query matches any Roman transliteration
    for (const [roman, teluguWords] of Object.entries(romanToTelugu)) {
      if (queryLower === roman || queryLower.includes(roman)) {
        searchTerms = [...searchTerms, ...teluguWords];
        break;
      }
    }

    // Also add the original query for direct Telugu text search
    if (/[\u0C00-\u0C7F]/.test(query)) {
      // Query contains Telugu characters, search directly
      searchTerms = [query];
    }

    // List of Telugu Bible book files
    const books = [
      { id: 1, file: 'Genesis.json', english: 'Genesis' },
      { id: 2, file: 'Exodus.json', english: 'Exodus' },
      { id: 40, file: 'Matthew.json', english: 'Matthew' },
      { id: 41, file: 'Mark.json', english: 'Mark' },
      { id: 42, file: 'Luke.json', english: 'Luke' },
      { id: 43, file: 'John.json', english: 'John' },
      { id: 44, file: 'Acts.json', english: 'Acts' },
      { id: 45, file: 'Romans.json', english: 'Romans' },
      { id: 19, file: 'Psalms.json', english: 'Psalms' },
      { id: 20, file: 'Proverbs.json', english: 'Proverbs' },
      { id: 23, file: 'Isaiah.json', english: 'Isaiah' },
      { id: 24, file: 'Jeremiah.json', english: 'Jeremiah' },
      { id: 58, file: 'Hebrews.json', english: 'Hebrews' },
      { id: 59, file: 'James.json', english: 'James' },
      { id: 60, file: '1Peter.json', english: '1 Peter' },
      { id: 66, file: 'Revelation.json', english: 'Revelation' },
    ];

    // Search through books (limit to commonly searched books for performance)
    for (const book of books) {
      if (results.length >= limit) break;

      try {
        const response = await fetch(`/offline-data/telugu/${book.file}`);
        if (!response.ok) continue;

        const data = await response.json();
        const teluguName = data.book?.telugu || book.english;

        // Search through chapters
        for (const chapter of data.chapters || []) {
          if (results.length >= limit) break;

          for (const verse of chapter.verses || []) {
            if (results.length >= limit) break;

            const verseText = verse.text || '';

            // Check if any search term matches
            for (const term of searchTerms) {
              if (verseText.includes(term)) {
                results.push({
                  bookId: book.id,
                  chapter: parseInt(chapter.chapter),
                  verse: parseInt(verse.verse),
                  teluguText: verseText,
                  englishName: book.english,
                  teluguName: teluguName,
                  reference: `${book.english} ${chapter.chapter}:${verse.verse}`,
                  matchedWord: term
                });
                break; // Found match, no need to check other terms
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error loading ${book.file}:`, err);
      }
    }

    return results;
  }
}

export const bibleAPI = new BibleAPI();

