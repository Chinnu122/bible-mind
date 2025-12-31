/**
 * App Update Routes
 * 
 * Provides version checking and APK download for in-app auto-updates.
 * 
 * Endpoints:
 * - GET /api/update/check - Check for new version
 * - GET /api/update/download - Download latest APK
 */

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Current app version (update this when releasing new versions)
const CURRENT_VERSION = '2.13.0';
const VERSION_CODE = 2130;

// APK file location (can be stored on server or cloud storage)
const APK_DIRECTORY = process.env.APK_DIRECTORY || path.join(__dirname, '../../public/updates');
const APK_FILENAME = 'bible-mind-latest.apk';

// Release notes for current version
const RELEASE_NOTES = `
## What's New in ${CURRENT_VERSION}
- 📖 Complete offline Bible support (52MB)
- ⚡ Holiday background removed for better performance
- 🚀 Particles disabled by default
- 📱 Auto-update popup notifications
- 🎨 Smoother animations and transitions
- 🐛 Bug fixes and stability improvements
`;

/**
 * GET /check - Check for app updates
 */
router.get('/check', (req: Request, res: Response) => {
    const clientVersion = req.query.version as string;
    const clientVersionCode = parseInt(req.query.versionCode as string) || 0;

    // Determine if update is available
    const updateAvailable = clientVersionCode < VERSION_CODE;
    const forceUpdate = clientVersionCode < 200; // Force update if below v2.0.0

    // Check if APK exists
    const apkPath = path.join(APK_DIRECTORY, APK_FILENAME);
    const apkExists = fs.existsSync(apkPath);

    let apkSize = 0;
    if (apkExists) {
        const stats = fs.statSync(apkPath);
        apkSize = stats.size;
    }

    res.json({
        success: true,
        data: {
            updateAvailable,
            forceUpdate,
            currentVersion: CURRENT_VERSION,
            versionCode: VERSION_CODE,
            clientVersion: clientVersion || 'unknown',
            clientVersionCode,
            releaseNotes: RELEASE_NOTES.trim(),
            apkSize,
            downloadUrl: updateAvailable && apkExists
                ? `/api/update/download`
                : null,
            publishedAt: new Date().toISOString(),
        },
    });
});

/**
 * GET /download - Download latest APK
 */
router.get('/download', (req: Request, res: Response) => {
    const apkPath = path.join(APK_DIRECTORY, APK_FILENAME);

    if (!fs.existsSync(apkPath)) {
        return res.status(404).json({
            success: false,
            error: 'APK file not found. Please try again later.',
        });
    }

    // Set headers for APK download
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${APK_FILENAME}"`);

    // Stream the file
    const fileStream = fs.createReadStream(apkPath);
    fileStream.pipe(res);
});

/**
 * GET /latest - Get latest version info (public)
 */
router.get('/latest', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            version: CURRENT_VERSION,
            versionCode: VERSION_CODE,
            releaseNotes: RELEASE_NOTES.trim(),
            minSupportedVersion: '2.0.0',
            minSupportedVersionCode: 200,
        },
    });
});

export default router;
