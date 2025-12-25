import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/export/pdf
 * Generate a PDF from lesson content (placeholder for server-side generation)
 * Currently, PDF is generated client-side with jsPDF + html2canvas
 * This endpoint can be used for advanced server-side rendering if needed
 */
router.post('/pdf', async (req: Request, res: Response) => {
    try {
        const { title, verseRef, verseText, notes, template } = req.body;

        if (!title || !verseRef || !verseText) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: title, verseRef, verseText',
                code: 400
            });
            return;
        }

        // For now, return a success response indicating client-side should handle PDF
        // In future, could use puppeteer or pdfkit for server-side generation
        res.json({
            success: true,
            data: {
                message: 'PDF generation is handled client-side for performance.',
                content: {
                    title,
                    verseRef,
                    verseText,
                    notes: notes || '',
                    template: template || 'classic'
                }
            }
        });
    } catch (error: any) {
        console.error('Export error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process export request',
            code: 500
        });
    }
});

/**
 * GET /api/export/lesson/:lessonId
 * Get a shareable lesson by ID (placeholder for future lesson storage)
 */
router.get('/lesson/:lessonId', (_req: Request, res: Response) => {
    // Placeholder for shareable lessons feature
    res.json({
        success: true,
        data: {
            message: 'Shareable lessons feature coming soon',
            lessonId: _req.params.lessonId
        }
    });
});

export default router;
