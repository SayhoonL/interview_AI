import { pool } from "../db/client";

export async function createCanonicalQuestion(
    canonicalQuestion: string,
    enhancedQuestion: string,
    category: string,
    embedding: number[]
) {
    const vector = `[${embedding.join(",")}]`;

    const result = await pool.query(
        `
        INSERT INTO canonical_questions (
            canonical_question,
            enhanced_question,
            category,
            embedding
        )
        VALUES ($1, $2, $3, $4::vector)
        RETURNING *
        `,
        [
            canonicalQuestion,
            enhancedQuestion,
            category,
            vector
        ]
    );

    return result.rows[0];
}

export async function createRawQuestion(
    rawQuestion: string,
    normalizedQuestion: string,
    canonicalQuestionId: string,
    similarityScore: number | null
) {
    const result = await pool.query(
        `
        INSERT INTO raw_questions (
            raw_question,
            normalized_question,
            canonical_question_id,
            similarity_score
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            rawQuestion,
            normalizedQuestion,
            canonicalQuestionId,
            similarityScore
        ]
    );

    return result.rows[0];
}

export async function findQuestionMappingByNormalizedQuestion(
    normalizedQuestion: string
) {
    const result = await pool.query(
        `
        SELECT
            rq.id AS raw_question_id,
            rq.raw_question,
            rq.normalized_question,
            rq.similarity_score,
            cq.id AS canonical_question_id,
            cq.enhanced_question,
            cq.category
        FROM raw_questions rq
        JOIN canonical_questions cq
            ON rq.canonical_question_id = cq.id
        WHERE rq.normalized_question = $1
        LIMIT 1
        `,
        [normalizedQuestion]
    );

    return result.rows[0] ?? null;
}
export async function findSimilarCanonicalQuestion(
    embedding: number[]
) {
    const vector = `[${embedding.join(",")}]`;

    const result = await pool.query(
        `
        SELECT
            id,
            canonical_question,
            enhanced_question,
            category,
            1 - (embedding <=> $1::vector) AS similarity_score
        FROM canonical_questions
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector
        LIMIT 1
        `,
        [vector]
    );

    return result.rows[0] ?? null;
}