import { useEffect, useState } from "react";
import { fetchQuestions, submitQuestion, type QuestionMapping } from "../lib/api";
import { fromHistoryItem, fromSubmitResult, type DisplayResult } from "../lib/normalize";
import { Sidebar } from "./Sidebar";
import { Composer } from "./Composer";
import { ResultCard } from "./ResultCard";
import { QuestionListView } from "./QuestionListView";

type View = "chat" | "list";

export function Workspace() {
  const [history, setHistory] = useState<QuestionMapping[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [result, setResult] = useState<DisplayResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("chat");

  async function loadHistory() {
    try {
      const { questions } = await fetchQuestions();
      setHistory(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleSubmit(question: string) {
    setSubmitting(true);
    setError(null);
    setActiveId(null);
    setView("chat");

    try {
      const response = await submitQuestion(question);
      setResult(fromSubmitResult(question, response));
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSelect(item: QuestionMapping) {
    setActiveId(item.raw_id);
    setResult(fromHistoryItem(item));
    setView("chat");
  }

  function handleNewQuestion() {
    setActiveId(null);
    setResult(null);
    setError(null);
    setView("chat");
  }

  function handleShowAll() {
    setView("list");
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar
        items={history}
        loading={historyLoading}
        activeId={activeId}
        listActive={view === "list"}
        onNewQuestion={handleNewQuestion}
        onSelect={handleSelect}
        onShowAll={handleShowAll}
      />

      <main className="flex flex-1 flex-col">
        {view === "list" ? (
          <QuestionListView items={history} loading={historyLoading} />
        ) : result ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-8">
                <div className="self-end rounded-2xl bg-sidebar px-4 py-2.5 text-sm text-text">
                  {result.rawQuestion}
                </div>
                <ResultCard result={result} />
              </div>
            </div>
            <div className="border-t border-border bg-bg px-6 py-4">
              <div className="mx-auto max-w-2xl">
                {error && <p className="mb-2 text-sm text-danger">{error}</p>}
                <Composer onSubmit={handleSubmit} disabled={submitting} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl">
              <h1 className="mb-6 text-center font-serif text-3xl text-text">
                What interview question would you like to check?
              </h1>
              {error && <p className="mb-2 text-center text-sm text-danger">{error}</p>}
              <Composer onSubmit={handleSubmit} disabled={submitting} />
              {submitting && (
                <p className="mt-3 text-center text-sm text-text-muted">Thinking…</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
