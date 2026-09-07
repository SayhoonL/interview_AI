import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1"
});

export async function generateEmbedding(
    text: string
): Promise<number[]> {

    const command = new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v2:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            inputText: text,
            dimensions: 1024,
            normalize: true
        })
    });

    const response = await client.send(command);

    const responseBody = JSON.parse(
        new TextDecoder().decode(response.body)
    );

    return responseBody.embedding;
}