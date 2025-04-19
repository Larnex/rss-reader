import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  articleMatchesSearch,
  transformRSSItemToArticle,
} from "../lib/article-helpers";
import type { RSSItem } from "@/types/rss";
import React, { useEffect, useMemo, useState } from "react";

export type ArticleFilter = {
  feedId?: string;
  onlyUnread?: boolean;
  onlyFavorites?: boolean;
  onlyReadLater?: boolean;
  searchQuery?: string;
};

export async function fetchFeed(url: string) {
  const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }
  return response.json();
}

export function useFeed(feedId?: string) {
  const { subscribedFeeds } = useUserPreferencesStore();
  const feedInfo = subscribedFeeds.find((feed) => feed.id === feedId);

  return useQuery({
    queryKey: ["feed", feedId],
    queryFn: async () => {
      if (!feedInfo) throw new Error("Feed not found");
      return fetchFeed(feedInfo.url);
    },
    enabled: !!feedInfo,
  });
}

export function useAllFeeds() {
  const queryClient = useQueryClient();
  const { subscribedFeeds } = useUserPreferencesStore();

  React.useEffect(() => {
    subscribedFeeds.forEach((feed) => {
      const existingData = queryClient.getQueryData(["feed", feed.id]);

      // If not in cache, prefetch it
      if (!existingData) {
        queryClient.prefetchQuery({
          queryKey: ["feed", feed.id],
          queryFn: () => fetchFeed(feed.url),
        });
      }
    });
  }, [subscribedFeeds, queryClient]);

  const feedQueries = useQueries({
    queries: subscribedFeeds.map((feed) => ({
      queryKey: ["feed", feed.id],
      queryFn: () => fetchFeed(feed.url),
    })),
  });

  const isLoading = feedQueries.some((query) => query.isLoading);
  const isError = feedQueries.some((query) => query.isError);

  const feeds = feedQueries.map((query, index) => ({
    ...query,
    feedId: subscribedFeeds[index]?.id,
  }));

  const refetch = () => {
    subscribedFeeds.forEach((feed) => {
      queryClient.invalidateQueries({ queryKey: ["feed", feed.id] });
    });
  };

  return {
    feeds,
    isLoading,
    isError,
    refetch,
  };
}

export function useArticles(filter?: ArticleFilter) {
  const { articlePreferences } = useUserPreferencesStore();
  const allFeedsQuery = useAllFeeds();

  const allArticles = allFeedsQuery.feeds
    .filter((query) => query.data)
    .flatMap((query) => {
      const feedId = query.feedId;
      const items = query.data.feed.items;

      return items.map((item: RSSItem) => {
        const articleId = item.guid || item.link;
        const userPrefs = articlePreferences[articleId] || {
          read: false,
          favorite: false,
          readLater: false,
        };

        const article = transformRSSItemToArticle(item, feedId);

        article.id = articleId;

        return {
          ...article,
          ...userPrefs,
        };
      });
    });

  // Apply filters
  return {
    articles: allArticles
      .filter((article) => {
        if (filter?.feedId && article.feedId !== filter.feedId) return false;
        if (filter?.onlyUnread && article.read) return false;
        if (filter?.onlyFavorites && !article.favorite) return false;
        if (filter?.onlyReadLater && !article.readLater) return false;
        if (
          filter?.searchQuery &&
          !articleMatchesSearch(article, filter.searchQuery)
        )
          return false;
        return true;
      })
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      ),
    isLoading: allFeedsQuery.feeds.some((query) => query.isLoading),
    isError: allFeedsQuery.feeds.some((query) => query.isError),
    error: allFeedsQuery.feeds.find((query) => query.error)?.error,
  };
}

export function useArticle(articleId: string) {
  const decodedArticleId = decodeURIComponent(articleId);

  const [error, setError] = useState<Error | null>(null);

  const {
    feeds,
    isLoading: isLoadingFeeds,
    isError: isErrorFeeds,
  } = useAllFeeds();

  const article = useMemo(() => {
    for (const feed of feeds) {
      if (!feed.data?.feed?.items) continue;

      // Try to find article in this feed
      const foundItem = feed.data.feed.items.find(
        (item: RSSItem) => (item.guid ?? item.link) === decodedArticleId
      );

      if (foundItem) {
        return transformRSSItemToArticle(foundItem, feed.feedId);
      }
    }

    // If no article found in any feed
    return null;
  }, [feeds, decodedArticleId]);

  useEffect(() => {
    if (!article || isErrorFeeds) {
      setError(new Error("Article not found"));
    }
  }, [article, decodedArticleId, isErrorFeeds]);

  return {
    article,
    isLoading: isLoadingFeeds,
    error: error,
  };
}
