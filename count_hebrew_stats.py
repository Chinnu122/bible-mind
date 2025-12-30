import csv
import os

def calculate_stats():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Files
    hebrew_path = os.path.join(base_dir, 'backend', 'data', 'HebrewStrongs.csv')
    concordance_path = os.path.join(base_dir, 'backend', 'data', 'StrongsConcordance-EnglishTelugu.csv')
    
    stats = {
        'unique_hebrew': set(),
        'total_occurrences': 0,
        'telugu_count': 0
    }
    
    # 1. Count Hebrew Words from Dictionary (HebrewStrongs.csv)
    if os.path.exists(hebrew_path):
        print(f"Reading {hebrew_path}...")
        try:
            with open(hebrew_path, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                # Clean headers
                reader.fieldnames = [h.strip() for h in reader.fieldnames]
                
                for row in reader:
                    # Find strongs number column
                    strongs = row.get('strongs_number', '').strip()
                    occ = row.get('occurrences', '0').strip()
                    
                    if strongs:
                        # Normalize H prefix
                        if not strongs[0].isalpha():
                            strongs = 'H' + strongs
                        
                        if strongs.startswith('H'):
                            stats['unique_hebrew'].add(strongs)
                            try:
                                stats['total_occurrences'] += int(occ.replace(',', ''))
                            except:
                                pass
        except Exception as e:
            print(f"Error reading HebrewStrongs.csv: {e}")

    # 2. Count Telugu Definitions from Concordance
    if os.path.exists(concordance_path):
        print(f"Reading {concordance_path}...")
        try:
            with open(concordance_path, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                # Clean headers
                reader.fieldnames = [h.strip() for h in reader.fieldnames]
                
                for row in reader:
                    strongs = row.get('strongs_number', '').strip()
                    telugu = row.get('telugu_meaning', '').strip()
                    
                    if strongs.startswith('H') and telugu:
                        stats['telugu_count'] += 1
        except Exception as e:
            print(f"Error reading Concordance: {e}")

    print("\n" + "="*40)
    print("� HEBREW BIBLE STATISTICS (OLD TESTAMENT)")
    print("="*40)
    print(f"Total Unique Hebrew Words:  {len(stats['unique_hebrew']):,}")
    print(f"Total Word Occurrences:     {stats['total_occurrences']:,}")
    print(f"Words with Telugu Meaning:  {stats['telugu_count']:,}")
    print("="*40)

if __name__ == '__main__':
    calculate_stats()
