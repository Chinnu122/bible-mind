import express from 'express';

const router = express.Router();

// In-memory storage for notes (for development)
// In production, use a database like MongoDB, PostgreSQL, etc.
const notesStore: Record<string, any> = {};

// GET /api/notes/:deviceId - Retrieve notes for a device
router.get('/:deviceId', (req, res) => {
    const { deviceId } = req.params;

    if (!deviceId) {
        return res.status(400).json({ success: false, error: 'Device ID required' });
    }

    const notes = notesStore[deviceId] || {};

    res.json({
        success: true,
        data: notes,
        deviceId
    });
});

// POST /api/notes/:deviceId - Save notes for a device
router.post('/:deviceId', (req, res) => {
    const { deviceId } = req.params;
    const { notes } = req.body;

    if (!deviceId) {
        return res.status(400).json({ success: false, error: 'Device ID required' });
    }

    if (notes === undefined) {
        return res.status(400).json({ success: false, error: 'Notes data required' });
    }

    notesStore[deviceId] = notes;

    res.json({
        success: true,
        message: 'Notes saved successfully',
        deviceId
    });
});

// DELETE /api/notes/:deviceId - Clear notes for a device
router.delete('/:deviceId', (req, res) => {
    const { deviceId } = req.params;

    if (notesStore[deviceId]) {
        delete notesStore[deviceId];
    }

    res.json({
        success: true,
        message: 'Notes cleared',
        deviceId
    });
});

export default router;
