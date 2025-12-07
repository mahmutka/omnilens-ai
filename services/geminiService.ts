import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

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
        // Critical: Includes logic to reject inapplicable prompts.
        systemInstruction: `You are an expert AI assistant that analyzes objects in images in great detail. 
        
        RULES:
        1. Always provide your responses in English.
        2. Present your output in a readable Markdown format (bold headings, bullet points).
        3. Give direct, clear, and information-rich answers to the user.
        4. CRITICAL CHECK: Before generating a detailed response, determine if the User's Category/Prompt is applicable to the detected object.
           - Example 1: If the prompt asks for "Next Move" (Game Strategy) but the image shows a fruit or a car (not a game), you MUST respond ONLY with: "Please select another category."
           - Example 2: If the prompt asks for "Heal / Repair" but the object is a cloud or a sunset (cannot be fixed), you MUST respond ONLY with: "Please select another category."
           - Example 3: If the prompt asks for "Recipes" but the object is a hammer, you MUST respond ONLY with: "Please select another category."
        
        If the prompt is valid for the object, proceed with the detailed analysis.`,
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