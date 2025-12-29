"""
Build Complete Strong's Dictionary with English and Telugu Meanings
Converts CSV data to JSON for frontend use
"""

import csv
import json
import os

def build_strongs_dictionary():
    """Build a comprehensive Strong's dictionary from CSV files."""
    
    # Paths
    base_path = os.path.dirname(os.path.abspath(__file__))
    concordance_path = os.path.join(base_path, 'backend', 'data', 'StrongsConcordance-EnglishTelugu.csv')
    hebrew_strongs_path = os.path.join(base_path, 'backend', 'data', 'HebrewStrongs.csv')
    greek_strongs_path = os.path.join(base_path, 'backend', 'data', 'GreekStrongs.csv')
    output_path = os.path.join(base_path, 'frontend', 'public', 'data', 'strongs_dictionary.json')
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    dictionary = {}
    
    # Read main concordance with English/Telugu meanings
    print(f"Reading {concordance_path}...")
    with open(concordance_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            strongs = row.get('strongs_number', '').strip()
            if not strongs:
                continue
            
            dictionary[strongs] = {
                'strongs': strongs,
                'word': row.get('original_word', '').strip(),
                'testament': row.get('testament', '').strip(),
                'language': row.get('language', '').strip(),
                'pos': row.get('part_of_speech', '').strip(),
                'english': row.get('english_meaning', '').strip(),
                'telugu': row.get('telugu_meaning', '').strip(),
                'occurrences': int(row.get('occurrences', 0) or 0)
            }
    
    print(f"Loaded {len(dictionary)} entries from concordance")
    
    # Enhance with Hebrew word data
    hebrew_count = 0
    if os.path.exists(hebrew_strongs_path):
        print(f"Reading {hebrew_strongs_path}...")
        with open(hebrew_strongs_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                strongs = row.get('Strongs:Number', '').strip().replace('|', '')
                if not strongs:
                    continue
                
                # Add or enhance entry
                if strongs in dictionary:
                    # Add gloss if not already present
                    if not dictionary[strongs].get('gloss'):
                        dictionary[strongs]['gloss'] = row.get('Strongs:Gloss', '').strip()
                    if not dictionary[strongs].get('root'):
                        dictionary[strongs]['root'] = row.get('Strongs:RootLemma', '').strip()
                else:
                    dictionary[strongs] = {
                        'strongs': strongs,
                        'word': row.get('Strongs:Word', '').strip(),
                        'testament': 'Old Testament',
                        'language': 'Hebrew',
                        'pos': '',
                        'english': row.get('Strongs:Gloss', '').strip(),
                        'telugu': '',
                        'gloss': row.get('Strongs:Gloss', '').strip(),
                        'root': row.get('Strongs:RootLemma', '').strip(),
                        'occurrences': int(row.get('Strongs:Occurrences', 0) or 0)
                    }
                    hebrew_count += 1
        print(f"Added {hebrew_count} Hebrew entries")
    
    # Enhance with Greek word data
    greek_count = 0
    if os.path.exists(greek_strongs_path):
        print(f"Reading {greek_strongs_path}...")
        with open(greek_strongs_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            for row in reader:
                strongs = row.get('Strongs:Number', '').strip().replace('|', '')
                if not strongs:
                    continue
                
                # Add or enhance entry
                if strongs in dictionary:
                    if not dictionary[strongs].get('root'):
                        dictionary[strongs]['root'] = row.get('Strongs:RootLemma', '').strip()
                else:
                    dictionary[strongs] = {
                        'strongs': strongs,
                        'word': row.get('Strongs:Lemma', '').strip(),
                        'testament': 'New Testament',
                        'language': 'Greek',
                        'pos': '',
                        'english': '',
                        'telugu': '',
                        'root': row.get('Strongs:RootLemma', '').strip(),
                        'occurrences': 0
                    }
                    greek_count += 1
        print(f"Added {greek_count} Greek entries")
    
    # Write output as JSON
    print(f"\nWriting {len(dictionary)} total entries to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=2)
    
    # Also create a compact version for production
    compact_path = output_path.replace('.json', '_compact.json')
    with open(compact_path, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, separators=(',', ':'))
    
    print(f"Created compact version: {compact_path}")
    
    # Stats
    hebrew_entries = sum(1 for k in dictionary if k.startswith('H'))
    greek_entries = sum(1 for k in dictionary if k.startswith('G'))
    aramaic_entries = sum(1 for k in dictionary if k.startswith('A'))
    with_telugu = sum(1 for v in dictionary.values() if v.get('telugu'))
    
    print(f"\n📊 Dictionary Statistics:")
    print(f"   Hebrew entries:  {hebrew_entries}")
    print(f"   Greek entries:   {greek_entries}")
    print(f"   Aramaic entries: {aramaic_entries}")
    print(f"   With Telugu:     {with_telugu}")
    print(f"   Total entries:   {len(dictionary)}")
    
    return dictionary

if __name__ == '__main__':
    build_strongs_dictionary()
