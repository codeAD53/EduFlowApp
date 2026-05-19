import type { RoadmapInput, AIRoadmapOutput } from "../types/roadmaps.types.ts";
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the environment variable is set (Gemini uses GEMINI_API_KEY by default)
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

export const generateRoadmapFromAI = async (
    input: RoadmapInput
): Promise<AIRoadmapOutput> => {
    const { title, goal, level, duration } = input;

    const prompt = `
    You are an expert learning path creator. Generate a structured learning roadmap. 

    Topic: ${title}
    Goal: ${goal}
    Level: ${level}
    Duration: ${duration}

    Rules:
    - Generate 8-15 topics depending on duration.
    - Each topic should have 2-3 resources.
    - Resources must have real, valid URLs.
    - Topics must be in logical learning order.
    - week_number groups topics by week.
    - order_index is the position within the week.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Fast, highly accurate, and has a great free tier
            contents: prompt,
            config: {
                // Enforce the exact JSON structure using a Schema
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        topics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    week_number: { type: Type.INTEGER },
                                    order_index: { type: Type.INTEGER },
                                    resources: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                title: { type: Type.STRING },
                                                url: { type: Type.STRING },
                                                type: { 
                                                    type: Type.STRING, 
                                                    description: "Must be one of: video, article, documentation, exercise" 
                                                },
                                            },
                                            required: ["title", "url", "type"],
                                        },
                                    },
                                },
                                required: ["title", "description", "week_number", "order_index", "resources"],
                            },
                        },
                    },
                    required: ["title", "topics"],
                },
            },
        });

        const content = response.text;
        if (!content) {
            throw new Error("Unexpected AI response type");
        }

        const roadmap: AIRoadmapOutput = JSON.parse(content);
        for(const topic of roadmap.topics){
            for(const resource of topic.resources){
                 let parsed: URL;
            try {
                parsed = new URL(resource.url);
            } catch {
                throw new Error(`Invalid resource URL: ${resource.url}`);
            }
            if(!["http:", "https:"].includes(parsed.protocol)){
                throw new Error(`Unsupported resource URL protocol: ${resource.url}`);
            }
            }
           
        }
        return roadmap;

    } catch (err) {
        const parseError = new Error('Failed to generate or parse AI roadmap');
        (parseError as Error & { cause?: unknown }).cause = err;
        throw parseError;
    }
};