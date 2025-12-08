import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

// Available languages metadata
const AVAILABLE_LANGUAGES = [
    { code: 'kjv', name: 'King James Version (English)', field: 'kjvText' },
    { code: 'web', name: 'World English Bible', field: 'webText' },
    { code: 'hebrew', name: 'Leningrad Codex (Hebrew)', field: 'hebrewText' },
    { code: 'jps', name: 'Jewish Publication Society', field: 'jpsText' },
    { code: 'greek', name: 'Codex Alexandrinus (Greek)', field: 'greekText' },
    { code: 'brenton', name: 'Brenton Septuagint', field: 'brentonText' },
    { code: 'samaritan', name: 'Samaritan Pentateuch (Hebrew)', field: 'samaritanText' },
    { code: 'samaritan_en', name: 'Samaritan Pentateuch (English)', field: 'samaritanEnglish' },
    { code: 'aramaic', name: 'Onkelos Targum (Aramaic)', field: 'onkelosAramaic' },
    { code: 'aramaic_en', name: 'Onkelos Targum (English)', field: 'onkelosEnglish' },
];

/**
 * GET /api/languages
 * Returns list of available Bible languages/translations
 */
router.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: AVAILABLE_LANGUAGES.map(({ code, name }) => ({ code, name })),
        meta: { total: AVAILABLE_LANGUAGES.length }
    });
});

/**
 * GET /api/languages/verse/:bookId/:chapter/:verse
 * Returns a specific verse in all available languages
 */
router.get('/verse/:bookId/:chapter/:verse', (req: Request, res: Response) => {
    let bookId = parseInt(req.params.bookId);
    const chapter = parseInt(req.params.chapter);
    const verseNum = parseInt(req.params.verse);

    // Handle book name instead of ID
    if (isNaN(bookId)) {
        const book = dataStore.getBookByName(req.params.bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                error: 'Book not found',
                code: 404
            });
            return;
        }
        bookId = book.bookId;
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

    const book = dataStore.getBook(bookId);

    // Build response with all languages
    const translations: Record<string, string> = {};
    AVAILABLE_LANGUAGES.forEach(lang => {
        const text = (verse as any)[lang.field];
        if (text && text.trim()) {
            translations[lang.code] = text;
        }
    });

    res.json({
        success: true,
        data: {
            reference: `${book?.bookName} ${chapter}:${verseNum}`,
            bookId: verse.bookId,
            chapter: verse.chapter,
            verse: verse.verse,
            translations
        }
    });
});

export default router;
