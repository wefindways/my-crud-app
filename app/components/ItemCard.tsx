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
  return (
    <li
      className="flex items-center justify-between rounded-lg border p-4"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.title}</span>
          <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs">
            {item.priority}
          </span>
        </div>
        {item && <p className="text-sm text-zinc-500">{item.description}</p>}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(item.id, e.target.value as Item["status"])
          }
          className="rounded border px-2 py-1 text-xs bg-transparent"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onDelete(item.id)}
          className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
