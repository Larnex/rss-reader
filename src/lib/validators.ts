import type { RSSFeed, RSSItem } from "@/types/rss";

export function isValidRSSData(data: unknown): data is RSSFeed {
  return (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    "description" in data &&
    "link" in data &&
    "items" in data &&
    Array.isArray(data.items)
  );
}

export function isValidRSSItem(item: unknown): item is RSSItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "title" in item &&
    "link" in item &&
    "description" in item &&
    "pubDate" in item
  );
}
