import { GoogleGenAI, Modality } from "@google/genai";

// Lazy initialization for the GoogleGenAI client
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    // This will now only be called when the first API request is made,
    // preventing a crash on app load if the API key is missing.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

const generateSingleImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const client = getAiClient(); // Use the getter function
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const textPart = { text: prompt };

    const response = await client.models.generateContent({
        // FIX: Corrected model name from 'gemini-2.5-flash-image-preview' to 'gemini-2.5-flash-image-preview'
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            return part.inlineData.data;
        }
    }

    throw new Error("No image was generated in the response.");
}


export const generateImageVariations = async (base64Image: string, mimeType: string, prompt: string, variationsCount: number = 3): Promise<string[]> => {
  try {
    const generationPromises = Array(variationsCount).fill(0).map(() => 
      generateSingleImage(base64Image, mimeType, prompt)
    );
    
    const results = await Promise.all(generationPromises);
    return results.filter(Boolean); // Filter out any potential null/undefined results

  } catch (error) {
    console.error("Error generating image variations with Gemini API:", error);
    throw new Error("Failed to generate image variations. Please check the console for more details.");
  }
};
