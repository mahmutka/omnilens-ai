import { GoogleGenAI } from "@google/genai";

// process.env YERİNE import.meta.env KULLANIYORUZ
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API Key bulunamadı! .env dosyasını veya Vercel ayarlarını kontrol et.");
}

if (!apiKey) {
  console.error("API_KEY is missing in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const analyzeImage = async (
  base64Image: string,
  promptText: string
): Promise<string> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: {
        // System Instruction: Sets the model's persona and output language to English.
        systemInstruction: "You are an expert AI assistant that analyzes objects in images in great detail. Always provide your responses in English. Present your output in a readable Markdown format (bold headings, bullet points). Give direct, clear, and information-rich answers to the user.",
        // Creativity setting: 0.5 is balanced for factual yet engaging content.
        temperature: 0.5,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      }
    });

    return response.text || "Could not generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("An error occurred while analyzing the image.");
  }
};
