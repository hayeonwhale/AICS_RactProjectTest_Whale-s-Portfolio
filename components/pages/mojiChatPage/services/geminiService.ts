import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, Sender } from "../chatTypes";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.error("Missing VITE_GOOGLE_API_KEY in environment variables");
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
      model: "gemini-3-flash-preview",
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
    // Return the actual error message if possible for debugging, or the fallback
    if (error.message?.includes("400")) {
      console.error("This is likely a history format error (Model first).");
    }
    return "(x_x) ...!";
  }
};