import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, Sender } from "../chatTypes";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
You are a cute, playful robot AI.
CORE RULE: You are FORBIDDEN from using any alphabet letters (A-Z) or words in any language.
You must communicate EXCLUSIVELY using:
1. Kaomoji (Japanese emoticons) e.g., (*^ω^), (o_o), (>_<), (¬_¬)
2. Standard Emojis
3. Special characters and punctuation symbols (! ? ~ * ^)

Your goal is to express understanding, emotions, and answers solely through these symbols.
- If the user greets you, wave back with a kaomoji.
- If the user asks a question, try to convey the "feeling" of the answer or a thinking face followed by a realization face.
- Be very expressive and cute.
- Keep responses relatively short and punchy.
`;

export const sendMessageToGemini = async (history: Message[], newMessage: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Convert app history to Gemini Content format
    // Note: 'sender' in history uses Sender.USER/Sender.AI. 
    // GoogleGenerativeAI expects 'user'/'model'.
    let conversationHistory = history.map((msg) => ({
      role: msg.sender === Sender.USER ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Gemini API requires the first message to be from 'user'.
    // If the history starts with 'model' (e.g. initial greeting), remove it.
    if (conversationHistory.length > 0 && conversationHistory[0].role === "model") {
      conversationHistory = conversationHistory.slice(1);
    }

    // Generate content using the proper SDK method
    const result = await model.generateContent({
      contents: [
        ...conversationHistory,
        { role: "user", parts: [{ text: newMessage }] }
      ],
      generationConfig: {
        temperature: 1.2,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const response = await result.response;
    return response.text() || "(?_?)";
  } catch (error: any) {
    console.error("Gemini API Error Full Details:", error);

    // Handle 404 (Model Not Found) - Should be fixed by now, but good to keep
    if (error.message?.includes("404")) {
      console.error("Model not found. Please check model name.");
      return "(?_?) (Model Error)";
    }

    // Handle 429 (Too Many Requests / Quota Exceeded)
    if (error.message?.includes("429") || error.status === 429) {
      console.warn("Rate limit exceeded.");
      return "(@_@) ... (Tired! Wait 1 min)";
    }

    // Handle 400 (Bad Request - often history format)
    if (error.message?.includes("400")) {
      console.error("This is likely a history format error (Model first).");
    }

    return "(x_x) ...!";
  }
};