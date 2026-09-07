import type { ProcessQuestionResult, QuestionMapping } from "./api";

export interface DisplayResult {
  rawQuestion: string;
  duplicate: boolean;
  matchType: "EXACT" | "SEMANTIC" | null;
  similarityScore: number | null;
  canonicalQuestion: string | null;
  enhancedQuestion: string | null;
  category: string;
}

export function fromSubmitResult(
  rawQuestion: string,
  result: ProcessQuestionResult
): DisplayResult {
  const cq = result.canonicalQuestion;

  return {
    rawQuestion,
    duplicate: result.duplicate,
    matchType: result.matchType,
    similarityScore: result.similarityScore,
    canonicalQuestion: cq.canonicalQuestion ?? cq.canonical_question ?? null,
    enhancedQuestion: cq.enhancedQuestion ?? cq.enhanced_question ?? null,
    category: cq.category,
  };
}

export function fromHistoryItem(item: QuestionMapping): DisplayResult {
  return {
    rawQuestion: item.raw_question,
    duplicate: true,
    matchType: item.similarity_score === null ? null : "SEMANTIC",
    similarityScore:
      item.similarity_score === null ? null : Number(item.similarity_score),
    canonicalQuestion: item.canonical_question,
    enhancedQuestion: item.enhanced_question,
    category: item.category,
  };
}
