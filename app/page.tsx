"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/lib/db/schema";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Form state for creating a new item
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Item["priority"]>("medium");

  const FILTER_TABS = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
  ];

  // 1. READ (GET /api/items)
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);

      const url = statusFilter
        ? `/api/items?status=${statusFilter}`
        : "/api/items";

      const res = await fetch(url);
      const data = await res.json();

      setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, [statusFilter]);

  // 2. CREATE (POST /api/items)
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority }),
    });

    if (res.ok) {
      const newItem: Item = await res.json();
      setItems((prev) => [newItem, ...prev]); // Add to top of list
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  }

  // 3. UPDATE (PATCH /api/items/:id)
  async function handleStatusChange(id: string, status: Item["status"]) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updated: Item = await res.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
  }

  // 4. DELETE (DELETE /api/items/:id)
  async function handleDelete(id: string) {
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Task Tracker (Drizzle + Postgres)</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="space-y-3 rounded-lg border p-4">
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

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 text-sm">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full border px-3 py-1 ${
              statusFilter === tab.value ? "bg-zinc-900 text-white" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ITEMS LIST */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading items...
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.title}</span>
                  <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs">
                    {item.priority}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-zinc-500">{item.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(
                      item.id,
                      e.target.value as Item["status"],
                    )
                  }
                  className="rounded border px-2 py-1 text-xs bg-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
