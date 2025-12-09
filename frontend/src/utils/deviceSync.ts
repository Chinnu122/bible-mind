// Device-linked notes utility
// Generates unique device ID and syncs notes across devices via shareable links

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generate or retrieve device ID
export function getDeviceId(): string {
    let deviceId = localStorage.getItem('bible-mind-device-id');

    if (!deviceId) {
        // Generate UUID v4
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem('bible-mind-device-id', deviceId);
    }

    return deviceId;
}

// Check URL for shared device ID and import notes
export async function checkAndImportSharedNotes(): Promise<boolean> {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedDeviceId = urlParams.get('sharedFrom');

    if (sharedDeviceId) {
        try {
            // Fetch notes from the shared device
            const response = await fetch(`${API_BASE}/device-notes/${sharedDeviceId}`);
            const data = await response.json();

            if (data.success && data.data && Object.keys(data.data).length > 0) {
                // Merge with existing notes
                const existingNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}');
                const mergedNotes = { ...existingNotes, ...data.data };
                localStorage.setItem('bible-notes', JSON.stringify(mergedNotes));

                // Clean up URL
                const url = new URL(window.location.href);
                url.searchParams.delete('sharedFrom');
                window.history.replaceState({}, '', url.toString());

                return true; // Notes imported
            }
        } catch (error) {
            console.error('Failed to import shared notes:', error);
        }
    }

    return false; // No notes imported
}

// Save notes to server for device
export async function syncNotesToServer(): Promise<boolean> {
    const deviceId = getDeviceId();
    const notes = localStorage.getItem('bible-notes');

    if (!notes) return false;

    try {
        const response = await fetch(`${API_BASE}/device-notes/${deviceId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: JSON.parse(notes) })
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Failed to sync notes:', error);
        return false;
    }
}

// Generate shareable link
export function generateShareableLink(): string {
    const deviceId = getDeviceId();
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?sharedFrom=${deviceId}`;
}

// Copy link to clipboard
export async function copyShareableLink(): Promise<boolean> {
    // First sync notes to server
    await syncNotesToServer();

    const link = generateShareableLink();

    try {
        await navigator.clipboard.writeText(link);
        return true;
    } catch (error) {
        console.error('Failed to copy link:', error);
        return false;
    }
}
