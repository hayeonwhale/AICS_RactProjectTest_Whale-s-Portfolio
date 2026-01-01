import * as generativeAi from "@google/generative-ai";

const API_KEY = "AIzaSyBZKYYjYQNdWbSETLBzZvG_mz5SRzpWnRM";
const genAI = new generativeAi.GoogleGenerativeAI(API_KEY);

async function testMultimodal() {
    console.log("Testing gemini-flash-latest with PNG Input...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Tiny 1x1 PNG pixel
        const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

        const result = await model.generateContent([
            "Describe this image",
            { inlineData: { data: base64Image, mimeType: "image/png" } }
        ]);

        console.log("MULTIMODAL SUCCESS: ", result.response.text());
    } catch (e) {
        console.log("MULTIMODAL FAILED: ", e.message);
    }
}

testMultimodal();
