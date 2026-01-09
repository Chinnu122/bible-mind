import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

/**
 * POST /api/ai/generate-image
 * Generate image via Hugging Face Inference API (Proxy)
 */
router.post('/generate-image', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        // Get API key from environment variable (set HF_API_KEY in .env or Render dashboard)
        const apiKey = process.env.HF_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'Server configuration error: Missing HF_API_KEY environment variable' });
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            {
                inputs: prompt,
                parameters: {
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                    width: 1024, // FLUX.1-dev supports higher res, sticking to 1024 for speed
                    height: 1024
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        res.json({ success: true, imageUrl: dataUrl });

    } catch (error: any) {
        console.error('AI Image Gen error:', error.response?.data ? String(error.response.data) : error.message);
        console.error('Full Error:', JSON.stringify(error.response?.data || error, null, 2));
        res.status(500).json({
            success: false,
            error: 'Failed to generate image',
            details: error.response?.data ? String(error.response.data) : error.message
        });
    }
});

/**
 * GET /api/ai/context/:book/:chapter/:verse

 * Get AI-generated historical and cultural context for a verse
 * Placeholder for future OpenAI/LLM integration
 */
router.get('/context/:book/:chapter/:verse', async (req: Request, res: Response) => {
    try {
        const { book, chapter, verse } = req.params;

        // Placeholder response - in production, this would call OpenAI or similar
        const mockContext = {
            historical: {
                period: "Creation Era",
                setting: "Before time and space as we know it",
                significance: "The foundational verse of the Bible, establishing God as the creator of all things."
            },
            cultural: {
                hebrewContext: "The word 'Bereshit' (בראשית) is the first word of the Hebrew Bible and literally means 'In the beginning'.",
                ancientNearEast: "Unlike other ancient creation narratives, Genesis presents a singular, all-powerful God who creates through speech."
            },
            theological: {
                keyThemes: ["Divine sovereignty", "Creation ex nihilo", "God's eternal nature"],
                crossReferences: ["John 1:1-3", "Colossians 1:16", "Hebrews 11:3"]
            }
        };

        res.json({
            success: true,
            data: {
                verseRef: `${book} ${chapter}:${verse}`,
                context: mockContext,
                source: "AI Context (Placeholder)",
                disclaimer: "This context is for educational purposes. Always verify with scholarly sources."
            }
        });
    } catch (error: any) {
        console.error('AI Context error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate AI context',
            code: 500
        });
    }
});

/**
 * GET /api/ai/word-study/:strongsNumber
 * Get AI-enhanced word study for a Strong's number
 */
router.get('/word-study/:strongsNumber', async (req: Request, res: Response) => {
    try {
        const { strongsNumber } = req.params;

        // Placeholder for AI-enhanced word study
        res.json({
            success: true,
            data: {
                strongsNumber,
                aiEnhancements: {
                    usage: "This word appears in various contexts throughout Scripture...",
                    modernApplication: "In contemporary usage, this concept relates to...",
                    relatedConcepts: ["faith", "trust", "belief"]
                },
                disclaimer: "AI-generated content. Verify with lexicons."
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate word study',
            code: 500
        });
    }
});

export default router;
