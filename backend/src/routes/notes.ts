import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Simple file-based storage for notes
const NOTES_DIR = path.join(__dirname, '../../data/notes');

// Ensure notes directory exists
if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
}

interface Note {
    id: string;
    userId: string;
    verseRef: string;
    bookId: number;
    chapter: number;
    verse: number;
    text: string;
    highlightColor?: string;
    createdAt: string;
    updatedAt: string;
}

function getUserNotesPath(userId: string): string {
    return path.join(NOTES_DIR, `${userId}.json`);
}

function loadUserNotes(userId: string): Note[] {
    const filePath = getUserNotesPath(userId);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return [];
    }
}

function saveUserNotes(userId: string, notes: Note[]): void {
    const filePath = getUserNotesPath(userId);
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * GET /api/notes/:userId
 * Get all notes for a user
 */
router.get('/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const notes = loadUserNotes(userId);

    res.json({
        success: true,
        data: notes,
        meta: { total: notes.length }
    });
});

/**
 * GET /api/notes/:userId/verse/:bookId/:chapter/:verse
 * Get notes for a specific verse
 */
router.get('/:userId/verse/:bookId/:chapter/:verse', (req: Request, res: Response) => {
    const { userId, bookId, chapter, verse } = req.params;
    const notes = loadUserNotes(userId);

    const verseNotes = notes.filter(n =>
        n.bookId === parseInt(bookId) &&
        n.chapter === parseInt(chapter) &&
        n.verse === parseInt(verse)
    );

    res.json({
        success: true,
        data: verseNotes,
        meta: { total: verseNotes.length }
    });
});

/**
 * POST /api/notes
 * Create a new note (mark a verse)
 */
router.post('/', (req: Request, res: Response) => {
    const { userId, verseRef, bookId, chapter, verse, text, highlightColor } = req.body;

    if (!userId || !bookId || !chapter || !verse) {
        res.status(400).json({
            success: false,
            error: 'Missing required fields: userId, bookId, chapter, verse',
            code: 400
        });
        return;
    }

    const notes = loadUserNotes(userId);
    const now = new Date().toISOString();

    const newNote: Note = {
        id: generateId(),
        userId,
        verseRef: verseRef || `${bookId} ${chapter}:${verse}`,
        bookId: parseInt(bookId),
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        text: text || '',
        highlightColor: highlightColor || '#FFD700', // Default gold
        createdAt: now,
        updatedAt: now
    };

    notes.push(newNote);
    saveUserNotes(userId, notes);

    res.status(201).json({
        success: true,
        data: newNote,
        message: 'Note created successfully'
    });
});

/**
 * PUT /api/notes/:noteId
 * Update a note
 */
router.put('/:noteId', (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { userId, text, highlightColor } = req.body;

    if (!userId) {
        res.status(400).json({
            success: false,
            error: 'Missing required field: userId',
            code: 400
        });
        return;
    }

    const notes = loadUserNotes(userId);
    const noteIndex = notes.findIndex(n => n.id === noteId);

    if (noteIndex === -1) {
        res.status(404).json({
            success: false,
            error: 'Note not found',
            code: 404
        });
        return;
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        text: text !== undefined ? text : notes[noteIndex].text,
        highlightColor: highlightColor !== undefined ? highlightColor : notes[noteIndex].highlightColor,
        updatedAt: new Date().toISOString()
    };

    saveUserNotes(userId, notes);

    res.json({
        success: true,
        data: notes[noteIndex],
        message: 'Note updated successfully'
    });
});

/**
 * DELETE /api/notes/:noteId
 * Delete a note
 */
router.delete('/:noteId', (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
        res.status(400).json({
            success: false,
            error: 'Missing required query param: userId',
            code: 400
        });
        return;
    }

    const notes = loadUserNotes(userId);
    const noteIndex = notes.findIndex(n => n.id === noteId);

    if (noteIndex === -1) {
        res.status(404).json({
            success: false,
            error: 'Note not found',
            code: 404
        });
        return;
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];
    saveUserNotes(userId, notes);

    res.json({
        success: true,
        data: deletedNote,
        message: 'Note deleted successfully'
    });
});

export default router;
