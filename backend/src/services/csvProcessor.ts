/**
 * CSV Processor for Bible Data
 * 
 * Handles parsing of Hebrew, English, Telugu Bible CSV files with:
 * - Metadata line skipping (lines 1-5)
 * - Streaming support for large files
 * - Verse ID normalization for cross-language matching
 */

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// CSV file structure info
const METADATA_LINES_TO_SKIP = 5;

export interface BibleVerseCSV {
    verseId: string;
    bookName: string;
    bookNumber: number;
    chapter: number;
    verse: number;
    text: string;
}

export interface UnifiedVerse {
    verseId: string;
    bookNumber: number;
    bookName: {
        english: string;
        hebrew?: string;
        telugu?: string;
    };
    chapter: number;
    verse: number;
    text: {
        english: string;
        hebrew?: string;
        telugu?: string;
    };
    strongNumbers?: string[];
}

/**
 * Parse a Bible CSV file with metadata skipping
 */
export async function parseBibleCSV(filePath: string): Promise<BibleVerseCSV[]> {
    return new Promise((resolve, reject) => {
        const results: BibleVerseCSV[] = [];
        let lineCount = 0;
        let headerParsed = false;

        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

        // Manual line reading to skip metadata
        let buffer = '';

        stream.on('data', (chunk: Buffer | string) => {
            buffer += chunk.toString();
        });

        stream.on('end', () => {
            const lines = buffer.split('\n');

            // Skip first 5 metadata lines, line 6 is header
            const dataLines = lines.slice(METADATA_LINES_TO_SKIP);
            const csvContent = dataLines.join('\n');

            // Parse CSV from data portion
            const Readable = require('stream').Readable;
            const csvStream = new Readable();
            csvStream.push(csvContent);
            csvStream.push(null);

            csvStream
                .pipe(csvParser({
                    mapHeaders: ({ header }: { header: string }) => header.trim().toLowerCase().replace(/\s+/g, '_')
                }))
                .on('data', (row: any) => {
                    try {
                        const verse: BibleVerseCSV = {
                            verseId: row['verse_id'] || row['verseid'] || '',
                            bookName: row['book_name'] || row['bookname'] || '',
                            bookNumber: parseInt(row['book_number'] || row['booknumber'] || '0', 10),
                            chapter: parseInt(row['chapter'] || '0', 10),
                            verse: parseInt(row['verse'] || '0', 10),
                            text: row['text'] || ''
                        };

                        if (verse.verseId && verse.text) {
                            results.push(verse);
                        }
                    } catch (err) {
                        console.error('Error parsing row:', err);
                    }
                })
                .on('end', () => {
                    console.log(`Parsed ${results.length} verses from ${path.basename(filePath)}`);
                    resolve(results);
                })
                .on('error', reject);
        });

        stream.on('error', reject);
    });
}

/**
 * Normalize a verse ID for matching across languages
 * Example: "GEN 1:1" -> "gen_1_1"
 */
export function normalizeVerseId(verseId: string): string {
    return verseId
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/:/g, '_')
        .trim();
}

/**
 * Parse Strong's numbers from Hebrew text
 * Looks for patterns like H430, G3056, etc.
 */
export function extractStrongNumbers(text: string): string[] {
    const pattern = /[HG]\d{1,5}/gi;
    const matches = text.match(pattern) || [];
    return [...new Set(matches.map(m => m.toUpperCase()))];
}

/**
 * Load all Bible CSVs from root directory
 */
export async function loadAllBibleCSVs(rootDir: string): Promise<{
    hebrew: BibleVerseCSV[];
    english: BibleVerseCSV[];
    telugu: BibleVerseCSV[];
}> {
    const hebrewPath = path.join(rootDir, 'hebrew_words.csv');
    const englishPath = path.join(rootDir, 'english_words.csv');
    const teluguPath = path.join(rootDir, 'telugu_words.csv');

    console.log('Loading Bible CSVs...');

    const [hebrew, english, telugu] = await Promise.all([
        fs.existsSync(hebrewPath) ? parseBibleCSV(hebrewPath) : Promise.resolve([]),
        fs.existsSync(englishPath) ? parseBibleCSV(englishPath) : Promise.resolve([]),
        fs.existsSync(teluguPath) ? parseBibleCSV(teluguPath) : Promise.resolve([]),
    ]);

    console.log(`Loaded: Hebrew=${hebrew.length}, English=${english.length}, Telugu=${telugu.length}`);

    return { hebrew, english, telugu };
}

/**
 * Merge verses from multiple languages into unified records
 */
export function mergeVerses(
    hebrew: BibleVerseCSV[],
    english: BibleVerseCSV[],
    telugu: BibleVerseCSV[]
): UnifiedVerse[] {
    // Create maps for quick lookup  
    const hebrewMap = new Map<string, BibleVerseCSV>();
    const teluguMap = new Map<string, BibleVerseCSV>();

    hebrew.forEach(v => hebrewMap.set(normalizeVerseId(v.verseId), v));
    telugu.forEach(v => teluguMap.set(normalizeVerseId(v.verseId), v));

    // Use English as base since it's most complete
    const unified: UnifiedVerse[] = [];

    for (const eng of english) {
        const normalId = normalizeVerseId(eng.verseId);
        const heb = hebrewMap.get(normalId);
        const tel = teluguMap.get(normalId);

        const verse: UnifiedVerse = {
            verseId: eng.verseId,
            bookNumber: eng.bookNumber,
            bookName: {
                english: eng.bookName,
                hebrew: heb?.bookName,
                telugu: tel?.bookName
            },
            chapter: eng.chapter,
            verse: eng.verse,
            text: {
                english: eng.text,
                hebrew: heb?.text,
                telugu: tel?.text
            }
        };

        unified.push(verse);
    }

    console.log(`Merged ${unified.length} unified verses`);
    return unified;
}

export default {
    parseBibleCSV,
    loadAllBibleCSVs,
    mergeVerses,
    normalizeVerseId,
    extractStrongNumbers
};
