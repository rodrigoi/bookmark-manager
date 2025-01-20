"use client";

import { useEffect, useState } from "react";

import { BookmarkList } from "@/components/bookmark-list";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { z } from "zod";

interface Bookmark {
  id: number;
  title: string;
  icon: string;
  url: string;
  date: string;
}

const urlSchema = z.string().url();

// Dummy data
const initialBookmarks: Bookmark[] = [
  {
    id: 1,
    title: "Lee Robinson",
    icon: "👤",
    url: "leerob.com",
    date: "Jan 02, 2025",
  },
  {
    id: 2,
    title: "There's no speed limit | Derek Sivers",
    icon: "⬡",
    url: "sive.rs",
    date: "Jan 02, 2025",
  },
  {
    id: 3,
    title: "Things you're allowed to do",
    icon: "M",
    url: "milan.cvitkovic.net",
    date: "Jan 02, 2025",
  },
  {
    id: 4,
    title: "PlasticList",
    icon: "⚡",
    url: "www.plasticlist.org",
    date: "Jan 01, 2025",
  },
  {
    id: 5,
    title: "Things we learned about LLMs in 2024",
    icon: "🤖",
    url: "simonwillison.net",
    date: "Jan 01, 2025",
  },
];

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      setBookmarks(initialBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(initialBookmarks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(searchLower) ||
      bookmark.url.toLowerCase().includes(searchLower)
    );
  });

  const addBookmark = async (url: string) => {
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      console.error("Invalid URL");
      return;
    }

    // Check for duplicates
    const normalizedUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const isDuplicate = bookmarks.some(
      (bookmark) =>
        bookmark.url.replace(/^https?:\/\//, "").replace(/\/$/, "") ===
        normalizedUrl
    );

    if (isDuplicate) {
      console.error("This URL already exists in your bookmarks");
      return;
    }

    try {
      const response = await fetch(
        `/api/fetchMetadata?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      const newBookmark: Bookmark = {
        id: Date.now(),
        title: data.title || url,
        icon: data.icon || "📄",
        url: url,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
      };

      setBookmarks((prev) => [...prev, newBookmark]);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };

  const updateBookmark = (id: number, newTitle: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, title: newTitle } : bookmark
      )
    );
  };

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <main className="container mx-auto p-4 font-mono">
      <Header
        isManaging={isManaging}
        onManageClick={() => setIsManaging(!isManaging)}
      />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEnter={addBookmark}
      />
      <BookmarkList
        bookmarks={filteredBookmarks}
        isManaging={isManaging}
        onUpdate={updateBookmark}
        onRemove={removeBookmark}
      />
    </main>
  );
}
