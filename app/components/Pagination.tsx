import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t pt-4 text-sm text-neutral-600 dark:text-neutral-400">
      <span>
        Page <strong className="text-neutral-900 dark:text-neutral-100">{page}</strong> of{" "}
        <strong className="text-neutral-900 dark:text-neutral-100">{totalPages}</strong> ({total}{" "}
        {total === 1 ? "task" : "tasks"})
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
