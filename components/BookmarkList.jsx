"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to load bookmarks");
  }

  return Array.isArray(data) ? data : [];
};

export default function BookmarkList() {
  const {
    data: bookmarks,
    error,
    mutate,
  } = useSWR("/api/bookmarks", fetcher, {
    refreshInterval: 3000,
  });

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) mutate();
      else alert("Delete failed");
    } catch (deleteError) {
      console.error(deleteError);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-200">
        {error.message || "Failed to load bookmarks"}
      </div>
    );
  }

  if (!bookmarks) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-500/70 bg-[#102437]/70 py-16 text-center">
        <p className="mb-1 text-slate-200">No bookmarks yet</p>
        <p className="text-sm text-slate-400">
          Add your first saved link from the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <article
          key={bookmark.id}
          className="card group flex h-full flex-col transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/60"
        >
          <div className="flex flex-1 flex-col p-5 min-w-0">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3
                className="w-full truncate text-lg font-semibold text-white"
                title={bookmark.title}
              >
                {bookmark.title}
              </h3>
              <button
                onClick={() => handleDelete(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                title="Delete bookmark"
              >
                {deletingId === bookmark.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 block truncate text-sm text-cyan-200 transition hover:text-cyan-100"
              title={bookmark.url}
            >
              {bookmark.url}
            </a>

            <div className="mt-auto flex items-center justify-between border-t border-slate-500/60 pt-3 text-xs text-slate-400">
              <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-200 transition hover:text-white"
              >
                Visit
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
