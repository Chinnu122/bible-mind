/**
 * AI Content Routes
 * 
 * These routes implement "generate once, cache forever" pattern:
 * 1. Check database for existing cached content
 * 2. If found → return cached data
 * 3. If not found → call AI API → save to database → return data
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    generateInterlinear,
    generateBibleStudy,
    generateKidStory,
    generateQuiz,
    generateRiddle,
    hashRiddle,
    InterlinearData,
    BibleStudyData,
    KidStory,
    PuzzleGame,
    BibleRiddle
} from '../services/openrouterService';

const router = Router();
const prisma = new PrismaClient();

// ============================================
// INTERLINEAR ANALYSIS
// ============================================

/**
 * GET /ai/interlinear/:book/:chapter
 * Get or generate interlinear word-by-word analysis for a chapter
 */
router.get('/interlinear/:book/:chapter', async (req: Request, res: Response) => {
    try {
        const { book, chapter } = req.params;
        const chapterNum = parseInt(chapter);

        if (!book || isNaN(chapterNum) || chapterNum < 1) {
            return res.status(400).json({
                success: false,
                error: 'Valid book name and chapter number required'
            });
        }

        // Check database cache first
        const cached = await prisma.aIInterlinear.findUnique({
            where: { book_chapter: { book, chapter: chapterNum } }
        });

        if (cached) {
            console.log(`[AI] Interlinear cache HIT: ${book} ${chapterNum}`);
            return res.json({
                success: true,
                cached: true,
                data: cached.data as unknown as InterlinearData
            });
        }

        // Not cached - generate new
        console.log(`[AI] Interlinear cache MISS: ${book} ${chapterNum} - generating...`);
        const data = await generateInterlinear(book, chapterNum);

        // Save to database
        await prisma.aIInterlinear.create({
            data: {
                book,
                chapter: chapterNum,
                language: data.language,
                data: data as any
            }
        });

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Interlinear error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get interlinear data'
        });
    }
});

// ============================================
// BIBLE STUDY
// ============================================

/**
 * GET /ai/study/:topic
 * Get or generate bible study guide for a topic
 */
router.get('/study/:topic', async (req: Request, res: Response) => {
    try {
        const { topic } = req.params;

        if (!topic || topic.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Topic must be at least 2 characters'
            });
        }

        const normalizedTopic = topic.trim().toLowerCase();

        // Check database cache first
        const cached = await prisma.aIBibleStudy.findUnique({
            where: { topic: normalizedTopic }
        });

        if (cached) {
            console.log(`[AI] Bible study cache HIT: ${normalizedTopic}`);
            return res.json({
                success: true,
                cached: true,
                data: cached.data as unknown as BibleStudyData
            });
        }

        // Not cached - generate new
        console.log(`[AI] Bible study cache MISS: ${normalizedTopic} - generating...`);
        const data = await generateBibleStudy(topic);

        // Save to database
        await prisma.aIBibleStudy.create({
            data: {
                topic: normalizedTopic,
                data: data as any
            }
        });

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Bible study error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get bible study'
        });
    }
});

// ============================================
// KIDS STORY
// ============================================

/**
 * GET /ai/kids-story/:character
 * Get or generate a kids story for a Bible character
 */
router.get('/kids-story/:character', async (req: Request, res: Response) => {
    try {
        const { character } = req.params;

        if (!character || character.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Character name required'
            });
        }

        const normalizedChar = character.trim().toLowerCase();

        // Check database cache first
        const cached = await prisma.aIKidsStory.findUnique({
            where: { character: normalizedChar }
        });

        if (cached) {
            console.log(`[AI] Kids story cache HIT: ${normalizedChar}`);
            return res.json({
                success: true,
                cached: true,
                data: cached.data as unknown as KidStory
            });
        }

        // Not cached - generate new
        console.log(`[AI] Kids story cache MISS: ${normalizedChar} - generating...`);
        const data = await generateKidStory(character);

        // Save to database
        await prisma.aIKidsStory.create({
            data: {
                character: normalizedChar,
                data: data as any
            }
        });

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Kids story error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get kids story'
        });
    }
});

// ============================================
// QUIZ / PUZZLES
// ============================================

/**
 * Helper function for quiz logic
 */
async function handleQuizRequest(providedTopic: string | undefined, res: Response) {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const quizTopic = providedTopic || `daily-${today}`;

        // Check database cache first
        const cached = await prisma.aIQuiz.findUnique({
            where: { topic: quizTopic }
        });

        if (cached) {
            console.log(`[AI] Quiz cache HIT: ${quizTopic}`);
            return res.json({
                success: true,
                cached: true,
                data: cached.data as unknown as PuzzleGame
            });
        }

        // Not cached - generate new
        console.log(`[AI] Quiz cache MISS: ${quizTopic} - generating...`);
        const data = await generateQuiz(providedTopic || undefined);

        // Save to database
        await prisma.aIQuiz.create({
            data: {
                topic: quizTopic,
                data: data as any
            }
        });

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Quiz error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get quiz'
        });
    }
}

/**
 * GET /ai/quiz - Get daily quiz
 */
router.get('/quiz', async (req: Request, res: Response) => {
    return handleQuizRequest(undefined, res);
});

/**
 * GET /ai/quiz/:topic - Get quiz for specific topic
 */
router.get('/quiz/:topic', async (req: Request, res: Response) => {
    return handleQuizRequest(req.params.topic, res);
});

// ============================================
// RIDDLE / MIND GAME
// ============================================

/**
 * GET /ai/riddle
 * Get a random riddle (from cache or generate new)
 */
router.get('/riddle', async (req: Request, res: Response) => {
    try {
        // First, check if we have any cached riddles
        const cachedCount = await prisma.aIRiddle.count();

        // If we have enough riddles, return a random one
        if (cachedCount >= 10) {
            const randomOffset = Math.floor(Math.random() * cachedCount);
            const cached = await prisma.aIRiddle.findFirst({
                skip: randomOffset
            });

            if (cached) {
                console.log(`[AI] Riddle from cache (${cachedCount} total)`);
                return res.json({
                    success: true,
                    cached: true,
                    data: cached.data as unknown as BibleRiddle
                });
            }
        }

        // Generate new riddle
        console.log(`[AI] Generating new riddle...`);
        const data = await generateRiddle();

        // Save to database with hash for uniqueness
        const riddleHash = hashRiddle(data.riddle);

        // Check if this exact riddle exists
        const existing = await prisma.aIRiddle.findUnique({
            where: { riddleHash }
        });

        if (!existing) {
            await prisma.aIRiddle.create({
                data: {
                    riddleHash,
                    data: data as any
                }
            });
        }

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Riddle error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get riddle'
        });
    }
});

/**
 * GET /ai/riddle/new
 * Force generate a new riddle (always generates, adds to cache)
 */
router.get('/riddle/new', async (req: Request, res: Response) => {
    try {
        console.log(`[AI] Force generating new riddle...`);
        const data = await generateRiddle();

        // Save to database
        const riddleHash = hashRiddle(data.riddle);

        const existing = await prisma.aIRiddle.findUnique({
            where: { riddleHash }
        });

        if (!existing) {
            await prisma.aIRiddle.create({
                data: {
                    riddleHash,
                    data: data as any
                }
            });
        }

        return res.json({
            success: true,
            cached: false,
            data
        });
    } catch (error: any) {
        console.error('Riddle generation error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate riddle'
        });
    }
});

// ============================================
// CACHE STATS (Admin)
// ============================================

/**
 * GET /ai/stats
 * Get AI content cache statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const [interlinear, studies, stories, quizzes, riddles] = await Promise.all([
            prisma.aIInterlinear.count(),
            prisma.aIBibleStudy.count(),
            prisma.aIKidsStory.count(),
            prisma.aIQuiz.count(),
            prisma.aIRiddle.count()
        ]);

        return res.json({
            success: true,
            data: {
                interlinear,
                studies,
                stories,
                quizzes,
                riddles,
                total: interlinear + studies + stories + quizzes + riddles
            }
        });
    } catch (error: any) {
        console.error('Stats error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get stats'
        });
    }
});

export default router;
