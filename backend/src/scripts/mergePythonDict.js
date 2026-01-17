/**
 * Script to merge the existing Python Hebrew dictionary into StrongsWithTelugu.csv
 * Reads the complete curated dictionary and populates missing Telugu meanings
 * 
 * Run with: node src/scripts/mergePythonDict.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const pythonDictPath = 'd:/projects/Bible Mind/tools/📜 Dictionary Scripts/hebrew_word_dict.py';
const csvPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');
const outputPath = path.join(__dirname, '../../data/StrongsWithTelugu_merged.csv');

// Parse the Python dictionary file
function parsePythonDict(content) {
    const entries = new Map();

    // Match patterns like: 'אָב': ('H1', 'av', 'father', 'తండ్రి'),
    const pattern = /'([^']+)':\s*\(\s*'([^']+)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\s*\)/g;

    let match;
    while ((match = pattern.exec(content)) !== null) {
        const [, hebrewWord, strongsNum, transliteration, englishMeaning, teluguMeaning] = match;

        // Store by Strong's number as key
        entries.set(strongsNum, {
            strongsNumber: strongsNum,
            originalWord: hebrewWord,
            transliteration,
            englishMeaning,
            teluguMeaning
        });

        // Also store by Hebrew word
        entries.set(hebrewWord, {
            strongsNumber: strongsNum,
            originalWord: hebrewWord,
            transliteration,
            englishMeaning,
            teluguMeaning
        });
    }

    return entries;
}

// Parse CSV line
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
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

// Main
console.log('📖 Loading Python dictionary...');
const pythonContent = fs.readFileSync(pythonDictPath, 'utf-8');
const pythonDict = parsePythonDict(pythonContent);
console.log(`Found ${pythonDict.size / 2} unique entries in Python dictionary`);

console.log('📖 Loading StrongsWithTelugu.csv...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');
const header = lines[0];

let updated = 0;
let alreadyHad = 0;
let notFound = 0;
const outputLines = [header];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);

    // Columns: Strong's Number, Original Word, English Meaning, Telugu Word, Telugu Meaning, Language, Testament
    let strongsNumber = values[0] || '';
    let originalWord = values[1] || '';
    let englishMeaning = values[2] || '';
    let teluguWord = values[3] || '';
    let teluguMeaning = values[4] || '';
    const language = values[5] || '';
    const testament = values[6] || '';

    // Check if we already have Telugu meaning
    if (teluguMeaning || teluguWord) {
        alreadyHad++;
    } else {
        // Try to find in Python dictionary
        let found = pythonDict.get(strongsNumber) || pythonDict.get(originalWord);

        if (found && found.teluguMeaning) {
            teluguMeaning = found.teluguMeaning;
            updated++;
        } else {
            notFound++;
        }
    }

    // Rebuild line
    const newLine = [
        strongsNumber,
        originalWord,
        `"${englishMeaning.replace(/"/g, '""')}"`,
        teluguWord,
        teluguMeaning,
        language,
        testament
    ].join(',');

    outputLines.push(newLine);
}

// Write output
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');

console.log('\n📊 RESULTS:');
console.log('='.repeat(50));
console.log(`Already had Telugu: ${alreadyHad}`);
console.log(`Updated from Python dict: ${updated}`);
console.log(`Still missing: ${notFound}`);
console.log(`\n✅ Output saved to: ${outputPath}`);
