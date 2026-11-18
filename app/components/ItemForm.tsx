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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4 bg-white/50 dark:bg-neutral-900/50">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder="Task title..."
          required
          maxLength={120}
          className={`flex-1 rounded border px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 ${
            fieldError
              ? "border-red-500 focus:ring-red-400"
              : "border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
          }`}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Add
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add
            </>
          )}
        </button>
      </div>

      {fieldError && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{fieldError}</p>
      )}

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description..."
        className="w-full rounded border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      />
    </form>
  );
}
