import type { DisplayResult } from "../lib/normalize";
import { CategoryBadge } from "./CategoryBadge";

function StatusBadge({ result }: { result: DisplayResult }) {
  if (!result.duplicate) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        New canonical question
      </span>
    );
  }

  const pct =
    result.similarityScore !== null
      ? `${Math.round(result.similarityScore * 100)}% match`
      : null;

  const label = result.matchType === "EXACT" ? "Exact duplicate" : "Semantic duplicate";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-2.5 py-0.5 text-xs font-medium text-text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
      {label}
      {pct ? ` · ${pct}` : ""}
    </span>
  );
}

export function ResultCard({ result }: { result: DisplayResult }) {
  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge result={result} />
        <CategoryBadge category={result.category} />
      </div>

      {result.canonicalQuestion && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
            Canonical question
          </p>
          <p className="font-serif text-base text-text">{result.canonicalQuestion}</p>
        </div>
      )}

      {result.enhancedQuestion && (
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
            Enhanced question
          </p>
          <p className="text-sm leading-relaxed text-text">{result.enhancedQuestion}</p>
        </div>
      )}
    </div>
  );
}
