"use client";

import { Pencil, X } from "lucide-react";

import Image from "next/image";
import { useState } from "react";

interface Bookmark {
  id: number;
  title: string;
  icon: string;
  url: string;
  date: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  isManaging: boolean;
  onUpdate: (id: number, newTitle: string) => void;
  onRemove: (id: number) => void;
}

export function BookmarkList({
  bookmarks,
  isManaging,
  onUpdate,
  onRemove,
}: BookmarkListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditingTitle(bookmark.title);
  };

  const handleSave = () => {
    if (editingId !== null) {
      onUpdate(editingId, editingTitle);
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No Results Found. Press Enter to add a new bookmark.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          onClick={(e) => {
            if (!isManaging && e.target === e.currentTarget) {
              window.open(`https://${bookmark.url}`, "_blank");
            }
          }}
          className={`flex items-center justify-between gap-4 hover:bg-gray-50 group ${
            !isManaging ? "cursor-pointer" : ""
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            {bookmark.icon.startsWith("data:") ? (
              <Image
                src={bookmark.icon || "/placeholder.svg"}
                alt={`Icon for ${bookmark.title}`}
                width={16}
                height={16}
                className="w-4 h-4"
              />
            ) : (
              <span className="text-gray-500 w-4 h-4 flex items-center justify-center">
                {bookmark.icon}
              </span>
            )}
            {editingId === bookmark.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="flex-1 border px-2 py-1 font-mono focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                onClick={() =>
                  !isManaging &&
                  window.open(`https://${bookmark.url}`, "_blank")
                }
              >
                {bookmark.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span
              onClick={() =>
                !isManaging && window.open(`https://${bookmark.url}`, "_blank")
              }
            >
              [{bookmark.url}]
            </span>
            <span>{bookmark.date}</span>
            {isManaging && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(bookmark);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(bookmark.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
