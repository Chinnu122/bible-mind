/**
 * Script to fill missing Telugu meanings in StrongsWithTelugu.csv
 * Translates English meanings to Telugu using a simple mapping and common words
 * 
 * Run with: node src/scripts/fillTeluguMeanings.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const csvPath = path.join(__dirname, '../../data/StrongsWithTelugu.csv');
const outputPath = path.join(__dirname, '../../data/StrongsWithTelugu_filled.csv');

// Common English to Telugu word mappings for Bible terms
const ENGLISH_TO_TELUGU = {
    // Common words
    'father': 'తండ్రి',
    'mother': 'తల్లి',
    'son': 'కుమారుడు',
    'daughter': 'కుమార్తె',
    'brother': 'సోదరుడు',
    'sister': 'సోదరి',
    'man': 'మనిషి',
    'woman': 'స్త్రీ',
    'child': 'బిడ్డ',
    'lord': 'ప్రభువు',
    'god': 'దేవుడు',
    'king': 'రాజు',
    'priest': 'యాజకుడు',
    'prophet': 'ప్రవక్త',
    'servant': 'సేవకుడు',
    'slave': 'బానిస',
    'master': 'యజమాని',
    'house': 'ఇల్లు',
    'temple': 'దేవాలయం',
    'city': 'నగరం',
    'land': 'భూమి',
    'earth': 'భూమి',
    'heaven': 'పరలోకం',
    'sky': 'ఆకాశం',
    'water': 'నీరు',
    'fire': 'అగ్ని',
    'light': 'వెలుగు',
    'darkness': 'చీకటి',
    'day': 'దినము',
    'night': 'రాత్రి',
    'morning': 'ఉదయం',
    'evening': 'సాయంత్రం',
    'sun': 'సూర్యుడు',
    'moon': 'చంద్రుడు',
    'star': 'నక్షత్రం',
    'mountain': 'పర్వతం',
    'sea': 'సముద్రం',
    'river': 'నది',
    'tree': 'చెట్టు',
    'fruit': 'పండు',
    'bread': 'రొట్టె',
    'wine': 'ద్రాక్షారసం',
    'blood': 'రక్తం',
    'life': 'జీవితం',
    'death': 'మరణం',
    'soul': 'ఆత్మ',
    'spirit': 'ఆత్మ',
    'heart': 'హృదయం',
    'hand': 'చేయి',
    'eye': 'కన్ను',
    'ear': 'చెవి',
    'mouth': 'నోరు',
    'tongue': 'నాలుక',
    'head': 'తల',
    'foot': 'పాదం',
    'word': 'మాట',
    'voice': 'స్వరం',
    'name': 'పేరు',
    'way': 'మార్గం',
    'path': 'దారి',
    'truth': 'సత్యం',
    'love': 'ప్రేమ',
    'peace': 'శాంతి',
    'joy': 'ఆనందం',
    'hope': 'ఆశ',
    'faith': 'విశ్వాసం',
    'grace': 'కృప',
    'mercy': 'దయ',
    'righteousness': 'నీతి',
    'holy': 'పవిత్రమైన',
    'sacred': 'పవిత్రమైన',
    'sin': 'పాపం',
    'evil': 'దుష్టత్వం',
    'good': 'మంచి',
    'great': 'గొప్ప',
    'strong': 'బలమైన',
    'mighty': 'శక్తివంతమైన',
    'almighty': 'సర్వశక్తిమంతుడు',
    'eternal': 'శాశ్వతమైన',
    'covenant': 'నిబంధన',
    'blessing': 'ఆశీర్వాదం',
    'curse': 'శాపం',
    'sacrifice': 'బలి',
    'offering': 'అర్పణ',
    'altar': 'బలిపీఠం',
    'prayer': 'ప్రార్థన',
    'praise': 'స్తుతి',
    'glory': 'మహిమ',
    'honor': 'గౌరవం',
    'wisdom': 'జ్ఞానం',
    'knowledge': 'జ్ఞానం',
    'understanding': 'అవగాహన',
    'judgment': 'తీర్పు',
    'justice': 'న్యాయం',
    'law': 'ధర్మశాస్త్రం',
    'commandment': 'ఆజ్ఞ',
    'testimony': 'సాక్ష్యం',
    'promise': 'వాగ్దానం',
    'salvation': 'రక్షణ',
    'redemption': 'విమోచన',
    'forgiveness': 'క్షమాపణ',
    'angel': 'దేవదూత',
    'cherub': 'కెరూబు',
    'seraph': 'సెరాపు',
    'sword': 'కత్తి',
    'shield': 'డాలు',
    'armor': 'కవచం',
    'battle': 'యుద్ధం',
    'war': 'యుద్ధం',
    'enemy': 'శత్రువు',
    'nation': 'జాతి',
    'people': 'ప్రజలు',
    'tribe': 'గోత్రం',
    'family': 'కుటుంబం',
    'generation': 'తరం',
    'inheritance': 'వారసత్వం',
    'wilderness': 'అరణ్యం',
    'desert': 'ఎడారి',
    'garden': 'తోట',
    'vineyard': 'ద్రాక్షతోట',
    'field': 'పొలం',
    'seed': 'విత్తనం',
    'harvest': 'కోత',
    'flock': 'మంద',
    'sheep': 'గొర్రె',
    'lamb': 'గొర్రెపిల్ల',
    'goat': 'మేక',
    'ox': 'ఎద్దు',
    'donkey': 'గాడిద',
    'horse': 'గుర్రం',
    'lion': 'సింహం',
    'bird': 'పక్షి',
    'fish': 'చేప',
    'serpent': 'సర్పం',
    'snake': 'పాము',
    'gold': 'బంగారం',
    'silver': 'వెండి',
    'bronze': 'ఇత్తడి',
    'iron': 'ఇనుము',
    'stone': 'రాయి',
    'rock': 'బండ',
    'wood': 'కలప',
    'oil': 'నూనె',
    'honey': 'తేనె',
    'milk': 'పాలు',
    'salt': 'ఉప్పు',
    'clothing': 'వస్త్రం',
    'robe': 'అంగీ',
    'crown': 'కిరీటం',
    'throne': 'సింహాసనం',
    'ark': 'మందసం',
    'tabernacle': 'గుడారం',
    'tent': 'గుడారం',
    'gate': 'ద్వారం',
    'door': 'తలుపు',
    'wall': 'గోడ',
    'tower': 'బురుజు',
    'well': 'బావి',
    'spring': 'ఊట',
    'fountain': 'జలధార',
    'rain': 'వర్షం',
    'cloud': 'మేఘం',
    'wind': 'గాలి',
    'storm': 'తుఫాను',
    'thunder': 'ఉరుము',
    'lightning': 'మెరుపు',
    'rainbow': 'ఇంద్రధనస్సు',
    'year': 'సంవత్సరం',
    'month': 'నెల',
    'week': 'వారం',
    'sabbath': 'విశ్రాంతిదినం',
    'feast': 'పండుగ',
    'passover': 'పస్కాపండుగ',
    'beginning': 'ఆరంభం',
    'end': 'అంతం',
    'first': 'మొదటి',
    'last': 'చివరి',
    'new': 'కొత్త',
    'old': 'పాత',
    'young': 'యువ',
    'one': 'ఒకటి',
    'two': 'రెండు',
    'three': 'మూడు',
    'four': 'నాలుగు',
    'five': 'ఐదు',
    'six': 'ఆరు',
    'seven': 'ఏడు',
    'eight': 'ఎనిమిది',
    'nine': 'తొమ్మిది',
    'ten': 'పది',
    'twelve': 'పన్నెండు',
    'hundred': 'నూరు',
    'thousand': 'వెయ్యి',
    // Verbs
    'to be': 'ఉండు',
    'to say': 'చెప్పు',
    'to speak': 'మాట్లాడు',
    'to call': 'పిలుచు',
    'to come': 'రా',
    'to go': 'వెళ్ళు',
    'to walk': 'నడుచు',
    'to run': 'పరుగెత్తు',
    'to stand': 'నిలబడు',
    'to sit': 'కూర్చొను',
    'to lie': 'పడుకొను',
    'to rise': 'లేచు',
    'to fall': 'పడు',
    'to give': 'ఇచ్చు',
    'to take': 'తీసుకొను',
    'to send': 'పంపు',
    'to bring': 'తెచ్చు',
    'to make': 'చేయు',
    'to do': 'చేయు',
    'to create': 'సృజించు',
    'to build': 'కట్టు',
    'to destroy': 'నాశనము చేయు',
    'to kill': 'చంపు',
    'to save': 'రక్షించు',
    'to heal': 'స్వస్థపరచు',
    'to bless': 'ఆశీర్వదించు',
    'to curse': 'శపించు',
    'to love': 'ప్రేమించు',
    'to hate': 'ద్వేషించు',
    'to fear': 'భయపడు',
    'to trust': 'నమ్ము',
    'to believe': 'నమ్ము',
    'to know': 'తెలుసుకొను',
    'to hear': 'విను',
    'to see': 'చూచు',
    'to eat': 'తిను',
    'to drink': 'త్రాగు',
    'to sleep': 'నిద్రపోవు',
    'to die': 'చనిపోవు',
    'to live': 'జీవించు',
    'to worship': 'ఆరాధించు',
    'to pray': 'ప్రార్థించు',
    'to sing': 'పాడు',
    'to praise': 'స్తుతించు',
    'to judge': 'తీర్పు తీర్చు',
    'to forgive': 'క్షమించు',
    'to repent': 'మారుమనస్సు పొందు',
    'to anoint': 'అభిషేకించు',
    'to sanctify': 'పవిత్రపరచు',
    'to purify': 'శుద్ధిచేయు',
    'to cleanse': 'శుభ్రపరచు',
    'to remember': 'జ్ఞాపకము చేసికొను',
    'to forget': 'మరచిపోవు',
    'to write': 'వ్రాయు',
    'to read': 'చదువు',
    'to teach': 'బోధించు',
    'to learn': 'నేర్చుకొను',
    'to fight': 'పోరాడు',
    'to conquer': 'జయించు',
    'to reign': 'పరిపాలించు',
    'to serve': 'సేవించు',
    'to obey': 'విధేయత చూపు',
    'to command': 'ఆజ్ఞాపించు',
};

// Parse CSV line handling quotes
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

// Translate English to Telugu using dictionary
function translateToTelugu(englishMeaning) {
    if (!englishMeaning) return '';

    const text = englishMeaning.toLowerCase();

    // Try to find matching Telugu word
    for (const [eng, tel] of Object.entries(ENGLISH_TO_TELUGU)) {
        if (text.includes(eng)) {
            return tel;
        }
    }

    return '';
}

// Main
console.log('📖 Loading StrongsWithTelugu.csv...');
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');
const header = lines[0];

let filled = 0;
let total = 0;
let alreadyHad = 0;
const outputLines = [header];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    total++;
    const values = parseCSVLine(line);

    // Columns: Strong's Number, Original Word, English Meaning, Telugu Word, Telugu Meaning, Language, Testament
    const strongsNumber = values[0] || '';
    const originalWord = values[1] || '';
    const englishMeaning = values[2] || '';
    let teluguWord = values[3] || '';
    let teluguMeaning = values[4] || '';
    const language = values[5] || '';
    const testament = values[6] || '';

    // If no Telugu meaning, try to translate from English
    if (!teluguMeaning && !teluguWord && englishMeaning) {
        teluguMeaning = translateToTelugu(englishMeaning);
        if (teluguMeaning) {
            filled++;
        }
    } else if (teluguMeaning || teluguWord) {
        alreadyHad++;
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
console.log('='.repeat(40));
console.log(`Total entries: ${total}`);
console.log(`Already had Telugu: ${alreadyHad}`);
console.log(`Newly filled: ${filled}`);
console.log(`Still missing: ${total - alreadyHad - filled}`);
console.log(`\n✅ Output saved to: ${outputPath}`);
