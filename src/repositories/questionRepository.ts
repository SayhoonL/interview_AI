import { pool } from "../db/client";

export async function createCanonicalQuestion(
    enhancedQuestion: string,
    category: string
) {
    const result = await pool.query(
        `
        INSERT INTO canonical_questions (
            enhanced_question,
            category
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [enhancedQuestion, category]
    );

    return result.rows[0];
}

export async function createRawQuestion(
    rawQuestion: string,
    normalizedQuestion: string,
    canonicalQuestionId: string,
    similarityScore: number
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