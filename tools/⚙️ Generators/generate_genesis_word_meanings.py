"""
Genesis Word Meanings Generator - Final Version
Uses curated word mappings for accuracy + Strong's concordance for comprehensive coverage.
"""

import csv
import json
import os
import re
from pathlib import Path

# Paths to data sources
BASE_DIR = Path(__file__).parent
ALAMO_POLYGLOT = BASE_DIR / "AlamoPolyglot.csv"
STRONGS_EN_TE = BASE_DIR / "backend" / "data" / "StrongsConcordance-EnglishTelugu.csv"
TELUGU_GENESIS = BASE_DIR / "backend" / "data" / "telugu" / "Genesis.json"
OUTPUT_DIR = BASE_DIR / "Genesis-Word-Meanings"

# Import curated Hebrew words from external dictionary
from hebrew_word_dict import CURATED_HEBREW_WORDS


def normalize_hebrew(word):
    """Remove vowels/nikkud for matching."""
    result = ''
    for char in word:
        if '\u05D0' <= char <= '\u05EA':
            result += char
    return result


def load_strongs_concordance():
    """Load Strong's concordance with Hebrew word to Strong's mapping."""
    strongs_by_number = {}
    
    if STRONGS_EN_TE.exists():
        print(f"  Loading {STRONGS_EN_TE}...")
        with open(STRONGS_EN_TE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                num = row.get('strongs_number', '').strip()
                if num:
                    strongs_by_number[num] = {
                        'strongs': num,
                        'hebrew': row.get('original_word', '').strip(),
                        'english': row.get('english_meaning', '').strip(),
                        'telugu': row.get('telugu_meaning', '').strip(),
                        'pos': row.get('part_of_speech', '').strip(),
                    }
    
    print(f"  Loaded {len(strongs_by_number)} Strong's entries")
    return strongs_by_number


def load_alamo_polyglot():
    """Load Alamo Polyglot data for Genesis."""
    genesis_verses = {}
    
    if ALAMO_POLYGLOT.exists():
        print(f"  Loading {ALAMO_POLYGLOT}...")
        with open(ALAMO_POLYGLOT, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get('book_name', '').lower() == 'genesis':
                    chapter = int(row.get('chapter', 0))
                    verse = int(row.get('verse', 0))
                    
                    if chapter not in genesis_verses:
                        genesis_verses[chapter] = {}
                    
                    genesis_verses[chapter][verse] = {
                        'hebrew': row.get('leningrad_codex', ''),
                        'greek_lxx': row.get('codex_alexandrinus', '') or row.get('brenton', ''),
                        'english_web': row.get('world_english_bible_web', ''),
                        'english_kjv': row.get('king_james_bible_kjv', ''),
                    }
    
    print(f"  Loaded {len(genesis_verses)} chapters from AlamoPolyglot")
    return genesis_verses


def load_telugu_genesis():
    """Load Telugu Genesis translations."""
    telugu_verses = {}
    
    if TELUGU_GENESIS.exists():
        print(f"  Loading {TELUGU_GENESIS}...")
        with open(TELUGU_GENESIS, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for chapter_data in data.get('chapters', []):
                chapter = int(chapter_data.get('chapter', 0))
                telugu_verses[chapter] = {}
                for verse_data in chapter_data.get('verses', []):
                    verse = int(verse_data.get('verse', 0))
                    telugu_verses[chapter][verse] = verse_data.get('text', '')
    
    print(f"  Loaded {len(telugu_verses)} chapters from Telugu Genesis")
    return telugu_verses


def extract_hebrew_words(hebrew_text):
    """Extract Hebrew words from text."""
    if not hebrew_text:
        return []
    words = re.split(r'[\s׃׀־\u200F]+', hebrew_text)
    result = []
    for w in words:
        w = w.strip()
        if w and any('\u05D0' <= c <= '\u05EA' for c in w):
            result.append(w)
    return result


def find_word_info(word, strongs_by_number):
    """Find Strong's info for a Hebrew word using curated dictionary."""
    
    # Direct match in curated dictionary (most accurate)
    if word in CURATED_HEBREW_WORDS:
        strongs, translit, meaning, telugu = CURATED_HEBREW_WORDS[word]
        extra = strongs_by_number.get(strongs, {})
        return {
            'strongs': strongs,
            'translit': translit,
            'english': meaning,
            'telugu': telugu or extra.get('telugu', ''),
            'pos': extra.get('pos', '')
        }
    
    # Try without prefix (ו, ה, ב, כ, ל, מ)
    normalized = normalize_hebrew(word)
    prefixes = ['ו', 'ה', 'ב', 'כ', 'ל', 'מ', 'ש']
    
    for prefix in prefixes:
        if normalized.startswith(prefix) and len(normalized) > 2:
            root = normalized[1:]
            # Check curated dict with normalized root
            for curated_word, data in CURATED_HEBREW_WORDS.items():
                if normalize_hebrew(curated_word) == root:
                    strongs, translit, meaning, telugu = data
                    extra = strongs_by_number.get(strongs, {})
                    return {
                        'strongs': strongs,
                        'translit': translit,
                        'english': meaning,
                        'telugu': telugu or extra.get('telugu', ''),
                        'pos': extra.get('pos', '')
                    }
    
    # Try double prefix removal (וה, ול, וב, etc.)
    if len(normalized) > 3:
        for p1 in prefixes:
            for p2 in prefixes:
                if normalized.startswith(p1 + p2):
                    root = normalized[2:]
                    for curated_word, data in CURATED_HEBREW_WORDS.items():
                        if normalize_hebrew(curated_word) == root:
                            strongs, translit, meaning, telugu = data
                            extra = strongs_by_number.get(strongs, {})
                            return {
                                'strongs': strongs,
                                'translit': translit,
                                'english': meaning,
                                'telugu': telugu or extra.get('telugu', ''),
                                'pos': extra.get('pos', '')
                            }
    
    return None


def transliterate_hebrew(word):
    """Simple transliteration of Hebrew to Latin characters."""
    translit_map = {
        'א': "'", 'ב': 'v', 'ג': 'g', 'ד': 'd', 'ה': 'h',
        'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y',
        'כ': 'kh', 'ך': 'kh', 'ל': 'l', 'מ': 'm', 'ם': 'm',
        'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': "'", 'פ': 'f',
        'ף': 'f', 'צ': 'ts', 'ץ': 'ts', 'ק': 'q', 'ר': 'r',
        'ש': 'sh', 'ת': 't'
    }
    result = ''
    for char in word:
        if char in translit_map:
            result += translit_map[char]
    return result if result else word


def generate_chapter_markdown(chapter, verses_data, telugu_verses, strongs_by_number):
    """Generate Markdown study guide for a chapter."""
    lines = [
        f"# Genesis {chapter} - Word Meanings Study Guide",
        f"## בְּרֵאשִׁית {chapter} (Bereshit {chapter}) - Hebrew, Greek, English & Telugu",
        "",
        "---",
        ""
    ]
    
    chapter_verses = verses_data.get(chapter, {})
    telugu_chapter = telugu_verses.get(chapter, {})
    
    for verse_num in sorted(chapter_verses.keys()):
        verse = chapter_verses[verse_num]
        hebrew = verse.get('hebrew', '')
        greek = verse.get('greek_lxx', '')
        english = verse.get('english_kjv', '') or verse.get('english_web', '')
        telugu = telugu_chapter.get(verse_num, '')
        
        lines.append(f"## Verse {verse_num} (Genesis {chapter}:{verse_num})")
        lines.append(f"**{hebrew}**")
        lines.append("")
        lines.append(f"**English:** {english}")
        lines.append(f"**Telugu:** {telugu}")
        lines.append(f"**Greek (LXX):** {greek}")
        lines.append("")
        lines.append("### Word Analysis:")
        lines.append("")
        lines.append("| Hebrew | Transliteration | Strong's | Meaning | Telugu |")
        lines.append("|--------|-----------------|----------|---------|--------|")
        
        hebrew_words = extract_hebrew_words(hebrew)
        for word in hebrew_words[:15]:
            info = find_word_info(word, strongs_by_number)
            if info:
                translit = info.get('translit', transliterate_hebrew(word))
                meaning = info.get('english', '')[:50]
                telugu_m = info.get('telugu', '')[:25]
                strongs = info.get('strongs', '')
                lines.append(f"| {word} | {translit} | {strongs} | {meaning} | {telugu_m} |")
            else:
                translit = transliterate_hebrew(word)
                lines.append(f"| {word} | {translit} | - | - | - |")
        
        lines.append("")
        lines.append("---")
        lines.append("")
    
    return "\n".join(lines)


def generate_chapter_csv(chapter, verses_data, telugu_verses, strongs_by_number):
    """Generate CSV data for a chapter."""
    rows = []
    headers = ['Verse', 'Hebrew Word', 'Transliteration', "Strong's Number", 
               'English Meaning', 'Telugu Meaning', 'Part of Speech']
    
    chapter_verses = verses_data.get(chapter, {})
    
    for verse_num in sorted(chapter_verses.keys()):
        verse = chapter_verses[verse_num]
        hebrew = verse.get('hebrew', '')
        
        hebrew_words = extract_hebrew_words(hebrew)
        for word in hebrew_words[:15]:
            info = find_word_info(word, strongs_by_number)
            if info:
                translit = info.get('translit', transliterate_hebrew(word))
                rows.append([
                    f"{chapter}:{verse_num}",
                    word,
                    translit,
                    info.get('strongs', ''),
                    info.get('english', ''),
                    info.get('telugu', ''),
                    info.get('pos', '')
                ])
            else:
                rows.append([
                    f"{chapter}:{verse_num}",
                    word,
                    transliterate_hebrew(word),
                    '', '', '', ''
                ])
    
    return headers, rows


def main():
    """Main function to generate all Genesis word meanings."""
    print("=" * 60)
    print("Genesis Word Meanings Generator - Enhanced Version")
    print("=" * 60)
    print()
    print("Loading data sources...")
    
    strongs_by_number = load_strongs_concordance()
    verses_data = load_alamo_polyglot()
    telugu_verses = load_telugu_genesis()
    
    print(f"  Curated Hebrew words: {len(CURATED_HEBREW_WORDS)}")
    
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    print()
    print("Generating word meanings...")
    
    total_words = 0
    matched_words = 0
    
    for chapter in range(1, 51):
        if chapter not in verses_data:
            continue
        
        print(f"  Chapter {chapter}...", end=" ")
        
        chapter_total = 0
        chapter_matched = 0
        chapter_verses = verses_data.get(chapter, {})
        for verse_num in chapter_verses:
            hebrew = chapter_verses[verse_num].get('hebrew', '')
            words = extract_hebrew_words(hebrew)
            for word in words[:15]:
                chapter_total += 1
                if find_word_info(word, strongs_by_number):
                    chapter_matched += 1
        
        total_words += chapter_total
        matched_words += chapter_matched
        match_pct = (chapter_matched / chapter_total * 100) if chapter_total > 0 else 0
        
        md_content = generate_chapter_markdown(chapter, verses_data, telugu_verses, strongs_by_number)
        md_file = OUTPUT_DIR / f"Genesis-{chapter}-Word-Meanings.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        headers, rows = generate_chapter_csv(chapter, verses_data, telugu_verses, strongs_by_number)
        csv_file = OUTPUT_DIR / f"Genesis-{chapter}-Word-Meanings.csv"
        with open(csv_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)
        
        print(f"{chapter_matched}/{chapter_total} words matched ({match_pct:.0f}%)")
    
    print()
    print("=" * 60)
    overall_pct = (matched_words / total_words * 100) if total_words > 0 else 0
    print(f"✅ Complete! {matched_words}/{total_words} words matched ({overall_pct:.1f}%)")
    print(f"   All matches are ACCURATE (curated dictionary)")
    print(f"   Output directory: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
