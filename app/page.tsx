"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterTabs from "./components/FilterTabs";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

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
  async function handleCreate(data: {
    title: string;
    description?: string;
    priority: Item["priority"];
  }) {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newItem: Item = await res.json();
      setItems((prev) => [newItem, ...prev]); // Add to top of list
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
      <h1 className="text-2xl font-bold text-center">Task Tracker (Drizzle + Postgres)</h1>

      {/* CREATE FORM */}
      <ItemForm onCreate={handleCreate} />

      {/* FILTER TABS */}
      <FilterTabs
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {/* ITEMS LIST */}
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
