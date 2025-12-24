import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';

const router = Router();
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ============ SECURITY: Rate Limiting ============
// Limit login attempts to prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        error: 'Too many login attempts. Please try again in 15 minutes.',
        code: 'RATE_LIMITED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limit registration to prevent spam
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
    message: {
        success: false,
        error: 'Too many registration attempts. Please try again later.',
        code: 'RATE_LIMITED'
    }
});

// ============ SECURITY: Password Validation ============
function validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: 'Password is strong' };
}

// ============ SECURITY: Input Sanitization ============
function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim().replace(/[<>]/g, '');
}

function sanitizeName(name: string): string {
    return name.trim().replace(/[<>\\\/]/g, '').substring(0, 100);
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface User {
    id: string;
    email: string;
    password: string; // Hashed
    name: string;
    createdAt: string;
    lastLoginAt?: string;
    failedAttempts?: number;
}

function loadUsers(): User[] {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch { return []; }
}

function saveUsers(users: User[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ============ ROUTES ============

// Register (with rate limiting and password validation)
router.post('/register', registerLimiter, async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ success: false, error: 'Invalid email format' });
        return;
    }

    // Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
        res.status(400).json({ success: false, error: passwordCheck.message });
        return;
    }

    const users = loadUsers();
    const sanitizedEmail = sanitizeEmail(email);

    // Check if email already exists
    if (users.find(u => u.email === sanitizedEmail)) {
        res.status(400).json({ success: false, error: 'Email already registered' });
        return;
    }

    // Hash password with strong salt
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizeName(name || email.split('@')[0]),
        createdAt: new Date().toISOString(),
        failedAttempts: 0
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
        success: true,
        data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        },
        message: 'Account created successfully'
    });
});

// Login (with rate limiting)
router.post('/login', authLimiter, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
    }

    const users = loadUsers();
    const sanitizedEmail = sanitizeEmail(email);
    const user = users.find(u => u.email === sanitizedEmail);

    if (!user) {
        // Don't reveal whether email exists
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        // Track failed attempts
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        saveUsers(users);
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
    }

    // Reset failed attempts on successful login
    user.failedAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);

    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            name: user.name
        },
        message: 'Login successful'
    });
});

// Get user profile (simple validation)
router.get('/profile/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;

    // Validate userId format
    if (!userId || userId.length < 5 || userId.length > 50) {
        res.status(400).json({ success: false, error: 'Invalid user ID' });
        return;
    }

    const users = loadUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        }
    });
});

// Password strength check endpoint
router.post('/check-password', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ success: false, error: 'Password is required' });
        return;
    }
    const result = validatePassword(password);
    res.json({ success: true, ...result });
});

export default router;

