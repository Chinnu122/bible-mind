import { Router, Request, Response } from 'express';

const router = Router();

// Current app version info
const APP_VERSION = {
    version: "2.9.1",
    versionCode: 291,
    minVersion: "2.0.0",
    releaseDate: "2025-12-31",
    releaseNotes: [
        "Performance optimizations",
        "Hardware acceleration enabled",
        "Smoother animations",
        "Bug fixes and improvements"
    ],
    apkUrl: "https://github.com/Chinnu122/Bible-Mind/releases/latest/download/bible-mind.apk",
    forceUpdate: false
};

// GET /api/version - Get current app version info
router.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: APP_VERSION
    });
});

// GET /api/version/check - Check if update is available
router.get('/check', (req: Request, res: Response) => {
    const clientVersion = req.query.version as string;

    if (!clientVersion) {
        return res.status(400).json({
            success: false,
            error: 'Version parameter required'
        });
    }

    const clientParts = clientVersion.split('.').map(Number);
    const serverParts = APP_VERSION.version.split('.').map(Number);

    // Compare versions
    let updateAvailable = false;
    for (let i = 0; i < 3; i++) {
        if (serverParts[i] > (clientParts[i] || 0)) {
            updateAvailable = true;
            break;
        } else if (serverParts[i] < (clientParts[i] || 0)) {
            break;
        }
    }

    // Check if force update needed (client below minimum)
    const minParts = APP_VERSION.minVersion.split('.').map(Number);
    let forceUpdate = false;
    for (let i = 0; i < 3; i++) {
        if (minParts[i] > (clientParts[i] || 0)) {
            forceUpdate = true;
            break;
        } else if (minParts[i] < (clientParts[i] || 0)) {
            break;
        }
    }

    res.json({
        success: true,
        data: {
            updateAvailable,
            forceUpdate,
            currentVersion: clientVersion,
            latestVersion: APP_VERSION.version,
            releaseNotes: updateAvailable ? APP_VERSION.releaseNotes : [],
            apkUrl: updateAvailable ? APP_VERSION.apkUrl : null
        }
    });
});

export default router;
