import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';
import fs from 'fs';
import path from 'path';

const router = Router();

type CrossRef = {
    bookId: number;
    bookName: string;
    chapter: number;
    verse: number;
    reference: string;
    votes: number;
};

// TSK Cross-Reference Index (loaded from OpenBible.info data)
let tskIndex: Map<string, CrossRef[]> = new Map();
let tskLoaded = false;

// Book name mappings: OSIS abbreviation -> bookId
const OSIS_TO_BOOK_ID: Record<string, number> = {
    'Gen': 1, 'Exod': 2, 'Lev': 3, 'Num': 4, 'Deut': 5,
    'Josh': 6, 'Judg': 7, 'Ruth': 8, '1Sam': 9, '2Sam': 10,
    '1Kgs': 11, '2Kgs': 12, '1Chr': 13, '2Chr': 14, 'Ezra': 15,
    'Neh': 16, 'Esth': 17, 'Job': 18, 'Ps': 19, 'Prov': 20,
    'Eccl': 21, 'Song': 22, 'Isa': 23, 'Jer': 24, 'Lam': 25,
    'Ezek': 26, 'Dan': 27, 'Hos': 28, 'Joel': 29, 'Amos': 30,
    'Obad': 31, 'Jonah': 32, 'Mic': 33, 'Nah': 34, 'Hab': 35,
    'Zeph': 36, 'Hag': 37, 'Zech': 38, 'Mal': 39,
    'Matt': 40, 'Mark': 41, 'Luke': 42, 'John': 43, 'Acts': 44,
    'Rom': 45, '1Cor': 46, '2Cor': 47, 'Gal': 48, 'Eph': 49,
    'Phil': 50, 'Col': 51, '1Thess': 52, '2Thess': 53, '1Tim': 54,
    '2Tim': 55, 'Titus': 56, 'Phlm': 57, 'Heb': 58, 'Jas': 59,
    '1Pet': 60, '2Pet': 61, '1John': 62, '2John': 63, '3John': 64,
    'Jude': 65, 'Rev': 66
};

// Reverse lookup: bookId -> short name for display
const BOOK_ID_TO_NAME: Record<number, string> = {
    1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
    6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
    11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles', 15: 'Ezra',
    16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms', 20: 'Proverbs',
    21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah', 24: 'Jeremiah', 25: 'Lamentations',
    26: 'Ezekiel', 27: 'Daniel', 28: 'Hosea', 29: 'Joel', 30: 'Amos',
    31: 'Obadiah', 32: 'Jonah', 33: 'Micah', 34: 'Nahum', 35: 'Habakkuk',
    36: 'Zephaniah', 37: 'Haggai', 38: 'Zechariah', 39: 'Malachi',
    40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John', 44: 'Acts',
    45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians', 48: 'Galatians', 49: 'Ephesians',
    50: 'Philippians', 51: 'Colossians', 52: '1 Thessalonians', 53: '2 Thessalonians', 54: '1 Timothy',
    55: '2 Timothy', 56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James',
    60: '1 Peter', 61: '2 Peter', 62: '1 John', 63: '2 John', 64: '3 John',
    65: 'Jude', 66: 'Revelation'
};

/**
 * Parse OSIS verse reference like "Gen.1.1" or "Ps.89.11-Ps.89.12"
 * Returns { bookId, chapter, verse } for the first verse in range
 */
function parseOSIS(osis: string): { bookId: number; chapter: number; verse: number } | null {
    // Handle ranges by taking the first verse
    const firstPart = osis.split('-')[0];
    const parts = firstPart.split('.');
    if (parts.length < 3) return null;

    const bookAbbr = parts[0];
    const chapter = parseInt(parts[1], 10);
    const verse = parseInt(parts[2], 10);

    const bookId = OSIS_TO_BOOK_ID[bookAbbr];
    if (!bookId || isNaN(chapter) || isNaN(verse)) return null;

    return { bookId, chapter, verse };
}

/**
 * Convert bookId + chapter + verse to internal key format
 */
function toKey(bookId: number, chapter: number, verse: number): string {
    return `${bookId}-${chapter}-${verse}`;
}

/**
 * Load TSK cross-references from the downloaded OpenBible.info data file
 */
function loadTSKData() {
    if (tskLoaded) return;

    const dataPath = path.join(__dirname, '../../data/cross_references.txt');
    if (!fs.existsSync(dataPath)) {
        console.warn('TSK cross_references.txt not found at', dataPath);
        tskLoaded = true;
        return;
    }

    const content = fs.readFileSync(dataPath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
        if (!line.trim() || line.startsWith('From Verse') || line.startsWith('#')) continue;

        const [fromOSIS, toOSIS, votesStr] = line.split('\t');
        if (!fromOSIS || !toOSIS) continue;

        const fromParsed = parseOSIS(fromOSIS);
        const toParsed = parseOSIS(toOSIS);
        if (!fromParsed || !toParsed) continue;

        const votes = parseInt(votesStr, 10) || 0;

        const fromKey = toKey(fromParsed.bookId, fromParsed.chapter, fromParsed.verse);

        if (!tskIndex.has(fromKey)) {
            tskIndex.set(fromKey, []);
        }

        tskIndex.get(fromKey)!.push({
            bookId: toParsed.bookId,
            bookName: BOOK_ID_TO_NAME[toParsed.bookId] || `Book ${toParsed.bookId}`,
            chapter: toParsed.chapter,
            verse: toParsed.verse,
            reference: `${BOOK_ID_TO_NAME[toParsed.bookId]} ${toParsed.chapter}:${toParsed.verse}`,
            votes
        });
    }

    // Sort each verse's cross-refs by votes (descending)
    for (const [key, refs] of tskIndex) {
        refs.sort((a, b) => b.votes - a.votes);
    }

    console.log(`📖 Loaded TSK cross-references: ${tskIndex.size} source verses`);
    tskLoaded = true;
}

/**
 * GET /api/cross-references/:bookId/:chapter/:verse?limit=8
 * Returns authoritative cross references from Treasury of Scripture Knowledge (TSK).
 */
router.get('/:bookId/:chapter/:verse', (req: Request, res: Response) => {
    try {
        const bookId = parseInt(req.params.bookId);
        const chapter = parseInt(req.params.chapter);
        const verseNum = parseInt(req.params.verse);
        const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '8'), 1), 50);

        if ([bookId, chapter, verseNum].some(n => Number.isNaN(n))) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters',
                code: 400
            });
            return;
        }

        const verse = dataStore.getVerse(bookId, chapter, verseNum);
        if (!verse) {
            res.status(404).json({
                success: false,
                error: 'Verse not found',
                code: 404
            });
            return;
        }

        // Load TSK data if not already loaded
        loadTSKData();

        const key = toKey(bookId, chapter, verseNum);
        const refs = tskIndex.get(key) || [];

        res.json({
            success: true,
            data: {
                sourceVerse: {
                    bookId,
                    chapter,
                    verse: verseNum,
                    reference: `${verse.bookName} ${chapter}:${verseNum}`
                },
                crossReferences: refs.slice(0, limit),
                source: 'Treasury of Scripture Knowledge (OpenBible.info)'
            }
        });
    } catch (error: any) {
        console.error('Cross references error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get cross references',
            code: 500
        });
    }
});

export default router;
