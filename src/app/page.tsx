import { BookmarkList } from "@/components/bookmark-list";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { bookmarks } from "@/data/schema";
import { db } from "@/data";

export default async function Home() {
  const filteredBookmarks = await db.select().from(bookmarks);

  return (
    <main className="container mx-auto p-4 font-mono">
      <Header />
      <SearchBar />
      <BookmarkList bookmarks={filteredBookmarks} />
    </main>
  );
}
