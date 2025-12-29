"""
Merge existing curated Hebrew dictionary with complete Strong's dictionary
Keeps better translations from curated dict while adding all entries from Strong's
"""

# Read the complete dictionary
print("Reading complete Strong's dictionary...")
with open('hebrew_word_dict_complete.py', 'r', encoding='utf-8') as f:
    complete_content = f.read()

# Read the existing curated dictionary (with better translations)
print("Reading existing curated dictionary...")
with open('hebrew_word_dict.py', 'r', encoding='utf-8') as f:
    curated_content = f.read()

# Execute to get dictionaries
exec(complete_content, globals())
COMPLETE_DICT = dict(CURATED_HEBREW_WORDS)

exec(curated_content, globals())
CURATED_DICT = dict(CURATED_HEBREW_WORDS)

print(f"Complete dict entries: {len(COMPLETE_DICT)}")
print(f"Curated dict entries: {len(CURATED_DICT)}")

# Merge - prefer curated entries when they have Telugu translations
merged = {}
for word, data in COMPLETE_DICT.items():
    if word in CURATED_DICT:
        # Use curated if it has Telugu, or better English
        curated_data = CURATED_DICT[word]
        if curated_data[3]:  # Has Telugu
            merged[word] = curated_data
        else:
            merged[word] = data if data[3] else curated_data
    else:
        merged[word] = data

# Add any curated entries not in complete (custom additions)
for word, data in CURATED_DICT.items():
    if word not in merged:
        merged[word] = data

print(f"Merged dict entries: {len(merged)}")

# Count Telugu translations
with_telugu = sum(1 for d in merged.values() if d[3])
print(f"Entries with Telugu: {with_telugu}")

# Write merged dictionary
print("Writing merged dictionary...")
with open('hebrew_word_dict.py', 'w', encoding='utf-8') as f:
    f.write("# Complete Hebrew Word Dictionary - Merged from Strong's Concordance and Curated Dictionary\n")
    f.write("# Contains comprehensive Hebrew vocabulary with English and Telugu translations\n")
    f.write(f"# Total entries: {len(merged)}\n\n")
    f.write("CURATED_HEBREW_WORDS = {\n")
    
    for word, data in merged.items():
        strongs, translit, english, telugu = data
        # Escape quotes properly
        word_safe = word.replace("'", "\\'")
        strongs_safe = strongs.replace("'", "\\'")
        translit_safe = translit.replace("'", "\\'")
        english_safe = english.replace("'", "\\'") if english else ''
        telugu_safe = telugu.replace("'", "\\'") if telugu else ''
        
        f.write(f"    '{word_safe}': ('{strongs_safe}', '{translit_safe}', '{english_safe}', '{telugu_safe}'),\n")
    
    f.write("}\n")

print("✅ Merged dictionary written to hebrew_word_dict.py")
