import Parser from "rss-parser";
import type { RSSFeed, RSSItem } from "../types/rss";
import { isValidRSSData } from "./validators";
import { RSSParserError } from "./errors";

const parser = new Parser<RSSFeed, RSSItem>({
  customFields: {
    feed: ["title", "description", "link", "language", "lastBuildDate"],
    item: ["title", "link", "description", "pubDate", "guid", "enclosure"],
  },
});

export async function parseFeedData(data: string): Promise<{
  feed: RSSFeed;
}> {
  if (!data?.trim()) {
    throw new RSSParserError("Empty feed data provided");
  }

  try {
    const result = await parser.parseString(data);

    if (!isValidRSSData(result)) {
      throw new RSSParserError("Invalid RSS feed format");
    }

    return {
      feed: {
        title: result.title,
        description: result.description,
        link: result.link,
        items: result.items,
        language: result.language,
        lastBuildDate: result.lastBuildDate,
      },
    };
  } catch (error) {
    if (error instanceof RSSParserError) {
      throw error;
    }
    throw new RSSParserError(
      `Failed to parse RSS feed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
