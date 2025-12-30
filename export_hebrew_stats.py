import csv
import os

def export_hebrew_occurrences():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Input Files
    hebrew_path = os.path.join(base_dir, 'backend', 'data', 'HebrewStrongs.csv')
    concordance_path = os.path.join(base_dir, 'backend', 'data', 'StrongsConcordance-EnglishTelugu.csv')
    
    # Output File
    output_dir = os.path.join(base_dir, 'output')
    os.makedirs(output_dir, exist_ok=True)
    output_csv = os.path.join(output_dir, 'HebrewWordOccurrences.csv')
    
    # Dictionary to store combined data
    # Key: StrongsNumber (e.g. H1)
    # Value: {word, occurrences, english, telugu}
    data_map = {}
    
    total_occ_check = 0
    
    print(f"Reading {hebrew_path}...")
    try:
        with open(hebrew_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            reader.fieldnames = [h.strip() for h in reader.fieldnames]
            
            for row in reader:
                strongs = row.get('strongs_number', '').strip()
                word = row.get('word', '').strip()
                gloss = row.get('gloss', '').strip().replace('\n', ' ').replace('\r', '')
                occ_str = row.get('occurrences', '0').strip()
                
                if strongs:
                    if not strongs[0].isalpha(): strongs = 'H' + strongs
                    
                    if strongs.startswith('H'):
                        try:
                            occ_val = int(occ_str.replace(',', ''))
                        except:
                            occ_val = 0
                            
                        total_occ_check += occ_val
                        
                        data_map[strongs] = {
                            'strongs': strongs,
                            'word': word,
                            'occurrences': occ_val,
                            'english': gloss, # Default english from HebrewStrongs
                            'telugu': ''
                        }
    except Exception as e:
        print(f"Error reading HebrewStrongs: {e}")
        return

    print(f"Reading {concordance_path}...")
    try:
        with open(concordance_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            reader.fieldnames = [h.strip() for h in reader.fieldnames]
            
            for row in reader:
                strongs = row.get('strongs_number', '').strip()
                telugu = row.get('telugu_meaning', '').strip()
                english = row.get('english_meaning', '').strip()
                
                if strongs in data_map:
                    if telugu:
                        data_map[strongs]['telugu'] = telugu
                    if english:
                        data_map[strongs]['english'] = english # Prefer concordance english if available
    except Exception as e:
        print(f"Error reading Concordance: {e}")

    # Write to CSV
    print(f"Writing to {output_csv}...")
    
    # Sort by occurrences descending (most frequent first)
    sorted_data = sorted(data_map.values(), key=lambda x: x['occurrences'], reverse=True)
    
    with open(output_csv, 'w', encoding='utf-8-sig', newline='') as f:
        fieldnames = ['strongs', 'word', 'occurrences', 'english_meaning', 'telugu_meaning']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        for item in sorted_data:
            writer.writerow({
                'strongs': item['strongs'],
                'word': item['word'],
                'occurrences': item['occurrences'],
                'english_meaning': item['english'],
                'telugu_meaning': item['telugu']
            })
            
    print(f"\n✅ GENERATED: {output_csv}")
    print(f"Total Rows: {len(sorted_data):,}")
    print(f"Total Occurrences Sum: {total_occ_check:,}")

if __name__ == '__main__':
    export_hebrew_occurrences()
