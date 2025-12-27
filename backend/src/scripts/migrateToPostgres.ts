/**
 * Migration Script: CSV to PostgreSQL
 * 
 * Imports existing CSV data (BibleData-Book.csv, AlamoPolyglot.csv, 
 * HebrewStrongs.csv, GreekStrongs.csv, TeluguHindiStrongs.csv)
 * into the new PostgreSQL database via Prisma.
 * 
 * Usage: npx ts-node src/scripts/migrateToPostgres.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

// ============================================
// HELPERS
// ============================================

function normalizeStrongsNumber(input: string): string {
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

    return `${prefix}${rawDigits.padStart(4, '0')}`;
}

async function readCSV<T>(filePath: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => results.push(row as T))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function migrateBooks() {
    console.log('📖 Migrating Books...');
    const filePath = path.join(__dirname, '../../data/BibleData-Book.csv');

    interface BookRow {
        book_id: string;
        book_name: string;
        hebrew_name?: string;
        hebrew_transliteration?: string;
        hebrew_meaning?: string;
        greek_name?: string;
        greek_transliteration?: string;
        greek_meaning?: string;
        chapter_count: string;
        verse_count: string;
        short_name: string;
        usx_code?: string;
    }

    const rows = await readCSV<BookRow>(filePath);

    for (const row of rows) {
        const bookId = parseInt(row.book_id) || 0;
        await prisma.book.upsert({
            where: { bookId },
            update: {},
            create: {
                bookId,
                bookName: row.book_name || '',
                hebrewName: row.hebrew_name || null,
                hebrewTransliteration: row.hebrew_transliteration || null,
                hebrewMeaning: row.hebrew_meaning || null,
                greekName: row.greek_name || null,
                greekTransliteration: row.greek_transliteration || null,
                greekMeaning: row.greek_meaning || null,
                chapterCount: parseInt(row.chapter_count) || 0,
                verseCount: parseInt(row.verse_count) || 0,
                shortName: row.short_name || '',
                usxCode: row.usx_code || null,
                testament: bookId <= 39 ? 'old' : 'new',
            },
        });
    }

    console.log(`   ✅ Migrated ${rows.length} books`);
}

async function migrateVerses() {
    console.log('📜 Migrating Verses...');
    const filePath = path.join(__dirname, '../../data/AlamoPolyglot.csv');

    interface VerseRow {
        id: string;
        book_id: string;
        book_name: string;
        chapter: string;
        verse: string;
        world_english_bible_web?: string;
        king_james_bible_kjv?: string;
        leningrad_codex?: string;
        jewish_publication_society_jps?: string;
        codex_alexandrinus?: string;
        brenton?: string;
        samaritan_pentateuch?: string;
        samaritan_pentateuch_english?: string;
        onkelos_aramaic?: string;
        onkelos_english?: string;
    }

    const rows = await readCSV<VerseRow>(filePath);
    let count = 0;

    // Batch processing for performance
    const batchSize = 500;
    for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);

        await prisma.$transaction(
            batch.map((row) => {
                const bookId = parseInt(row.book_id) || 0;
                const chapter = parseInt(row.chapter) || 0;
                const verse = parseInt(row.verse) || 0;

                const translations = {
                    kjv: row.king_james_bible_kjv || '',
                    web: row.world_english_bible_web || '',
                    jps: row.jewish_publication_society_jps || '',
                    brenton: row.brenton || '',
                    samaritan: row.samaritan_pentateuch_english || '',
                    onkelos: row.onkelos_english || '',
                };

                return prisma.verse.upsert({
                    where: {
                        bookId_chapter_verse: { bookId, chapter, verse }
                    },
                    update: {
                        translations,
                        hebrewText: row.leningrad_codex || null,
                        greekText: row.codex_alexandrinus || null,
                    },
                    create: {
                        bookId,
                        chapter,
                        verse,
                        hebrewText: row.leningrad_codex || null,
                        greekText: row.codex_alexandrinus || null,
                        translations,
                        strongNumbers: [],
                        crossReferences: [],
                    },
                });
            })
        );

        count += batch.length;
        process.stdout.write(`   Processing: ${count}/${rows.length}\r`);
    }

    console.log(`\n   ✅ Migrated ${rows.length} verses`);
}

async function migrateLexicon() {
    console.log('📚 Migrating Lexicon (Hebrew + Greek + Telugu/Hindi)...');

    // Hebrew Strongs
    const hebrewPath = path.join(__dirname, '../../data/HebrewStrongs.csv');
    const hebrewContent = fs.readFileSync(hebrewPath, 'utf8');
    const hebrewLines = hebrewContent.split('\n').slice(1); // Skip header

    let hebrewCount = 0;
    for (const line of hebrewLines) {
        if (!line.trim()) continue;

        // Parse CSV manually (handles quoted fields)
        const parts = parseCSVLine(line);
        if (parts.length >= 9 && parts[0]) {
            const strongNumber = normalizeStrongsNumber(`H${parts[0]}`);

            await prisma.lexiconEntry.upsert({
                where: { strongNumber },
                update: {},
                create: {
                    strongNumber,
                    lemma: parts[1] || '',
                    gloss: parts[2] || '',
                    language: (parts[3] || 'H') as string,
                    partOfSpeech: parts[4] || null,
                    gender: parts[5] || null,
                    occurrences: parseInt(parts[6]) || 0,
                    firstOccurrence: parts[7] || null,
                    rootWord: parts[8] || null,
                },
            });
            hebrewCount++;
        }
    }
    console.log(`   ✅ Migrated ${hebrewCount} Hebrew entries`);

    // Greek Strongs (TSV format)
    const greekPath = path.join(__dirname, '../../data/GreekStrongs.csv');
    const greekContent = fs.readFileSync(greekPath, 'utf8');
    const greekLines = greekContent.split('\n').slice(1);

    let greekCount = 0;
    for (const line of greekLines) {
        if (!line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length >= 2 && parts[0]) {
            const strongNumber = normalizeStrongsNumber(parts[0].trim());

            await prisma.lexiconEntry.upsert({
                where: { strongNumber },
                update: {},
                create: {
                    strongNumber,
                    lemma: parts[1]?.trim() || '',
                    gloss: parts[4]?.trim() || '',
                    language: 'G',
                    rootWord: parts[3]?.trim() || null,
                },
            });
            greekCount++;
        }
    }
    console.log(`   ✅ Migrated ${greekCount} Greek entries`);

    // Telugu/Hindi Meanings
    const teluguHindiPath = path.join(__dirname, '../../data/TeluguHindiStrongs.csv');
    if (fs.existsSync(teluguHindiPath)) {
        interface TeluguHindiRow {
            strongs_number?: string;
            strongsNumber?: string;
            strongs?: string;
            telugu_word?: string;
            telugu_meaning?: string;
            hindi_word?: string;
            hindi_meaning?: string;
        }

        const rows = await readCSV<TeluguHindiRow>(teluguHindiPath);
        let multiLangCount = 0;

        for (const row of rows) {
            const strongsRaw = (row.strongs_number || row.strongsNumber || row.strongs || '').toString();
            const strongNumber = normalizeStrongsNumber(strongsRaw);
            if (!strongNumber) continue;

            const teluguWord = (row.telugu_word || '').toString().trim();
            const teluguMeaning = (row.telugu_meaning || '').toString().trim();
            const hindiWord = (row.hindi_word || '').toString().trim();
            const hindiMeaning = (row.hindi_meaning || '').toString().trim();

            const telugu = teluguWord || teluguMeaning
                ? `${teluguWord}${teluguWord && teluguMeaning ? ' - ' : ''}${teluguMeaning}`
                : null;
            const hindi = hindiWord || hindiMeaning
                ? `${hindiWord}${hindiWord && hindiMeaning ? ' - ' : ''}${hindiMeaning}`
                : null;

            if (telugu || hindi) {
                await prisma.lexiconEntry.updateMany({
                    where: { strongNumber },
                    data: {
                        teluguMeaning: telugu,
                        hindiMeaning: hindi,
                    },
                });
                multiLangCount++;
            }
        }
        console.log(`   ✅ Added Telugu/Hindi meanings to ${multiLangCount} entries`);
    }
}

function parseCSVLine(line: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === '"' && inQuotes) {
            if (line[i + 1] === '"') {
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

    return parts;
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('🚀 Starting CSV to PostgreSQL Migration...\n');

    try {
        await migrateBooks();
        await migrateVerses();
        await migrateLexicon();

        console.log('\n✅ Migration Complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
