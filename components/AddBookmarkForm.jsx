"use client";

import { useState } from "react";
import { mutate } from "swr";

export default function AddBookmarkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      });

      if (response.ok) {
        setUrl("");
        setTitle("");
        mutate("/api/bookmarks");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add bookmark");
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card mb-8 p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Add Bookmark</h2>
        <p className="soft-text text-sm">Add a title and full URL</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end"
      >
        <div className="space-y-2 md:col-span-4">
          <label htmlFor="title" className="field-label block">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My favorite site"
            className="text-input"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-6">
          <label htmlFor="url" className="field-label block">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="text-input"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="primary-btn w-full px-4"
          >
            {loading ? "Adding..." : "Add Link"}
          </button>
        </div>
      </form>
    </section>
  );
}
