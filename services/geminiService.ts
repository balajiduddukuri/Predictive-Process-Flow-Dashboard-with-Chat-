import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIResponse } from "../types";

const apiKey = process.env.API_KEY;

// Helper to provide instant offline/free guidance when API is unavailable
const getOfflineGuidance = (stageName: string, phaseName: string): AIResponse => {
  return {
    summary: `(Offline Mode) The "${stageName}" is a standard component of the ${phaseName} phase. In a predictive environment, this step focuses on ensuring stability, documentation, and formal approval before moving forward.`,
    checklist: [
      `Review the inputs required for ${stageName}`,
      `Apply relevant tools and techniques`,
      `Document the outputs formally`,
      `Update the project documents`
    ],
    tips: "Ensure you are consulting the latest PMBOK guide or your organization's OPA (Organizational Process Assets) for specific templates."
  };
};

export const generatePMPGuidance = async (
  stageName: string,
  phaseName: string
): Promise<AIResponse> => {
  // Graceful fallback if no API Key is provided
  if (!apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getOfflineGuidance(stageName, phaseName)), 800);
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a world-class Project Management Professional (PMP) expert and instructor. 
  Your goal is to provide concise, actionable, and accurate guidance for specific steps in the Predictive Process Flow (Waterfall).
  Focus on PMI PMBOK guide standards. Keep the tone professional but encouraging.`;

  const prompt = `Provide guidance for the project management activity: "${stageName}" within the "${phaseName}" phase.
  
  Return a summary of what this activity entails, a checklist of 3-5 key things to do or verify, and a "Pro Tip" for success.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A 2-3 sentence explanation of the activity.",
      },
      checklist: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 actionable steps or verification points.",
      },
      tips: {
        type: Type.STRING,
        description: "One valuable pro-tip or common pitfall to avoid.",
      },
    },
    required: ["summary", "checklist", "tips"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return offline guidance on error to keep the tool usable
    return getOfflineGuidance(stageName, phaseName);
  }
};

export const askPMPQuestion = async (
  question: string,
  stageName: string,
  phaseName: string,
  contextData: AIResponse | null,
  history: Array<{ role: 'user' | 'model', text: string }>
): Promise<string> => {
  if (!apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(
        `I am currently operating in offline mode. I cannot provide dynamic answers to specific questions about "${question}". \n\nPlease refer to the PMBOK guide section on ${stageName} for authoritative details.`
      ), 800);
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a PMP expert mentor helping a student or project manager. 
  They are currently focusing on the "${stageName}" activity in the "${phaseName}" phase.
  
  ${contextData ? `Context already provided to them: ${contextData.summary}` : ''}

  Answer their follow-up questions concisely. If they ask about something unrelated to this specific stage, gently remind them of the current context but still try to answer helpfully if possible.`;

  let promptHistory = "";
  history.forEach(msg => {
    promptHistory += `${msg.role === 'user' ? 'User' : 'Mentor'}: ${msg.text}\n`;
  });
  
  const prompt = `${promptHistory}
  User: ${question}
  Mentor:`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    return response.text || "I'm sorry, I couldn't generate an answer right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the knowledge base. Please try again.";
  }
};