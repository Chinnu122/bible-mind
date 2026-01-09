#!/usr/bin/env python3
"""
Extract Hebrew-English word pairs from thetanakh.pdf
and merge with existing Strong's dictionary for Telugu translation.
"""

import json
import re
import os
from pathlib import Path

# Try different PDF libraries
try:
    from pdfminer.high_level import extract_text
    PDF_LIBRARY = 'pdfminer'
except ImportError:
    try:
        import pypdfium2 as pdfium
        PDF_LIBRARY = 'pypdfium2'
    except ImportError:
        PDF_LIBRARY = None

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using available library."""
    if PDF_LIBRARY == 'pdfminer':
        print(f"Using pdfminer.six to extract text from {pdf_path}")
        return extract_text(pdf_path)
    elif PDF_LIBRARY == 'pypdfium2':
        print(f"Using pypdfium2 to extract text from {pdf_path}")
        pdf = pdfium.PdfDocument(pdf_path)
        text = ""
        for page in pdf:
            textpage = page.get_textpage()
            text += textpage.get_text_range()
            text += "\n\n"
        return text
    else:
        raise RuntimeError("No PDF library available. Install pdfminer.six or pypdfium2")

def is_hebrew(text):
    """Check if text contains Hebrew characters."""
    hebrew_range = range(0x0590, 0x05FF + 1)
    return any(ord(char) in hebrew_range for char in text)

def extract_hebrew_words(text):
    """Extract Hebrew words and their potential English translations from text."""
    # Pattern to find Hebrew word sequences
    hebrew_pattern = re.compile(r'[\u0590-\u05FF\u200F]+')
    
    words = {}
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        hebrew_matches = hebrew_pattern.findall(line)
        for hebrew_word in hebrew_matches:
            hebrew_word = hebrew_word.strip()
            if len(hebrew_word) >= 2:  # Skip single characters
                # Clean the word
                clean_word = hebrew_word.replace('\u200f', '')  # Remove RTL mark
                if clean_word and clean_word not in words:
                    words[clean_word] = {
                        'hebrew': clean_word,
                        'english': '',
                        'telugu': '',
                        'source': 'tanakh_pdf',
                        'line': i + 1
                    }
    
    return words

def load_existing_dictionary(dict_path):
    """Load existing Strong's dictionary."""
    with open(dict_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def merge_with_dictionary(extracted_words, existing_dict):
    """Merge extracted words with existing dictionary entries."""
    merged = {}
    matched_count = 0
    new_count = 0
    
    # Create a lookup by Hebrew word
    existing_by_word = {}
    for key, entry in existing_dict.items():
        hebrew = entry.get('word', '')
        if hebrew:
            existing_by_word[hebrew] = entry
    
    for hebrew_word, data in extracted_words.items():
        if hebrew_word in existing_by_word:
            # Found in existing dictionary - use that data
            existing = existing_by_word[hebrew_word]
            merged[hebrew_word] = {
                'hebrew': hebrew_word,
                'strongs': existing.get('strongs', ''),
                'english': existing.get('english', ''),
                'telugu': existing.get('telugu', ''),
                'pronunciation': existing.get('pronunciation', ''),
                'transliteration': existing.get('transliteration', ''),
                'language': existing.get('language', 'Hebrew'),
                'pos': existing.get('pos', ''),
                'occurrences': existing.get('occurrences', 0),
                'source': 'strongs_match'
            }
            matched_count += 1
        else:
            # New word not in dictionary
            merged[hebrew_word] = data
            new_count += 1
    
    print(f"Matched with existing dictionary: {matched_count}")
    print(f"New words not in dictionary: {new_count}")
    
    return merged

def main():
    script_dir = Path(__file__).parent
    pdf_path = script_dir / "thetanakh.pdf"
    dict_path = script_dir / "frontend" / "public" / "data" / "strongs_dictionary.json"
    output_dir = script_dir / "output"
    output_dir.mkdir(exist_ok=True)
    
    print(f"PDF Library: {PDF_LIBRARY}")
    print(f"Extracting text from: {pdf_path}")
    
    # Extract text from PDF
    text = extract_text_from_pdf(str(pdf_path))
    print(f"Extracted {len(text)} characters from PDF")
    
    # Save raw text for inspection
    raw_text_path = output_dir / "tanakh_raw_text.txt"
    with open(raw_text_path, 'w', encoding='utf-8') as f:
        f.write(text[:50000])  # First 50K chars for inspection
    print(f"Saved sample text to: {raw_text_path}")
    
    # Extract Hebrew words
    extracted_words = extract_hebrew_words(text)
    print(f"Extracted {len(extracted_words)} unique Hebrew words")
    
    # Save extracted words
    extracted_path = output_dir / "tanakh_words_extracted.json"
    with open(extracted_path, 'w', encoding='utf-8') as f:
        json.dump(extracted_words, f, ensure_ascii=False, indent=2)
    print(f"Saved extracted words to: {extracted_path}")
    
    # Load and merge with existing dictionary
    if dict_path.exists():
        print(f"Loading existing dictionary from: {dict_path}")
        existing_dict = load_existing_dictionary(str(dict_path))
        print(f"Loaded {len(existing_dict)} entries from existing dictionary")
        
        merged = merge_with_dictionary(extracted_words, existing_dict)
        
        # Save merged result
        merged_path = output_dir / "tanakh_words_merged.json"
        with open(merged_path, 'w', encoding='utf-8') as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f"Saved merged dictionary to: {merged_path}")
        
        # Count words needing Telugu translation
        needs_telugu = sum(1 for w in merged.values() if not w.get('telugu'))
        has_telugu = sum(1 for w in merged.values() if w.get('telugu'))
        print(f"\nWords with Telugu translation: {has_telugu}")
        print(f"Words needing Telugu translation: {needs_telugu}")
    
    print("\nExtraction complete!")

if __name__ == "__main__":
    main()
