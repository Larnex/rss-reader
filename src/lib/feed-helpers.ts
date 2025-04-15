import type { Feed, RSSFeed } from "@/types/rss";

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function fetchFeed(
  url: string
): Promise<{ feed: RSSFeed; items: unknown[] }> {
  const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch feed");
  }

  return response.json();
}

export function createFeed(rssFeed: RSSFeed, feedUrl: string): Feed {
  return {
    ...rssFeed,
    id: generateId(),
    feedUrl: feedUrl,
    lastUpdated: new Date(),
    unreadCount: rssFeed.items.length,
  };
}

export const defaultFeeds = [
  "https://www.nasa.gov/rss/dyn/breaking_news.rss",
  "https://bookriot.com/feed",
  "http://pitchfork.com/rss/news",
];
