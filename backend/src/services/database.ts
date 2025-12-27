/**
 * Database Service
 * 
 * Prisma-based service layer that provides the same interface as the
 * legacy CSV-based dataStore, enabling a gradual migration.
 * 
 * This module exports a singleton PrismaClient instance and helper functions
 * for common database operations.
 */

import { PrismaClient, Book, Verse, LexiconEntry, User, Annotation } from '@prisma/client';

// Singleton Prisma Client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// ============================================
// BOOK OPERATIONS
// ============================================

export async function getAllBooks(): Promise<Book[]> {
    return prisma.book.findMany({
        orderBy: { bookId: 'asc' },
    });
}

export async function getBookById(bookId: number): Promise<Book | null> {
    return prisma.book.findUnique({
        where: { bookId },
    });
}

export async function getBookByName(name: string): Promise<Book | null> {
    const lowerName = name.toLowerCase();
    return prisma.book.findFirst({
        where: {
            OR: [
                { bookName: { equals: name, mode: 'insensitive' } },
                { shortName: { equals: name, mode: 'insensitive' } },
                { usxCode: { equals: name, mode: 'insensitive' } },
            ],
        },
    });
}

// ============================================
// VERSE OPERATIONS
// ============================================

export async function getVerse(bookId: number, chapter: number, verse: number): Promise<Verse | null> {
    return prisma.verse.findUnique({
        where: {
            bookId_chapter_verse: { bookId, chapter, verse },
        },
    });
}

export async function getChapter(bookId: number, chapter: number): Promise<Verse[]> {
    return prisma.verse.findMany({
        where: { bookId, chapter },
        orderBy: { verse: 'asc' },
    });
}

export async function searchVerses(query: string, limit: number = 100): Promise<Verse[]> {
    const lowerQuery = query.toLowerCase();

    // PostgreSQL full-text search or JSONB contains
    // For now, use a simpler approach with raw query
    const verses = await prisma.verse.findMany({
        where: {
            OR: [
                { hebrewText: { contains: query, mode: 'insensitive' } },
                { greekText: { contains: query, mode: 'insensitive' } },
                // JSONB search for translations
                {
                    translations: {
                        path: ['kjv'],
                        string_contains: lowerQuery,
                    },
                },
                {
                    translations: {
                        path: ['web'],
                        string_contains: lowerQuery,
                    },
                },
            ],
        },
        take: limit,
        orderBy: [{ bookId: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    });

    return verses;
}

// ============================================
// LEXICON OPERATIONS
// ============================================

export async function getStrongsEntry(strongNumber: string): Promise<LexiconEntry | null> {
    const normalized = normalizeStrongsNumber(strongNumber);
    return prisma.lexiconEntry.findUnique({
        where: { strongNumber: normalized },
    });
}

export async function searchStrongs(query: string, limit: number = 100): Promise<LexiconEntry[]> {
    const stripNikkud = (str: string) => str.replace(/[\u0591-\u05C7]/g, '');
    const cleanQuery = stripNikkud(query);

    return prisma.lexiconEntry.findMany({
        where: {
            OR: [
                { lemma: { contains: cleanQuery, mode: 'insensitive' } },
                { strongNumber: { contains: query.toUpperCase() } },
                { gloss: { contains: query, mode: 'insensitive' } },
                { rootWord: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: limit,
    });
}

export async function getAllStrongsEntries(): Promise<LexiconEntry[]> {
    return prisma.lexiconEntry.findMany();
}

// ============================================
// USER OPERATIONS
// ============================================

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(data: {
    email: string;
    displayName?: string;
    passwordHash?: string;
    authProvider?: string;
    providerId?: string;
}): Promise<User> {
    return prisma.user.create({
        data,
    });
}

export async function updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<User> {
    return prisma.user.update({
        where: { id: userId },
        data: { preferences },
    });
}

// ============================================
// ANNOTATION OPERATIONS
// ============================================

export async function getUserAnnotations(userId: string): Promise<Annotation[]> {
    return prisma.annotation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getVerseAnnotations(verseId: number, visibility?: 'private' | 'shared' | 'public'): Promise<Annotation[]> {
    return prisma.annotation.findMany({
        where: {
            verseId,
            ...(visibility && { visibility }),
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createAnnotation(data: {
    userId: string;
    verseId: number;
    selection?: string;
    note?: string;
    highlight?: string;
    visibility?: string;
    tags?: string[];
}): Promise<Annotation> {
    return prisma.annotation.create({
        data: {
            userId: data.userId,
            verseId: data.verseId,
            selection: data.selection,
            note: data.note,
            highlight: data.highlight,
            visibility: data.visibility || 'private',
            tags: data.tags || [],
        },
    });
}

export async function deleteAnnotation(id: string, userId: string): Promise<boolean> {
    try {
        await prisma.annotation.deleteMany({
            where: { id, userId },
        });
        return true;
    } catch {
        return false;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function normalizeStrongsNumber(input: string): string {
    const trimmed = (input || '').trim().toUpperCase();
    if (!trimmed) return trimmed;

    const first = trimmed[0];
    const hasPrefix = first === 'H' || first === 'G' || first === 'A';
    const prefix = hasPrefix ? first : 'H';
    const rawDigits = (hasPrefix ? trimmed.slice(1) : trimmed).replace(/\D/g, '');

    if (!rawDigits) return trimmed;

    if (prefix === 'G') {
        const n = parseInt(rawDigits, 10);
        if (Number.isNaN(n)) return trimmed;
        return `G${n}`;
    }

    return `${prefix}${rawDigits.padStart(4, '0')}`;
}

// ============================================
// DATABASE HEALTH CHECK
// ============================================

export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
}
