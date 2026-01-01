import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBZKYYjYQNdWbSETLBzZvG_mz5SRzpWnRM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testMultiImage() {
    console.log("Testing gemini-flash-latest with TWO Images...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Tiny 1x1 PNG pixel (Red)
        const img1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        // Tiny 1x1 PNG pixel (Blue - technically same base64 here for simplicity, just testing payload structure)
        const img2 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

        const result = await model.generateContent([
            "Compare these two images.",
            { inlineData: { data: img1, mimeType: "image/png" } },
            { inlineData: { data: img2, mimeType: "image/png" } }
        ]);

        console.log("MULTI-IMAGE SUCCESS");
        console.log("Text:", result.response.text());
    } catch (e) {
        console.log("MULTI-IMAGE FAILED: ", e.message);
    }
}

testMultiImage();
