# 📚 Bible Mind - Premium Project Structure

## 🗂️ Clean Folder Organization

```
Bible Mind/
│
├── 📁 resources/                     # All source data and resources
│   │
│   ├── 📊 Concordance/               # Strong's concordance CSVs (6 files)
│   ├── 📝 Bible Data/                # Bible metadata (14 files)
│   │
│   ├── PDFs - English Bible/         # KJV, Bishops, Strongs (4 PDFs)
│   ├── PDFs - Greek Bible/           # Textus Receptus (2 PDFs)
│   ├── PDFs - Hebrew Bible/          # WLC, Modern Hebrew (2 PDFs)
│   ├── PDFs - Telugu Bible/          # Telugu IRV (1 PDF)
│   ├── PDFs - Reference Books/       # Strong's Concordance, Stories
│   │
│   ├── EN-English/                   # English Bible data (JSON, PDF)
│   ├── HE-עברית/                     # Hebrew Bible data (JSON, PDF)
│   ├── GRC-Κοινη/                    # Greek Bible data (JSON, PDF)
│   ├── TE-తెలుగు/                    # Telugu Bible data (JSON, PDF)
│   │
│   ├── Books/                        # Additional books
│   ├── Photos/                       # Reference photos
│   └── Videos/                       # Reference videos
│
├── 📁 tools/                         # Scripts and utilities
│   ├── 📜 Dictionary Scripts/        # Hebrew dictionary (8,717 words)
│   ├── ⚙️ Generators/                 # Word meaning generators
│   └── 🔧 Utilities/                  # Helper scripts
│
├── 📁 output/                        # Generated output files
│   └── 📖 Word Meanings/             # Genesis word meanings (50 chapters)
│
├── 📁 archives/                      # Archived zip files
│   └── 📦 Zip Files/                 # Hebrew.zip, Greek.zip, Telugu.zip
│
├── 📁 backend/                       # Node.js/Express API
├── 📁 frontend/                      # React application
├── 📁 data/                          # Backend data files
│
├── 📄 README.md                      # Project readme
├── 📄 PROJECT_STRUCTURE.md           # This file
├── 📄 LICENSE                        # License
└── ⚙️ Config files                   # package.json, docker, etc.
```

---

## � Statistics

| Category | Count |
|----------|-------|
| Hebrew Dictionary Words | 8,717 |
| Telugu Translations | 1,525 |
| Genesis Coverage | 58.6% |
| Concordance Files | 6 CSVs |
| Bible Data Files | 14 CSVs |
| PDF Documents | 12+ files |

---

## 🔧 Key Files

| Script | Location | Purpose |
|--------|----------|---------|
| `hebrew_word_dict.py` | `tools/📜 Dictionary Scripts/` | Main Hebrew dictionary |
| `generate_genesis_word_meanings.py` | `tools/⚙️ Generators/` | Generate word meanings |
| `StrongsConcordance-EnglishTelugu.csv` | `resources/📊 Concordance/` | Strong's translations |

---

## � Quick Commands

```bash
# Generate Genesis word meanings
cd "tools/⚙️ Generators"
python generate_genesis_word_meanings.py

# View output
cd "output/📖 Word Meanings"
```

---

*Organized with ❤️ for Bible Mind - Premium Edition*
