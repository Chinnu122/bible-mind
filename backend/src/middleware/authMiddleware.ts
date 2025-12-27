/**
 * Authentication Middleware
 * 
 * Express middleware for:
 * - JWT token verification
 * - Protected route handling
 * - Optional authentication
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, DecodedToken } from '../services/authService';

// ============================================
// EXTEND EXPRESS REQUEST TYPE
// ============================================

// Use module augmentation to add our custom properties
declare module 'express-serve-static-core' {
    interface Request {
        authUser?: {
            id: string;
            email: string;
        };
        authToken?: DecodedToken;
    }
}

// ============================================
// MIDDLEWARE FUNCTIONS
// ============================================

/**
 * Require authentication - blocks unauthenticated requests
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Authentication required',
            code: 401,
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
            code: 401,
        });
        return;
    }

    if (decoded.type !== 'access') {
        res.status(401).json({
            success: false,
            error: 'Invalid token type',
            code: 401,
        });
        return;
    }

    // Attach user info to request
    req.authUser = {
        id: decoded.userId,
        email: decoded.email,
    };
    req.authToken = decoded;

    next();
}

/**
 * Optional authentication - attaches user if token present, continues either way
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (decoded && decoded.type === 'access') {
            req.authUser = {
                id: decoded.userId,
                email: decoded.email,
            };
            req.authToken = decoded;
        }
    }

    next();
}

/**
 * Check if user is authenticated (helper function)
 */
export function isAuthenticated(req: Request): boolean {
    return !!req.authUser?.id;
}

/**
 * Get current user ID (helper function)
 */
export function getCurrentUserId(req: Request): string | null {
    return req.authUser?.id || null;
}
