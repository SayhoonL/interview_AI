import { normalizeQuestion } from "../utils/normalizeQuestion";
import { generateEmbedding } from "./embeddingService";
import {
    findQuestionMappingByNormalizedQuestion,
    findSimilarCanonicalQuestion
} from "../repositories/questionRepository";

const SIMILARITY_THRESHOLD = 0.5;

export async function processQuestion(input: string) {
    const normalized = normalizeQuestion(input);

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

    const embedding = await generateEmbedding(normalized);

    const semanticMatch =
        await findSimilarCanonicalQuestion(embedding);

    if (
        semanticMatch &&
        Number(semanticMatch.similarity_score) >= SIMILARITY_THRESHOLD
    ) {
        return {
            duplicate: true,
            matchType: "SEMANTIC",
            similarityScore: Number(semanticMatch.similarity_score),
            canonicalQuestion: semanticMatch
        };
    }

    return {
        duplicate: false,
        matchType: null,
        similarityScore:
            semanticMatch
                ? Number(semanticMatch.similarity_score)
                : null,
        canonicalQuestion: null
    };
}