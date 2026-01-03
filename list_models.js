import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Function to read .env manually
function getEnvVar(key) {
    try {
        const envPath = path.resolve(process.cwd(), ".env");
        if (!fs.existsSync(envPath)) return null;
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(new RegExp(`^${key}=(.*)$`, "m"));
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const API_KEY = getEnvVar("VITE_GEMINI_API_KEY");

if (!API_KEY) {
    console.error("❌ Error: VITE_GEMINI_API_KEY not found in .env file.");
    process.exit(1);
}

console.log(`✅ Found API Key (starts with: ${API_KEY.substring(0, 4)}...)`);

async function listModels() {
    console.log("🚀 Fetching available models for this API key...\n");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        if (!data.models) {
            console.log("⚠️ No models returned. Check API key permissions.");
            return;
        }

        console.log("AVAILABLE MODELS:");
        const modelNames = data.models.map(m => m.name.replace("models/", ""));
        modelNames.forEach(name => console.log(` - ${name}`));

        console.log("\nRECOMMENDATION:");
        if (modelNames.includes("gemini-1.5-flash")) {
            console.log("✅ Use 'gemini-1.5-flash'");
        } else if (modelNames.includes("gemini-2.0-flash-exp")) {
            console.log("⚠️ Only 'gemini-2.0-flash-exp' is available (Experimental).");
        } else {
            console.log(`❓ Try one of the above: ${modelNames[0]}`);
        }

    } catch (error) {
        console.error("❌ Failed to fetch models:", error.message);
    }
}

listModels();
