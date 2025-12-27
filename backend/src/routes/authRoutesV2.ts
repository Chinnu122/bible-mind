/**
 * Authentication Routes (v2)
 * 
 * Endpoints:
 * - POST /api/v2/auth/register - Register with email/password
 * - POST /api/v2/auth/login - Login with email/password
 * - POST /api/v2/auth/refresh - Refresh access token
 * - GET /api/v2/auth/me - Get current user
 * - PUT /api/v2/auth/preferences - Update user preferences
 * - GET /api/v2/auth/google - Initiate Google OAuth
 * - GET /api/v2/auth/google/callback - Google OAuth callback
 */

import { Router, Request, Response } from 'express';
import passport from '../auth/passport';
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    getUserById,
    updateUserPreferences,
    updateReadingProgress,
    generateTokens,
} from '../services/authService';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// ============================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================

/**
 * POST /register - Register new user
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, displayName } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters',
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }

        // Register user
        const result = await registerUser({ email, password, displayName });

        if (!result) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered',
            });
        }

        return res.status(201).json({
            success: true,
            data: {
                user: result.user,
                tokens: result.tokens,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: 'Registration failed',
        });
    }
});

/**
 * POST /login - Login with email/password
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
        }

        const result = await loginUser({ email, password });

        if (!result) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        return res.json({
            success: true,
            data: {
                user: result.user,
                tokens: result.tokens,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed',
        });
    }
});

/**
 * POST /refresh - Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required',
            });
        }

        const tokens = refreshAccessToken(refreshToken);

        if (!tokens) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token',
            });
        }

        return res.json({
            success: true,
            data: { tokens },
        });
    } catch (error) {
        console.error('Refresh error:', error);
        return res.status(500).json({
            success: false,
            error: 'Token refresh failed',
        });
    }
});

// ============================================
// USER PROFILE
// ============================================

/**
 * GET /me - Get current user profile
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated',
            });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        return res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get profile',
        });
    }
});

/**
 * PUT /preferences - Update user preferences
 */
router.put('/preferences', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.id;
        const { preferences } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated',
            });
        }

        const user = await updateUserPreferences(userId, preferences);

        return res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update preferences',
        });
    }
});

/**
 * POST /reading-progress - Update reading progress
 */
router.post('/reading-progress', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.id;
        const { bookId, chapter, verse } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated',
            });
        }

        if (!bookId || !chapter) {
            return res.status(400).json({
                success: false,
                error: 'bookId and chapter are required',
            });
        }

        await updateReadingProgress(userId, bookId, chapter, verse);

        return res.json({
            success: true,
            message: 'Reading progress updated',
        });
    } catch (error) {
        console.error('Update reading progress error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update reading progress',
        });
    }
});

// ============================================
// GOOGLE OAUTH
// ============================================

/**
 * GET /google - Initiate Google OAuth flow
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * GET /google/callback - Google OAuth callback
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as any;

            if (!user) {
                return res.redirect('/login?error=oauth_failed');
            }

            // Generate tokens
            const tokens = generateTokens(user.id, user.email);

            // Redirect with tokens (in production, use a more secure method)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
            redirectUrl.searchParams.set('accessToken', tokens.accessToken);
            redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
            redirectUrl.searchParams.set('expiresIn', tokens.expiresIn.toString());

            return res.redirect(redirectUrl.toString());
        } catch (error) {
            console.error('Google callback error:', error);
            return res.redirect('/login?error=oauth_error');
        }
    }
);

// ============================================
// SESSION CHECK
// ============================================

/**
 * GET /check - Check if session is valid
 */
router.get('/check', optionalAuth, (req: Request, res: Response) => {
    const isAuthenticated = !!req.authUser?.id;

    res.json({
        success: true,
        data: {
            authenticated: isAuthenticated,
            user: isAuthenticated ? req.authUser : null,
        },
    });
});

export default router;
