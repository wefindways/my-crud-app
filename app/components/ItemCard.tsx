import { Trash2 } from "lucide-react";
import { Item } from "@/lib/db/schema";

interface ItemCardProps {
  item: Item;
  onStatusChange: (id: string, status: Item["status"]) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({
  item,
  onStatusChange,
  onDelete,
}: ItemCardProps) {
  const isCompleted = item.status === "completed";

  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            isCompleted
              ? "line-through text-zinc-400 dark:text-zinc-500"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(item.id, e.target.value as Item["status"])
          }
          className="border border-zinc-300 bg-transparent px-2 py-1 text-xs text-zinc-700 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <option value="pending" className="dark:bg-zinc-900">
            Pending
          </option>
          <option value="in_progress" className="dark:bg-zinc-900">
            In Progress
          </option>
          <option value="completed" className="dark:bg-zinc-900">
            Completed
          </option>
        </select>

        <button
          onClick={() => onDelete(item.id)}
          aria-label="Delete task"
          className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
