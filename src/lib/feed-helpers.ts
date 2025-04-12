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

export function createFeed(rssFeed: RSSFeed): Feed {
  return {
    ...rssFeed,
    id: generateId(),
    lastUpdated: new Date(),
    unreadCount: rssFeed.items.length,
  };
}

export const defaultFeeds = [
  {
    title: "NASA Breaking News",
    url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    description: "A RSS feed containing the latest NASA breaking news",
  },
  {
    title: "HackerNews",
    url: "https://news.ycombinator.com/rss",
    description: "Latest posts from Hacker News",
  },
  {
    title: "BBC World News",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    description: "BBC World News",
  },
];
