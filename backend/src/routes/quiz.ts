import { Router, Request, Response } from 'express';

const router = Router();

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    reference: string;
}

// A larger pool of questions would be better, but we'll start with a few
const questions: Question[] = [
    {
        id: 1,
        question: "Who was the first man created by God?",
        options: ["Adam", "Eve", "Cain", "Abel"],
        correctAnswer: 0,
        reference: "Genesis 1:27"
    },
    {
        id: 2,
        question: "What is the longest book in the Bible?",
        options: ["Isaiah", "Genesis", "Psalms", "Matthew"],
        correctAnswer: 2,
        reference: "Psalms"
    },
    {
        id: 3,
        question: "Who built the ark?",
        options: ["Moses", "Abraham", "Noah", "David"],
        correctAnswer: 2,
        reference: "Genesis 6"
    },
    {
        id: 4,
        question: "Who killed Goliath?",
        options: ["Saul", "Jonathan", "David", "Samson"],
        correctAnswer: 2,
        reference: "1 Samuel 17"
    },
    {
        id: 5,
        question: "How many disciples did Jesus have?",
        options: ["10", "12", "7", "3"],
        correctAnswer: 1,
        reference: "Matthew 10:1"
    }
];

// Get question for the day based on date
router.get('/today', (req: Request, res: Response) => {
    // Simple rotation based on day of year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const questionIndex = dayOfYear % questions.length;

    // Don't send correct answer to client immediately if we want to be secure, 
    // but for a simple app sending it and checking on client is easier for immediate feedback
    // Let's send it but maybe scramble? No, keep it simple.

    res.json({
        success: true,
        data: questions[questionIndex]
    });
});

router.post('/check', (req: Request, res: Response) => {
    const { questionId, answerIndex } = req.body;
    const question = questions.find(q => q.id === questionId);

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

export default router;
