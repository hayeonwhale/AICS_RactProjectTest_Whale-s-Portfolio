import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PosterContent } from "../Ptypes";

const parseJSON = (text: string) => {
    try {
        // Remove code block markers if present
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return null;
    }
}

export const analyzeImageAndCreatePoster = async (
  base64Image: string, 
  userPrompt: string
): Promise<PosterContent | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    당신은 예술 큐레이터이자 철학자, 그리고 심리 상담가입니다.
    당신의 목표는 예술 작품을 분석하고 그 역사적 맥락을 현대인의 고민(번아웃, 불안, 경쟁 등)과 연결하는 것입니다.
    "개인의 존중"과 "소소한 행복의 발견"에 초점을 맞추세요.
    어조는 공감적이고 시적이며 지적이지만 이해하기 쉬워야 합니다.
    
    반드시 **한국어(Korean)**로만 응답하세요.
    
    Structure your response to strictly match the requested JSON schema.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title of the artwork (in Korean)" },
      artist: { type: Type.STRING, description: "Name of the artist (in Korean)" },
      year: { type: Type.STRING, description: "Year of creation" },
      intro: { type: Type.STRING, description: "Brief introduction about the work's historical context (in Korean)." },
      pastTheme: { type: Type.STRING, description: "The theme relative to the past era (in Korean)." },
      modernTheme: { type: Type.STRING, description: "The theme re-interpreted for today's society (in Korean)." },
      connection: { type: Type.STRING, description: "Why these two themes connect (in Korean)." },
      coreMessage: { type: Type.STRING, description: "A short, powerful message for the viewer (in Korean)." },
      tags: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3 keywords related to the mood (in Korean)."
      }
    },
    required: ["title", "artist", "year", "intro", "pastTheme", "modernTheme", "connection", "coreMessage", "tags"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image. ${userPrompt ? `User Context: ${userPrompt}` : 'Interpret this art piece focusing on finding peace in a chaotic world.'} Output must be in Korean.`
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      return parseJSON(response.text) as PosterContent;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};