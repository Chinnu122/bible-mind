"""
Analyze all Telugu data sources and count unique Hebrew entries with Telugu meanings.
"""
import csv
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, 'backend', 'data')

all_telugu_hebrew = {}  # Strong's Number -> Telugu Meaning

# Source 1: StrongsWithTelugu.csv
print("1. Analyzing StrongsWithTelugu.csv...")
path = os.path.join(data_dir, 'StrongsWithTelugu.csv')
if os.path.exists(path):
    count = 0
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sid = row.get("Strong's Number", "").strip().upper()
            tel_meaning = row.get("Telugu Meaning", "").strip()
            tel_word = row.get("Telugu Word", "").strip()
            # Combine meaning and word if available
            telugu = tel_meaning or tel_word
            if sid.startswith('H') and telugu:
                if sid not in all_telugu_hebrew:
                    all_telugu_hebrew[sid] = telugu
                    count += 1
    print(f"   Found: {count} Hebrew entries with Telugu")
else:
    print("   NOT FOUND")

# Source 2: StrongsConcordance-EnglishTelugu.csv
print("2. Analyzing StrongsConcordance-EnglishTelugu.csv...")
path = os.path.join(data_dir, 'StrongsConcordance-EnglishTelugu.csv')
if os.path.exists(path):
    count = 0
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sid = row.get("strongs_number", "").strip().upper()
            telugu = row.get("telugu_meaning", "").strip()
            if sid.startswith('H') and telugu:
                if sid not in all_telugu_hebrew:
                    all_telugu_hebrew[sid] = telugu
                    count += 1
    print(f"   Found: {count} NEW Hebrew entries with Telugu")
else:
    print("   NOT FOUND")

# Source 3: TeluguHindiStrongs.csv
print("3. Analyzing TeluguHindiStrongs.csv...")
path = os.path.join(data_dir, 'TeluguHindiStrongs.csv')
if os.path.exists(path):
    count = 0
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"   Headers: {headers[:5]}...")
        for row in reader:
            # Try different column names
            sid = row.get("strongs_number", row.get("strongsNumber", row.get("strongs", ""))).strip().upper()
            telugu = row.get("telugu_meaning", row.get("telugu_word", row.get("telugu", ""))).strip()
            if not sid.startswith('H') and not sid.startswith('G'):
                sid = 'H' + sid
            if sid.startswith('H') and telugu:
                if sid not in all_telugu_hebrew:
                    all_telugu_hebrew[sid] = telugu
                    count += 1
    print(f"   Found: {count} NEW Hebrew entries with Telugu")
else:
    print("   NOT FOUND")

# Source 4: TeluguHindiStrongs-Extended.csv
print("4. Analyzing TeluguHindiStrongs-Extended.csv...")
path = os.path.join(data_dir, 'TeluguHindiStrongs-Extended.csv')
if os.path.exists(path):
    count = 0
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"   Headers: {headers[:5]}...")
        for row in reader:
            sid = row.get("strongs_number", row.get("strongsNumber", row.get("strongs", ""))).strip().upper()
            telugu = row.get("telugu_meaning", row.get("telugu_word", row.get("telugu", ""))).strip()
            if not sid.startswith('H') and not sid.startswith('G'):
                sid = 'H' + sid
            if sid.startswith('H') and telugu:
                if sid not in all_telugu_hebrew:
                    all_telugu_hebrew[sid] = telugu
                    count += 1
    print(f"   Found: {count} NEW Hebrew entries with Telugu")
else:
    print("   NOT FOUND")

# Summary
print("\n" + "="*50)
print(f"TOTAL UNIQUE Hebrew words with Telugu: {len(all_telugu_hebrew)}")
print(f"Hebrew words in dictionary: 8674")
print(f"MISSING Telugu translations: {8674 - len(all_telugu_hebrew)}")
print(f"Coverage: {len(all_telugu_hebrew)/8674*100:.1f}%")
print("="*50)
