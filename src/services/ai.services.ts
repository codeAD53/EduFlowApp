import Anthropic from "@anthropic-ai/sdk";
import type { RoadmapInput, AIRoadmapOutput } from "../types/roadmaps.types.ts";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_KEY
});

export const generateRoadmapFromAI = async (
    input: RoadmapInput
): Promise<AIRoadmapOutput> => {
    const {title, goal, level, duration} = input;

    const prompt = `
    You are an expert learning path creator, Generate a structured learning roadmap. 

    Topic: ${title}
    Goal: ${goal}
    level: ${level}
    Duration: ${duration}

    Return ONLY a valid JSON object with this exact structure, no extra text:
    {
        "title": "roadmap title",
        "topics": [
            {
                "title": "topic title",
                "description": "what this topic covers"
                "week_number": 1,
                "order_index": 1,
                "resources": [
                    {
                        "title": "resource title",
                        "url": "https://example.com"
                        "type": "video | article | documentation | exercise"
                    }
                ]
            }
        ]
    }

    Rules:
    - Generate 8-15 topics depending on duration
    - Each topic should have 2-3 resources
    - Resources must have real, valid URLs
    - Topics must be in logical learning order
    - week_number groups topics by week
    - order_index is the position within the week
    - Return ONLY the JSON, no markdown, no explanation
    `

    const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
    });

    const content = response.content[0];
    if(content?.type !== 'text'){
        throw new Error("Unexpected AI response type")
    }

    try {
        const roadmap: AIRoadmapOutput = JSON.parse(content.text);
        return roadmap
    } catch (err) {
        const parseError = new Error('Failed to parse AI response as JSON');
        (parseError as Error & {cause?: unknown}).cause = err;
        throw parseError;
    }
}
