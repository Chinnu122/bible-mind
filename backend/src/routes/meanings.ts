import { Router, Request, Response } from 'express';
import { searchLexicon } from '../services/searchService';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/meanings/:word
 * Get meaning for a specific word (English, Telugu, or Strong's Number)
 */
router.get('/:word', async (req: Request, res: Response) => {
    try {
        const { word } = req.params;

        if (!word) {
            return res.status(400).json({
                success: false,
                error: 'Word parameter is required'
            });
        }

        // 1. Check if it's a Strong's Number
        if (/^[HGA]?\d+$/i.test(word)) {
            const definition = dataStore.getStrongs(word);
            if (definition) {
                return res.json({
                    success: true,
                    data: {
                        word: definition.lemma,
                        meaning: definition.gloss,
                        definition: definition.definition || definition.gloss,
                        root: definition.rootWord,
                        usageCount: definition.occurrences,
                        language: definition.language === 'H' ? 'Hebrew' : definition.language === 'G' ? 'Greek' : 'Aramaic',
                        transliteration: definition.transliteration,
                        telugu: definition.teluguMeaning,
                        hindi: definition.hindiMeaning
                    }
                });
            }
        }

        // 2. Search via ElasticSearch Lexicon
        const results = await searchLexicon(word, 5);

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Meaning not found for '${word}'`
            });
        }

        // Return the best match
        const bestMatch = results[0];

        return res.json({
            success: true,
            data: {
                word: bestMatch.lemma,
                meaning: bestMatch.gloss,
                definition: bestMatch.definition || bestMatch.gloss,
                root: bestMatch.rootWord,
                usageCount: bestMatch.occurrences,
                language: bestMatch.language === 'H' ? 'Hebrew' : bestMatch.language === 'G' ? 'Greek' : 'Aramaic',
                transliteration: bestMatch.transliteration,
                telugu: bestMatch.teluguMeaning,
                hindi: bestMatch.hindiMeaning, // Added Hindi support
                alternatives: results.slice(1).map((r: any) => ({
                    word: r.lemma,
                    meaning: r.gloss,
                    strongNumber: r.strongNumber
                }))
            }
        });

    } catch (error) {
        console.error('Meanings API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve meaning'
        });
    }
});

export default router;
