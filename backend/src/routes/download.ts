import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Map of available Bible downloads
const BIBLE_DOWNLOADS: Record<string, { path: string; filename: string; description: string }> = {
    'kjv': {
        path: 'EN-English/kjv.pdf',
        filename: 'KJV-Bible.pdf',
        description: 'King James Version (English)'
    },
    'kjv_strongs': {
        path: 'EN-English/kjv_strongs.pdf',
        filename: 'KJV-Strongs-Bible.pdf',
        description: 'King James Version with Strong\'s Numbers'
    },
    'bishops': {
        path: 'EN-English/bishops.pdf',
        filename: 'Bishops-Bible.pdf',
        description: 'Bishop\'s Bible (English)'
    },
    'hebrew_modern': {
        path: 'HE-עברית/he_modern.pdf',
        filename: 'Hebrew-Modern-Bible.pdf',
        description: 'Modern Hebrew Bible'
    },
    'hebrew_wlc': {
        path: 'HE-עברית/wlc.pdf',
        filename: 'Westminster-Leningrad-Codex.pdf',
        description: 'Westminster Leningrad Codex'
    },
    'telugu': {
        path: 'TE-తెలుగు/te_irv.pdf',
        filename: 'Telugu-IRV-Bible.pdf',
        description: 'Telugu Indian Revised Version'
    },
};

/**
 * GET /api/download
 * Returns list of available Bible downloads
 */
router.get('/', (_req: Request, res: Response) => {
    const available = Object.entries(BIBLE_DOWNLOADS).map(([code, info]) => ({
        code,
        description: info.description,
        filename: info.filename,
        downloadUrl: `/api/download/${code}`
    }));

    res.json({
        success: true,
        data: available,
        meta: { total: available.length }
    });
});

/**
 * GET /api/download/:format
 * Downloads a Bible PDF in the specified format
 */
router.get('/:format', (req: Request, res: Response) => {
    const format = req.params.format.toLowerCase();
    const download = BIBLE_DOWNLOADS[format];

    if (!download) {
        res.status(404).json({
            success: false,
            error: `Unknown format: ${format}. Available: ${Object.keys(BIBLE_DOWNLOADS).join(', ')}`,
            code: 404
        });
        return;
    }

    const filePath = path.join(__dirname, '../../../', download.path);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            success: false,
            error: 'File not found on server',
            code: 404
        });
        return;
    }

    res.download(filePath, download.filename, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to download file',
                code: 500
            });
        }
    });
});

export default router;
