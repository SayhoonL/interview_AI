import { pool } from "./db/client";
import {
    createCanonicalQuestion,
    createRawQuestion,
    findQuestionMappingByNormalizedQuestion
} from "./repositories/questionRepository";
import { normalizeQuestion } from "./utils/normalizeQuestion";

async function main() {
    try {
        const input = "   INTRODUCE Yourself!!!   ";

        const normalized = normalizeQuestion(input);

        console.log("Raw input:", input);
        console.log("Normalized:", normalized);

        const existing =
            await findQuestionMappingByNormalizedQuestion(normalized);

        if (existing) {
            console.log("Exact duplicate found!");
            console.log(existing);
            return;
        }

        const canonical = await createCanonicalQuestion(
            "Tell me about yourself and walk me through your past experience.",
            "BEHAVIORAL"
        );

        const raw = await createRawQuestion(
            input,
            normalized,
            canonical.id,
            1
        );

        console.log("New question created:");
        console.log(raw);
    } catch (error) {
        console.error("Error:");
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();