import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/strongs/search?q=query
 * Search Strong's definitions by word, meaning, or root
 * NOTE: This route MUST be defined before /:number to avoid conflicts
 */
router.get('/search', (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.length < 2) {
    res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters',
      code: 400
    });
    return;
  }

  const results = dataStore.searchStrongs(query);

  res.json({
    success: true,
    data: results,
    meta: { total: results.length, query }
  });
});

/**
 * POST /api/strongs/bulk
 * Get multiple Strong's definitions at once
 * Body: { numbers: ["H430", "H1254", ...] }
 */
router.post('/bulk', (req: Request, res: Response) => {
  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers)) {
    res.status(400).json({
      success: false,
      error: 'Request body must contain "numbers" array',
      code: 400
    });
    return;
  }

  const results: Record<string, any> = {};
  const notFound: string[] = [];

  for (const num of numbers.slice(0, 100)) { // Limit to 100
    const def = dataStore.getStrongs(num);
    if (def) {
      results[def.strongsNumber] = def;
    } else {
      notFound.push(num);
    }
  }

  res.json({
    success: true,
    data: results,
    meta: {
      found: Object.keys(results).length,
      notFound: notFound.length > 0 ? notFound : undefined
    }
  });
});

/**
 * GET /api/strongs/all
 * Get all Strong's definitions (for frontend caching)
 */
router.get('/all', (_req: Request, res: Response) => {
  const allStrongs = dataStore.getAllStrongs();

  res.json({
    success: true,
    data: allStrongs,
    meta: { total: allStrongs.length }
  });
});

/**
 * GET /api/strongs/:number
 * Get a Strong's definition by number (e.g., H430, G3056)
 */
router.get('/:number', (req: Request, res: Response) => {
  const strongsNum = req.params.number;
  const definition = dataStore.getStrongs(strongsNum);

  if (!definition) {
    res.status(404).json({
      success: false,
      error: `Strong's number ${strongsNum} not found`,
      code: 404
    });
    return;
  }

  res.json({
    success: true,
    data: definition
  });
});

export default router;

