import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sendReviewNotification } from '../services/emailService';

const router = Router();
const DATA_DIR = path.join(__dirname, '../../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Review {
    id: string;
    userId?: string;
    authorName: string;
    content: string;
    rating?: number;
    type: 'review' | 'idea';
    createdAt: string;
}

function loadReviews(): Review[] {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));
    } catch { return []; }
}

function saveReviews(reviews: Review[]) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// GET all reviews/ideas
router.get('/', (_req: Request, res: Response) => {
    const reviews = loadReviews();
    res.json({
        success: true,
        data: reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
});

// POST a new review/idea
router.post('/', async (req: Request, res: Response) => {
    const { userId, authorName, content, rating, type } = req.body;

    if (!content) {
        res.status(400).json({ success: false, error: 'Content is required' });
        return;
    }

    const reviews = loadReviews();
    const newReview: Review = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        userId,
        authorName: authorName || 'Anonymous',
        content,
        rating,
        type: type || 'idea',
        createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    saveReviews(reviews);

    // Send email notification (async, don't block response)
    sendReviewNotification({
        authorName: newReview.authorName,
        content: newReview.content,
        type: newReview.type,
        submittedAt: newReview.createdAt
    }).catch(err => console.error('Email notification failed:', err));

    res.status(201).json({
        success: true,
        data: newReview,
        message: 'Review submitted successfully'
    });
});

export default router;
