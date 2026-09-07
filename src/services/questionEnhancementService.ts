import {
    BedrockRuntimeClient,
    ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1"
});

export interface EnhancedQuestionResult {
    canonicalQuestion: string;
    enhancedQuestion: string;
    category: string;
}

export async function enhanceQuestion(
    rawQuestion: string
): Promise<EnhancedQuestionResult> {

    const command = new ConverseCommand({
        modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",

        messages: [
            {
                role: "user",
                content: [
                    {
                        text: `
You process interview questions.

Given a raw interview question, return:

1. canonicalQuestion:
A short, standardized version preserving the original meaning.

2. enhancedQuestion:
A clearer and more complete interview-ready version.
Do not add requirements that significantly change the original meaning.

3. category:
Choose exactly one:
BEHAVIORAL
CODING
SYSTEM_DESIGN
TECHNICAL
LEADERSHIP
PROJECT_EXPERIENCE
COMPANY_CULTURE
OTHER

Raw question:
"${rawQuestion}"

Return ONLY valid JSON using this format:

{
  "canonicalQuestion": "...",
  "enhancedQuestion": "...",
  "category": "..."
}
`
                    }
                ]
            }
        ],

        inferenceConfig: {
            maxTokens: 300,
            temperature: 0
        }
    });

    const response = await client.send(command);

    const text = response.output?.message?.content?.[0]?.text;

    if (!text) {
        throw new Error("Claude returned no response");
    }

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error(`Claude enhancement response had no JSON: ${text}`);
    }

    return JSON.parse(match[0]) as EnhancedQuestionResult;
}