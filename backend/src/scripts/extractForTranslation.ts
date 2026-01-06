import fs from 'fs';
import path from 'path';

const jsonPath = path.join(__dirname, '../../../frontend/public/data/strongs_dictionary.json');
const missingIdsPath = path.join(__dirname, '../../missing_telugu_ids.txt');
const outputPath = path.join(__dirname, '../../source_for_translation.json');

async function extract() {
    if (!fs.existsSync(jsonPath) || !fs.existsSync(missingIdsPath)) {
        console.error('Files not found');
        return;
    }

    const dictionary = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const missingIds = fs.readFileSync(missingIdsPath, 'utf8')
        .split('\n')
        .map(id => id.trim())
        .filter(id => id.length > 0);

    const extracted: any[] = [];

    missingIds.forEach(id => {
        const entry = dictionary[id];
        if (entry) {
            extracted.push({
                id: id,
                word: entry.word,
                english: entry.english || entry.definition || entry.meaning || entry.gloss || ""
            });
        }
    });

    fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2));
    console.log(`Extracted ${extracted.length} entries to ${outputPath}`);
}

extract();
