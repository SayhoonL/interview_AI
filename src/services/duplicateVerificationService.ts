import {
  BedrockRuntimeClient,
  ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1"
});

export async function verifyDuplicate(
  questionA: string,
  questionB: string
): Promise<boolean> {
  const command = new ConverseCommand({
    modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",

    messages: [
      {
        role: "user",
        content: [
          {
            text: `
You are verifying whether two interview questions are asking the same underlying question.

Question A:
"${questionA}"

Question B:
"${questionB}"

Return ONLY valid JSON:

{
  "duplicate": true
}

or

{
  "duplicate": false
}

Mark duplicate=true only if answering one question would substantially answer the other.

Be careful with questions that use similar wording but ask opposite or different things, such as strengths versus weaknesses.
`
          }
        ]
      }
    ],

    inferenceConfig: {
      maxTokens: 50,
      temperature: 0
    }
  });

  const response = await client.send(command);

  const text =
    response.output?.message?.content?.[0]?.text;

  if (!text) {
    throw new Error("Claude returned no duplicate verification result");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return parsed.duplicate === true;
}