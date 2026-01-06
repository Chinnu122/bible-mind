import fs from 'fs';
import path from 'path';

const jsonPath = path.join(__dirname, '../../../frontend/public/data/strongs_dictionary.json');
const translationsPath = path.join(__dirname, '../../translated_batch_1.json');

async function merge() {
    console.log('Reading files...');
    if (!fs.existsSync(jsonPath) || !fs.existsSync(translationsPath)) {
        console.error('File not found');
        return;
    }

    const dictionary = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

    let updatedCount = 0;

    translations.forEach((t: any) => {
        if (dictionary[t.id]) {
            dictionary[t.id].telugu = t.telugu;
            dictionary[t.id].telugu_meaning = t.telugu_meaning;
            // Also set telugu_definition if missing
            if (!dictionary[t.id].telugu_definition) {
                dictionary[t.id].telugu_definition = t.telugu_meaning;
            }
            updatedCount++;
        }
    });

    console.log(`Updating ${updatedCount} entries in strongs_dictionary.json...`);
    fs.writeFileSync(jsonPath, JSON.stringify(dictionary, null, 2));
    console.log('Done!');
}

merge();
