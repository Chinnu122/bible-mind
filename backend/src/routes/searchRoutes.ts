/**
 * Search API Routes
 * 
 * Endpoints:
 * - POST /api/search - Multilingual Bible search
 * - GET /api/search/lexicon - Search Strong's lexicon
 * - GET /api/search/suggest - Autocomplete suggestions
 */

import { Router, Request, Response } from 'express';
import { searchVerses, searchLexicon, SearchOptions } from '../services/searchService';
import { getCachedSearch, setCachedSearch } from '../services/cacheService';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for search endpoints
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: { error: 'Too many search requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ============================================
// POST /api/search - Main Bible Search
// ============================================

interface SearchRequestBody {
    q: string;
    lang_hint?: 'hebrew' | 'greek' | 'english' | 'telugu' | 'hindi' | 'auto';
    filters?: {
        testament?: 'old' | 'new';
        bookId?: number;
        strongNumber?: string;
    };
    limit?: number;
    explain?: boolean;
}

router.post('/', searchLimiter, async (req: Request, res: Response) => {
    try {
        const { q, lang_hint, filters, limit, explain }: SearchRequestBody = req.body;

        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required',
            });
        }

        const query = q.trim();

        // Check cache first
        const cacheFilters = { lang_hint, ...filters };
        const cached = await getCachedSearch(query, cacheFilters);
        if (cached) {
            return res.json({
                success: true,
                data: cached,
                meta: { cached: true },
            });
        }

        // Execute search
        const searchOptions: SearchOptions = {
            query,
            language: lang_hint || 'auto',
            filters,
            limit: Math.min(limit || 50, 100), // Cap at 100
            explain: explain || false,
        };

        const results = await searchVerses(searchOptions);

        // Cache results
        await setCachedSearch(query, cacheFilters, results);

        return res.json({
            success: true,
            data: results,
            meta: {
                query,
                language: lang_hint || 'auto',
                total: results.length,
                cached: false,
            },
        });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Search failed. Please try again.',
        });
    }
});

// ============================================
// GET /api/search/lexicon - Lexicon Search
// ============================================

router.get('/lexicon', searchLimiter, async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required',
            });
        }

        const results = await searchLexicon(query.trim(), Math.min(limit, 100));

        return res.json({
            success: true,
            data: results,
            meta: {
                query: query.trim(),
                total: results.length,
            },
        });
    } catch (error) {
        console.error('Lexicon search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Lexicon search failed. Please try again.',
        });
    }
});

// ============================================
// GET /api/search/suggest - Autocomplete
// ============================================

router.get('/suggest', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query || query.length < 2) {
            return res.json({
                success: true,
                data: [],
            });
        }

        // Use lexicon search for suggestions (faster, smaller result set)
        const suggestions = await searchLexicon(query, 10);

        return res.json({
            success: true,
            data: suggestions.map((s: any) => ({
                text: s.lemma,
                strongNumber: s.strongNumber,
                gloss: s.gloss,
            })),
        });
    } catch (error) {
        console.error('Suggestion error:', error);
        return res.json({
            success: true,
            data: [],
        });
    }
});

// ============================================
// GET /api/search/filters - Available Filters
// ============================================

router.get('/filters', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            languages: [
                { id: 'auto', label: 'Auto-detect' },
                { id: 'hebrew', label: 'Hebrew (עברית)' },
                { id: 'greek', label: 'Greek (Ελληνικά)' },
                { id: 'english', label: 'English' },
                { id: 'telugu', label: 'Telugu (తెలుగు)' },
                { id: 'hindi', label: 'Hindi (हिंदी)' },
            ],
            testaments: [
                { id: 'old', label: 'Old Testament' },
                { id: 'new', label: 'New Testament' },
            ],
            morphologyTags: [
                { id: 'noun', label: 'Noun' },
                { id: 'verb', label: 'Verb' },
                { id: 'adjective', label: 'Adjective' },
                { id: 'preposition', label: 'Preposition' },
                { id: 'pronoun', label: 'Pronoun' },
            ],
        },
    });
});

export default router;
