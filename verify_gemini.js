import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Function to read .env manually since we might not have dotenv
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

const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = ["gemini-3-flash-preview", "gemini-2.5-flash-lite", "gemini-2.0-flash-exp"];

async function verify() {
    console.log("🚀 Starting Gemini Model Verification...\n");

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing model: ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`✅ SUCCESS`);
            // console.log(`   Response: ${response.text().substring(0, 50)}...`);
        } catch (error) {
            console.log(`❌ FAILED`);
            if (error.message.includes("404")) {
                console.log(`   Reason: Model not found (404). This API key might not have access to it.`);
            } else if (error.message.includes("403")) {
                console.log(`   Reason: Forbidden (403). API Key invalid or quota exceeded.`);
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }
    }
}

verify();
