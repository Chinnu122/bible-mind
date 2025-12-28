/**
 * Script to generate a comprehensive CSV file with Hebrew (OT) and Greek (NT) words
 * with English and Telugu meanings
 */

const fs = require('fs');
const path = require('path');

// Read and parse Hebrew Strong's
function parseHebrewStrongs() {
    const filePath = path.join(__dirname, '../../data/HebrewStrongs.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const entries = [];
    let currentRecord = [];
    let inQuotes = false;
    let isFirstLine = true;

    for (const line of lines) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip header
        }

        const quoteCount = (line.match(/"/g) || []).length;

        if (!inQuotes) {
            currentRecord = [line];
            if (quoteCount % 2 !== 0) {
                inQuotes = true;
            } else {
                const entry = parseHebrewRecord(currentRecord.join('\n'));
                if (entry) entries.push(entry);
            }
        } else {
            currentRecord.push(line);
            if (quoteCount % 2 !== 0) {
                inQuotes = false;
                const entry = parseHebrewRecord(currentRecord.join('\n'));
                if (entry) entries.push(entry);
            }
        }
    }

    return entries;
}

function parseHebrewRecord(record) {
    if (!record.trim()) return null;

    const parts = [];
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

    if (parts.length >= 3 && parts[0]) {
        // Extract just the main meaning from the gloss (first line, simplified)
        let gloss = parts[2] || '';
        // Clean up - get just the main meaning
        const glossMatch = gloss.match(/n-[mf]?\.\s*\d+\.\s*([^\n{[]+)/);
        let simpleMeaning = glossMatch ? glossMatch[1].trim() : gloss.split('\n')[0].replace(/["{}\[\]]/g, '').trim();

        // Further simplify - take first meaningful part
        simpleMeaning = simpleMeaning.split(/[,;]/)[0].trim();
        if (simpleMeaning.length > 100) {
            simpleMeaning = simpleMeaning.substring(0, 100) + '...';
        }

        return {
            strongsNumber: `H${parts[0].padStart(4, '0')}`,
            word: parts[1] || '',
            englishMeaning: simpleMeaning || parts[2]?.split('\n')[0] || '',
            language: 'Hebrew',
            testament: 'Old Testament'
        };
    }
    return null;
}

// Read and parse Greek Strong's (TSV format)
function parseGreekStrongs() {
    const filePath = path.join(__dirname, '../../data/GreekStrongs.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const entries = [];
    let isFirstLine = true;

    for (const line of lines) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip header
        }

        if (!line.trim()) continue;

        const parts = line.split('\t');
        if (parts.length >= 2 && parts[0]) {
            const strongsNumber = parts[0].trim();
            const lemma = parts[1]?.trim() || '';
            const rootLemma = parts[4]?.trim() || '';

            entries.push({
                strongsNumber: strongsNumber,
                word: lemma,
                englishMeaning: rootLemma || lemma, // Use root lemma as hint
                language: 'Greek',
                testament: 'New Testament'
            });
        }
    }

    return entries;
}

// Read Telugu translations
function parseTeluguStrongs() {
    const filePath = path.join(__dirname, '../../data/TeluguHindiStrongs.csv');

    if (!fs.existsSync(filePath)) {
        return new Map();
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const teluguMap = new Map();
    let isFirstLine = true;

    for (const line of lines) {
        if (isFirstLine) {
            isFirstLine = false;
            continue;
        }

        if (!line.trim()) continue;

        const parts = line.split(',');
        if (parts.length >= 3) {
            const strongsNum = parts[0].trim().toUpperCase();
            const teluguWord = parts[1]?.trim() || '';
            const teluguMeaning = parts[2]?.trim() || '';

            teluguMap.set(strongsNum, {
                word: teluguWord,
                meaning: teluguMeaning
            });
        }
    }

    return teluguMap;
}

// Main function
function generateCSV() {
    console.log('📖 Generating Hebrew and Greek Strong\'s CSV with Telugu meanings...');

    // Parse all data
    console.log('  Loading Hebrew Strong\'s...');
    const hebrewEntries = parseHebrewStrongs();
    console.log(`    Found ${hebrewEntries.length} Hebrew entries`);

    console.log('  Loading Greek Strong\'s...');
    const greekEntries = parseGreekStrongs();
    console.log(`    Found ${greekEntries.length} Greek entries`);

    console.log('  Loading Telugu translations...');
    const teluguMap = parseTeluguStrongs();
    console.log(`    Found ${teluguMap.size} Telugu entries`);

    // Combine all entries
    const allEntries = [...hebrewEntries, ...greekEntries];

    // Add Telugu meanings
    for (const entry of allEntries) {
        const telugu = teluguMap.get(entry.strongsNumber);
        if (telugu) {
            entry.teluguWord = telugu.word;
            entry.teluguMeaning = telugu.meaning;
        } else {
            entry.teluguWord = '';
            entry.teluguMeaning = '';
        }
    }

    // Generate CSV content
    const csvHeader = 'Strong\'s Number,Original Word,English Meaning,Telugu Word,Telugu Meaning,Language,Testament';
    const csvRows = allEntries.map(entry => {
        // Escape fields that might contain commas or quotes
        const escape = (str) => {
            if (!str) return '';
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        return [
            escape(entry.strongsNumber),
            escape(entry.word),
            escape(entry.englishMeaning),
            escape(entry.teluguWord),
            escape(entry.teluguMeaning),
            escape(entry.language),
            escape(entry.testament)
        ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Write to file
    const outputPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');
    fs.writeFileSync(outputPath, csvContent, 'utf8');

    console.log(`\n✅ CSV generated successfully!`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Total entries: ${allEntries.length}`);
    console.log(`   - Hebrew (OT): ${hebrewEntries.length}`);
    console.log(`   - Greek (NT): ${greekEntries.length}`);
    console.log(`   - With Telugu: ${allEntries.filter(e => e.teluguMeaning).length}`);
}

generateCSV();
