import csv
import json
import os
import re

def normalize_strongs(sid):
    """
    Normalizes Strong's ID to H1, G1 format.
    Removes leading zeros (H0001 -> H1).
    Ensures prefix (123 -> H123 if Hebrew context).
    """
    if not sid: return None
    sid = sid.strip().upper()
    if not sid: return None
    
    # Remove 'H' or 'G' prefix to parse number
    prefix = ''
    number_part = sid
    if sid.startswith('H'):
        prefix = 'H'
        number_part = sid[1:]
    elif sid.startswith('G'):
        prefix = 'G'
        number_part = sid[1:]
    
    # If no prefix, let caller decide or assume H if unknown? 
    # Better to preserve existing prefix if present.
    
    try:
        num = int(number_part)
        return f"{prefix}{num}"
    except:
        return sid # Return as is if not parseable

def build_dictionary():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'backend', 'data')
    output_file = os.path.join(base_dir, 'frontend', 'public', 'data', 'strongs_dictionary.json')
    
    dictionary = {}

    # 1. Base Hebrew (HebrewStrongs.csv)
    # Covers H1 - H8674
    print("Processing HebrewStrongs.csv...")
    try:
        with open(os.path.join(data_dir, 'HebrewStrongs.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            reader.fieldnames = [h.strip() for h in reader.fieldnames]
            for row in reader:
                sid = row.get('strongs_number', '').strip()
                if not sid: continue
                
                # Check if it has H prefix, if not add it
                if not sid[0].isalpha(): sid = 'H' + sid
                
                sid = normalize_strongs(sid)
                
                dictionary[sid] = {
                    "strongs": sid,
                    "word": row.get('word', ''),
                    "pronunciation": row.get('pronunciation', ''),
                    "english": row.get('gloss', '').replace('\n', '; '), # Basic gloss
                    "telugu": "",
                    "transliteration": ""
                }
    except Exception as e:
        print(f"Error processing HebrewStrongs: {e}")

    # 2. Base Greek (GreekStrongs.csv)
    # Covers G1 - G5624
    print("Processing GreekStrongs.csv...")
    try:
        with open(os.path.join(data_dir, 'GreekStrongs.csv'), 'r', encoding='utf-8') as f:
            # Tab separated
            reader = csv.DictReader(f, delimiter='\t')
            # Columns: Strongs:Number, Strongs:Lemma
            for row in reader:
                sid = row.get('Strongs:Number', '').strip()
                lemma = row.get('Strongs:Lemma', '').strip()
                
                if not sid: continue
                sid = normalize_strongs(sid) # G1 format
                
                if sid not in dictionary:
                    dictionary[sid] = {
                        "strongs": sid,
                        "word": lemma,
                        "pronunciation": "",
                        "english": "",
                        "telugu": "",
                        "transliteration": ""
                    }
                else:
                    # Update word if missing
                    if not dictionary[sid]['word']:
                        dictionary[sid]['word'] = lemma
    except Exception as e:
        print(f"Error processing GreekStrongs: {e}")

    # 3. Enrich with StrongsWithTelugu.csv (This has Transliteration + Telugu Meaning)
    # Format: Strong's Number,Original Word,English Meaning,Telugu Word,Telugu Meaning,Language,Testament
    print("Processing StrongsWithTelugu.csv...")
    try:
        with open(os.path.join(data_dir, 'StrongsWithTelugu.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            reader.fieldnames = [h.strip() for h in reader.fieldnames]
            
            for row in reader:
                raw_sid = row.get("Strong's Number", '').strip()
                telugu_word = row.get('Telugu Word', '').strip() # e.g. Transliteration
                telugu_meaning = row.get('Telugu Meaning', '').strip()
                english = row.get('English Meaning', '').strip()
                
                sid = normalize_strongs(raw_sid)
                if not sid: continue
                
                # If ID exists (it should for most)
                if sid not in dictionary:
                    # Create if missing
                    dictionary[sid] = {
                        "strongs": sid,
                        "word": row.get('Original Word', ''),
                        "pronunciation": "",
                        "english": english,
                        "telugu": telugu_meaning,
                        "transliteration": telugu_word
                    }
                else:
                    entry = dictionary[sid]
                    # Update/Append Telugu Meaning
                    if telugu_meaning:
                        if entry['telugu'] and telugu_meaning not in entry['telugu']:
                             entry['telugu'] += "; " + telugu_meaning
                        elif not entry['telugu']:
                             entry['telugu'] = telugu_meaning
                    
                    # Update Transliteration
                    if telugu_word:
                        entry['transliteration'] = telugu_word
                        
                    # Enrich English if current is weak (optional, HebrewStrongs gloss is usually good)
                    if english and not entry['english']:
                        entry['english'] = english

    except Exception as e:
        print(f"Error processing StrongsWithTelugu: {e}")

    # 4. Enrich with StrongsConcordance-EnglishTelugu.csv (Old file, just in case)
    print("Processing StrongsConcordance-EnglishTelugu.csv...")
    try:
        with open(os.path.join(data_dir, 'StrongsConcordance-EnglishTelugu.csv'), 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                sid = normalize_strongs(row.get('strongs_number', ''))
                telugu = row.get('telugu_meaning', '').strip()
                english = row.get('english_meaning', '').strip()
                
                if not sid: continue
                
                if sid in dictionary:
                    entry = dictionary[sid]
                    if telugu and not entry['telugu']:
                         entry['telugu'] = telugu
                    if english and not entry['english']:
                         entry['english'] = english
                # We won't create new entries from this source as it might be incomplete/messy
    except Exception as e:
        print(f"Error processing Concordance: {e}")

    # Statistics
    hebrew_count = sum(1 for k in dictionary if k.startswith('H'))
    greek_count = sum(1 for k in dictionary if k.startswith('G'))
    telugu_count = sum(1 for k in dictionary.values() if k['telugu'])
    
    print(f"Total Entries: {len(dictionary)}")
    print(f"Hebrew Words: {hebrew_count}")
    print(f"Greek Words: {greek_count}")
    print(f"Entries with Telugu: {telugu_count}")
    
    # Write JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to {output_file}")

if __name__ == '__main__':
    build_dictionary()
