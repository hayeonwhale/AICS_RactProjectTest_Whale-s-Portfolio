import fs from 'fs';
import path from 'path';

const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        console.error("Failed to read .env file");
        return null;
    }
};

const run = async () => {
    const apiKey = loadEnv();
    if (!apiKey) {
        console.error("❌ Could not find VITE_GEMINI_API_KEY in .env");
        process.exit(1);
    }

    console.log(`🔑 API Key found (length: ${apiKey.length})`);

    try {
        console.log("📡 Listing available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            headers: {
                'Referer': 'http://localhost:5173/'
            }
        });

        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response body:", text);
            return;
        }

        const data = await response.json();
        console.log("✅ Models found:");
        if (data.models) {
            data.models.forEach(m => console.log(` - ${m.name} [${m.supportedGenerationMethods.join(', ')}]`));
        } else {
            console.log("No models returned.");
        }

    } catch (error) {
        console.error("❌ Request Failed:", error);
    }
};

run();
