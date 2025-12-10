import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const router = Router();
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

// Register
router.post('/register', async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
    }

    const users = loadUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        res.status(400).json({ success: false, error: 'Email already registered' });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
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

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
    }

    const users = loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
    }

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

export default router;
