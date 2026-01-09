#!/usr/bin/env python3
"""
Translate Hebrew/English words to Telugu using the existing Strong's dictionary.
Uses deep_translator library for auto-translation.
"""

import json
import os
import re
import time
from pathlib import Path

# Try to import translation library
try:
    from deep_translator import GoogleTranslator
    TRANSLATOR_AVAILABLE = True
except ImportError:
    TRANSLATOR_AVAILABLE = False
    print("Warning: deep_translator not available. Install with: pip install deep_translator")

def load_dictionary(dict_path):
    """Load the Strong's dictionary."""
    with open(dict_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def clean_english_meaning(english_text):
    """Extract clean English meaning for translation, removing grammar/pronunciation."""
    if not english_text:
        return ""
    
    # Text is usually in format: 
    # "word (pronunciation) pos.; 1. definition; ..."
    
    # 1. Extract the main definition part
    # If there's a numbered list "1.", take the text after it
    match = re.search(r'1\.\s*([^;]+)', english_text)
    if match:
        text = match.group(1)
    else:
        # No number, try to split by semicolon and take the first relevant part
        # But first, skip the initial "word (pron) pos" part if it exists
        # This part usually ends with ".;" or "; "
        
        # Split by semicolon
        parts = english_text.split(';')
        
        # If the first part looks like the header ("word (pron) pos"), take the second part
        # Header usually contains the word pattern or pronunciation
        if len(parts) > 1 and ('(' in parts[0] or 'n-m' in parts[0] or ' v ' in parts[0]):
             text = parts[1]
        else:
             text = parts[0]

    # 2. Clean up the extracted text
    
    # Remove KJV references if they snuck in
    if 'KJV:' in text:
        text = text.split('KJV:')[0]
        
    # Remove parenthetical content (often alternative meanings or grammar notes)
    text = re.sub(r'\([^)]*\)', '', text)
    
    # Remove braces {} or brackets []
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\{.*?\}', '', text)
    
    # Remove common grammar codes if they remain
    text = re.sub(r'\b(n-m|n-f|v|adj|adv|prep|conj)\b', '', text)
    
    # Remove non-word characters from start/end
    text = text.strip(' .,;:-')
    
    # 3. Final polish
    # Take just the first comma-separated phrase if it's long
    if ',' in text:
        first_phrase = text.split(',')[0].strip()
        if len(first_phrase) > 2:
            text = first_phrase
            
    # Limit length
    words = text.split()
    if len(words) > 6:
        text = ' '.join(words[:6])
    
    return text.strip()

def process_dictionary(dict_path, output_path, max_items=10000):
    """Process dictionary and add Telugu translations."""
    print(f"Loading dictionary from: {dict_path}")
    dictionary = load_dictionary(dict_path)
    
    # Count current state
    total = len(dictionary)
    print(f"Total entries: {total}")
    
    if not TRANSLATOR_AVAILABLE:
        print("\nTranslator not available. Exiting.")
        return
    
    # Initialize translator
    translator = GoogleTranslator(source='en', target='te')
    
    # Collect entries needing processing
    # We will process ALL entries that don't have a simple Hebrew/English match or need cleaning
    entries_to_process = []
    
    for key, entry in dictionary.items():
        original_english = entry.get('english', '')
        
        # Generate the clean english version
        clean_english = clean_english_meaning(original_english)
        
        # Check if we need to update:
        # 1. If English field is still "dirty" (contains 'n-m', ';', '1.')
        # 2. If Telugu is missing, incomplete, OR contains English characters (indicating it wasn't translated properly)
        
        english_needs_update = len(original_english) > len(clean_english) + 5 and ('1.' in original_english or ';' in original_english)
        
        current_telugu = entry.get('telugu', '')
        # Check for English letters in Telugu field - indicates incomplete translation or retained grammar codes
        has_english_in_telugu = bool(re.search(r'[a-zA-Z]', current_telugu))
        
        telugu_needs_update = not current_telugu or len(current_telugu) < 2 or current_telugu == "nan" or has_english_in_telugu or current_telugu == clean_english
        
        if english_needs_update or telugu_needs_update:
            entries_to_process.append((key, original_english, clean_english))
            
    print(f"\nProcessing {len(entries_to_process)} entries (Translations & Cleaning)...")
    
    updated_count = 0
    # Process in chunks to save progress
    chunk_size = 50
    
    for i, (key, original_english, clean_english) in enumerate(entries_to_process):
        try:
            # Update English to clean version
            dictionary[key]['english'] = clean_english
            # Keep full original in a new field if desired, or just discard as per "words only"
            # dictionary[key]['english_full'] = original_english 

            # Translate if needed
            current_telugu = dictionary[key].get('telugu', '')
            if not current_telugu or len(current_telugu) < 2 or current_telugu == "nan":
                 # Translate the clean English word
                 if clean_english:
                    telugu = translator.translate(clean_english)
                    dictionary[key]['telugu'] = telugu if telugu else ""
                    time.sleep(0.2) # Rate limiting
            
            updated_count += 1
            
            if updated_count % chunk_size == 0:
                print(f"  Processed {updated_count} entries...")
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(dictionary, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"Error processing {key}: {e}")
            time.sleep(1)
            
    # Save final result
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=2)
    
    print(f"\nComplete! Processed {updated_count} entries.")
    print(f"Saved to: {output_path}")
    
    return updated_count

def main():
    script_dir = Path(__file__).parent
    dict_path = script_dir / "frontend" / "public" / "data" / "strongs_dictionary.json"
    output_dir = script_dir / "output"
    output_dir.mkdir(exist_ok=True)
    
    output_path = output_dir / "strongs_dictionary_with_telugu.json"
    
    # Process with a limit for initial batch
    updated = process_dictionary(dict_path, output_path, max_items=200)
    
    if updated:
        print(f"\n✓ Successfully translated {updated} words to Telugu!")

if __name__ == "__main__":
    main()
