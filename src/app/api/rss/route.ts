import { NextResponse } from "next/server";
import { parseFeedData } from "@/lib/parser";
import { RSSParserError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get("url");

  if (!feedUrl) {
    return NextResponse.json(
      { error: "Feed URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("xml") && !contentType?.includes("rss")) {
      return NextResponse.json(
        { error: "URL does not point to a valid RSS feed" },
        { status: 400 }
      );
    }

    const data = await response.text();
    const result = await parseFeedData(data);

    return NextResponse.json(result);
  } catch (error) {
    const statusCode = error instanceof RSSParserError ? 400 : 500;
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
