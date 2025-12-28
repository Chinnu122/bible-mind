"""
Script to automatically translate Strong's Hebrew/Greek meanings to Telugu
Uses Google Translate API via deep-translator library
"""

import csv
import os
import re
import time

# Install: pip install deep-translator
try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Installing deep-translator...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'deep-translator'])
    from deep_translator import GoogleTranslator

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
HEBREW_FILE = os.path.join(DATA_DIR, 'HebrewStrongs.csv')
GREEK_FILE = os.path.join(DATA_DIR, 'GreekStrongs.csv')
TELUGU_FILE = os.path.join(DATA_DIR, 'TeluguHindiStrongs.csv')
OUTPUT_FILE = os.path.join(DATA_DIR, 'TeluguHindiStrongs-Extended.csv')

# Common and important Hebrew words to translate (by frequency/importance)
IMPORTANT_HEBREW_NUMBERS = [
    # Creation/Beginnings
    1, 2, 3, 6, 7, 68, 85, 113, 119, 120, 136, 157, 430, 559, 776, 853, 1254, 1696, 1961, 2617, 3068, 3478, 4325, 5315, 5769, 6663, 7225, 7307, 7965, 8064,
    # Common verbs
    935, 1980, 3045, 3212, 3318, 5414, 5975, 6213, 7200, 8085,
    # Important nouns
    120, 376, 802, 1121, 1323, 1697, 2233, 2416, 2617, 3027, 3117, 3820, 4428, 4725, 5315, 5869, 5971, 6440, 6635, 7121,
    # Names of God
    410, 426, 430, 433, 3050, 3068, 3069, 6635, 7706,
    # Key theological terms
    539, 571, 1285, 1350, 2403, 2617, 3722, 4941, 5545, 6664, 6666, 7965, 8451,
    # Numbers
    259, 8147, 7969, 702, 2568, 8337, 7651, 8083, 8672, 6235,
    # Family terms
    1, 517, 251, 269, 1121, 1323, 376, 802,
    # Body parts
    3027, 5869, 7218, 3820, 6310, 241, 639, 7272,
    # Nature
    776, 8064, 3220, 2022, 5104, 6086, 68, 784, 4325, 7307,
    # Time
    3117, 3915, 1242, 6153, 8141, 2320, 7651,
    # Actions
    559, 1696, 6213, 5414, 3947, 7200, 8085, 3045, 1980, 935,
    # Emotions/States
    157, 8130, 3372, 8055, 1058, 7521, 2654,
    # Religious terms
    6942, 2077, 4196, 3548, 5030, 4397, 7891, 8426
]

# Common Greek words (NT)
IMPORTANT_GREEK_NUMBERS = [
    # God/Jesus
    2316, 2424, 5547, 2962, 4151, 40,
    # Love/Faith
    26, 4102, 1680, 5479, 1515,
    # Salvation
    4991, 4982, 3341, 907, 4100,
    # Common verbs
    1510, 2064, 3004, 4160, 1492, 191, 1325, 2192, 2980, 3708,
    # People
    444, 435, 1135, 5043, 80, 3962, 3384,
    # Life/Death
    2222, 2288, 386, 2889,
    # Kingdom
    932, 935, 2409, 2411,
    # Body/Soul
    4983, 5590, 2588, 4750, 5495, 3788,
    # Time
    2250, 3571, 5610, 2540,
    # Truth/Way
    225, 3598, 2222, 5457,
    # Sin/Righteousness
    266, 1343, 3551, 5485,
    # Heaven/Earth
    3772, 1093, 2281,
    # Church
    1577, 652, 4396, 1320
]

def clean_english_meaning(gloss):
    """Extract clean English meaning from gloss"""
    if not gloss:
        return ''
    # Remove pronunciation guide
    gloss = re.sub(r'^[^\n]+\n', '', gloss)
    # Get numbered definitions
    meanings = []
    for match in re.finditer(r'\d+\.\s*([^{}\[\]]+?)(?=\d+\.|$|\{|\[)', gloss):
        meaning = match.group(1).strip()
        meaning = re.sub(r'\s+', ' ', meaning)
        if meaning and len(meaning) > 2:
            meanings.append(meaning)
    if meanings:
        return '; '.join(meanings[:2])
    # Fallback
    lines = gloss.strip().split('\n')
    for line in lines:
        line = re.sub(r'\{[^}]*\}', '', line)
        line = re.sub(r'\[[^\]]*\]', '', line)
        line = line.strip()
        if line and len(line) > 3:
            return line[:100]
    return ''

def translate_to_telugu(text):
    """Translate English text to Telugu using Google Translate"""
    if not text or len(text) < 2:
        return ''
    try:
        translator = GoogleTranslator(source='en', target='te')
        result = translator.translate(text)
        return result if result else ''
    except Exception as e:
        print(f"  Translation error: {e}")
        return ''

def translate_to_hindi(text):
    """Translate English text to Hindi using Google Translate"""
    if not text or len(text) < 2:
        return ''
    try:
        translator = GoogleTranslator(source='en', target='hi')
        result = translator.translate(text)
        return result if result else ''
    except Exception as e:
        print(f"  Translation error: {e}")
        return ''

def load_existing_telugu():
    """Load existing Telugu translations"""
    existing = {}
    try:
        with open(TELUGU_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                strongs = row.get('strongs_number', '').strip()
                if strongs:
                    existing[strongs] = row
    except:
        pass
    return existing

def load_hebrew_words():
    """Load Hebrew words"""
    words = {}
    try:
        with open(HEBREW_FILE, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                num = row.get('strongs_number', '').strip()
                if num:
                    try:
                        num_int = int(num)
                        lang = row.get('language', 'H').strip()
                        key = f"{lang}{num_int:04d}"
                        words[key] = {
                            'number': num_int,
                            'word': row.get('word', ''),
                            'gloss': row.get('gloss', ''),
                            'language': lang
                        }
                    except:
                        pass
    except Exception as e:
        print(f"Error loading Hebrew: {e}")
    return words

def load_greek_words():
    """Load Greek words"""
    words = {}
    try:
        with open(GREEK_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            next(reader)  # Skip header
            for row in reader:
                if len(row) < 2:
                    continue
                strongs = row[0].strip()
                if strongs.startswith('G'):
                    try:
                        num = int(strongs[1:])
                        key = f"G{num:04d}"
                        words[key] = {
                            'number': num,
                            'word': row[1] if len(row) > 1 else '',
                            'origin': row[2] if len(row) > 2 else ''
                        }
                    except:
                        pass
    except Exception as e:
        print(f"Error loading Greek: {e}")
    return words

def main():
    print("=" * 60)
    print("Strong's Hebrew/Greek to Telugu/Hindi Translator")
    print("=" * 60)
    
    # Load existing translations
    print("\nLoading existing translations...")
    existing = load_existing_telugu()
    print(f"Found {len(existing)} existing translations")
    
    # Load source words
    print("\nLoading Hebrew words...")
    hebrew_words = load_hebrew_words()
    print(f"Loaded {len(hebrew_words)} Hebrew words")
    
    print("\nLoading Greek words...")
    greek_words = load_greek_words()
    print(f"Loaded {len(greek_words)} Greek words")
    
    # Prepare new translations
    new_translations = []
    
    # Process Hebrew words
    print("\n" + "=" * 60)
    print("Translating Hebrew words to Telugu/Hindi...")
    print("=" * 60)
    
    for num in IMPORTANT_HEBREW_NUMBERS:
        key = f"H{num:04d}"
        if key in existing:
            print(f"  {key}: Already exists, skipping")
            continue
        
        if key not in hebrew_words:
            # Try without leading zeros
            for k, v in hebrew_words.items():
                if v['number'] == num and v['language'] == 'H':
                    key = k
                    break
        
        if key in hebrew_words:
            word_data = hebrew_words[key]
            english = clean_english_meaning(word_data['gloss'])
            if english:
                print(f"  {key} ({word_data['word']}): {english[:50]}...")
                
                # Translate
                telugu = translate_to_telugu(english)
                hindi = translate_to_hindi(english)
                
                if telugu:
                    print(f"    Telugu: {telugu}")
                    new_translations.append({
                        'strongs_number': key,
                        'telugu_word': word_data['word'],
                        'telugu_meaning': telugu,
                        'hindi_word': word_data['word'],
                        'hindi_meaning': hindi
                    })
                
                # Rate limiting
                time.sleep(0.5)
    
    # Process Greek words (with basic English meanings from a dictionary)
    print("\n" + "=" * 60)
    print("Translating Greek words to Telugu/Hindi...")
    print("=" * 60)
    
    # Greek word meanings (common ones)
    greek_meanings = {
        2316: "God",
        2424: "Jesus, Savior",
        5547: "Christ, Anointed One",
        2962: "Lord, Master",
        4151: "Spirit, Breath",
        40: "Holy, Sacred",
        26: "Love (divine love)",
        4102: "Faith, Belief",
        1680: "Hope",
        5479: "Joy, Gladness",
        1515: "Peace",
        4991: "Salvation, Deliverance",
        4982: "To save, To heal",
        3341: "Repentance",
        907: "To baptize",
        4100: "To believe, To have faith",
        1510: "To be, I am",
        2064: "To come",
        3004: "To say, To speak",
        4160: "To do, To make",
        1492: "To see, To know",
        191: "To hear",
        1325: "To give",
        2192: "To have",
        2980: "To speak, To talk",
        3708: "To see, To look",
        444: "Man, Human being",
        435: "Man, Husband",
        1135: "Woman, Wife",
        5043: "Child",
        80: "Brother",
        3962: "Father",
        3384: "Mother",
        2222: "Life",
        2288: "Death",
        386: "Resurrection",
        2889: "World, Universe",
        932: "Kingdom",
        935: "King",
        2409: "Priest",
        2411: "Temple",
        4983: "Body",
        5590: "Soul, Life",
        2588: "Heart",
        4750: "Mouth",
        5495: "Hand",
        3788: "Eye",
        2250: "Day",
        3571: "Night",
        5610: "Hour",
        2540: "Time, Season",
        225: "Truth",
        3598: "Way, Path",
        5457: "Light",
        266: "Sin",
        1343: "Righteousness",
        3551: "Law",
        5485: "Grace, Favor",
        3772: "Heaven",
        1093: "Earth, Land",
        2281: "Sea",
        1577: "Church, Assembly",
        652: "Apostle",
        4396: "Prophet",
        1320: "Teacher"
    }
    
    for num in IMPORTANT_GREEK_NUMBERS:
        key = f"G{num:04d}"
        if key in existing:
            print(f"  {key}: Already exists, skipping")
            continue
        
        if num in greek_meanings:
            english = greek_meanings[num]
            greek_key = f"G{num:04d}"
            word = ''
            
            # Find Greek word
            for k, v in greek_words.items():
                if v['number'] == num:
                    word = v['word']
                    break
            
            print(f"  G{num} ({word}): {english}")
            
            # Translate
            telugu = translate_to_telugu(english)
            hindi = translate_to_hindi(english)
            
            if telugu:
                print(f"    Telugu: {telugu}")
                new_translations.append({
                    'strongs_number': f"G{num:04d}",
                    'telugu_word': word,
                    'telugu_meaning': telugu,
                    'hindi_word': word,
                    'hindi_meaning': hindi
                })
            
            # Rate limiting
            time.sleep(0.5)
    
    # Write combined output
    print("\n" + "=" * 60)
    print(f"Writing {len(new_translations)} new translations...")
    print("=" * 60)
    
    # Combine existing and new
    all_translations = list(existing.values()) + new_translations
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        fieldnames = ['strongs_number', 'telugu_word', 'telugu_meaning', 'hindi_word', 'hindi_meaning']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_translations)
    
    print(f"\nDone! Output written to: {OUTPUT_FILE}")
    print(f"Total translations: {len(all_translations)}")
    
    # Also update the original file
    import shutil
    shutil.copy(OUTPUT_FILE, TELUGU_FILE)
    print(f"Updated original file: {TELUGU_FILE}")

if __name__ == '__main__':
    main()
