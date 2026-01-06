import fs from 'fs';
import path from 'path';

const jsonPath = path.join(__dirname, '../../../frontend/public/data/strongs_dictionary.json');

async function analyze() {
    console.log(`Reading JSON from ${jsonPath}...`);

    if (!fs.existsSync(jsonPath)) {
        console.error('JSON file not found!');
        return;
    }

    const content = fs.readFileSync(jsonPath, 'utf8');
    const dictionary = JSON.parse(content);

    let totalHebrew = 0;
    let missingEnglish = 0;
    let missingTelugu = 0;
    const missingTeluguIds: string[] = [];

    Object.keys(dictionary).forEach(key => {
        if (!key.startsWith('H')) return;

        totalHebrew++;
        const entry = dictionary[key];

        // English check
        // Using verified keys from debug step
        const hasEnglish = (!!entry.english && entry.english.trim().length > 0) ||
            (!!entry.definition && entry.definition.trim().length > 0) ||
            (!!entry.meaning && entry.meaning.trim().length > 0);

        // Telugu check
        const hasTelugu = (!!entry.telugu && entry.telugu.trim().length > 0) ||
            (!!entry.telugu_definition && entry.telugu_definition.trim().length > 0) ||
            (!!entry.telugu_meaning && entry.telugu_meaning.trim().length > 0);

        if (!hasEnglish) missingEnglish++;
        if (!hasTelugu) {
            missingTelugu++;
            missingTeluguIds.push(key);
        }
    });

    const summary = `
--- JSON Analysis Result ---
Total Hebrew Words: ${totalHebrew}
Missing English: ${missingEnglish}
Missing Telugu: ${missingTelugu}
----------------------------
`;
    // Write summary
    fs.writeFileSync('analysis_debug.txt', summary);
    console.log(summary);

    // Write first 50 missing IDs to preview
    if (missingTelugu > 0) {
        fs.writeFileSync('missing_telugu_ids.txt', missingTeluguIds.join('\n'));
        console.log(`First 10 missing Telugu: ${missingTeluguIds.slice(0, 10).join(', ')}`);
    }
}

analyze();
