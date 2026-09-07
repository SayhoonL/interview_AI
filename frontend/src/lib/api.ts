const API_URL = import.meta.env.VITE_API_URL;

export type MatchType = "EXACT" | "SEMANTIC" | null;

export interface CanonicalQuestion {
  id?: string;
  canonicalQuestion?: string;
  canonical_question?: string;
  enhancedQuestion?: string;
  enhanced_question?: string;
  category: string;
}

export interface ProcessQuestionResult {
  duplicate: boolean;
  matchType: MatchType;
  similarityScore: number | null;
  canonicalQuestion: CanonicalQuestion;
}

export interface QuestionMapping {
  raw_id: string;
  raw_question: string;
  normalized_question: string;
  similarity_score: number | null;
  created_at: string;
  canonical_id: string;
  canonical_question: string;
  enhanced_question: string;
  category: string;
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.message ?? response.statusText);
  }

  return response.json();
}

export function submitQuestion(question: string) {
  return request<ProcessQuestionResult>("/questions", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function fetchQuestions() {
  return request<{ questions: QuestionMapping[] }>("/questions");
}
