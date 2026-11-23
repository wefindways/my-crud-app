import { Pencil, Trash2 } from "lucide-react";
import { Item } from "@/lib/db/schema";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({
  item,
  onEdit,
  onDelete,
}: ItemCardProps) {
  const isCompleted = item.status === "completed";

  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium break-words ${
            isCompleted
              ? "line-through text-zinc-400 dark:text-zinc-500"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 break-words">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onEdit(item)}
          aria-label="Edit task"
          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>

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
