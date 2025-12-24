import { Router, Request, Response } from 'express';
import { ensureDailyVerseImage, readDailyVerseMeta } from '../cronJobs';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        // Prefer existing meta (fast), but ensure it's present for today
        const meta = readDailyVerseMeta();
        const today = new Date().toISOString().split('T')[0];

        if (!meta || meta.date !== today) {
            const ensured = await ensureDailyVerseImage();
            res.json({ success: true, data: ensured });
            return;
        }

        res.json({ success: true, data: meta });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e?.message || 'Failed to load daily verse' });
    }
});

export default router;
