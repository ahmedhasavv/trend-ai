import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// Lazy initialization for the GoogleGenAI client
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error(
      "The API_KEY environment variable is not set. Please make sure to configure it before running the application."
    );
  }
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
    const client = getAiClient();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const textPart = { text: prompt };

    const response: GenerateContentResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    const firstCandidate = response.candidates?.[0];

    if (!firstCandidate) {
        console.error("Gemini API returned no candidates.", JSON.stringify(response, null, 2));
        throw new Error("The AI model did not return a valid response. This might be a temporary issue.");
    }
    
    // Check for safety blocks
    if (firstCandidate.finishReason === 'SAFETY') {
        throw new Error("Image generation was blocked for safety reasons. Please try a different image or adjust the prompt.");
    }

    // Find the image part in the response
    const imageResponsePart = firstCandidate.content?.parts?.find(part => 
        part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    if (imageResponsePart?.inlineData?.data) {
        return imageResponsePart.inlineData.data;
    }
    
    console.error("Gemini API response did not contain an image.", JSON.stringify(response, null, 2));
    throw new Error("No image was generated in the response. The model may have returned text instead.");
}


export const generateImageVariations = async (base64Image: string, mimeType: string, prompt: string, variationsCount: number = 3): Promise<string[]> => {
  try {
    const results: string[] = [];
    // Running image generation sequentially to avoid potential rate limiting issues.
    for (let i = 0; i < variationsCount; i++) {
        const result = await generateSingleImage(base64Image, mimeType, prompt);
        results.push(result);
    }
    
    return results;

  } catch (error) {
    console.error("Error generating image variations with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(error.message); // Propagate the more specific error message
    }
    throw new Error("Failed to generate image variations. Please check the console for more details.");
  }
};