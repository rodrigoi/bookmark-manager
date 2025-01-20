import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML to extract title and favicon
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const faviconMatch = html.match(
      /<link.*?rel="(shortcut )?icon".*?href="(.*?)"/
    );
    let icon = faviconMatch ? new URL(faviconMatch[2], url).href : "";

    // If favicon found, convert it to data:URL
    if (icon) {
      const iconResponse = await fetch(icon);
      const iconBlob = await iconResponse.blob();
      const reader = new FileReader();
      icon = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(iconBlob);
      });
    }

    return NextResponse.json({ title, icon });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
