import { Article, RSSItem } from "@/types/rss";

export function extractImageUrl(article: RSSItem): string | undefined {
  if (article["content:encoded"] ?? article.content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      article["content:encoded"] ?? article.content ?? "",
      "text/html"
    );
    const img = doc.querySelector("img");
    console.log(" extractImageUrl img:", img);
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

export function articleMatchesSearch(article: Article, query: string): boolean {
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const searchableText = [
    article.title,
    article.description,
    article.contentSnippet,
    article.author,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchTerms.every((term) => searchableText.includes(term));
}
