"use client";

import { useState, useTransition } from "react";
import { saveFeedback, deleteFeedback } from "@/app/dashboard/actions";

type Feedback = {
  id: string;
  content: string;
  created_at: string;
};

type Props = {
  initialItems: Feedback[];
};

const inputClass =
  "w-full rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-ink-primary)] outline-none focus:border-[var(--color-court)]";

const btnPrimary =
  "rounded-[4px] bg-[var(--color-court)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1a1206] hover:bg-[var(--color-court-strong)] disabled:opacity-60";

const btnGhost =
  "rounded-[4px] border border-[var(--color-line-default)] px-3 py-1.5 text-xs text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink-primary)] disabled:opacity-60";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EditForm({
  item,
  onSaved,
  onCancel,
}: {
  item: Feedback | null;
  onSaved: (item: Feedback) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(item?.content ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!content.trim()) return;
    startTransition(async () => {
      const saved = await saveFeedback({ id: item?.id, content });
      onSaved(saved);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] p-3">
      <textarea
        className={inputClass}
        placeholder="Share feedback with your coaches…"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className={btnGhost}
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function PlayerFeedbackSection({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  const handleSaved = (saved: Feedback) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [saved, ...prev];
    });
    setEditingId(null);
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(async () => {
      await deleteFeedback(id);
    });
  };

  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
            Feedback
          </h2>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Visible to your coaches
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            className={btnGhost}
            onClick={() => setAdding(true)}
          >
            + Add
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {adding && (
          <EditForm
            item={null}
            onSaved={handleSaved}
            onCancel={() => setAdding(false)}
          />
        )}

        {items.length === 0 && !adding && (
          <p className="text-sm text-[var(--color-ink-tertiary)]">
            You haven&apos;t shared any feedback yet.
          </p>
        )}

        {items.map((item) =>
          editingId === item.id ? (
            <EditForm
              key={item.id}
              item={item}
              onSaved={handleSaved}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-[4px] border border-[var(--color-line-soft)] p-3"
            >
              <div>
                <p className="text-sm text-[var(--color-ink-primary)]">
                  {item.content}
                </p>
                <p className="mt-2 font-data text-[10px] uppercase text-[var(--color-ink-muted)]">
                  {formatDateTime(item.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setEditingId(item.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
