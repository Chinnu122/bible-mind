import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Data directory path
const charactersDir = path.join(__dirname, '../../data/characters');

interface CharacterHistory {
    currentCharacter: string;
    lastUpdated: string;
    history: Array<{
        id: string;
        date: string;
        dayNumber: number;
    }>;
    upcoming: string[];
}

// Get today's character of the day
router.get('/', async (_req: Request, res: Response) => {
    try {
        const historyPath = path.join(charactersDir, 'character-history.json');

        if (!fs.existsSync(historyPath)) {
            return res.status(404).json({
                success: false,
                error: 'Character history not found'
            });
        }

        const historyData: CharacterHistory = JSON.parse(
            fs.readFileSync(historyPath, 'utf-8')
        );

        // Load the current character's full data
        const characterPath = path.join(charactersDir, `${historyData.currentCharacter}.json`);

        if (!fs.existsSync(characterPath)) {
            return res.status(404).json({
                success: false,
                error: `Character data not found: ${historyData.currentCharacter}`
            });
        }

        const characterData = JSON.parse(fs.readFileSync(characterPath, 'utf-8'));

        res.json({
            success: true,
            data: {
                character: characterData,
                dayNumber: historyData.history.length,
                lastUpdated: historyData.lastUpdated
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

// Get character history
router.get('/history', async (_req: Request, res: Response) => {
    try {
        const historyPath = path.join(charactersDir, 'character-history.json');

        if (!fs.existsSync(historyPath)) {
            return res.status(404).json({
                success: false,
                error: 'Character history not found'
            });
        }

        const historyData: CharacterHistory = JSON.parse(
            fs.readFileSync(historyPath, 'utf-8')
        );

        res.json({
            success: true,
            data: historyData.history
        });
    } catch (error) {
        console.error('Error loading character history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load character history'
        });
    }
});

// Get a specific character by ID
router.get('/:characterId', async (req: Request, res: Response) => {
    try {
        const { characterId } = req.params;
        const characterPath = path.join(charactersDir, `${characterId}.json`);

        if (!fs.existsSync(characterPath)) {
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

export default router;
