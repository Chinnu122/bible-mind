import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/books
 * Get all books of the Bible
 */
router.get('/', (_req: Request, res: Response) => {
  const books = dataStore.getBooks();
  res.json({
    success: true,
    data: books,
    meta: { total: books.length }
  });
});

/**
 * GET /api/books/:bookId
 * Get a specific book by ID
 */
router.get('/:bookId', (req: Request, res: Response) => {
  const bookId = parseInt(req.params.bookId);
  
  // Check if bookId is a number or name
  let book;
  if (isNaN(bookId)) {
    book = dataStore.getBookByName(req.params.bookId);
  } else {
    book = dataStore.getBook(bookId);
  }

  if (!book) {
    res.status(404).json({
      success: false,
      error: 'Book not found',
      code: 404
    });
    return;
  }

  res.json({
    success: true,
    data: book
  });
});

/**
 * GET /api/books/:bookId/chapters
 * Get list of chapters in a book
 */
router.get('/:bookId/chapters', (req: Request, res: Response) => {
  const bookId = parseInt(req.params.bookId);
  let book;
  
  if (isNaN(bookId)) {
    book = dataStore.getBookByName(req.params.bookId);
  } else {
    book = dataStore.getBook(bookId);
  }

  if (!book) {
    res.status(404).json({
      success: false,
      error: 'Book not found',
      code: 404
    });
    return;
  }

  const chapters = Array.from({ length: book.chapterCount }, (_, i) => i + 1);
  
  res.json({
    success: true,
    data: {
      book: book.bookName,
      chapters: chapters,
      chapterCount: book.chapterCount
    }
  });
});

export default router;
