import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Telugu book data cache
interface TeluguVerse {
    verse: string;
    text: string;
}

interface TeluguChapter {
    chapter: string;
    verses: TeluguVerse[];
}

interface TeluguBook {
    book: { english: string; telugu: string };
    count: string;
    chapters: TeluguChapter[];
}

// Map book ID to filename
const BOOK_FILE_MAP: Record<number, string> = {
    1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
    6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1Samuel', 10: '2Samuel',
    11: '1Kings', 12: '2Kings', 13: '1Chronicles', 14: '2Chronicles', 15: 'Ezra',
    16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms', 20: 'Proverbs',
    21: 'Ecclesiastes', 22: 'SongofSongs', 23: 'Isaiah', 24: 'Jeremiah', 25: 'Lamentations',
    26: 'Ezekiel', 27: 'Daniel', 28: 'Hosea', 29: 'Joel', 30: 'Amos',
    31: 'Obadiah', 32: 'Jonah', 33: 'Micah', 34: 'Nahum', 35: 'Habakkuk',
    36: 'Zephaniah', 37: 'Haggai', 38: 'Zechariah', 39: 'Malachi',
    40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John', 44: 'Acts',
    45: 'Romans', 46: '1Corinthians', 47: '2Corinthians', 48: 'Galatians', 49: 'Ephesians',
    50: 'Philippians', 51: 'Colossians', 52: '1Thessalonians', 53: '2Thessalonians', 54: '1Timothy',
    55: '2Timothy', 56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James',
    60: '1Peter', 61: '2Peter', 62: '1John', 63: '2John', 64: '3John',
    65: 'Jude', 66: 'Revelation'
};

// Cache for loaded books
const bookCache: Map<number, TeluguBook> = new Map();

function loadTeluguBook(bookId: number): TeluguBook | null {
    if (bookCache.has(bookId)) {
        return bookCache.get(bookId)!;
    }

    const filename = BOOK_FILE_MAP[bookId];
    if (!filename) return null;

    const filePath = path.join(__dirname, '../../data/telugu', `${filename}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`Telugu file not found: ${filePath}`);
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const book: TeluguBook = JSON.parse(content);
        bookCache.set(bookId, book);
        return book;
    } catch (error) {
        console.error(`Failed to load Telugu book ${bookId}:`, error);
        return null;
    }
}

/**
 * GET /api/telugu/books
 * Get list of Telugu books with their names
 */
router.get('/books', (_req: Request, res: Response) => {
    const books = Object.entries(BOOK_FILE_MAP).map(([id, filename]) => {
        const book = loadTeluguBook(parseInt(id));
        return {
            bookId: parseInt(id),
            englishName: book?.book.english || filename,
            teluguName: book?.book.telugu || '',
            chapterCount: book ? parseInt(book.count) : 0,
            testament: parseInt(id) <= 39 ? 'old' : 'new'
        };
    });

    res.json({
        success: true,
        data: books,
        meta: { total: books.length }
    });
});

/**
 * GET /api/telugu/:bookId
 * Get Telugu book info
 */
router.get('/:bookId', (req: Request, res: Response) => {
    const bookId = parseInt(req.params.bookId);
    const book = loadTeluguBook(bookId);

    if (!book) {
        res.status(404).json({
            success: false,
            error: 'Telugu book not found',
            code: 404
        });
        return;
    }

    res.json({
        success: true,
        data: {
            bookId,
            englishName: book.book.english,
            teluguName: book.book.telugu,
            chapterCount: parseInt(book.count)
        }
    });
});

/**
 * GET /api/telugu/:bookId/:chapter
 * Get Telugu chapter with all verses
 */
router.get('/:bookId/:chapter', (req: Request, res: Response) => {
    const bookId = parseInt(req.params.bookId);
    const chapterNum = parseInt(req.params.chapter);
    const book = loadTeluguBook(bookId);

    if (!book) {
        res.status(404).json({
            success: false,
            error: 'Telugu book not found',
            code: 404
        });
        return;
    }

    const chapter = book.chapters.find(c => parseInt(c.chapter) === chapterNum);
    if (!chapter) {
        res.status(404).json({
            success: false,
            error: `Chapter ${chapterNum} not found in ${book.book.english}`,
            code: 404
        });
        return;
    }

    res.json({
        success: true,
        data: {
            bookId,
            englishName: book.book.english,
            teluguName: book.book.telugu,
            chapter: chapterNum,
            verses: chapter.verses.map(v => ({
                verse: parseInt(v.verse),
                teluguText: v.text
            }))
        },
        meta: { total: chapter.verses.length }
    });
});

/**
 * GET /api/telugu/:bookId/:chapter/:verse
 * Get specific Telugu verse with parallel English (from main dataStore)
 */
router.get('/:bookId/:chapter/:verse', (req: Request, res: Response) => {
    const bookId = parseInt(req.params.bookId);
    const chapterNum = parseInt(req.params.chapter);
    const verseNum = parseInt(req.params.verse);
    const book = loadTeluguBook(bookId);

    if (!book) {
        res.status(404).json({
            success: false,
            error: 'Telugu book not found',
            code: 404
        });
        return;
    }

    const chapter = book.chapters.find(c => parseInt(c.chapter) === chapterNum);
    if (!chapter) {
        res.status(404).json({
            success: false,
            error: `Chapter ${chapterNum} not found`,
            code: 404
        });
        return;
    }

    const verse = chapter.verses.find(v => parseInt(v.verse) === verseNum);
    if (!verse) {
        res.status(404).json({
            success: false,
            error: `Verse ${verseNum} not found`,
            code: 404
        });
        return;
    }

    res.json({
        success: true,
        data: {
            bookId,
            englishName: book.book.english,
            teluguName: book.book.telugu,
            chapter: chapterNum,
            verse: verseNum,
            teluguText: verse.text,
            reference: `${book.book.english} ${chapterNum}:${verseNum}`,
            teluguReference: `${book.book.telugu} ${chapterNum}:${verseNum}`
        }
    });
});

export default router;
