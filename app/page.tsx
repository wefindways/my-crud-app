"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Item } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterTabs from "./components/FilterTabs";
import ErrorBanner from "./components/ErrorBanner";
import Pagination from "./components/Pagination";

function ItemsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateUrl = useCallback(
    (status: string, nextPage: number) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (nextPage > 1) params.set("page", String(nextPage));
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
    },
    [router],
  );

  // 1. READ (GET /api/items?status=...&page=...)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));

      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load tasks. Please try again.");
      }

      const data: { items: Item[]; total: number; totalPages: number } =
        await res.json();

      // This page became empty (e.g. we deleted its last task) → go back one page.
      if (data.items.length === 0 && page > 1) {
        updateUrl(statusFilter, page - 1);
        return;
      }

      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setErrorMessage("Unable to load tasks. Please check your connection.");
    }
    setLoading(false);
  }, [statusFilter, page, updateUrl]);

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
        setErrorMessage(null);
        if (page === 1) await fetchItems();
        else updateUrl(statusFilter, 1);
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

      await fetchItems();
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
      await fetchItems();
    } catch {
      setErrorMessage("Failed to delete task. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-15 space-y-6">
      {/* GLOBAL ERROR BANNER */}
      {errorMessage && (
        <ErrorBanner
          message={errorMessage}
          onRetry={() => fetchItems()}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      <div className="grid gap-8 md:grid-cols-[280px_minmax(0,1fr)] items-start">
        {/* LEFT COLUMN: CREATE FORM */}
        <div className="md:sticky md:top-8">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 pb-2">
            Task Tracker
          </h1>

          <ItemForm onCreate={handleCreate} />
        </div>

        {/* RIGHT COLUMN: TABS, LIST & PAGINATION */}
        <div className="min-w-0 space-y-4">
          <FilterTabs
            activeFilter={statusFilter}
            onSelectFilter={(filter) => updateUrl(filter, 1)}
          />

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              No tasks found.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
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

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={(nextPage) => updateUrl(statusFilter, nextPage)}
          />
        </div>
      </div>
    </main>
  );
}

export default function ItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-neutral-400" />
        </div>
      }
    >
      <ItemsPageContent />
    </Suspense>
  );
}
