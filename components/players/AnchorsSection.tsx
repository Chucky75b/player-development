"use client";

import { useState, useTransition } from "react";
import { saveAnchor, deleteAnchor } from "@/app/players/[id]/actions";

type Anchor = {
  id: string;
  title: string;
  description: string | null;
};

type Props = {
  playerId: string;
  initialItems: Anchor[];
};

const inputClass =
  "w-full rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-ink-primary)] outline-none focus:border-[var(--color-court)]";

const btnPrimary =
  "rounded-[4px] bg-[var(--color-court)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1a1206] hover:bg-[var(--color-court-strong)] disabled:opacity-60";

const btnGhost =
  "rounded-[4px] border border-[var(--color-line-default)] px-3 py-1.5 text-xs text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-ink-primary)] disabled:opacity-60";

function EditForm({
  playerId,
  item,
  onSaved,
  onCancel,
}: {
  playerId: string;
  item: Anchor | null;
  onSaved: (item: Anchor) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      const saved = await saveAnchor(playerId, {
        id: item?.id,
        title,
        description,
      });
      onSaved(saved);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-[4px] border border-[var(--color-line-default)] bg-[var(--color-surface-2)] p-3">
      <input
        className={inputClass}
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={inputClass}
        placeholder="Description"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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

export function AnchorsSection({ playerId, initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  const handleSaved = (saved: Anchor) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [...prev, saved];
    });
    setEditingId(null);
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(async () => {
      await deleteAnchor(playerId, id);
    });
  };

  return (
    <section className="rounded-[6px] border border-[var(--color-line-default)] bg-[var(--color-surface-1)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-data text-xs uppercase tracking-[0.15em] text-[var(--color-court)]">
          Anchors
        </h2>
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
        {items.length === 0 && !adding && (
          <p className="text-sm text-[var(--color-ink-tertiary)]">
            No data yet.
          </p>
        )}

        {items.map((item) =>
          editingId === item.id ? (
            <EditForm
              key={item.id}
              playerId={playerId}
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
                <p className="text-sm font-semibold text-[var(--color-ink-primary)]">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-[var(--color-ink-tertiary)]">
                    {item.description}
                  </p>
                )}
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

        {adding && (
          <EditForm
            playerId={playerId}
            item={null}
            onSaved={handleSaved}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>
    </section>
  );
}
