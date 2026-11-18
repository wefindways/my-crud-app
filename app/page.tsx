"use client";

import { useEffect, useState, useCallback } from "react";
import type { Item } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterTabs from "./components/FilterTabs";
import ErrorBanner from "./components/ErrorBanner";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. READ (GET /api/items?status=...)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const url = statusFilter
        ? `/api/items?status=${statusFilter}`
        : "/api/items";

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to load tasks. Please try again.");
      }

      const data: Item[] = await res.json();
      setItems(data);
    } catch {
      setErrorMessage("Unable to load tasks. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchItems();
  }, [fetchItems]);

  // 2. CREATE (POST /api/items)
  async function handleCreate(data: {
    title: string;
    description?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newItem: Item = await res.json();
        setItems((prev) => [newItem, ...prev]);
        setErrorMessage(null);
        return { success: true };
      }

      const errorBody = await res.json();
      const message =
        errorBody?.errors?.fieldErrors?.title?.[0] ||
        errorBody?.error ||
        "Failed to create task.";
      return { success: false, error: message };
    } catch {
      return {
        success: false,
        error: "Unable to reach the server. Please check your connection.",
      };
    }
  }

  // 3. UPDATE (PATCH /api/items/:id)
  async function handleStatusChange(id: string, status: Item["status"]) {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error();
      }

      const updated: Item = await res.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      setErrorMessage("Failed to update task. Please try again.");
    }
  }

  // 4. DELETE (DELETE /api/items/:id)
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error();
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setErrorMessage("Failed to delete task. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Task Tracker (Drizzle + Postgres)
      </h1>

      {/* GLOBAL ERROR BANNER */}
      {errorMessage && (
        <ErrorBanner
          message={errorMessage}
          onRetry={() => fetchItems()}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* CREATE FORM */}
      <ItemForm onCreate={handleCreate} />

      {/* FILTER TABS */}
      <FilterTabs
        activeFilter={statusFilter}
        onSelectFilter={setStatusFilter}
      />

      {/* ITEMS LIST */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-neutral-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-neutral-500 py-8">
          No tasks found.
        </p>
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
