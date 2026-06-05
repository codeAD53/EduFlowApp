import { AppError } from "../middlewares/error.middleware.ts";
import type { RoadmapInput, AIRoadmapOutput, Resource } from "../types/roadmaps.types.ts";
import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env.ts";
const RESOURCE_TYPES = ['video', 'article', 'documentation', 'exercise'] as const;
// Ensure the environment variable is set (Gemini uses GEMINI_API_KEY by default)
const apiKey = env.GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey });

const isRecord = (value:unknown):value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isNonEmptyString = (value:unknown):value is string => typeof value === 'string' && value.trim().length > 0 ;

const isResourceType = (value:unknown):value is Resource["type"] => typeof value === "string" && RESOURCE_TYPES.includes(value as Resource["type"]);

const assertValidUrl = (url: string): void => {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        throw new Error(`Invalid resource URL: ${url}`);
    }
    if(!["https:","http:"].includes(parsed.protocol)){
        throw new Error(`Unsupported resource URL protocol: ${url}`);
    }
};

const validateRoadmapOutput = (value:unknown):AIRoadmapOutput => {
    if(!isRecord(value) || !isNonEmptyString(value.title) || !Array.isArray(value.topics)) {
        throw new Error("AI response does not match roadmap shape");
    }
    if(value.topics.length < 1 || value.topics.length > 20){
        throw new Error("AI response returned an invalid number of topics");
    }
    const topics = value.topics.map((topic,index)=>{
        if(!isRecord(topic)){
            throw new Error(`AI topic ${index + 1} is invalid`);
        } 
        if(
            !isNonEmptyString(topic.title) ||
            !isNonEmptyString(topic.description) ||
            typeof topic.week_number !== 'number' ||
            typeof topic.order_index !== 'number' ||
            !Array.isArray(topic.resources)
        ){
            throw new Error(`AI topic ${index + 1} is missing required fields`);
        }

        const resources = topic.resources.map((resource,resourceIndex)=>{
            if(!isRecord(resource)){
                throw new Error(`AI generated resource ${resourceIndex + 1} for topic ${index + 1} is invalid`)
            }
            if(!isNonEmptyString(resource.title) || !isNonEmptyString(resource.url) || !isResourceType(resource.type)){
                throw new Error(`AI generated resource ${resourceIndex + 1} for topic ${index + 1} is missing required fields`);
            }
            assertValidUrl(resource.url);

            return {
                title: resource.title.trim(),
                url: resource.url.trim(),
                type: resource.type,
            };
        });
        if(resources.length < 1 || resources.length > 5){
            throw new Error(`AI topic ${index + 1}returned an invalid number of resources`);
        }
        return {
            title: topic.title.trim(),
            description: topic.description.trim(),
            week_number: topic.week_number,
            order_index: topic.order_index,
            resources,
        };
    });
    return {
        title: value.title.trim(),
        topics
    }
}

export const generateRoadmapFromAI = async (
    input: RoadmapInput
): Promise<AIRoadmapOutput> => {
    const { title, goal, level, duration } = input;

    const prompt = `
    You are an expert learning path creator. Generate a structured learning roadmap. 

    Topic: ${JSON.stringify(title)}
    Goal: ${JSON.stringify(goal)}
    Level: ${JSON.stringify(level)}
    Duration: ${JSON.stringify(duration)}

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

        return validateRoadmapOutput(JSON.parse(content));

    } catch (err){
        console.error('AI_SERVICE_ERROR', err); // Logging actual GEMINI error (quota,key,network)
        const aiError = new AppError('Failed to generate roadmap. Please try again.', 502);
        (aiError as Error & { cause?: unknown }).cause = err;
        throw aiError;
    }
};