import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/verses/:bookId/:chapter
 * Get all verses in a chapter
 */
router.get('/:bookId/:chapter', (req: Request, res: Response) => {
  let bookId = parseInt(req.params.bookId);
  const chapter = parseInt(req.params.chapter);

  // Handle book name instead of ID
  if (isNaN(bookId)) {
    const book = dataStore.getBookByName(req.params.bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found',
        code: 404
      });
      return;
    }
    bookId = book.bookId;
  }

  const book = dataStore.getBook(bookId);
  if (!book) {
    res.status(404).json({
      success: false,
      error: 'Book not found',
      code: 404
    });
    return;
  }

  if (chapter < 1 || chapter > book.chapterCount) {
    res.status(400).json({
      success: false,
      error: `Invalid chapter. ${book.bookName} has ${book.chapterCount} chapters.`,
      code: 400
    });
    return;
  }

  const verses = dataStore.getChapter(bookId, chapter);

  res.json({
    success: true,
    data: {
      book: book.bookName,
      bookId: book.bookId,
      chapter: chapter,
      verses: verses
    },
    meta: { total: verses.length }
  });
});

/**
 * GET /api/verses/:bookId/:chapter/:verse
 * Get a specific verse
 */
router.get('/:bookId/:chapter/:verse', (req: Request, res: Response) => {
  let bookId = parseInt(req.params.bookId);
  const chapter = parseInt(req.params.chapter);
  const verseNum = parseInt(req.params.verse);

  // Handle book name instead of ID
  if (isNaN(bookId)) {
    const book = dataStore.getBookByName(req.params.bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found',
        code: 404
      });
      return;
    }
    bookId = book.bookId;
  }

  const verse = dataStore.getVerse(bookId, chapter, verseNum);

  if (!verse) {
    res.status(404).json({
      success: false,
      error: 'Verse not found',
      code: 404
    });
    return;
  }

  const book = dataStore.getBook(bookId);

  res.json({
    success: true,
    data: {
      ...verse,
      reference: `${book?.bookName} ${chapter}:${verseNum}`,
      testament: book?.testament
    }
  });
});

export default router;
