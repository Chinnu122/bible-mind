import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/search?q=query&limit=20&book=Genesis
 * Search verses
 */
router.get('/', (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const bookFilter = req.query.book as string;

  if (!query || query.length < 2) {
    res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters',
      code: 400
    });
    return;
  }

  let results = dataStore.searchVerses(query, limit * 2); // Get extra for filtering

  // Filter by book if specified
  if (bookFilter) {
    const book = dataStore.getBookByName(bookFilter);
    if (book) {
      results = results.filter(v => v.bookId === book.bookId);
    }
  }

  // Limit results
  results = results.slice(0, limit);

  // Format results with references
  const formattedResults = results.map(verse => ({
    ...verse,
    reference: `${verse.bookName} ${verse.chapter}:${verse.verse}`
  }));

  res.json({
    success: true,
    data: formattedResults,
    meta: { 
      total: formattedResults.length, 
      query,
      limit
    }
  });
});

/**
 * GET /api/search/strongs?q=query
 * Search Strong's definitions
 */
router.get('/strongs', (req: Request, res: Response) => {
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

export default router;
