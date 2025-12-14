import axios from 'axios';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(__dirname, '../../public/generated_images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

export const generateImage = async (prompt: string, verseRef: string): Promise<string | null> => {
    try {
        console.log(`Generating image for ${verseRef}...`);
        console.log(`Prompt: ${prompt.substring(0, 100)}...`);

        // Use Pollinations.ai - Free, reliable, high-quality Flux/SDXL images
        const safePrompt = encodeURIComponent(prompt.substring(0, 1000));
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1024&height=1024&model=flux&nologo=true`;

        console.log(`Fetching image from Pollinations...`);

        // Download image
        const filename = `${verseRef.replace(/[: ]/g, '_')}_${Date.now()}.jpg`;
        const filepath = path.join(IMAGES_DIR, filename);

        const imageResponse = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 120000 // 2 minute timeout for image generation
        });

        const writer = fs.createWriteStream(filepath);
        imageResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Image saved: ${filename}`);
                resolve(`/generated_images/${filename}`);
            });
            writer.on('error', (err) => {
                console.error('Error writing image:', err);
                reject(err);
            });
        });

    } catch (error: any) {
        console.error("Error generating image:", error.message || error);
        return null;
    }
};

