import * as generativeAi from "@google/generative-ai";

const API_KEY = "AIzaSyBZKYYjYQNdWbSETLBzZvG_mz5SRzpWnRM";
const genAI = new generativeAi.GoogleGenerativeAI(API_KEY);

async function testModels() {
    const models = ["gemini-2.5-flash-lite"];

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

testModels();
