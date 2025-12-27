/**
 * Authentication Service
 * 
 * Provides:
 * - JWT token generation and verification
 * - Password hashing and verification
 * - OAuth token validation
 * - Session management helpers
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './database';

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'bible-mind-secret-change-in-production';
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 30 * 24 * 60 * 60; // 30 days in seconds
const SALT_ROUNDS = 12;

// ============================================
// TOKEN TYPES
// ============================================

export interface TokenPayload {
    userId: string;
    email: string;
    type: 'access' | 'refresh';
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface DecodedToken extends TokenPayload {
    iat: number;
    exp: number;
}

// ============================================
// JWT FUNCTIONS
// ============================================

/**
 * Generate access and refresh tokens for a user
 */
export function generateTokens(userId: string, email: string): AuthTokens {
    const accessPayload: TokenPayload = {
        userId,
        email,
        type: 'access',
    };

    const refreshPayload: TokenPayload = {
        userId,
        email,
        type: 'refresh',
    };

    const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN_SECONDS,
    });

    const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    });

    // Calculate expiration in seconds
    const decoded = jwt.decode(accessToken) as DecodedToken;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    return {
        accessToken,
        refreshToken,
        expiresIn,
    };
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
        return null;
    }
}

/**
 * Refresh access token using refresh token
 */
export function refreshAccessToken(refreshToken: string): AuthTokens | null {
    const decoded = verifyToken(refreshToken);

    if (!decoded || decoded.type !== 'refresh') {
        return null;
    }

    return generateTokens(decoded.userId, decoded.email);
}

// ============================================
// PASSWORD FUNCTIONS
// ============================================

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============================================
// USER AUTHENTICATION
// ============================================

export interface RegisterInput {
    email: string;
    password: string;
    displayName?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface OAuthInput {
    provider: 'google' | 'apple';
    providerId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
}

/**
 * Register a new user with email/password
 */
export async function registerUser(input: RegisterInput): Promise<{ user: any; tokens: AuthTokens } | null> {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            return null; // User already exists
        }

        // Hash password
        const passwordHash = await hashPassword(input.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: input.email,
                displayName: input.displayName || input.email.split('@')[0],
                passwordHash,
                authProvider: 'email',
            },
        });

        // Generate tokens
        const tokens = generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
            },
            tokens,
        };
    } catch (error) {
        console.error('Registration error:', error);
        return null;
    }
}

/**
 * Login a user with email/password
 */
export async function loginUser(input: LoginInput): Promise<{ user: any; tokens: AuthTokens } | null> {
    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user || !user.passwordHash) {
            return null; // User not found or uses OAuth only
        }

        // Verify password
        const isValid = await verifyPassword(input.password, user.passwordHash);

        if (!isValid) {
            return null; // Invalid password
        }

        // Generate tokens
        const tokens = generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
            },
            tokens,
        };
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

/**
 * Login or register a user via OAuth
 */
export async function oauthLogin(input: OAuthInput): Promise<{ user: any; tokens: AuthTokens; isNewUser: boolean }> {
    // Try to find existing user by provider + providerId
    let user = await prisma.user.findFirst({
        where: {
            authProvider: input.provider,
            providerId: input.providerId,
        },
    });

    let isNewUser = false;

    if (!user) {
        // Try to find by email
        user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (user) {
            // Link OAuth to existing account
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    authProvider: input.provider,
                    providerId: input.providerId,
                    avatarUrl: input.avatarUrl || user.avatarUrl,
                },
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: input.email,
                    displayName: input.displayName || input.email.split('@')[0],
                    authProvider: input.provider,
                    providerId: input.providerId,
                    avatarUrl: input.avatarUrl,
                },
            });
            isNewUser = true;
        }
    }

    // Generate tokens
    const tokens = generateTokens(user.id, user.email);

    return {
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
        },
        tokens,
        isNewUser,
    };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<any | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                preferences: true,
                lastReadBook: true,
                lastReadChapter: true,
                createdAt: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<any | null> {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { preferences },
            select: {
                id: true,
                email: true,
                displayName: true,
                preferences: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Update preferences error:', error);
        return null;
    }
}

/**
 * Update reading progress
 */
export async function updateReadingProgress(
    userId: string,
    bookId: number,
    chapter: number,
    verse?: number
): Promise<void> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                lastReadBook: bookId,
                lastReadChapter: chapter,
                lastReadVerse: verse,
            },
        });
    } catch (error) {
        console.error('Update reading progress error:', error);
    }
}
