/**
 * Word Dictionary API Routes
 * 
 * Serves Hebrew/Greek word meanings from StrongsWithTelugu.csv
 * Provides Telugu and English translations for Bible study
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

interface WordEntry {
    strongsNumber: string;
    originalWord: string;
    englishMeaning: string;
    teluguWord: string;
    teluguMeaning: string;
    language: string;
    testament: string;
}

// Cache for word dictionary
let wordDictionary: WordEntry[] = [];
let wordLookupMap: Map<string, WordEntry> = new Map();
let isLoaded = false;

/**
 * Load the word dictionary from CSV file
 */
function loadDictionary(): void {
    if (isLoaded) return;

    try {
        const csvPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');
        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n');

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse CSV line (handle commas in quoted fields)
            const parts = parseCSVLine(line);
            if (parts.length >= 7) {
                const entry: WordEntry = {
                    strongsNumber: parts[0] || '',
                    originalWord: parts[1] || '',
                    englishMeaning: parts[2] || '',
                    teluguWord: parts[3] || '',
                    teluguMeaning: parts[4] || '',
                    language: parts[5] || '',
                    testament: parts[6] || ''
                };

                wordDictionary.push(entry);

                // Create lookup by original word (Hebrew/Greek)
                if (entry.originalWord) {
                    wordLookupMap.set(entry.originalWord, entry);
                }

                // Also create lookup by Strong's number
                if (entry.strongsNumber) {
                    wordLookupMap.set(entry.strongsNumber, entry);
                }
            }
        }

        isLoaded = true;
        console.log(`✅ Word dictionary loaded: ${wordDictionary.length} entries`);
    } catch (error) {
        console.error('❌ Failed to load word dictionary:', error);
    }
}

/**
 * Parse a CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Load dictionary on module load
loadDictionary();

/**
 * GET /api/dictionary/all
 * Returns the complete word dictionary
 */
router.get('/all', (_req: Request, res: Response) => {
    if (!isLoaded) {
        loadDictionary();
    }

    res.json({
        success: true,
        data: wordDictionary,
        meta: {
            total: wordDictionary.length
        }
    });
});

/**
 * GET /api/dictionary/lookup/:word
 * Lookup a specific Hebrew/Greek word or Strong's number
 */
router.get('/lookup/:word', (req: Request, res: Response) => {
    const word = req.params.word;

    if (!isLoaded) {
        loadDictionary();
    }

    // Try exact match first
    let entry = wordLookupMap.get(word);

    // If no exact match, try to find by similar word
    if (!entry) {
        // Remove vowel points and look again
        const cleanWord = word.replace(/[\u0591-\u05C7]/g, '');
        entry = wordLookupMap.get(cleanWord);

        // If still not found, search in dictionary
        if (!entry) {
            entry = wordDictionary.find(e =>
                e.originalWord.includes(word) ||
                word.includes(e.originalWord)
            );
        }
    }

    if (entry) {
        res.json({
            success: true,
            data: entry
        });
    } else {
        res.json({
            success: false,
            error: 'Word not found',
            data: null
        });
    }
});

/**
 * GET /api/dictionary/search
 * Search words by English or Telugu meaning
 */
router.get('/search', (req: Request, res: Response) => {
    const query = (req.query.q as string || '').toLowerCase();
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
        res.status(400).json({
            success: false,
            error: 'Query parameter "q" is required'
        });
        return;
    }

    if (!isLoaded) {
        loadDictionary();
    }

    const results = wordDictionary.filter(entry =>
        entry.englishMeaning.toLowerCase().includes(query) ||
        entry.teluguMeaning.includes(query) ||
        entry.teluguWord.includes(query) ||
        entry.originalWord.includes(query) ||
        entry.strongsNumber.toLowerCase().includes(query)
    ).slice(0, limit);

    res.json({
        success: true,
        data: results,
        meta: {
            total: results.length,
            query
        }
    });
});

/**
 * GET /api/dictionary/stats
 * Get dictionary statistics
 */
router.get('/stats', (_req: Request, res: Response) => {
    if (!isLoaded) {
        loadDictionary();
    }

    const hebrewCount = wordDictionary.filter(e => e.language === 'Hebrew').length;
    const greekCount = wordDictionary.filter(e => e.language === 'Greek').length;
    const withTelugu = wordDictionary.filter(e => e.teluguMeaning || e.teluguWord).length;

    res.json({
        success: true,
        data: {
            total: wordDictionary.length,
            hebrew: hebrewCount,
            greek: greekCount,
            withTeluguMeaning: withTelugu
        }
    });
});

export default router;
