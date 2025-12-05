import { GoogleGenAI } from "@google/genai";
import { CelestialBody } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeSystem = async (bodies: CelestialBody[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment to use AI features.";
  }

  const systemDescription = bodies.map(b => 
    `- ${b.name}: Mass=${b.mass.toFixed(1)}, Position=(${b.position.x.toFixed(0)}, ${b.position.y.toFixed(0)}), Velocity=(${b.velocity.x.toFixed(2)}, ${b.velocity.y.toFixed(2)})`
  ).join('\n');

  const prompt = `
    You are an expert astrophysicist analyzing a 2D solar system simulation.
    
    Here is the current state of the system:
    ${systemDescription}

    Please provide a brief, fun, and scientific analysis of this system. 
    1. Is it likely stable?
    2. Are there any potential collisions imminent based on positions?
    3. Suggest one new body (name, mass, approx position/velocity) that would be interesting to add to this specific configuration.
    
    Keep the response under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze the system. Please try again later.";
  }
};
