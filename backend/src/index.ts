import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { dataStore } from './services/dataStore';
import { initCronJobs, triggerImageGen } from './cronJobs';

import booksRouter from './routes/books';
import versesRouter from './routes/verses';
import strongsRouter from './routes/strongs';
import searchRouter from './routes/search';
import v2SearchRouter from './routes/searchRoutes';
import languagesRouter from './routes/languages';
import downloadRouter from './routes/download';
import notesRouter from './routes/notes';
import teluguRouter from './routes/telugu';
import noteSyncRouter from './routes/noteSync';
import characterOfDayRouter from './routes/characterOfDay';
import reviewsRouter from './routes/reviews';
import quizRouter from './routes/quiz';
import authRouter from './routes/auth';
import dailyVerseRouter from './routes/dailyVerse';
import exportRouter from './routes/export';
import aiRouter from './routes/ai';
import v2AuthRouter from './routes/authRoutesV2';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(express.json());

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Info
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Bible Mind API',
    version: '1.0.0',
    description: 'Advanced Bible API with Hebrew & Greek meanings',
    endpoints: {
      books: '/api/books',
      verses: '/api/verses/:book/:chapter/:verse',
      strongs: '/api/strongs/:number',
      search: '/api/search?q=query',
      languages: '/api/languages',
      download: '/api/download',
      notes: '/api/notes/:userId',
      telugu: '/api/telugu',
      characterOfDay: '/api/character-of-day',
      reviews: '/api/reviews',
      quiz: '/api/quiz',
      auth: '/api/auth',
      gallery: '/api/gallery'
    }
  });
});

// Standard Routes
app.use('/api/books', booksRouter);
app.use('/api/verses', versesRouter);
app.use('/api/strongs', strongsRouter);
app.use('/api/search', searchRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/download', downloadRouter);
app.use('/api/notes', notesRouter);
app.use('/api/telugu', teluguRouter);
app.use('/api/device-notes', noteSyncRouter);
app.use('/api/character-of-day', characterOfDayRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/auth', authRouter);
app.use('/api/daily-verse', dailyVerseRouter);
app.use('/api/export', exportRouter);
app.use('/api/ai', aiRouter);
app.use('/api/v2/search', v2SearchRouter); // ElasticSearch-powered advanced search
app.use('/api/v2/auth', v2AuthRouter); // OAuth + JWT authentication

// Serve generated images statically
app.use('/generated_images', express.static(path.join(__dirname, '../public/generated_images')));

// Gallery API - List generated images
app.get('/api/gallery', (_req: Request, res: Response) => {
  const imagesDir = path.join(__dirname, '../public/generated_images');

  if (!fs.existsSync(imagesDir)) {
    return res.json([]);
  }

  fs.readdir(imagesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to list images' });

    // Filter image files and add full URL path
    const images = files
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/generated_images/${file}`,
        timestamp: fs.statSync(path.join(imagesDir, file)).mtime
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(images);
  });
});

// Gallery API - Trigger manual generation (Dev/Admin)
app.post('/api/gallery/generate', async (_req: Request, res: Response) => {
  try {
    const url = await triggerImageGen();
    res.json({ success: true, url });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 404 handler (MUST be after all routes)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 404
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 500
  });
});

// Start server
async function startServer() {
  try {
    await dataStore.loadAllData();
    initCronJobs(); // Start background jobs

    app.listen(PORT, () => {
      console.log(`📖 Bible Mind API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

