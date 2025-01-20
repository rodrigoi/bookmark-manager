import type { Bookmark } from "@/data/schema";
import Image from "next/image";

const extractDomain = (url: string) => {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
};

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

const isManaging = false;

export function BookmarkList({ bookmarks }: BookmarkListProps) {
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
          className={`flex items-center justify-between gap-4 hover:bg-gray-50 group ${
            !isManaging ? "cursor-pointer" : ""
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            {bookmark.icon && bookmark.icon.startsWith("data:") ? (
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

            <span>{bookmark.title}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>[{extractDomain(bookmark.url)}]</span>
            <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
