import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, AIResponseItem } from "../types";

// Ensure API KEY is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      senderName: {
        type: Type.STRING,
        description: "The name of the community member replying (e.g., 'Mrs. Higgins', 'Dave the Plumber').",
      },
      content: {
        type: Type.STRING,
        description: "The message content, keeping it concise and relevant to the chat context.",
      },
      emoji: {
        type: Type.STRING,
        description: "A single emoji representing the character's avatar/mood.",
      },
    },
    required: ["senderName", "content", "emoji"],
  },
};

export const getCommunityResponse = async (
  currentChannelName: string,
  currentChannelDesc: string,
  messageHistory: Message[],
  userMessage: string
): Promise<AIResponseItem[]> => {
  if (!apiKey) return [];

  // Limit history context to save tokens and improve focus
  const recentHistory = messageHistory.slice(-10).map(m => 
    `${m.senderName}: ${m.content}`
  ).join("\n");

  const prompt = `
    You are the engine behind 'Neighborhood.ai', a simulated local community chat.
    The user has posted in the #${currentChannelName} channel.
    Channel Description: ${currentChannelDesc}.
    
    Recent Chat History:
    ${recentHistory}

    User's New Message: "${userMessage}"

    Your task:
    Generate 1 or 2 responses from fictional community members.
    - If the user asks a question, have helpful neighbors answer.
    - If the user shares news, have neighbors react.
    - Keep responses conversational, sometimes brief, sometimes detailed, like a real group chat.
    - Create diverse personas (grumpy old neighbor, helpful techie, busy mom, local business owner).
    - DO NOT ALWAYS REPLY. Sometimes return an empty array if the conversation naturally lulls, but since this is a demo, usually return at least one.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.2, // High temperature for variety in characters
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    return JSON.parse(jsonText) as AIResponseItem[];

  } catch (error) {
    console.error("Error getting Gemini response:", error);
    return [];
  }
};