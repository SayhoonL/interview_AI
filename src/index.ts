import { pool } from "./db/client";
import { generateEmbedding } from "./services/embeddingService";
import {
    createCanonicalQuestion,
    findSimilarCanonicalQuestion
} from "./repositories/questionRepository";

async function main() {
    try {
        const canonicalQuestion = "Tell me about yourself";

        const enhancedQuestion =
            "Tell me about yourself and walk me through your past experience.";

        const canonicalEmbedding =
            await generateEmbedding(canonicalQuestion);

        const canonical = await createCanonicalQuestion(
            canonicalQuestion,
            enhancedQuestion,
            "BEHAVIORAL",
            canonicalEmbedding
        );

        console.log("Created canonical question:");
        console.log(canonical);

    const testInputs = [
        "Introduce yourself",
        "Can you tell me about yourself?",
        "Give me a quick introduction about yourself",
        "What are your greatest strengths?",
        "Design a URL shortener",
        "Why do you want to work here?"
    ];

    for (const testInput of testInputs) {
        const testEmbedding = await generateEmbedding(testInput);

        const match =
            await findSimilarCanonicalQuestion(testEmbedding);

        console.log("\nInput:", testInput);
        console.log("Similarity:", match?.similarity_score);
    }


    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();