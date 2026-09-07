CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS canonical_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_question TEXT NOT NULL,
    enhanced_question TEXT NOT NULL,
    category VARCHAR(100),
    embedding VECTOR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE raw_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_question TEXT NOT NULL,
    normalized_question TEXT NOT NULL,
    canonical_question_id UUID,
    similarity_score DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_canonical_question
        FOREIGN KEY (canonical_question_id)
        REFERENCES canonical_questions(id)
);