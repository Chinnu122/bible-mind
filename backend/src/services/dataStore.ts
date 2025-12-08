import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { BibleVerse, BibleBook, StrongsDefinition } from '../types';

// In-memory data store
class DataStore {
  private verses: Map<string, BibleVerse> = new Map();
  private books: Map<number, BibleBook> = new Map();
  private strongs: Map<string, StrongsDefinition> = new Map();
  private versesByBook: Map<number, BibleVerse[]> = new Map();
  private versesByChapter: Map<string, BibleVerse[]> = new Map();
  private isLoaded: boolean = false;

  async loadAllData(): Promise<void> {
    if (this.isLoaded) return;

    console.log('📖 Loading Bible data...');
    const startTime = Date.now();

    await Promise.all([
      this.loadBooks(),
      this.loadVerses(),
      this.loadStrongs(),
    ]);

    this.isLoaded = true;
    const duration = Date.now() - startTime;
    console.log(`✅ Data loaded in ${duration}ms`);
    console.log(`   - ${this.books.size} books`);
    console.log(`   - ${this.verses.size} verses`);
    console.log(`   - ${this.strongs.size} Strong's definitions`);
  }

  private async loadBooks(): Promise<void> {
    const filePath = path.join(__dirname, '../../../BibleData-Book.csv');
    
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
    const filePath = path.join(__dirname, '../../../AlamoPolyglot.csv');
    
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

  private async loadStrongs(): Promise<void> {
    const filePath = path.join(__dirname, '../../../HebrewStrongs.csv');
    
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
        strongsNumber: `H${parts[0]}`,
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

  getStrongs(strongsNumber: string): StrongsDefinition | undefined {
    // Normalize the input
    let normalized = strongsNumber.toUpperCase();
    if (!normalized.startsWith('H') && !normalized.startsWith('G')) {
      normalized = 'H' + normalized;
    }
    return this.strongs.get(normalized);
  }

  searchStrongs(query: string): StrongsDefinition[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.strongs.values()).filter(
      s => s.word.toLowerCase().includes(lowerQuery) ||
           s.gloss.toLowerCase().includes(lowerQuery) ||
           s.rootWord.toLowerCase().includes(lowerQuery)
    ).slice(0, 50);
  }

  searchVerses(query: string, limit: number = 20): BibleVerse[] {
    const lowerQuery = query.toLowerCase();
    const results: BibleVerse[] = [];
    
    for (const verse of this.verses.values()) {
      if (results.length >= limit) break;
      
      if (verse.kjvText.toLowerCase().includes(lowerQuery) ||
          verse.webText.toLowerCase().includes(lowerQuery)) {
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
