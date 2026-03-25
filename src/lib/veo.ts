import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateVeoVideo(prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = 'veo-3.1-fast-generate-preview';
  
  let operation = await ai.models.generateVideos({
    model,
    prompt,
    image: imageBase64 ? {
      imageBytes: imageBase64.split(',')[1], // remove data:image/png;base64,
      mimeType: 'image/png',
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Failed to generate video");

  // To fetch the video, append the Gemini API key to the `x-goog-api-key` header.
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
