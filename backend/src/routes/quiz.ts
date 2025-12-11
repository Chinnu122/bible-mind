import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

const router = Router();

interface Question {
    dayOfYear: number;
    questionId: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    reference: string;
}

// Load questions from CSV file
function loadQuestions(): Question[] {
    try {
        const csvPath = join(__dirname, '../../data/daily_quiz.csv');
        const csvContent = readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });

        return records.map((row: any) => ({
            dayOfYear: parseInt(row.dayOfYear),
            questionId: parseInt(row.questionId),
            question: row.question,
            options: [row.option1, row.option2, row.option3, row.option4],
            correctAnswer: parseInt(row.correctAnswer),
            reference: row.reference
        }));
    } catch (error) {
        console.error('Failed to load quiz CSV:', error);
        // Return fallback questions
        return [
            {
                dayOfYear: 1,
                questionId: 1,
                question: "Who was the first man created by God?",
                options: ["Adam", "Eve", "Cain", "Abel"],
                correctAnswer: 0,
                reference: "Genesis 1:27"
            }
        ];
    }
}

let questions: Question[] = loadQuestions();

// Get the current day of year (1-365)
function getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Get 20 questions for today
router.get('/today', (req: Request, res: Response) => {
    const dayOfYear = getDayOfYear();
    // Cycle through available days
    const maxDay = Math.max(...questions.map(q => q.dayOfYear));
    const effectiveDay = ((dayOfYear - 1) % maxDay) + 1;

    const todayQuestions = questions.filter(q => q.dayOfYear === effectiveDay);

    // If no questions for this day, get day 1
    const selectedQuestions = todayQuestions.length > 0 ? todayQuestions : questions.filter(q => q.dayOfYear === 1);

    res.json({
        success: true,
        dayOfYear: effectiveDay,
        totalQuestions: selectedQuestions.length,
        data: selectedQuestions.map(q => ({
            ...q,
            // Don't reveal correct answer in response
        }))
    });
});

// Get a single question (for backward compatibility)
router.get('/today/single', (req: Request, res: Response) => {
    const dayOfYear = getDayOfYear();
    const maxDay = Math.max(...questions.map(q => q.dayOfYear));
    const effectiveDay = ((dayOfYear - 1) % maxDay) + 1;

    const todayQuestions = questions.filter(q => q.dayOfYear === effectiveDay);
    const selectedQuestions = todayQuestions.length > 0 ? todayQuestions : questions.filter(q => q.dayOfYear === 1);

    // Return first question of the day
    res.json({
        success: true,
        data: selectedQuestions[0]
    });
});

router.post('/check', (req: Request, res: Response) => {
    const { questionId, answerIndex } = req.body;
    const question = questions.find(q => q.questionId === questionId);

    if (!question) {
        res.status(404).json({ success: false, error: 'Question not found' });
        return;
    }

    const isCorrect = question.correctAnswer === answerIndex;
    res.json({
        success: true,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        reference: question.reference
    });
});

// Reload questions (admin endpoint)
router.post('/reload', (req: Request, res: Response) => {
    questions = loadQuestions();
    res.json({ success: true, message: 'Questions reloaded', count: questions.length });
});

export default router;
