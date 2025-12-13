import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const router = Router();

// Data directory paths - handle both running from root or backend folder
// First check if we're in the backend folder, then check parent/backend
const findDataDir = (): string => {
    // Try current directory + data (if running from backend/)
    let dataPath = path.join(process.cwd(), 'data');
    if (fs.existsSync(path.join(dataPath, 'daily_characters.csv'))) {
        return dataPath;
    }
    // Try current directory + backend/data (if running from root/)
    dataPath = path.join(process.cwd(), 'backend', 'data');
    if (fs.existsSync(path.join(dataPath, 'daily_characters.csv'))) {
        return dataPath;
    }
    // Fallback to __dirname based path (production/dist)
    return path.join(__dirname, '..', 'data');
};

const dataDir = findDataDir();
const charactersDir = path.join(dataDir, 'characters');

interface CharacterFromCSV {
    dayOfYear: number;
    name: string;
    hebrewName: string;
    teluguName: string;
    meaning: string;
    shortDescription: string;
    keyVerse: string;
    storyHighlight: string;
    longStory: string;
    references: string;
    image: string;
}

// Load characters from CSV file
function loadCharacters(): CharacterFromCSV[] {
    try {
        const csvPath = path.join(dataDir, 'daily_characters.csv');
        console.log('📖 Loading characters from:', csvPath);

        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found at:', csvPath);
            return [];
        }

        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true
        });

        console.log('✅ Parsed', records.length, 'character records');

        return records.map((row: any) => ({
            dayOfYear: parseInt(row.dayOfYear),
            name: row.name,
            hebrewName: row.hebrewName,
            teluguName: row.teluguName,
            meaning: row.meaning,
            shortDescription: row.shortDescription,
            keyVerse: row.keyVerse,
            storyHighlight: row.storyHighlight,
            longStory: row.longStory || '',
            references: row.references || '',
            image: row.image || ''
        }));
    } catch (error) {
        console.error('CRITICAL: Failed to load characters CSV:', error);
        return [];
    }
}

let characters: CharacterFromCSV[] = loadCharacters();

// ... (middleware code)

// Get today's character of the day (from CSV)
router.get('/', async (_req: Request, res: Response) => {
    try {
        const dayOfYear = getDayOfYear();
        const maxDay = characters.length > 0 ? Math.max(...characters.map(c => c.dayOfYear)) : 1;
        const effectiveDay = ((dayOfYear - 1) % maxDay) + 1;

        const todayCharacter = characters.find(c => c.dayOfYear === effectiveDay) || characters[0];

        if (!todayCharacter) {
            return res.status(404).json({ success: false, error: 'No character found for today' });
        }

        // Parse references logic...
        const parsedReferences = todayCharacter.references
            ? todayCharacter.references.split('|').map((ref: string) => ({
                reference: ref.trim(),
                topic: ref.includes('Genesis') ? 'Creation & Origins' : 'Key Reference'
            }))
            : [{ reference: todayCharacter.keyVerse, topic: 'Key Verse' }];

        res.json({
            success: true,
            data: {
                character: {
                    name: {
                        english: todayCharacter.name,
                        hebrew: todayCharacter.hebrewName,
                        telugu: todayCharacter.teluguName
                    },
                    meaning: { english: todayCharacter.meaning },
                    description: { english: todayCharacter.shortDescription },
                    image: todayCharacter.image,
                    story: {
                        highlight: { english: todayCharacter.storyHighlight },
                        full: { english: todayCharacter.longStory || todayCharacter.storyHighlight }
                    },
                    references: parsedReferences
                },
                dayNumber: effectiveDay,
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Failed to load character' });
    }
});

// Get all characters (for browsing)
router.get('/all', async (_req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            count: characters.length,
            data: characters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load characters'
        });
    }
});

// Get a specific character by day number
router.get('/day/:dayNumber', async (req: Request, res: Response) => {
    try {
        const dayNumber = parseInt(req.params.dayNumber);
        const character = characters.find(c => c.dayOfYear === dayNumber);

        if (!character) {
            return res.status(404).json({
                success: false,
                error: `Character not found for day: ${dayNumber}`
            });
        }

        res.json({
            success: true,
            data: character
        });
    } catch (error) {
        console.error('Error loading character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load character'
        });
    }
});

// Legacy: Get a specific character by ID (from old JSON files)
router.get('/:characterId', async (req: Request, res: Response) => {
    try {
        const { characterId } = req.params;
        const characterPath = path.join(charactersDir, `${characterId}.json`);

        if (!fs.existsSync(characterPath)) {
            // Try to find by name in CSV
            const fromCSV = characters.find(c => c.name.toLowerCase() === characterId.toLowerCase());
            if (fromCSV) {
                return res.json({
                    success: true,
                    data: fromCSV
                });
            }
            return res.status(404).json({
                success: false,
                error: `Character not found: ${characterId}`
            });
        }

        const characterData = JSON.parse(fs.readFileSync(characterPath, 'utf-8'));

        res.json({
            success: true,
            data: characterData
        });
    } catch (error) {
        console.error('Error loading character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load character'
        });
    }
});

// Reload characters from CSV (admin endpoint)
router.post('/reload', (_req: Request, res: Response) => {
    characters = loadCharacters();
    res.json({ success: true, message: 'Characters reloaded', count: characters.length });
});

export default router;
