import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { BibleVerse, BibleBook, StrongsDefinition, StrongsMultiLang, GreekEquivalent } from '../types';

// In-memory data store
class DataStore {
  private verses: Map<string, BibleVerse> = new Map();
  private books: Map<number, BibleBook> = new Map();
  private strongs: Map<string, StrongsDefinition> = new Map();
  private strongsMultiLang: Map<string, StrongsMultiLang> = new Map();
  private hebrewToGreek: Map<string, GreekEquivalent[]> = new Map();
  private versesByBook: Map<number, BibleVerse[]> = new Map();
  private versesByChapter: Map<string, BibleVerse[]> = new Map();
  private isLoaded: boolean = false;

  private normalizeStrongsNumber(input: string): string {
    const trimmed = (input || '').trim().toUpperCase();
    if (!trimmed) return trimmed;

    const first = trimmed[0];
    const hasPrefix = first === 'H' || first === 'G' || first === 'A';
    const prefix = hasPrefix ? first : 'H';
    const rawDigits = (hasPrefix ? trimmed.slice(1) : trimmed).replace(/\D/g, '');

    if (!rawDigits) return trimmed;

    if (prefix === 'G') {
      const n = parseInt(rawDigits, 10);
      if (Number.isNaN(n)) return trimmed;
      return `G${n}`;
    }

    // Hebrew / Aramaic in our dataset are stored as 4-digit (e.g., H0430)
    return `${prefix}${rawDigits.padStart(4, '0')}`;
  }

  async loadAllData(): Promise<void> {
    if (this.isLoaded) return;

    console.log('📖 Loading Bible data...');
    const startTime = Date.now();

    await Promise.all([
      this.loadBooks(),
      this.loadVerses(),
      this.loadHebrewStrongs(),
      this.loadGreekStrongs(),
      this.loadTeluguHindiStrongs(),
    ]);

    this.isLoaded = true;
    const duration = Date.now() - startTime;
    console.log(`✅ Data loaded in ${duration}ms`);
    console.log(`   - ${this.books.size} books`);
    console.log(`   - ${this.verses.size} verses`);
    console.log(`   - ${this.strongs.size} Strong's definitions`);
  }

  private async loadBooks(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/BibleData-Book.csv');

    return new Promise((resolve, reject) => {
      const results: BibleBook[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const book: BibleBook = {
            bookId: parseInt(row.book_id) || 0,
            bookName: row.book_name || '',
            hebrewName: row.hebrew_name || '',
            hebrewTransliteration: row.hebrew_transliteration || '',
            hebrewMeaning: row.hebrew_meaning || '',
            greekName: row.greek_name || '',
            greekTransliteration: row.greek_transliteration || '',
            greekMeaning: row.greek_meaning || '',
            chapterCount: parseInt(row.chapter_count) || 0,
            verseCount: parseInt(row.verse_count) || 0,
            shortName: row.short_name || '',
            usxCode: row.usx_code || '',
            testament: parseInt(row.book_id) <= 39 ? 'old' : 'new',
          };
          results.push(book);
        })
        .on('end', () => {
          results.forEach(book => {
            this.books.set(book.bookId, book);
          });
          resolve();
        })
        .on('error', reject);
    });
  }

  private async loadVerses(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/AlamoPolyglot.csv');

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const verse: BibleVerse = {
            id: parseInt(row.id) || 0,
            bookId: parseInt(row.book_id) || 0,
            bookName: row.book_name || '',
            chapter: parseInt(row.chapter) || 0,
            verse: parseInt(row.verse) || 0,
            webText: row.world_english_bible_web || '',
            kjvText: row.king_james_bible_kjv || '',
            hebrewText: row.leningrad_codex || '',
            jpsText: row.jewish_publication_society_jps || '',
            greekText: row.codex_alexandrinus || '',
            brentonText: row.brenton || '',
            samaritanText: row.samaritan_pentateuch || '',
            samaritanEnglish: row.samaritan_pentateuch_english || '',
            onkelosAramaic: row.onkelos_aramaic || '',
            onkelosEnglish: row.onkelos_english || '',
          };

          const key = `${verse.bookId}-${verse.chapter}-${verse.verse}`;
          this.verses.set(key, verse);

          // Index by book
          if (!this.versesByBook.has(verse.bookId)) {
            this.versesByBook.set(verse.bookId, []);
          }
          this.versesByBook.get(verse.bookId)!.push(verse);

          // Index by chapter
          const chapterKey = `${verse.bookId}-${verse.chapter}`;
          if (!this.versesByChapter.has(chapterKey)) {
            this.versesByChapter.set(chapterKey, []);
          }
          this.versesByChapter.get(chapterKey)!.push(verse);
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  private async loadHebrewStrongs(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/HebrewStrongs.csv');

    // Read and parse CSV manually due to multi-line fields
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let currentRecord: string[] = [];
    let inQuotes = false;
    let isFirstLine = true;

    for (const line of lines) {
      if (isFirstLine) {
        isFirstLine = false;
        continue; // Skip header
      }

      // Count quotes to determine if we're in a multi-line field
      const quoteCount = (line.match(/"/g) || []).length;

      if (!inQuotes) {
        currentRecord = [line];
        // If odd number of quotes, we're starting a multi-line field
        if (quoteCount % 2 !== 0) {
          inQuotes = true;
        } else {
          // Complete record, parse it
          this.parseStrongsRecord(currentRecord.join('\n'));
        }
      } else {
        currentRecord.push(line);
        // If odd number of quotes, we're closing the multi-line field
        if (quoteCount % 2 !== 0) {
          inQuotes = false;
          this.parseStrongsRecord(currentRecord.join('\n'));
        }
      }
    }
  }

  private parseStrongsRecord(record: string): void {
    if (!record.trim()) return;

    // Simple CSV parsing for this specific format
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < record.length; i++) {
      const char = record[i];

      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (record[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    if (parts.length >= 9 && parts[0]) {
      const def: StrongsDefinition = {
        strongsNumber: this.normalizeStrongsNumber(`H${parts[0]}`),
        word: parts[1] || '',
        gloss: parts[2] || '',
        language: (parts[3] || 'H') as 'H' | 'A' | 'G',
        partOfSpeech: parts[4] || '',
        gender: parts[5] || '',
        occurrences: parseInt(parts[6]) || 0,
        firstOccurrence: parts[7] || '',
        rootWord: parts[8] || '',
      };
      this.strongs.set(def.strongsNumber, def);
    }
  }

  private async loadGreekStrongs(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/GreekStrongs.csv');

    // Read TSV file (tab-separated)
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let isFirstLine = true;
    for (const line of lines) {
      if (isFirstLine) {
        isFirstLine = false;
        continue; // Skip header
      }

      if (!line.trim()) continue;

      // Parse TSV: Number, Lemma, Origin, Root, RootLemma, | (separator)
      const parts = line.split('\t');
      if (parts.length >= 2 && parts[0]) {
        const strongsNumber = this.normalizeStrongsNumber(parts[0].trim());
        const lemma = parts[1]?.trim() || '';
        const origin = parts[2]?.trim() || '';
        const root = parts[3]?.trim() || '';
        const rootLemma = parts[4]?.trim() || '';

        const def: StrongsDefinition = {
          strongsNumber: strongsNumber,
          word: lemma,
          gloss: rootLemma, // Use root lemma as a gloss/meaning hint
          language: 'G' as 'H' | 'A' | 'G',
          partOfSpeech: '',
          gender: '',
          occurrences: 0,
          firstOccurrence: '',
          rootWord: root,
        };
        this.strongs.set(def.strongsNumber, def);

        // Build Hebrew-to-Greek mapping from origin field (e.g., "H175")
        if (origin && origin.startsWith('H')) {
          const hebrewNum = this.normalizeStrongsNumber(origin);
          const existing = this.hebrewToGreek.get(hebrewNum) || [];
          existing.push({ strongsNumber, lemma, origin });
          this.hebrewToGreek.set(hebrewNum, existing);
        }
      }
    }
  }

  private async loadTeluguHindiStrongs(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/TeluguHindiStrongs.csv');

    if (!fs.existsSync(filePath)) {
      return;
    }

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const strongsNumberRaw = (row.strongs_number || row.strongsNumber || row.strongs || '').toString();
          const strongsNumber = this.normalizeStrongsNumber(strongsNumberRaw);
          if (!strongsNumber) return;

          const teluguWord = (row.telugu_word || '').toString().trim();
          const teluguMeaning = (row.telugu_meaning || '').toString().trim();
          const hindiWord = (row.hindi_word || '').toString().trim();
          const hindiMeaning = (row.hindi_meaning || '').toString().trim();

          const telugu = teluguWord || teluguMeaning
            ? `${teluguWord}${teluguWord && teluguMeaning ? ' - ' : ''}${teluguMeaning}`
            : undefined;
          const hindi = hindiWord || hindiMeaning
            ? `${hindiWord}${hindiWord && hindiMeaning ? ' - ' : ''}${hindiMeaning}`
            : undefined;

          if (!telugu && !hindi) return;
          this.strongsMultiLang.set(strongsNumber, { telugu, hindi });
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  // Getters
  getBooks(): BibleBook[] {
    return Array.from(this.books.values());
  }

  getBook(bookId: number): BibleBook | undefined {
    return this.books.get(bookId);
  }

  getBookByName(name: string): BibleBook | undefined {
    const lowerName = name.toLowerCase();
    return Array.from(this.books.values()).find(
      b => b.bookName.toLowerCase() === lowerName ||
        b.shortName.toLowerCase() === lowerName ||
        b.usxCode.toLowerCase() === lowerName
    );
  }

  getVerse(bookId: number, chapter: number, verse: number): BibleVerse | undefined {
    return this.verses.get(`${bookId}-${chapter}-${verse}`);
  }

  getChapter(bookId: number, chapter: number): BibleVerse[] {
    return this.versesByChapter.get(`${bookId}-${chapter}`) || [];
  }

  getBookVerses(bookId: number): BibleVerse[] {
    return this.versesByBook.get(bookId) || [];
  }

  getAllVerses(): BibleVerse[] {
    return Array.from(this.verses.values());
  }

  getStrongs(strongsNumber: string): StrongsDefinition | undefined {
    const normalized = this.normalizeStrongsNumber(strongsNumber);
    return this.strongs.get(normalized);
  }

  getStrongsMultiLang(strongsNumber: string): StrongsMultiLang | undefined {
    const normalized = this.normalizeStrongsNumber(strongsNumber);
    return this.strongsMultiLang.get(normalized);
  }

  getGreekEquivalents(hebrewNumber: string): GreekEquivalent[] {
    const normalized = this.normalizeStrongsNumber(hebrewNumber);
    return this.hebrewToGreek.get(normalized) || [];
  }

  searchStrongs(query: string): StrongsDefinition[] {
    const lowerQuery = query.toLowerCase();

    // Strip Hebrew vowel points (nikkud) for better matching
    const stripNikkud = (str: string) => str.replace(/[\u0591-\u05C7]/g, '');
    const cleanQuery = stripNikkud(query);

    const results = Array.from(this.strongs.values()).filter(s => {
      const cleanWord = stripNikkud(s.word);
      const strongsNum = s.strongsNumber.toLowerCase();

      // Match by: Hebrew word (with or without nikkud), Strong's number, gloss, root
      return cleanWord.includes(cleanQuery) ||
        cleanQuery.includes(cleanWord) ||
        s.word.toLowerCase().includes(lowerQuery) ||
        strongsNum.includes(lowerQuery) ||
        s.gloss.toLowerCase().includes(lowerQuery) ||
        s.rootWord.toLowerCase().includes(lowerQuery);
    });

    // Sort results: prioritize exact word matches first
    results.sort((a, b) => {
      const aClean = stripNikkud(a.word);
      const bClean = stripNikkud(b.word);
      const aExact = aClean === cleanQuery ? 0 : (cleanQuery.includes(aClean) ? 1 : 2);
      const bExact = bClean === cleanQuery ? 0 : (cleanQuery.includes(bClean) ? 1 : 2);
      return aExact - bExact;
    });

    return results.slice(0, 100);
  }

  searchVerses(query: string, limit: number = 100): BibleVerse[] {
    const lowerQuery = query.toLowerCase();
    const results: BibleVerse[] = [];

    for (const verse of this.verses.values()) {
      if (results.length >= limit) break;

      // Search across ALL language texts
      const searchableTexts = [
        verse.kjvText,
        verse.webText,
        verse.hebrewText,
        verse.greekText,
        verse.jpsText,
        verse.brentonText
      ].filter(Boolean); // Filter out undefined/null values

      const found = searchableTexts.some(text =>
        text && text.toLowerCase().includes(lowerQuery)
      );

      if (found) {
        results.push(verse);
      }
    }

    return results;
  }

  getAllStrongs(): StrongsDefinition[] {
    return Array.from(this.strongs.values());
  }
}

// Singleton export
export const dataStore = new DataStore();
