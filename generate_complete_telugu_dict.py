"""
Robust Hebrew-Telugu Dictionary Generator
- Translates one word at a time
- Saves progress every 50 words
- Can resume from saved progress
- Uses multiple translation sources for reliability
"""
import csv
import json
import os
import time
import random

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'backend', 'data')
OUTPUT_FILE = os.path.join(BASE_DIR, 'frontend', 'public', 'data', 'strongs_dictionary.json')
PROGRESS_FILE = os.path.join(BASE_DIR, 'output', 'translation_progress.json')

# Rate limiting
DELAY_MIN = 0.3  # seconds between requests
DELAY_MAX = 0.8

def normalize_strongs(sid):
    """Normalize Strong's ID to H1, G1 format."""
    if not sid:
        return None
    sid = sid.strip().upper()
    if not sid:
        return None
    
    prefix = ''
    number_part = sid
    if sid.startswith('H'):
        prefix = 'H'
        number_part = sid[1:]
    elif sid.startswith('G'):
        prefix = 'G'
        number_part = sid[1:]
    else:
        prefix = 'H'
    
    try:
        num = int(number_part)
        return f"{prefix}{num}"
    except:
        return sid

def load_existing_telugu():
    """Load all existing Telugu from CSV sources."""
    telugu_map = {}
    
    sources = [
        ('StrongsWithTelugu.csv', "Strong's Number", "Telugu Meaning", "Telugu Word"),
        ('TeluguHindiStrongs.csv', 'strongs_number', 'telugu_meaning', 'telugu_word'),
        ('TeluguHindiStrongs-Extended.csv', 'strongs_number', 'telugu_meaning', 'telugu_word'),
    ]
    
    for filename, id_col, meaning_col, word_col in sources:
        path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(path):
            continue
        try:
            with open(path, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    sid = row.get(id_col, "").strip().upper()
                    tel = row.get(meaning_col, row.get(word_col, "")).strip()
                    if not sid.startswith('H') and not sid.startswith('G'):
                        try:
                            sid = 'H' + str(int(sid))
                        except:
                            continue
                    else:
                        sid = normalize_strongs(sid)
                    if sid and tel and sid not in telugu_map:
                        telugu_map[sid] = tel
        except Exception as e:
            print(f"Error loading {filename}: {e}")
    
    return telugu_map

def translate_text(text, translator=None):
    """Translate English text to Telugu using deep-translator."""
    if not text or len(text.strip()) == 0:
        return ""
    
    try:
        from deep_translator import GoogleTranslator
        
        # Clean the text - extract just the meaning part
        clean_text = text.split(';')[0].strip()  # Take first meaning
        clean_text = clean_text.split('.')[0].strip() if '.' in clean_text else clean_text
        
        # Skip if too short or just numbers
        if len(clean_text) < 2 or clean_text.isnumeric():
            return text
        
        if len(clean_text) > 200:
            clean_text = clean_text[:200]
        
        translator = GoogleTranslator(source='en', target='te')
        result = translator.translate(clean_text)
        return result if result else text
        
    except Exception as e:
        return text  # Return original on error

def load_progress():
    """Load translation progress from file."""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_progress(progress):
    """Save translation progress to file."""
    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def main():
    print("="*60)
    print("ROBUST HEBREW-TELUGU DICTIONARY GENERATOR")
    print("="*60)
    
    # Step 1: Load existing Telugu
    print("\n[1/5] Loading existing Telugu translations...")
    existing_telugu = load_existing_telugu()
    print(f"  Found {len(existing_telugu)} existing Telugu translations")
    
    # Step 2: Load progress (if any)
    print("\n[2/5] Checking for previous progress...")
    progress = load_progress()
    print(f"  Found {len(progress)} previously translated words")
    
    # Merge progress with existing
    for sid, tel in progress.items():
        if tel and sid not in existing_telugu:
            existing_telugu[sid] = tel
    
    # Step 3: Load Hebrew words
    print("\n[3/5] Loading Hebrew words...")
    dictionary = {}
    hebrew_path = os.path.join(DATA_DIR, 'HebrewStrongs.csv')
    
    with open(hebrew_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        reader.fieldnames = [h.strip() for h in reader.fieldnames]
        for row in reader:
            sid = row.get('strongs_number', '').strip()
            if not sid:
                continue
            if not sid[0].isalpha():
                sid = 'H' + sid
            sid = normalize_strongs(sid)
            
            english = row.get('gloss', '').replace('\n', '; ')
            
            dictionary[sid] = {
                "strongs": sid,
                "word": row.get('word', ''),
                "pronunciation": "",
                "english": english,
                "telugu": existing_telugu.get(sid, ""),
                "transliteration": "",
                "language": "Hebrew",
                "pos": row.get('part_of_speech', ''),
                "occurrences": int(row.get('occurrences', 0) or 0)
            }
    
    print(f"  Loaded {len(dictionary)} Hebrew entries")
    
    # Step 4: Translate missing Telugu
    print("\n[4/5] Translating missing Telugu...")
    need_translation = [(sid, entry['english']) for sid, entry in dictionary.items() 
                        if not entry['telugu'] and entry['english']]
    print(f"  Need to translate: {len(need_translation)} words")
    
    if need_translation:
        translated_count = 0
        save_interval = 50
        
        for i, (sid, english) in enumerate(need_translation):
            try:
                translated = translate_text(english)
                if translated and translated != english:
                    dictionary[sid]['telugu'] = translated
                    progress[sid] = translated
                    translated_count += 1
                
                # Progress update
                if (i + 1) % save_interval == 0:
                    save_progress(progress)
                    print(f"  Progress: {i+1}/{len(need_translation)} ({translated_count} successful)")
                
                # Rate limiting
                time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))
                
            except KeyboardInterrupt:
                print("\n  Interrupted! Saving progress...")
                save_progress(progress)
                break
            except Exception as e:
                if (i + 1) % 100 == 0:
                    print(f"  Error at {i+1}: {e}")
                continue
        
        save_progress(progress)
        print(f"\n  Translated {translated_count} new words")
    
    # Step 5: Add Greek and save
    print("\n[5/5] Adding Greek words and saving...")
    
    greek_path = os.path.join(DATA_DIR, 'GreekStrongs.csv')
    if os.path.exists(greek_path):
        with open(greek_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                sid = row.get('Strongs:Number', '').strip()
                lemma = row.get('Strongs:Lemma', '').strip()
                if not sid:
                    continue
                sid = normalize_strongs(sid)
                if sid and sid not in dictionary:
                    dictionary[sid] = {
                        "strongs": sid,
                        "word": lemma,
                        "pronunciation": "",
                        "english": "",
                        "telugu": existing_telugu.get(sid, ""),
                        "transliteration": "",
                        "language": "Greek",
                        "pos": "",
                        "occurrences": 0
                    }
    
    # Save dictionary
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=2)
    
    # Stats
    hebrew_count = sum(1 for k in dictionary if k.startswith('H'))
    greek_count = sum(1 for k in dictionary if k.startswith('G'))
    telugu_count = sum(1 for v in dictionary.values() if v.get('telugu'))
    
    print(f"\n" + "="*60)
    print("COMPLETE!")
    print("="*60)
    print(f"Total entries: {len(dictionary)}")
    print(f"  - Hebrew: {hebrew_count}")
    print(f"  - Greek: {greek_count}")  
    print(f"  - With Telugu: {telugu_count} ({telugu_count/len(dictionary)*100:.1f}%)")
    print(f"\nSaved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
