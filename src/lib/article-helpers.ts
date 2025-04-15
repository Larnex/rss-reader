import { Article, RSSItem } from "@/types/rss";
import { generateId } from "./feed-helpers";

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

export function transformRSSItemToArticle(
  article: RSSItem,
  feedId: string,
  existingArticle?: Article
): Article {
  if (existingArticle) {
    return {
      ...existingArticle,
      title: article.title,
      description: article.description,
      pubDate: article.pubDate,
      content: article.content,
      contentSnippet: article.contentSnippet,
      "content:encoded": article["content:encoded"],
      "content:encodedSnippet": article["content:encodedSnippet"],
      author: article.creator,
      categories: article.categories,
      guid: article.guid,
      isoDate: article.isoDate,
    };
  }

  return {
    id: generateId(),
    feedId,
    title: article.title,
    link: article.link,
    description: article.description,
    pubDate: article.pubDate,
    content: article.content,
    contentSnippet: article.contentSnippet,
    "content:encoded": article["content:encoded"],
    "content:encodedSnippet": article["content:encodedSnippet"],
    author: article.creator,
    categories: article.categories,
    guid: article.guid,
    isoDate: article.isoDate,
    readLater: false,
    read: false,
    favorite: false,
    imageUrl: extractImageUrl(article),
  };
}
