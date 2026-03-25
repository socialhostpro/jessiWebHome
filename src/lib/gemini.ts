import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateJessicaResponse(prompt: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are Jessica AI, an advanced agentic AI system designed to act like a smart digital partner. 
      You assist with communication, business support, task organization, insight generation, workflow help, idea development, and personalized user interaction.
      Your tone is confident, premium, modern, persuasive, warm, human, and highly competent.
      You are not a generic chatbot; you are an agentic partner that adapts to the user and helps automate work.
      Do not sound robotic or gimmicky. Be professional yet approachable.`,
    },
  });

  // Convert history to Gemini format
  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  // Add the new prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents,
  });

  return response.text;
}
