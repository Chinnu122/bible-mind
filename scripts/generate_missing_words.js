// Generate CSV of words without meanings from Strong's dictionary
const fs = require('fs');
const path = require('path');

const dictionaryPath = path.join(__dirname, '../frontend/public/data/strongs_dictionary.json');
const outputPath = path.join(__dirname, '../missing_words.csv');

console.log('Loading dictionary...');
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

const entries = Object.entries(dictionary);
console.log(`Total entries: ${entries.length}`);

// Filter for missing meanings
const missingWords = entries.filter(([key, entry]) => {
    return !entry.telugu || !entry.english;
}).map(([key, entry]) => ({
    strongsNumber: key,
    word: entry.word || '',
    testament: key.startsWith('H') ? 'Hebrew (OT)' : key.startsWith('G') ? 'Greek (NT)' : 'Aramaic',
    hasEnglish: entry.english ? 'Yes' : 'No',
    hasTelugu: entry.telugu ? 'Yes' : 'No',
    pos: entry.pos || '',
    gloss: (entry.gloss || '').replace(/,/g, ';').replace(/\n/g, ' ').substring(0, 100)
}));

console.log(`Words with missing meanings: ${missingWords.length}`);

// Sort by Strong's number
missingWords.sort((a, b) => {
    const numA = parseInt(a.strongsNumber.substring(1));
    const numB = parseInt(b.strongsNumber.substring(1));
    return a.strongsNumber[0].localeCompare(b.strongsNumber[0]) || numA - numB;
});

// Generate CSV
const headers = ['Strong\'s Number', 'Original Word', 'Testament', 'Has English', 'Has Telugu', 'Part of Speech', 'Gloss/Note'];
const csvContent = [
    headers.join(','),
    ...missingWords.map(w =>
        [w.strongsNumber, `"${w.word}"`, w.testament, w.hasEnglish, w.hasTelugu, w.pos, `"${w.gloss}"`].join(',')
    )
].join('\n');

fs.writeFileSync(outputPath, csvContent, 'utf8');
console.log(`\n✅ CSV saved to: ${outputPath}`);
console.log(`Total missing: ${missingWords.length}`);

// Stats
const hebrewMissing = missingWords.filter(w => w.strongsNumber.startsWith('H'));
const greekMissing = missingWords.filter(w => w.strongsNumber.startsWith('G'));
console.log(`\nBreakdown:`);
console.log(`  Hebrew (OT) missing: ${hebrewMissing.length}`);
console.log(`  Greek (NT) missing: ${greekMissing.length}`);
