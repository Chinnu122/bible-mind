import csv
import re
import os

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
HEBREW_FILE = os.path.join(DATA_DIR, 'HebrewStrongs.csv')
GREEK_FILE = os.path.join(DATA_DIR, 'GreekStrongs.csv')
TELUGU_FILE = os.path.join(DATA_DIR, 'TeluguHindiStrongs.csv')
OUTPUT_FILE = os.path.join(DATA_DIR, 'StrongsConcordance-EnglishTelugu.csv')

def clean_gloss(gloss):
    """Extract clean English meaning from gloss field"""
    if not gloss:
        return ''
    # Remove the pronunciation guide at start
    gloss = re.sub(r'^[^,]+,\s*', '', gloss, count=1)
    # Get first definition line
    lines = gloss.strip().split('\n')
    meanings = []
    for line in lines:
        line = line.strip()
        if line.startswith('1.') or line.startswith('2.') or line.startswith('3.'):
            # Extract the meaning
            meaning = re.sub(r'^\d+\.\s*', '', line)
            meaning = re.sub(r'\{[^}]*\}', '', meaning)  # Remove bracketed notes
            meaning = re.sub(r'\[[^\]]*\]', '', meaning)  # Remove square brackets
            meaning = meaning.strip()
            if meaning:
                meanings.append(meaning)
    if meanings:
        return '; '.join(meanings[:3])  # Return first 3 meanings
    # Fallback: return first line cleaned
    first_line = lines[0] if lines else ''
    first_line = re.sub(r'\{[^}]*\}', '', first_line)
    first_line = re.sub(r'\[[^\]]*\]', '', first_line)
    return first_line.strip()

def load_telugu_meanings():
    """Load Telugu meanings from TeluguHindiStrongs.csv"""
    telugu = {}
    try:
        with open(TELUGU_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                strongs = row.get('strongs_number', '').strip()
                telugu_meaning = row.get('telugu_meaning', '').strip()
                if strongs and telugu_meaning:
                    # Normalize strongs number (H0001 -> H1)
                    if strongs.startswith('H') or strongs.startswith('G'):
                        num = int(re.sub(r'[HGA]', '', strongs))
                        normalized = f"{strongs[0]}{num}"
                        telugu[normalized] = telugu_meaning
    except Exception as e:
        print(f"Error loading Telugu file: {e}")
    return telugu

def load_hebrew_words():
    """Load Hebrew words from HebrewStrongs.csv"""
    words = []
    try:
        with open(HEBREW_FILE, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
            reader = csv.DictReader(f)
            for row in reader:
                strongs_num = row.get('strongs_number', '').strip()
                if not strongs_num:
                    continue
                # strongs_num is just a number like "1", "2", etc.
                try:
                    num = int(strongs_num)
                except:
                    continue
                    
                word = row.get('word', '').strip()
                gloss = row.get('gloss', '').strip()
                language = row.get('language', 'H').strip()
                pos = row.get('part_of_speech', '').strip()
                occurrences = row.get('occurrences', '').strip()
                
                # Format strongs number with H or A prefix
                strongs_formatted = f"{language}{num}"
                
                words.append({
                    'strongs_number': strongs_formatted,
                    'original_word': word,
                    'testament': 'Old Testament',
                    'language': 'Hebrew' if language == 'H' else 'Aramaic',
                    'part_of_speech': pos,
                    'english_meaning': clean_gloss(gloss),
                    'occurrences': occurrences
                })
    except Exception as e:
        print(f"Error loading Hebrew file: {e}")
        import traceback
        traceback.print_exc()
    return words

def load_greek_words():
    """Load Greek words from GreekStrongs.csv (tab-separated)"""
    words = []
    try:
        with open(GREEK_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            headers = next(reader)  # Skip header
            for row in reader:
                if len(row) < 2:
                    continue
                strongs_num = row[0].strip()
                lemma = row[1].strip() if len(row) > 1 else ''
                origin = row[2].strip() if len(row) > 2 else ''
                
                if not strongs_num.startswith('G'):
                    continue
                
                # For Greek, we'll use origin/root info as meaning hint
                words.append({
                    'strongs_number': strongs_num,
                    'original_word': lemma,
                    'testament': 'New Testament',
                    'language': 'Greek',
                    'part_of_speech': '',
                    'english_meaning': f"From {origin}" if origin else lemma,
                    'occurrences': ''
                })
    except Exception as e:
        print(f"Error loading Greek file: {e}")
    return words

def main():
    print("Loading Telugu meanings...")
    telugu_meanings = load_telugu_meanings()
    print(f"Loaded {len(telugu_meanings)} Telugu meanings")
    
    print("Loading Hebrew words...")
    hebrew_words = load_hebrew_words()
    print(f"Loaded {len(hebrew_words)} Hebrew/Aramaic words")
    
    print("Loading Greek words...")
    greek_words = load_greek_words()
    print(f"Loaded {len(greek_words)} Greek words")
    
    # Combine all words
    all_words = hebrew_words + greek_words
    
    # Add Telugu meanings
    for word in all_words:
        strongs = word['strongs_number']
        word['telugu_meaning'] = telugu_meanings.get(strongs, '')
    
    # Write output CSV
    print(f"Writing output to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        fieldnames = [
            'strongs_number',
            'original_word', 
            'testament',
            'language',
            'part_of_speech',
            'english_meaning',
            'telugu_meaning',
            'occurrences'
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_words)
    
    print(f"Done! Created {OUTPUT_FILE}")
    print(f"Total entries: {len(all_words)}")
    print(f"Entries with Telugu: {sum(1 for w in all_words if w['telugu_meaning'])}")

if __name__ == '__main__':
    main()
