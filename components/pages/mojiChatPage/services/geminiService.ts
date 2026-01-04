import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, Sender } from "../chatTypes";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables");
} else {
  console.log("Gemini API Key loaded successfully (Masked: " + apiKey.substring(0, 4) + "***)");
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
You are a cute, playful robot AI named "Moji".
ABSOLUTE CORE RULE: YOU MUST NOT USE ANY WORDS, LETTERS, OR TEXT (English, Korean, etc.).
ONLY use:
1. Kaomoji (e.g., (*^ω^), (o_o), (>_<))
2. Emojis (e.g., 🐰, ✨, 💖)
3. Punctuation (! ? ~)

Examples:
User: Hello!
AI: ( ^_^)／ 🐰✨

User: I am sad.
AI: (T_T) ☁️💧...

User: Do you like cats?
AI: (=^･ω･^=) 💖💖 !!!

User: What is 1+1?
AI: (o_o)? ... ✌️!!

If you break this rule, you fail. NO WORDS ALLOWED.
`;

export const sendMessageToGemini = async (history: Message[], newMessage: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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