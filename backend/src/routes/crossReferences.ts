import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

type CrossRef = {
    bookId: number;
    bookName: string;
    chapter: number;
    verse: number;
    reference: string;
    score: number;
};

const STOP_WORDS = new Set([
    'the', 'and', 'for', 'that', 'with', 'you', 'your', 'yours', 'their', 'theirs', 'his', 'her', 'hers',
    'our', 'ours', 'they', 'them', 'then', 'than', 'this', 'these', 'those', 'from', 'into', 'unto', 'upon',
    'over', 'under', 'above', 'below', 'about', 'after', 'before', 'again', 'also', 'only', 'even', 'very',
    'shall', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'cannot', 'not', 'nor', 'no', 'yes',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'in', 'on', 'at', 'to', 'of', 'a', 'an', 'as', 'it', 'its', 'he', 'she', 'we', 'i', 'me', 'my',
    'there', 'here', 'where', 'when', 'what', 'who', 'whom', 'which', 'why', 'how',
    'say', 'said', 'says', 'let', 'let\'s', 'come', 'came', 'go', 'went', 'gone',
]);

function normalizeToken(token: string): string {
    return token
        .toLowerCase()
        .replace(/[^a-z0-9']/g, '')
        .replace(/^'+|'+$/g, '');
}

function tokenize(text: string): string[] {
    if (!text) return [];
    const rawTokens = text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[^a-zA-Z0-9'\s]/g, ' ')
        .split(/\s+/)
        .map(normalizeToken)
        .filter(Boolean);

    const tokens: string[] = [];
    for (const token of rawTokens) {
        if (token.length < 3) continue;
        if (STOP_WORDS.has(token)) continue;
        if (/^\d+$/.test(token)) continue;
        tokens.push(token);
    }
    return tokens;
}

let indexBuilt = false;
let verseTokenSets: Map<string, Set<string>> = new Map();
let tokenToVerseKeys: Map<string, Set<string>> = new Map();

function buildIndexIfNeeded() {
    if (indexBuilt) return;
    const verses = dataStore.getAllVerses();

    for (const verse of verses) {
        const key = `${verse.bookId}-${verse.chapter}-${verse.verse}`;
        const baseText = verse.kjvText || verse.webText || '';
        const tokens = tokenize(baseText);

        // Limit tokens per verse for index size (keep distinct + longer words first)
        const unique = Array.from(new Set(tokens)).sort((a, b) => b.length - a.length).slice(0, 18);
        const tokenSet = new Set(unique);
        verseTokenSets.set(key, tokenSet);

        for (const token of tokenSet) {
            let bucket = tokenToVerseKeys.get(token);
            if (!bucket) {
                bucket = new Set();
                tokenToVerseKeys.set(token, bucket);
            }
            bucket.add(key);
        }
    }

    indexBuilt = true;
}

function getVerseKey(bookId: number, chapter: number, verse: number) {
    return `${bookId}-${chapter}-${verse}`;
}

/**
 * GET /api/cross-references/:bookId/:chapter/:verse?limit=8
 * Returns a computed list of cross references based on token overlap.
 */
router.get('/:bookId/:chapter/:verse', (req: Request, res: Response) => {
    try {
        const bookId = parseInt(req.params.bookId);
        const chapter = parseInt(req.params.chapter);
        const verseNum = parseInt(req.params.verse);
        const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '8'), 1), 20);

        if ([bookId, chapter, verseNum].some(n => Number.isNaN(n))) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters',
                code: 400
            });
            return;
        }

        const verse = dataStore.getVerse(bookId, chapter, verseNum);
        if (!verse) {
            res.status(404).json({
                success: false,
                error: 'Verse not found',
                code: 404
            });
            return;
        }

        buildIndexIfNeeded();

        const selfKey = getVerseKey(bookId, chapter, verseNum);
        const baseTokens = verseTokenSets.get(selfKey) || new Set(tokenize(verse.kjvText || verse.webText || ''));

        // Candidate set: union of postings for each token
        const candidateKeys = new Set<string>();
        for (const token of baseTokens) {
            const postings = tokenToVerseKeys.get(token);
            if (!postings) continue;
            for (const k of postings) candidateKeys.add(k);
        }
        candidateKeys.delete(selfKey);

        const results: CrossRef[] = [];
        for (const candidateKey of candidateKeys) {
            const candidateTokens = verseTokenSets.get(candidateKey);
            if (!candidateTokens) continue;

            let overlap = 0;
            for (const token of baseTokens) {
                if (candidateTokens.has(token)) overlap++;
            }

            if (overlap < 2) continue; // minimum signal

            const [cBookIdStr, cChapterStr, cVerseStr] = candidateKey.split('-');
            const cBookId = parseInt(cBookIdStr);
            const cChapter = parseInt(cChapterStr);
            const cVerse = parseInt(cVerseStr);

            const candidateVerse = dataStore.getVerse(cBookId, cChapter, cVerse);
            if (!candidateVerse) continue;

            const candidateBook = dataStore.getBook(cBookId);
            const ref = `${candidateBook?.bookName || candidateVerse.bookName} ${cChapter}:${cVerse}`;

            // Small boost for same testament / same book proximity
            const bookBoost = cBookId === bookId ? 0.75 : 0;
            const score = overlap + bookBoost;

            results.push({
                bookId: cBookId,
                bookName: candidateBook?.bookName || candidateVerse.bookName,
                chapter: cChapter,
                verse: cVerse,
                reference: ref,
                score
            });
        }

        results.sort((a, b) => b.score - a.score);

        res.json({
            success: true,
            data: {
                sourceVerse: {
                    bookId,
                    chapter,
                    verse: verseNum,
                    reference: `${verse.bookName} ${chapter}:${verseNum}`
                },
                crossReferences: results.slice(0, limit)
            }
        });
    } catch (error: any) {
        console.error('Cross references error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to compute cross references',
            code: 500
        });
    }
});

export default router;
