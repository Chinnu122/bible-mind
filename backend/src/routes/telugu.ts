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

// ============================================
// TELUGU TRANSLITERATION SEARCH
// ============================================

/**
 * Roman to Telugu transliteration mapping
 * Maps common romanized Telugu (Manglish/Tenglish) to Telugu script
 */
const ROMAN_TO_TELUGU: Record<string, string> = {
    // Vowels
    'aa': 'ా', 'a': 'అ', 'ii': 'ీ', 'i': 'ఇ', 'uu': 'ూ', 'u': 'ఉ',
    'ee': 'ీ', 'e': 'ఎ', 'ai': 'ై', 'oo': 'ో', 'o': 'ఒ', 'au': 'ౌ',
    'ri': 'ృ', 'ru': 'ృ',
    
    // Consonants with inherent 'a'
    'kh': 'ఖ', 'k': 'క', 'gh': 'ఘ', 'g': 'గ', 'ng': 'ఙ',
    'ch': 'చ', 'chh': 'ఛ', 'j': 'జ', 'jh': 'ఝ', 'ny': 'ఞ',
    'th': 'థ', 't': 'ట', 'dh': 'ధ', 'd': 'డ', 'n': 'న',
    'ph': 'ఫ', 'p': 'ప', 'bh': 'భ', 'b': 'బ', 'm': 'మ',
    'y': 'య', 'r': 'ర', 'l': 'ల', 'v': 'వ', 'w': 'వ',
    'sh': 'శ', 's': 'స', 'h': 'హ', 'f': 'ఫ', 'z': 'జ',
    'x': 'క్ష', 'ksh': 'క్ష', 'gn': 'జ్ఞ', 'gy': 'జ్ఞ',
    'tr': 'త్ర', 'pr': 'ప్ర', 'kr': 'క్ర',
};

/**
 * Common Telugu words typed in Roman script -> Telugu equivalent
 * These are frequently searched Bible terms
 */
const TELUGU_WORD_MAP: Record<string, string[]> = {
    // God-related
    'devudu': ['దేవుడు', 'దేవుని', 'దేవునికి'],
    'deva': ['దేవ', 'దేవుని'],
    'prabhu': ['ప్రభు', 'ప్రభువు', 'ప్రభువా'],
    'prabhuvu': ['ప్రభువు'],
    'yesu': ['యేసు', 'యేసూ'],
    'yeshu': ['యేసు', 'యేసూ'],
    'jesus': ['యేసు', 'యేసూ'],
    'kristu': ['క్రీస్తు', 'క్రిస్తు'],
    'christ': ['క్రీస్తు', 'క్రిస్తు'],
    'christu': ['క్రీస్తు', 'క్రిస్తు'],
    'atma': ['ఆత్మ', 'ఆత్మను'],
    'aatma': ['ఆత్మ', 'ఆత్మను'],
    'parishuddhudatma': ['పరిశుద్ధాత్మ'],
    'parishuddhatma': ['పరిశుద్ధాత్మ'],
    
    // Creation terms
    'srushti': ['సృష్టి', 'సృజించెను'],
    'srujinchenu': ['సృజించెను'],
    'bhumi': ['భూమి', 'భూమిని'],
    'bhoomi': ['భూమి', 'భూమిని'],
    'akasham': ['ఆకాశము', 'ఆకాశం'],
    'aakasham': ['ఆకాశము', 'ఆకాశం'],
    'velugu': ['వెలుగు', 'వెలుగును'],
    'chikati': ['చీకటి', 'చీకటిని'],
    'neeru': ['నీరు', 'నీళ్ళు'],
    'jalamu': ['జలము', 'జలములు'],
    'samudram': ['సముద్రము', 'సముద్రం'],
    
    // People terms
    'manushya': ['మనుష్య', 'మనుష్యుడు'],
    'manishi': ['మనిషి'],
    'stri': ['స్త్రీ'],
    'purusha': ['పురుషుడు'],
    'kumara': ['కుమారుడు', 'కుమారుని'],
    'thandri': ['తండ్రి'],
    'thalli': ['తల్లి'],
    'pillalu': ['పిల్లలు'],
    
    // Actions/Verbs
    'prema': ['ప్రేమ', 'ప్రేమించు'],
    'nammakam': ['నమ్మకము', 'నమ్మకం'],
    'vishwasam': ['విశ్వాసము', 'విశ్వాసం'],
    'nammu': ['నమ్ము', 'నమ్మండి'],
    'prarthana': ['ప్రార్థన', 'ప్రార్థించు'],
    'aashirvadham': ['ఆశీర్వాదము', 'ఆశీర్వదించు'],
    'rakshana': ['రక్షణ', 'రక్షించు'],
    'papam': ['పాపము', 'పాపం'],
    'paapam': ['పాపము', 'పాపం'],
    'kshamapana': ['క్షమాపణ', 'క్షమించు'],
    'kshaminchu': ['క్షమించు'],
    
    // Scripture terms  
    'vachanam': ['వాక్యము', 'వచనము'],
    'vakyam': ['వాక్యము'],
    'niyamam': ['నియమము', 'నియమం'],
    'dharma': ['ధర్మము', 'ధర్మం'],
    'satya': ['సత్యము', 'సత్యం'],
    'satyam': ['సత్యము', 'సత్యం'],
    
    // Numbers  
    'okati': ['ఒకటి', 'ఒక'],
    'rendu': ['రెండు'],
    'moodu': ['మూడు'],
    'nalugu': ['నాలుగు'],
    'aidu': ['ఐదు'],
    
    // Common phrases
    'amen': ['ఆమేన్', 'ఆమెన్'],
    'hallelujah': ['హల్లెలూయా'],
    'hosanna': ['హోసన్నా'],
};

/**
 * Convert Roman/English typed Telugu to possible Telugu script variations
 */
function romanToTelugu(input: string): string[] {
    const lower = input.toLowerCase().trim();
    
    // Check if exact word mapping exists
    if (TELUGU_WORD_MAP[lower]) {
        return TELUGU_WORD_MAP[lower];
    }
    
    // Check partial word mappings
    const partialMatches: string[] = [];
    for (const [roman, teluguVariants] of Object.entries(TELUGU_WORD_MAP)) {
        if (roman.includes(lower) || lower.includes(roman)) {
            partialMatches.push(...teluguVariants);
        }
    }
    
    if (partialMatches.length > 0) {
        return [...new Set(partialMatches)];
    }
    
    return [];
}

/**
 * Check if a string contains Telugu script
 */
function containsTelugu(text: string): boolean {
    return /[\u0C00-\u0C7F]/.test(text);
}

/**
 * Search Telugu verses by Roman transliteration or Telugu script
 */
function searchTeluguVerses(query: string, limit: number = 50): Array<{
    bookId: number;
    chapter: number;
    verse: number;
    teluguText: string;
    englishName: string;
    teluguName: string;
    reference: string;
    matchedWord?: string;
}> {
    const results: Array<{
        bookId: number;
        chapter: number;
        verse: number;
        teluguText: string;
        englishName: string;
        teluguName: string;
        reference: string;
        matchedWord?: string;
    }> = [];
    
    // Determine search terms
    let searchTerms: string[] = [];
    
    if (containsTelugu(query)) {
        // Direct Telugu search
        searchTerms = [query.toLowerCase()];
    } else {
        // Roman to Telugu conversion
        searchTerms = romanToTelugu(query);
        if (searchTerms.length === 0) {
            // If no mapping found, try direct search anyway
            searchTerms = [query];
        }
    }
    
    // Search through all books
    for (let bookId = 1; bookId <= 66 && results.length < limit; bookId++) {
        const book = loadTeluguBook(bookId);
        if (!book) continue;
        
        for (const chapter of book.chapters) {
            if (results.length >= limit) break;
            
            for (const verse of chapter.verses) {
                if (results.length >= limit) break;
                
                const verseText = verse.text.toLowerCase();
                
                // Check if any search term matches
                for (const term of searchTerms) {
                    if (verseText.includes(term.toLowerCase())) {
                        results.push({
                            bookId,
                            chapter: parseInt(chapter.chapter),
                            verse: parseInt(verse.verse),
                            teluguText: verse.text,
                            englishName: book.book.english,
                            teluguName: book.book.telugu,
                            reference: `${book.book.english} ${chapter.chapter}:${verse.verse}`,
                            matchedWord: term
                        });
                        break; // Don't add same verse multiple times
                    }
                }
            }
        }
    }
    
    return results;
}

/**
 * GET /api/telugu/search?q=query&limit=50
 * Search Telugu verses by Roman transliteration or Telugu script
 * Examples: 
 *   /api/telugu/search?q=devudu   -> finds verses with దేవుడు
 *   /api/telugu/search?q=yesu     -> finds verses with యేసు
 *   /api/telugu/search?q=prema    -> finds verses with ప్రేమ
 */
router.get('/search', (req: Request, res: Response) => {
    const query = req.query.q as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    
    if (!query || query.length < 2) {
        res.status(400).json({
            success: false,
            error: 'Search query must be at least 2 characters',
            code: 400
        });
        return;
    }
    
    const results = searchTeluguVerses(query, limit);
    
    // Get the Telugu equivalents used for search
    const teluguTermsUsed = containsTelugu(query) ? [query] : romanToTelugu(query);
    
    res.json({
        success: true,
        data: results,
        meta: {
            total: results.length,
            query,
            teluguSearchTerms: teluguTermsUsed,
            limit
        }
    });
});

export default router;
