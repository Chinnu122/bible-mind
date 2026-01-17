/**
 * Parallel Verses API Routes
 * 
 * Endpoints:
 * - GET /api/verses/parallel/:reference - Multi-language verse data
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { dataStore } from '../services/dataStore';

const router = Router();

// Book name normalization map
const BOOK_ALIASES: { [key: string]: string } = {
    'gen': 'genesis', 'genesis': 'genesis',
    'exo': 'exodus', 'exodus': 'exodus', 'ex': 'exodus',
    'lev': 'leviticus', 'leviticus': 'leviticus',
    'num': 'numbers', 'numbers': 'numbers',
    'deu': 'deuteronomy', 'deut': 'deuteronomy', 'deuteronomy': 'deuteronomy',
    'jos': 'joshua', 'joshua': 'joshua',
    'jdg': 'judges', 'judg': 'judges', 'judges': 'judges',
    'rut': 'ruth', 'ruth': 'ruth',
    'psa': 'psalms', 'psalm': 'psalms', 'psalms': 'psalms', 'ps': 'psalms',
    'pro': 'proverbs', 'prov': 'proverbs', 'proverbs': 'proverbs',
    'isa': 'isaiah', 'isaiah': 'isaiah',
    'jer': 'jeremiah', 'jeremiah': 'jeremiah',
    'mat': 'matthew', 'matt': 'matthew', 'matthew': 'matthew',
    'mrk': 'mark', 'mark': 'mark',
    'luk': 'luke', 'luke': 'luke',
    'jhn': 'john', 'john': 'john', 'jn': 'john',
    'act': 'acts', 'acts': 'acts',
    'rom': 'romans', 'romans': 'romans',
    'rev': 'revelation', 'revelation': 'revelation'
    // Add more as needed
};

/**
 * Parse a verse reference like "Genesis 1:1" or "Gen 1:1"
 */
function parseReference(reference: string): { book: string; chapter: number; verse: number } | null {
    // Pattern: "Book Chapter:Verse" or "Book Chapter:Verse-EndVerse"
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-\d+)?$/i);
    if (!match) return null;

    const bookInput = match[1].toLowerCase().replace(/\s+/g, '');
    const book = BOOK_ALIASES[bookInput] || bookInput;
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);

    return { book, chapter, verse };
}

/**
 * GET /api/verses/parallel/:reference
 * Get verse in all available languages
 */
router.get('/:reference', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;

        const parsed = parseReference(decodeURIComponent(reference));
        if (!parsed) {
            return res.status(400).json({
                success: false,
                error: 'Invalid reference format. Use "Book Chapter:Verse" (e.g., "Genesis 1:1")'
            });
        }

        // Find book by name
        const book = dataStore.getBookByName(parsed.book);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: `Book not found: ${parsed.book}`
            });
        }

        // Get verse using bookId
        const verse = dataStore.getVerse(book.bookId, parsed.chapter, parsed.verse);
        if (!verse) {
            return res.status(404).json({
                success: false,
                error: `Verse not found: ${reference}`
            });
        }

        // Try to load from unified verses if available
        const unifiedPath = path.join(__dirname, '../../data/unified_verses.json');
        let hebrewText = verse.hebrewText || '';
        let teluguText = '';

        if (fs.existsSync(unifiedPath)) {
            try {
                const unified = JSON.parse(fs.readFileSync(unifiedPath, 'utf8'));
                const match = unified.find((v: any) =>
                    v.bookNumber === book.bookId &&
                    v.chapter === parsed.chapter &&
                    v.verse === parsed.verse
                );
                if (match) {
                    hebrewText = match.text?.hebrew || hebrewText;
                    teluguText = match.text?.telugu || '';
                }
            } catch (e) {
                // Unified file not available or parse error
            }
        }

        return res.json({
            success: true,
            data: {
                reference: `${book.bookName} ${parsed.chapter}:${parsed.verse}`,
                bookId: book.bookId,
                bookName: book.bookName,
                chapter: parsed.chapter,
                verse: parsed.verse,
                text: {
                    english: verse.kjvText || verse.webText || '',
                    hebrew: hebrewText,
                    telugu: teluguText,
                    greek: verse.greekText || ''
                },
                translations: {
                    kjv: verse.kjvText,
                    web: verse.webText,
                    jps: verse.jpsText,
                    brenton: verse.brentonText
                }
            }
        });
    } catch (error) {
        console.error('Parallel verse error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get parallel verse'
        });
    }
});

/**
 * GET /api/verses/parallel/chapter/:book/:chapter
 * Get entire chapter in all languages
 */
router.get('/chapter/:book/:chapter', async (req: Request, res: Response) => {
    try {
        const bookInput = req.params.book.toLowerCase();
        const chapter = parseInt(req.params.chapter, 10);

        const bookName = BOOK_ALIASES[bookInput] || bookInput;
        const book = dataStore.getBookByName(bookName);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: `Book not found: ${bookInput}`
            });
        }

        const verses = dataStore.getChapter(book.bookId, chapter);
        if (!verses || verses.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Chapter not found: ${bookName} ${chapter}`
            });
        }

        return res.json({
            success: true,
            data: {
                bookId: book.bookId,
                bookName: book.bookName,
                chapter,
                verses: verses.map(v => ({
                    verse: v.verse,
                    text: {
                        english: v.kjvText || v.webText,
                        hebrew: v.hebrewText,
                        greek: v.greekText
                    }
                })),
                totalVerses: verses.length
            }
        });
    } catch (error) {
        console.error('Chapter fetch error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get chapter'
        });
    }
});

export default router;
