import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { prisma } from '../services/database';

const router = Router();

// Require login for cloud favorites (Phase 1 can use local storage fallback on frontend, but backend requires auth)
router.use(requireAuth);

/**
 * GET /api/favorites
 * Get all favorite verses
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;

        // Favorites are Annotations with 'favorite' tag
        // OR we can store them in JSON preferences. 
        // Using Annotations is better for scale and querying.

        const favorites = await prisma.annotation.findMany({
            where: {
                userId,
                tags: { has: 'favorite' }
            },
            include: {
                verse: {
                    select: {
                        bookId: true,
                        chapter: true,
                        verse: true,
                        book: { select: { bookName: true } },
                        // Include text for preview
                        translations: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format for frontend
        const formatted = favorites.map(f => ({
            id: f.id,
            bookId: f.verse.bookId,
            bookName: f.verse.book.bookName,
            chapter: f.verse.chapter,
            verse: f.verse.verse,
            text: (f.verse.translations as any)?.english || "Verse text not available", // simplified
            addedAt: f.createdAt
        }));

        res.json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error('Get Favorites Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
    }
});

/**
 * POST /api/favorites
 * Add a verse to favorites
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const { bookId, chapter, verse } = req.body;

        if (!bookId || !chapter || !verse) {
            return res.status(400).json({ success: false, error: 'Verse reference required' });
        }

        // Find verse ID
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
            return res.status(404).json({ success: false, error: 'Verse not found' });
        }

        // Check if already favorited
        const existing = await prisma.annotation.findFirst({
            where: {
                userId,
                verseId: verseRecord.id,
                tags: { has: 'favorite' }
            }
        });

        if (existing) {
            return res.json({ success: true, message: 'Already in favorites', data: existing });
        }

        // Create new favorite annotation
        const newFavorite = await prisma.annotation.create({
            data: {
                userId,
                verseId: verseRecord.id,
                note: '', // Empty note for pure favorite
                visibility: 'private',
                tags: ['favorite'],
                highlight: '#FFD700' // Gold default
            }
        });

        res.status(201).json({
            success: true,
            data: newFavorite,
            message: 'Added to favorites'
        });

    } catch (error) {
        console.error('Add Favorite Error:', error);
        res.status(500).json({ success: false, error: 'Failed to add favorite' });
    }
});

/**
 * DELETE /api/favorites/:id
 * Remove from favorites
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.authUser!.id;
        const { id } = req.params; // Can be Annotation ID OR "book-chapter-verse"

        let annotationId = id;

        // Validating ID format 
        // If it looks like '1-1-1' (Book-Ch-Verse), find the annotation first
        if (id.includes('-')) {
            const [b, c, v] = id.split('-').map(Number);
            const verse = await prisma.verse.findUnique({
                where: { bookId_chapter_verse: { bookId: b, chapter: c, verse: v } }
            });

            if (verse) {
                const note = await prisma.annotation.findFirst({
                    where: { userId, verseId: verse.id, tags: { has: 'favorite' } }
                });
                if (note) annotationId = note.id;
                else return res.status(404).json({ success: false, error: 'Favorite not found' });
            }
        }

        await prisma.annotation.deleteMany({
            where: {
                id: annotationId,
                userId // Ensure ownership
            }
        });

        res.json({
            success: true,
            message: 'Removed from favorites'
        });

    } catch (error) {
        console.error('Remove Favorite Error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove favorite' });
    }
});

export default router;
