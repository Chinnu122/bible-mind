/**
 * Script to fill remaining Telugu meanings using OpenRouter AI
 * Batch translates English meanings to Telugu
 * 
 * Run with: node src/scripts/fillWithAI.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Paths
const csvPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');
const outputPath = path.join(__dirname, '../../data/StrongsWithTelugu_ai_filled.csv');

// OpenRouter API config - read from .env
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY_GPT || process.env.OPENROUTER_API_KEY;
const BATCH_SIZE = 30; // Number of words to translate per API call
const DELAY_BETWEEN_BATCHES = 1500; // ms to wait between batches

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

// Call OpenRouter API
async function translateBatch(words) {
    const prompt = `Translate these English biblical/Hebrew terms to Telugu. Give ONLY the Telugu translation for each, one per line, in order. No numbers, no explanations. If unknown, write "అర్థం తెలియదు".

${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Telugu translations:`;

    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000
        });

        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://bible-mind.app',
                'X-Title': 'Bible Mind Dictionary Fill'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.choices && json.choices[0] && json.choices[0].message) {
                        const text = json.choices[0].message.content;
                        // Debug: log first response
                        if (!global.debugShown) {
                            console.log('\n🔍 Sample API response:', text.substring(0, 200));
                            global.debugShown = true;
                        }
                        const translations = text.split('\n')
                            .map(line => line.trim())
                            .filter(line => line && line.length > 0)
                            .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim());
                        resolve(translations);
                    } else if (json.error) {
                        console.error('API error:', json.error.message || json.error);
                        resolve(words.map(() => ''));
                    } else {
                        console.error('Unexpected response:', JSON.stringify(json).substring(0, 200));
                        resolve(words.map(() => ''));
                    }
                } catch (e) {
                    console.error('Parse error:', e.message);
                    resolve(words.map(() => ''));
                }
            });
        });

        req.on('error', (e) => {
            console.error('Request error:', e.message);
            resolve(words.map(() => ''));
        });

        req.write(data);
        req.end();
    });
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
async function main() {
    console.log('📖 Loading StrongsWithTelugu.csv...');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    const header = lines[0];

    // Parse all rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = parseCSVLine(line);
        rows.push({
            strongsNumber: values[0] || '',
            originalWord: values[1] || '',
            englishMeaning: values[2] || '',
            teluguWord: values[3] || '',
            teluguMeaning: values[4] || '',
            language: values[5] || '',
            testament: values[6] || '',
            lineIndex: i
        });
    }

    console.log(`Total rows: ${rows.length}`);

    // Find rows needing translation
    const needsTranslation = rows.filter(r =>
        !r.teluguMeaning && !r.teluguWord && r.englishMeaning
    );

    console.log(`Needs translation: ${needsTranslation.length}`);

    if (needsTranslation.length === 0) {
        console.log('✅ All entries already have Telugu meanings!');
        return;
    }

    // Process in batches
    let translated = 0;
    let failed = 0;
    const totalBatches = Math.ceil(needsTranslation.length / BATCH_SIZE);

    for (let i = 0; i < needsTranslation.length; i += BATCH_SIZE) {
        const batch = needsTranslation.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        const englishWords = batch.map(r => {
            // Extract key word from meaning (first few words, clean up)
            let meaning = r.englishMeaning
                .replace(/["\(\)]/g, '')
                .split(';')[0]
                .split(',')[0]
                .replace(/\[.*?\]/g, '')
                .trim();
            return meaning.substring(0, 60);
        });

        process.stdout.write(`\r📝 Batch ${batchNum}/${totalBatches} - Translating ${batch.length} words...`);

        try {
            const translations = await translateBatch(englishWords);

            // Apply translations - accept any text with Telugu characters
            let batchSuccess = 0;
            batch.forEach((row, idx) => {
                const trans = translations[idx];
                // Check if translation exists and contains Telugu characters (\u0C00-\u0C7F)
                const hasTeluguChars = trans && /[\u0C00-\u0C7F]/.test(trans);
                if (hasTeluguChars || (trans && trans.length > 1 && trans !== 'అర్థం తెలియదు')) {
                    row.teluguMeaning = trans;
                    translated++;
                    batchSuccess++;
                } else {
                    failed++;
                }
            });

            process.stdout.write(` ✓ (${batchSuccess}/${batch.length} success)\n`);
        } catch (err) {
            console.error(`\n  Error in batch ${batchNum}:`, err.message);
            failed += batch.length;
        }

        // Rate limit delay
        if (i + BATCH_SIZE < needsTranslation.length) {
            await sleep(DELAY_BETWEEN_BATCHES);
        }

        // Save progress every 100 batches
        if (batchNum % 100 === 0) {
            console.log(`\n💾 Saving progress at batch ${batchNum}...`);
            saveOutput(header, rows, outputPath);
        }
    }

    // Final save
    saveOutput(header, rows, outputPath);

    console.log('\n\n📊 FINAL RESULTS:');
    console.log('='.repeat(50));
    console.log(`Successfully translated: ${translated}`);
    console.log(`Failed/skipped: ${failed}`);
    console.log(`Total with Telugu now: ${rows.filter(r => r.teluguMeaning || r.teluguWord).length}`);
    console.log(`\n✅ Output saved to: ${outputPath}`);
}

function saveOutput(header, rows, outputPath) {
    const outputLines = [header];
    for (const row of rows) {
        const line = [
            row.strongsNumber,
            row.originalWord,
            `"${(row.englishMeaning || '').replace(/"/g, '""')}"`,
            row.teluguWord || '',
            row.teluguMeaning || '',
            row.language || '',
            row.testament || ''
        ].join(',');
        outputLines.push(line);
    }
    fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');
}

main().catch(console.error);
