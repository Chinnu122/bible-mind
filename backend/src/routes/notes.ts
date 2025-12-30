import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

/**
 * GET /api/notes
 * Get all notes for the authenticated user
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const notes = await prisma.annotation.findMany({
            where: { userId },
            include: {
                verse: {
                    select: {
                        bookId: true,
                        chapter: true,
                        verse: true,
                        book: { select: { bookName: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: notes,
            meta: { total: notes.length }
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notes' });
    }
});

/**
 * GET /api/notes/verse/:bookId/:chapter/:verse
 * Get notes for a specific verse
 */
router.get('/verse/:bookId/:chapter/:verse', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const bookId = parseInt(req.params.bookId);
        const chapter = parseInt(req.params.chapter);
        const verseNum = parseInt(req.params.verse);

        // Find the verse ID first
        const verse = await prisma.verse.findUnique({
            where: {
                bookId_chapter_verse: {
                    bookId,
                    chapter,
                    verse: verseNum
                }
            }
        });

        if (!verse) {
            // Return empty if verse doesn't exist (shouldn't happen for valid verses)
            res.json({ success: true, data: [], meta: { total: 0 } });
            return;
        }

        const notes = await prisma.annotation.findMany({
            where: {
                userId,
                verseId: verse.id
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: notes,
            meta: { total: notes.length }
        });
    } catch (error) {
        console.error('Error fetching verse notes:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notes' });
    }
});

/**
 * POST /api/notes
 * Create a new note
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const { bookId, chapter, verse, text, highlightColor, isPublic, selection } = req.body;

        if (!bookId || !chapter || !verse || !text) {
            res.status(400).json({ success: false, error: 'Missing required fields' });
            return; // Explicit return to satisfy void
        }

        // 1. Find the verse ID (or create if missing? No, verses should exist)
        const verseRecord = await prisma.verse.findUnique({
            where: {
                bookId_chapter_verse: {
                    bookId: parseInt(bookId),
                    chapter: parseInt(chapter),
                    verse: parseInt(verse)
                }
            }
        });

        if (!verseRecord) {
            res.status(404).json({ success: false, error: 'Verse not found' });
            return; // Explicit return
        }

        // 2. Create the annotation
        const note = await prisma.annotation.create({
            data: {
                userId,
                verseId: verseRecord.id,
                note: text,
                highlight: highlightColor || '#FFD700',
                visibility: isPublic ? 'public' : 'private',
                selection: selection || null,
                tags: []
            }
        });

        res.status(201).json({
            success: true,
            data: note,
            message: 'Note created successfully'
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, error: 'Failed to create note' });
    }
});

/**
 * PUT /api/notes/:noteId
 * Update a note
 */
router.put('/:noteId', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const { noteId } = req.params;
        const { text, highlightColor, isPublic } = req.body;

        // Verify ownership
        const existingNote = await prisma.annotation.findUnique({
            where: { id: noteId }
        });

        if (!existingNote) {
            res.status(404).json({ success: false, error: 'Note not found' });
            return;
        }

        if (existingNote.userId !== userId) {
            res.status(403).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const updatedNote = await prisma.annotation.update({
            where: { id: noteId },
            data: {
                note: text !== undefined ? text : undefined,
                highlight: highlightColor !== undefined ? highlightColor : undefined,
                visibility: isPublic !== undefined ? (isPublic ? 'public' : 'private') : undefined,
                updatedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: updatedNote,
            message: 'Note updated successfully'
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ success: false, error: 'Failed to update note' });
    }
});

/**
 * DELETE /api/notes/:noteId
 * Delete a note
 */
router.delete('/:noteId', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const { noteId } = req.params;

        // Verify ownership
        const existingNote = await prisma.annotation.findUnique({
            where: { id: noteId }
        });

        if (!existingNote) {
            res.status(404).json({ success: false, error: 'Note not found' });
            return;
        }

        if (existingNote.userId !== userId) {
            res.status(403).json({ success: false, error: 'Unauthorized' });
            return;
        }

        await prisma.annotation.delete({
            where: { id: noteId }
        });

        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ success: false, error: 'Failed to delete note' });
    }
});

export default router;
