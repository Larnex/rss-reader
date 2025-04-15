/* eslint-disable max-lines-per-function */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article, RSSItem } from "@/types/rss";
import { generateId } from "@/lib/feed-helpers";
import {
  articleMatchesSearch,
  extractImageUrl,
  sortArticlesByDate,
} from "@/lib/article-helpers";

export type ArticleFilter = {
  feedId?: string;
  onlyUnread?: boolean;
  onlyFavorites?: boolean;
  onlyReadLater?: boolean;
  searchQuery?: string;
};

interface ArticlesState {
  articles: Article[];
  isLoading: boolean;
  error: string | null;

  // Article actions
  addArticlesFromFeed: (feedId: string, articles: RSSItem[]) => void;
  removeArticlesFromFeed: (feedId: string) => void;

  // Article status
  markAllAsRead: (feedId: string) => void;
  markAsRead: (articleId: string, read?: boolean) => void;
  toggleFavorite: (articleId: string) => void;
  toggleReadLater: (articleId: string) => void;

  getArticles: (filter?: ArticleFilter) => Article[];
  getArticlesLength: () => number;
  getArticlesById: (id: string) => Article[] | undefined;
  getUnreadCount: () => number;
  getFavoritesCount: () => number;
  getReadLaterCount: () => number;

  clearAllArticles: () => void;
}

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set, get) => ({
      articles: [],
      isLoading: false,
      error: null,

      // Transform RSSItem to Article with properties like read, favorite, etc.
      addArticlesFromFeed: (feedId: string, articles: RSSItem[]) => {
        set((state) => {
          const existingArticles = state.articles.filter(
            (article) => article.feedId === feedId
          );

          const updatedArticles = articles.map((article) => {
            const existingArticle = existingArticles.find(
              (a) =>
                (article.guid && a.guid === article.guid) ||
                a.link === article.link
            );

            if (existingArticle) {
              return {
                ...existingArticle,
                title: article.title,
                description: article.description,
                pubDate: article.pubDate,
                content: article.content,
                contentSnippet: article.contentSnippet,
                author: article.author,
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
              author: article.author,
              categories: article.categories,
              guid: article.guid,
              isoDate: article.isoDate,
              readLater: false,
              read: false,
              favorite: false,
              imageUrl: extractImageUrl(article),
            };
          });

          const otherArticles = state.articles.filter(
            (article) => article.feedId !== feedId
          );

          return {
            articles: [...otherArticles, ...updatedArticles],
          };
        });
      },

      removeArticlesFromFeed: (feedId: string) => {
        set((state) => {
          return {
            articles: state.articles.filter(
              (article) => article.feedId !== feedId
            ),
          };
        });
      },

      markAsRead: (articleId: string, read = true) => {
        set((state) => {
          return {
            articles: state.articles.map((article) =>
              article.id === articleId ? { ...article, read } : article
            ),
          };
        });
      },

      markAllAsRead: (feedId?: string) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            feedId
              ? article.feedId === feedId
                ? { ...article, read: true }
                : article
              : { ...article, read: true }
          ),
        }));
      },

      toggleFavorite: (articleId: string) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === articleId
              ? { ...article, favorite: !article.favorite }
              : article
          ),
        }));
      },

      toggleReadLater: (articleId: string) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === articleId
              ? { ...article, readLater: !article.readLater }
              : article
          ),
        }));
      },

      getArticles: (filter?: ArticleFilter) => {
        const articles = get().articles;

        if (!filter) return sortArticlesByDate(articles);

        return sortArticlesByDate(
          articles.filter((article) => {
            // Filter by feed
            if (filter.feedId && article.feedId !== filter.feedId) {
              return false;
            }

            // Filter by read status
            if (filter.onlyUnread && article.read) {
              return false;
            }

            // Filter by favorite status
            if (filter.onlyFavorites && !article.favorite) {
              return false;
            }

            // Filter by search query
            if (
              filter.searchQuery &&
              !articleMatchesSearch(article, filter.searchQuery)
            ) {
              return false;
            }

            return true;
          })
        );
      },

      getArticlesById: (id: string) => {
        return get().articles.filter((article) => article.id === id);
      },

      getUnreadCount: () => {
        return get().articles.filter((a) => !a.read).length;
      },

      // Count favorite articles
      getFavoritesCount: () => {
        return get().articles.filter((a) => a.favorite).length;
      },

      getReadLaterCount: () => {
        return get().articles.filter((a) => a.readLater).length;
      },

      getArticlesLength: () => {
        return get().articles.length;
      },

      // Clear all articles
      clearAllArticles: () => {
        set({ articles: [] });
      },
    }),
    {
      name: "rss-reader-articles",
    }
  )
);
