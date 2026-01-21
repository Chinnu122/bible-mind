/**
 * Stub for Gemini Service (image prompt generation)
 * Uses OpenRouter as fallback since Gemini API is not configured
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY_GPT;

/**
 * Generate an enhanced prompt for image generation from a Bible verse
 */
export async function generateImagePrompt(verseText: string, reference: string): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        // Fallback to simple prompt if no API key
        return `A beautiful, serene biblical illustration depicting: "${verseText}" (${reference}). Artistic, peaceful, golden light, divine atmosphere.`;
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://bible-mind.vercel.app',
                'X-Title': 'Bible Mind - Image Prompt'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at creating detailed image prompts for AI art generation. Create beautiful, peaceful biblical scene descriptions.'
                    },
                    {
                        role: 'user',
                        content: `Create a short, beautiful image prompt (max 100 words) for this Bible verse: "${verseText}" (${reference}). 
                        Focus on: peaceful atmosphere, golden divine light, artistic biblical illustration style.
                        Return ONLY the prompt text, no quotes or explanation.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            console.error('Failed to generate image prompt, using fallback');
            return `A beautiful, serene biblical illustration depicting: "${verseText}" (${reference}). Artistic, peaceful, golden light, divine atmosphere.`;
        }

        const data = await response.json() as {
            choices?: Array<{ message?: { content?: string } }>;
        };

        return data.choices?.[0]?.message?.content ||
            `A beautiful, serene biblical illustration depicting: "${verseText}" (${reference}). Artistic, peaceful, golden light, divine atmosphere.`;
    } catch (error) {
        console.error('Error generating image prompt:', error);
        return `A beautiful, serene biblical illustration depicting: "${verseText}" (${reference}). Artistic, peaceful, golden light, divine atmosphere.`;
    }
}
