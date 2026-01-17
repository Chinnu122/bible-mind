/**
 * Script to analyze and fill missing Telugu meanings in StrongsWithTelugu.csv
 * Uses English meanings to generate Telugu translations via AI or lookup
 */

const fs = require('fs');
const path = require('path');

// Path to the CSV file
const csvPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');

// Parse CSV
function parseCSV(content) {
    const lines = content.split('\n');
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parse (handles basic cases)
        const values = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const row = {};
        header.forEach((h, idx) => {
            row[h] = values[idx] || '';
        });
        rows.push(row);
    }

    return { header, rows };
}

// Analyze coverage
function analyzeCoverage(rows) {
    const total = rows.length;
    const withTelugu = rows.filter(r => r['Telugu Meaning'] || r['Telugu Word']).length;
    const withEnglish = rows.filter(r => r['English Meaning']).length;

    console.log('\n📊 DICTIONARY ANALYSIS');
    console.log('='.repeat(40));
    console.log(`Total entries: ${total}`);
    console.log(`With Telugu meaning: ${withTelugu} (${(withTelugu / total * 100).toFixed(1)}%)`);
    console.log(`Missing Telugu: ${total - withTelugu} (${((total - withTelugu) / total * 100).toFixed(1)}%)`);
    console.log(`With English meaning: ${withEnglish} (${(withEnglish / total * 100).toFixed(1)}%)`);
    console.log('');

    // Show sample entries that need filling
    console.log('📝 SAMPLE ENTRIES NEEDING TELUGU MEANINGS:');
    const needsFilling = rows.filter(r => !r['Telugu Meaning'] && !r['Telugu Word'] && r['English Meaning']);
    needsFilling.slice(0, 10).forEach(r => {
        console.log(`  ${r['Strong\'s Number']}: ${r['Original Word']} = ${r['English Meaning'].substring(0, 50)}...`);
    });

    return { total, withTelugu, withEnglish, needsFilling: needsFilling.length };
}

// Main
const content = fs.readFileSync(csvPath, 'utf-8');
const { header, rows } = parseCSV(content);
const stats = analyzeCoverage(rows);

console.log('\n📋 HEADER COLUMNS:');
console.log(header.join(', '));
