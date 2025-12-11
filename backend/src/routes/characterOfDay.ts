import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const router = Router();

// Data directory paths
const dataDir = path.join(__dirname, '../../data');
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
}

// Load characters from CSV file
function loadCharacters(): CharacterFromCSV[] {
    try {
        const csvPath = path.join(dataDir, 'daily_characters.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });

        return records.map((row: any) => ({
            dayOfYear: parseInt(row.dayOfYear),
            name: row.name,
            hebrewName: row.hebrewName,
            teluguName: row.teluguName,
            meaning: row.meaning,
            shortDescription: row.shortDescription,
            keyVerse: row.keyVerse,
            storyHighlight: row.storyHighlight
        }));
    } catch (error) {
        console.error('CRITICAL: Failed to load characters CSV:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        }
        return [];
    }
}

let characters: CharacterFromCSV[] = loadCharacters();

// Get the current day of year (1-365)
function getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Get today's character of the day (from CSV)
router.get('/', async (_req: Request, res: Response) => {
    try {
        const dayOfYear = getDayOfYear();
        const maxDay = characters.length > 0 ? Math.max(...characters.map(c => c.dayOfYear)) : 1;
        const effectiveDay = ((dayOfYear - 1) % maxDay) + 1;

        const todayCharacter = characters.find(c => c.dayOfYear === effectiveDay) || characters[0];

        if (!todayCharacter) {
            return res.status(404).json({
                success: false,
                error: 'No character found for today'
            });
        }

        res.json({
            success: true,
            data: {
                character: {
                    name: {
                        english: todayCharacter.name,
                        hebrew: todayCharacter.hebrewName,
                        telugu: todayCharacter.teluguName
                    },
                    meaning: {
                        english: todayCharacter.meaning
                    },
                    description: {
                        english: todayCharacter.shortDescription
                    },
                    story: {
                        highlight: {
                            english: todayCharacter.storyHighlight
                        }
                    },
                    references: [
                        { reference: todayCharacter.keyVerse, topic: 'Key Verse' }
                    ]
                },
                dayNumber: effectiveDay,
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('Error loading character of the day:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load character of the day'
        });
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
