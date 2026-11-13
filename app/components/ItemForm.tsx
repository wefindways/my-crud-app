import { useState } from "react";
import { Plus } from "lucide-react";
import type { Item } from "@/lib/db/schema";

interface ItemFromProps {
  onCreate: (data: {
    title: string;
    description?: string;
    priority: Item["priority"];
  }) => Promise<void>;
}

export default function ItemForm({ onCreate }: ItemFromProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Item["priority"]>("medium");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreate({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="flex-1 rounded border px-3 py-2 text-sm bg-transparent"
            required
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Item["priority"])}
            className="rounded border px-3 py-2 text-sm bg-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="w-full rounded border px-3 py-2 text-sm bg-transparent"
        />
      </form>
    </>
  );
}
