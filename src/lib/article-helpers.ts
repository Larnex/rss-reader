import { Article, RSSItem } from "@/types/rss";

export function extractImageUrl(article: RSSItem): string | undefined {
  if (article["content:encoded"] ?? article.content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      article["content:encoded"] ?? article.content ?? "",
      "text/html"
    );
    const img = doc.querySelector("img");
    if (img) {
      return img.src;
    }
  }

  return undefined;
}

export function sortArticlesByDate(articles: Article[]) {
  return articles.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB.getTime() - dateA.getTime();
  });
}

export function articleMatchesSearch(
  article: Article,
  searchQuery: string
): boolean {
  if (!searchQuery.trim()) return true;

  const query = searchQuery.toLowerCase();

  // Search in title
  if (article.title?.toLowerCase().includes(query)) return true;

  return false;
}
