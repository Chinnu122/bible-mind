"""
Build Complete Hebrew Dictionary from Strong's Concordance - Fixed Version
Uses the StrongsConcordance-EnglishTelugu.csv with proper escaping
"""

import csv
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
STRONGS_CSV = BASE_DIR / "backend" / "data" / "StrongsConcordance-EnglishTelugu.csv"
OUTPUT_FILE = BASE_DIR / "hebrew_word_dict_complete.py"

def clean_meaning(text):
    """Clean and shorten meaning text."""
    if not text:
        return ''
    # Remove excessive formatting
    text = re.sub(r'\{[^}]*\}', '', text)  # Remove braces content
    text = re.sub(r'\([^)]*\)', '', text)  # Remove parentheses content  
    text = re.sub(r'\[[^\]]*\]', '', text)  # Remove brackets content
    text = re.sub(r'[,;]+.*', '', text)  # Take first part before comma/semicolon
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove problematic characters
    text = text.replace('"', '')
    text = text.replace("'", "\\'")
    # Limit length
    if len(text) > 50:
        text = text[:50].rsplit(' ', 1)[0] + '...'
    return text

def escape_string(s):
    """Properly escape a string for Python code."""
    if not s:
        return ''
    s = s.replace('\\', '\\\\')  # Escape backslashes first
    s = s.replace("'", "\\'")    # Escape single quotes
    s = s.replace('\n', ' ')     # Remove newlines
    s = s.replace('\r', '')      # Remove carriage returns
    return s

def transliterate(hebrew_word):
    """Simple Hebrew to English transliteration."""
    translit_map = {
        'א': "'", 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h',
        'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y',
        'כ': 'kh', 'ך': 'kh', 'ל': 'l', 'מ': 'm', 'ם': 'm',
        'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': "'", 'פ': 'p',
        'ף': 'f', 'צ': 'ts', 'ץ': 'ts', 'ק': 'q', 'ר': 'r',
        'ש': 'sh', 'ת': 't',
        # Vowels - skip
        'ְ': '', 'ֱ': 'e', 'ֲ': 'a', 'ֳ': 'o', 'ִ': 'i',
        'ֵ': 'e', 'ֶ': 'e', 'ַ': 'a', 'ָ': 'a', 'ֹ': 'o',
        'ֻ': 'u', 'ּ': '', '־': '-', ' ': ' '
    }
    result = ''
    for char in hebrew_word:
        if char in translit_map:
            result += translit_map[char]
    return result if result else 'unknown'

def main():
    print("=" * 60)
    print("Building Complete Hebrew Dictionary from Strong's Concordance")
    print("=" * 60)
    
    if not STRONGS_CSV.exists():
        print(f"ERROR: Cannot find {STRONGS_CSV}")
        return
    
    print(f"Reading {STRONGS_CSV}...")
    
    entries = {}
    hebrew_count = 0
    with_telugu = 0
    
    with open(STRONGS_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            strongs = row.get('strongs_number', '').strip()
            hebrew_word = row.get('original_word', '').strip()
            english = row.get('english_meaning', '').strip()
            telugu = row.get('telugu_meaning', '').strip()
            language = row.get('language', '').strip()
            
            # Only process Hebrew entries (not Aramaic) and valid words
            if strongs.startswith('H') and hebrew_word and language == 'Hebrew':
                # Skip words that would cause issues
                if len(hebrew_word) < 1:
                    continue
                    
                hebrew_count += 1
                
                # Clean up meanings
                english_clean = clean_meaning(english)
                telugu_clean = escape_string(telugu.strip() if telugu else '')
                
                if telugu_clean:
                    with_telugu += 1
                
                # Generate transliteration
                translit = transliterate(hebrew_word)
                
                # Store with Hebrew word as key
                entries[hebrew_word] = {
                    'strongs': strongs,
                    'translit': translit,
                    'english': english_clean,
                    'telugu': telugu_clean
                }
    
    print(f"Found {hebrew_count} Hebrew entries")
    print(f"  Unique words: {len(entries)}")
    print(f"  With Telugu: {with_telugu}")
    
    # Write out the dictionary file
    print(f"\nWriting {OUTPUT_FILE}...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("# Complete Hebrew Word Dictionary from Strong's Concordance\n")
        f.write("# Auto-generated with English and Telugu meanings\n")
        f.write(f"# Total entries: {len(entries)}\n\n")
        f.write("CURATED_HEBREW_WORDS = {\n")
        
        for hebrew, entry in entries.items():
            # Escape the Hebrew word if it contains quotes
            hebrew_safe = escape_string(hebrew)
            strongs = entry['strongs']
            translit = escape_string(entry['translit'])
            english = entry['english']  # Already cleaned
            telugu = entry['telugu']  # Already escaped
            
            f.write(f"    '{hebrew_safe}': ('{strongs}', '{translit}', '{english}', '{telugu}'),\n")
        
        f.write("}\n")
    
    # Validate the file by trying to import it
    print("Validating generated file...")
    try:
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            code = f.read()
        exec(compile(code, OUTPUT_FILE, 'exec'))
        print(f"✅ Complete! Created valid dictionary with {len(entries)} entries")
    except SyntaxError as e:
        print(f"⚠️ Syntax error in generated file: {e}")
        print("   The file may need manual fixes")
    
    print(f"   Output: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
