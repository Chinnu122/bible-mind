/**
 * Concordance API Routes
 * 
 * Endpoints:
 * - GET /api/concordance/:strongsNumber - All verse occurrences
 * - GET /api/concordance/:strongsNumber/stats - Frequency by book
 * - GET /api/concordance/:strongsNumber/roots - Root word chain
 */

import { Router, Request, Response } from 'express';
import {
    getWordOccurrences,
    getWordStats,
    getRootChain,
    buildWordOccurrenceIndex
} from '../services/concordanceService';
import { dataStore } from '../services/dataStore';

const router = Router();

// Initialize index when routes are loaded
let indexInitialized = false;
async function ensureIndex() {
    if (!indexInitialized) {
        await buildWordOccurrenceIndex();
        indexInitialized = true;
    }
}

/**
 * GET /api/concordance/:strongsNumber
 * Get all verse occurrences for a Strong's number
 */
router.get('/:strongsNumber', async (req: Request, res: Response) => {
    try {
        await ensureIndex();

        const { strongsNumber } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;

        if (!strongsNumber) {
            return res.status(400).json({
                success: false,
                error: 'Strong\'s number is required'
            });
        }

        // Get definition
        const definition = dataStore.getStrongs(strongsNumber);

        // Get occurrences
        const occurrences = getWordOccurrences(strongsNumber);
        const limitedOccurrences = occurrences.slice(0, limit);

        return res.json({
            success: true,
            data: {
                strongsNumber: strongsNumber.toUpperCase(),
                word: definition?.word || '',
                gloss: definition?.gloss || '',
                occurrences: limitedOccurrences,
                totalCount: definition?.occurrences || occurrences.length
            },
            meta: {
                returned: limitedOccurrences.length,
                total: definition?.occurrences || occurrences.length
            }
        });
    } catch (error) {
        console.error('Concordance lookup error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get concordance data'
        });
    }
});

/**
 * GET /api/concordance/:strongsNumber/stats
 * Get frequency statistics by book
 */
router.get('/:strongsNumber/stats', async (req: Request, res: Response) => {
    try {
        await ensureIndex();

        const { strongsNumber } = req.params;

        if (!strongsNumber) {
            return res.status(400).json({
                success: false,
                error: 'Strong\'s number is required'
            });
        }

        const stats = getWordStats(strongsNumber);
        const definition = dataStore.getStrongs(strongsNumber);

        return res.json({
            success: true,
            data: {
                strongsNumber: strongsNumber.toUpperCase(),
                word: definition?.word || '',
                gloss: definition?.gloss || '',
                totalOccurrences: stats.totalOccurrences,
                bookDistribution: stats.bookDistribution,
                firstOccurrence: stats.firstOccurrence
            }
        });
    } catch (error) {
        console.error('Concordance stats error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get concordance statistics'
        });
    }
});

/**
 * GET /api/concordance/:strongsNumber/roots
 * Get root word chain (etymology)
 */
router.get('/:strongsNumber/roots', async (req: Request, res: Response) => {
    try {
        const { strongsNumber } = req.params;

        if (!strongsNumber) {
            return res.status(400).json({
                success: false,
                error: 'Strong\'s number is required'
            });
        }

        const rootChain = getRootChain(strongsNumber);
        const definition = dataStore.getStrongs(strongsNumber);

        return res.json({
            success: true,
            data: {
                strongsNumber: strongsNumber.toUpperCase(),
                word: rootChain.word,
                gloss: definition?.gloss || '',
                root: rootChain.rootNumber ? {
                    strongsNumber: rootChain.rootNumber,
                    word: rootChain.rootWord
                } : null,
                derivedWords: rootChain.derivedWords
            }
        });
    } catch (error) {
        console.error('Root chain lookup error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get root chain data'
        });
    }
});

/**
 * GET /api/concordance/search
 * Search for Strong's numbers by word or meaning
 */
router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Query must be at least 2 characters'
            });
        }

        const results = dataStore.searchStrongs(query).slice(0, limit);

        return res.json({
            success: true,
            data: results,
            meta: { total: results.length, query }
        });
    } catch (error) {
        console.error('Concordance search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Search failed'
        });
    }
});

export default router;
