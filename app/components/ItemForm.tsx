import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface ItemFromProps {
  onCreate: (data: {
    title: string;
    description?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function ItemForm({ onCreate }: ItemFromProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setIsSubmitting(true);

    try {
      const result = await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (result.success) {
        setTitle("");
        setDescription("");
      } else if (result.error) {
        setFieldError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
      >
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          New Task
        </h2>

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder="Task title..."
          required
          maxLength={120}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none dark:bg-zinc-900 ${
            fieldError
              ? "border-red-500"
              : "border-zinc-300 focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
          }`}
          disabled={isSubmitting}
        />

        {fieldError && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldError}</p>
        )}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}
