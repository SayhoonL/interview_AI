export function normalizeQuestion(question: string): string {
    return question
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
}