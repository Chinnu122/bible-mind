/**
 * Merge Verses Script
 * 
 * Merges Hebrew, English, Telugu Bible CSVs into unified format
 * 
 * Usage: npx ts-node src/scripts/mergeVerses.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { loadAllBibleCSVs, mergeVerses, UnifiedVerse } from '../services/csvProcessor';

const PROJECT_ROOT = path.join(__dirname, '../../../../');
const OUTPUT_PATH = path.join(__dirname, '../../data/unified_verses.json');

async function main() {
    const isDryRun = process.argv.includes('--dry-run');

    console.log('==============================================');
    console.log('  Bible Verse Merger');
    console.log('==============================================');
    console.log(`Mode: ${isDryRun ? 'DRY RUN (no files written)' : 'FULL'}`);
    console.log('');

    try {
        // Load all CSVs
        const { hebrew, english, telugu } = await loadAllBibleCSVs(PROJECT_ROOT);

        if (english.length === 0) {
            console.error('ERROR: No English verses found. Check CSV paths.');
            process.exit(1);
        }

        // Merge verses
        const unified = mergeVerses(hebrew, english, telugu);

        // Show sample
        console.log('\n--- Sample Merged Verses ---');
        for (let i = 0; i < Math.min(3, unified.length); i++) {
            const v = unified[i];
            console.log(`\n[${v.verseId}] ${v.bookName.english} ${v.chapter}:${v.verse}`);
            console.log(`  English: ${v.text.english?.substring(0, 80)}...`);
            if (v.text.hebrew) console.log(`  Hebrew: ${v.text.hebrew?.substring(0, 60)}...`);
            if (v.text.telugu) console.log(`  Telugu: ${v.text.telugu?.substring(0, 60)}...`);
        }

        // Statistics
        console.log('\n--- Statistics ---');
        const withHebrew = unified.filter(v => v.text.hebrew).length;
        const withTelugu = unified.filter(v => v.text.telugu).length;
        console.log(`Total verses: ${unified.length}`);
        console.log(`With Hebrew: ${withHebrew} (${(withHebrew / unified.length * 100).toFixed(1)}%)`);
        console.log(`With Telugu: ${withTelugu} (${(withTelugu / unified.length * 100).toFixed(1)}%)`);

        // Write output
        if (!isDryRun) {
            console.log(`\nWriting to: ${OUTPUT_PATH}`);
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(unified, null, 2), 'utf8');
            console.log('✓ Output file written successfully');

            // Also create a summary index
            const indexPath = path.join(__dirname, '../../data/verse_index.json');
            const index = unified.map(v => ({
                id: v.verseId,
                ref: `${v.bookName.english} ${v.chapter}:${v.verse}`,
                book: v.bookNumber
            }));
            fs.writeFileSync(indexPath, JSON.stringify(index), 'utf8');
            console.log(`✓ Index file written: ${indexPath}`);
        } else {
            console.log('\n[DRY RUN] No files written');
        }

        console.log('\n==============================================');
        console.log('  Merge Complete');
        console.log('==============================================');

    } catch (error) {
        console.error('Error during merge:', error);
        process.exit(1);
    }
}

main();
