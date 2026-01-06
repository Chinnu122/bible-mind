import { Router, Request, Response } from 'express';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware';
import { prisma } from '../services/database';

const router = Router();

/**
 * GET /api/preferences
 * Get user preferences
 */
router.get('/', optionalAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.id;

        // If logged in, fetch from DB
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { preferences: true }
            });

            return res.json({
                success: true,
                data: user?.preferences || {}
            });
        }

        // If guest (Frontend-only storage phase), just return empty defaults
        // In Phase 2, we can implement Device-ID based sync here if needed.
        return res.json({
            success: true,
            data: {},
            message: "Guest mode: Preferences stored locally"
        });

    } catch (error) {
        console.error('Preferences API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch preferences'
        });
    }
});

/**
 * POST /api/preferences
 * Update user preferences
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.id;
        const { language, theme, fontSize, favorites } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Login required to sync preferences'
            });
        }

        // Merge with existing preferences
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const currentPrefs = (user?.preferences as Record<string, any>) || {};

        const newPrefs = {
            ...currentPrefs,
            ...(language && { language }),
            ...(theme && { theme }),
            ...(fontSize && { fontSize }),
            ...(favorites != null && { favorites }) // favorites might be an array
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { preferences: newPrefs }
        });

        return res.json({
            success: true,
            data: updatedUser.preferences
        });

    } catch (error) {
        console.error('Update Preferences Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update preferences'
        });
    }
});

export default router;
