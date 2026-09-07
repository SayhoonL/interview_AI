import type { QuestionMapping } from "../lib/api";
import { categoryLabel } from "../lib/category";

interface SidebarProps {
  items: QuestionMapping[];
  loading: boolean;
  activeId: string | null;
  listActive: boolean;
  onNewQuestion: () => void;
  onSelect: (item: QuestionMapping) => void;
  onShowAll: () => void;
}

export function Sidebar({
  items,
  loading,
  activeId,
  listActive,
  onNewQuestion,
  onSelect,
  onShowAll,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-white">
            IA
          </div>
          <span className="font-serif text-base text-text">Interview AI</span>
        </div>
        <button
          onClick={onNewQuestion}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition hover:bg-accent-soft hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          New question
        </button>
        <button
          onClick={onShowAll}
          className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-surface ${
            listActive ? "bg-surface text-accent" : "text-text"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 4.5h10M3 8h10M3 11.5h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          All questions
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          Recent
        </p>
        {loading && items.length === 0 && (
          <p className="px-2 py-2 text-sm text-text-muted">Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="px-2 py-2 text-sm text-text-muted">No questions yet</p>
        )}
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.raw_id}>
              <button
                onClick={() => onSelect(item)}
                className={`w-full rounded-lg px-2 py-2 text-left transition hover:bg-surface ${
                  activeId === item.raw_id ? "bg-surface" : ""
                }`}
              >
                <p className="truncate text-sm text-text">{item.raw_question}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {categoryLabel(item.category)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
