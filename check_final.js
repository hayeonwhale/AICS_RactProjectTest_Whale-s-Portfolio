import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBZKYYjYQNdWbSETLBzZvG_mz5SRzpWnRM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testFinal() {
    const models = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`${modelName} SUCCESS: `, result.response.text());
        } catch (e) {
            console.log(`${modelName} FAILED: `, e.message);
        }
        console.log("---");
    }
}

testFinal();
