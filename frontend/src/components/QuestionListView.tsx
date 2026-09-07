import type { QuestionMapping } from "../lib/api";
import { CategoryBadge } from "./CategoryBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function QuestionListView({
  items,
  loading,
}: {
  items: QuestionMapping[];
  loading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-1 font-serif text-2xl text-text">All questions</h1>
        <p className="mb-6 text-sm text-text-muted">
          {items.length} question{items.length === 1 ? "" : "s"} processed so far
        </p>

        {loading && items.length === 0 && (
          <p className="text-sm text-text-muted">Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-sm text-text-muted">No questions submitted yet.</p>
        )}

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.raw_id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <CategoryBadge category={item.category} />
                <span className="text-xs text-text-muted">
                  {formatDate(item.created_at)}
                </span>
              </div>

              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Raw question
              </p>
              <p className="mb-3 text-sm text-text">{item.raw_question}</p>

              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Canonical question
              </p>
              <p className="mb-3 font-serif text-base text-text">
                {item.canonical_question}
              </p>

              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                Enhanced question
              </p>
              <p className="text-sm leading-relaxed text-text">
                {item.enhanced_question}
              </p>

              {item.similarity_score !== null && (
                <p className="mt-3 text-xs text-text-muted">
                  Matched existing canonical question at{" "}
                  {Math.round(Number(item.similarity_score) * 100)}% similarity
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
