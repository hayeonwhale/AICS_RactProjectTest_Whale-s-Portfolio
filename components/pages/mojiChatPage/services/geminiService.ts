import { GoogleGenAI, Content } from "@google/genai";
import { Message, Sender } from "../chatTypes";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables");
}
const ai = new GoogleGenAI({ apiKey });

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
    // Convert app history to Gemini Content format
    const contents: Content[] = history.map((msg) => ({
      role: msg.sender === Sender.USER ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Add the new message
    contents.push({
      role: "user",
      parts: [{ text: newMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // High temperature for more creative/varied kaomojis
      },
    });

    return response.text || "(?_?)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "(x_x) ...!";
  }
};