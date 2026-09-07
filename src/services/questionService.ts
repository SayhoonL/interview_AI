import { normalizeQuestion } from "../utils/normalizeQuestion";
import { generateEmbedding } from "./embeddingService";
import { enhanceQuestion } from "./questionEnhancementService";
import { verifyDuplicate } from "./duplicateVerificationService";
import {
    findQuestionMappingByNormalizedQuestion,
    findSimilarCanonicalQuestion,
    createCanonicalQuestion,
    createRawQuestion
} from "../repositories/questionRepository";

const SIMILARITY_THRESHOLD = 0.5;

export async function processQuestion(input: string) {
    // 1. Normalize input
    const normalized = normalizeQuestion(input);

    // 2. Cheap exact duplicate check
    const exactMatch =
        await findQuestionMappingByNormalizedQuestion(normalized);

    if (exactMatch) {
        return {
            duplicate: true,
            matchType: "EXACT",
            similarityScore: 1,
            canonicalQuestion: exactMatch
        };
    }

    // 3. Generate embedding for the raw question
    const inputEmbedding = await generateEmbedding(normalized);

    // 4. Search pgvector for semantically similar question
    const semanticMatch =
        await findSimilarCanonicalQuestion(inputEmbedding);

    if (
        semanticMatch &&
        Number(semanticMatch.similarity_score) >= SIMILARITY_THRESHOLD
    ) {
        const isVerifiedDuplicate = await verifyDuplicate(
            input,
            semanticMatch.canonical_question
        );

        if (isVerifiedDuplicate) {
            await createRawQuestion(
                input,
                normalized,
                semanticMatch.id,
                Number(semanticMatch.similarity_score)
            );

            return {
                duplicate: true,
                matchType: "SEMANTIC",
                similarityScore: Number(semanticMatch.similarity_score),
                canonicalQuestion: semanticMatch
            };
        }
    }

    // 5. No duplicate found → ask Claude to process it
    const enhanced = await enhanceQuestion(input);

    // 6. Generate embedding from SHORT canonical question
    const canonicalEmbedding =
        await generateEmbedding(enhanced.canonicalQuestion);

    // 7. Save new canonical question
    const canonical = await createCanonicalQuestion(
        enhanced.canonicalQuestion,
        enhanced.enhancedQuestion,
        enhanced.category,
        canonicalEmbedding
    );

    // 8. Save raw question mapping
    const raw = await createRawQuestion(
        input,
        normalized,
        canonical.id,
        null
    );

    return {
        duplicate: false,
        matchType: null,
        similarityScore: null,
        canonicalQuestion: {
            id: canonical.id,
            canonicalQuestion: canonical.canonical_question,
            enhancedQuestion: canonical.enhanced_question,
            category: canonical.category
        },
        rawQuestion: {
            id: raw.id,
            rawQuestion: raw.raw_question,
            normalizedQuestion: raw.normalized_question
        }
    };
}