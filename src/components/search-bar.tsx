import { Search } from "lucide-react";
import { bookmarks } from "@/data/schema";
import { db } from "@/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const urlSchema = z.string().url();

const getMetadata = async (
  url: string
): Promise<{ title: string; icon: string }> => {
  "use server";
  const response = await fetch(url);

  const html = await response.text();

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  const faviconMatch = html.match(
    /<link.*?rel="(shortcut )?icon".*?href="(.*?)"/
  );
  let iconURL = faviconMatch ? new URL(faviconMatch[2], url).href : "";

  let icon = "";
  if (iconURL) {
    const iconResponse = await fetch(iconURL);
    const iconArrayBuffer = await iconResponse.arrayBuffer();
    const buffer = Buffer.from(iconArrayBuffer);
    icon = `data:${
      iconResponse.headers.get("content-type") || "image/x-icon"
    };base64,${buffer.toString("base64")}`;
  }

  return { title, icon };
};

const handleSubmit = async (formData: FormData): Promise<void> => {
  "use server";

  const url = formData.get("url") as string;

  console.log(url);

  const result = urlSchema.safeParse(url);
  if (!result.success || !url) {
    return;
  }

  const normalizedUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  try {
    const { title, icon } = await getMetadata(url);

    await db.insert(bookmarks).values({
      title: title || url,
      url: url,
      icon: icon || "📄",
    });

    revalidatePath("/");
  } catch (error) {
    return;
  }
};

export function SearchBar() {
  return (
    <div className="sticky top-0 bg-white z-10 py-4">
      <div className="relative">
        <form action={handleSubmit}>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Search or paste URL (Press '/' to focus)"
            className={`w-full border px-12 py-3 font-mono text-sm focus:outline-none`}
          />
        </form>
      </div>
    </div>
  );
}
