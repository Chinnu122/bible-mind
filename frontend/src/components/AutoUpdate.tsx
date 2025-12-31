import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface UpdateInfo {
    updateAvailable: boolean;
    forceUpdate: boolean;
    currentVersion: string;
    versionCode: number;
    releaseNotes: string;
    downloadUrl: string | null;
}

const APP_VERSION = '2.9.0';
const VERSION_CODE = 290;

// API base URL - adjust for production
const API_BASE = import.meta.env.PROD
    ? 'https://bible-mind-api.onrender.com'
    : 'http://localhost:3001';

export default function AutoUpdate() {
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkForUpdates();
    }, []);

    const checkForUpdates = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/api/update/check?version=${APP_VERSION}&versionCode=${VERSION_CODE}`
            );
            const data = await response.json();

            if (data.success && data.data.updateAvailable) {
                setUpdateInfo(data.data);
                setShowModal(true);
            }
        } catch (err) {
            console.log('Update check failed:', err);
            // Silently fail - don't block the app
        }
    };

    const handleDownload = async () => {
        if (!updateInfo?.downloadUrl) {
            setError('Download URL not available');
            return;
        }

        setDownloading(true);
        setError(null);

        try {
            // Open download URL in new tab (for web)
            // On Android, this will trigger the APK download
            window.open(`${API_BASE}${updateInfo.downloadUrl}`, '_blank');

            // For Capacitor, we could use the App plugin to handle the download
            // and installation, but for now we'll use a simple redirect

            setTimeout(() => {
                setDownloading(false);
                if (!updateInfo.forceUpdate) {
                    setShowModal(false);
                }
            }, 2000);
        } catch (err) {
            setError('Download failed. Please try again.');
            setDownloading(false);
        }
    };

    if (!showModal || !updateInfo) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-2xl p-6 max-w-md w-full border border-gold/20 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Update Available</h2>
                            <p className="text-sm text-gray-400">v{updateInfo.currentVersion}</p>
                        </div>
                    </div>
                    {!updateInfo.forceUpdate && (
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Release Notes */}
                <div className="bg-black/30 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
                    <h3 className="text-gold text-sm font-semibold mb-2">What's New:</h3>
                    <div className="text-gray-300 text-sm whitespace-pre-line">
                        {updateInfo.releaseNotes}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Force Update Warning */}
                {updateInfo.forceUpdate && (
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mb-4 text-amber-400 text-sm">
                        ⚠️ This update is required to continue using the app.
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    {!updateInfo.forceUpdate && (
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            Later
                        </button>
                    )}
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${downloading
                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gold to-amber-600 text-black hover:opacity-90'
                            }`}
                    >
                        {downloading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Update Now
                            </>
                        )}
                    </button>
                </div>

                {/* Current Version */}
                <p className="text-center text-xs text-gray-500 mt-4">
                    Currently installed: v{APP_VERSION}
                </p>
            </div>
        </div>
    );
}
