"use client";

import { ArticleCarousel } from "./article-carousel";
import { useState } from "react";
import { ArticleCard } from "./article-card";
import { ArticleSearch } from "./article-search";
import {
  FeedSubscription,
  useUserPreferencesStore,
} from "@/stores/user-preferences-store";
import { useAllFeeds, useArticles, useFeed } from "@/hooks/use-feed";

export function ArticleList() {
  const { subscribedFeeds } = useUserPreferencesStore();
  const { isLoading } = useAllFeeds();
  const [searchQuery, setSearchQuery] = useState("");

  const { articles: searchResults } = useArticles(
    searchQuery.trim() ? { searchQuery } : undefined
  );

  const isSearchActive = searchQuery.trim().length > 0;

  if (subscribedFeeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-xl font-semibold mb-2">No feeds added yet</h2>
        <p className="text-muted-foreground">
          Add some RSS feeds to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-6">
      <ArticleSearch
        value={searchQuery}
        onChangeAction={setSearchQuery}
        className="w-full max-w-md mx-auto"
      />
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">
            Refreshing feeds...
          </div>
        </div>
      )}

      {isSearchActive ? (
        <div className="px-8 sm:px-10 md:px-12">
          <h2 className="text-xl font-semibold mb-4">
            Search Results ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <FeedCarousels feeds={subscribedFeeds} />
      )}
    </div>
  );
}

function FeedCarousels({ feeds }: { feeds: FeedSubscription[] }) {
  return (
    <>
      {feeds.map((feed) => (
        <FeedCarouselContainer key={feed.id} feedId={feed.id} />
      ))}
    </>
  );
}

function FeedCarouselContainer({ feedId }: { feedId: string }) {
  const { data, isLoading } = useFeed(feedId);

  if (isLoading || !data) {
    return (
      <div className="px-8 sm:px-10 md:px-12 py-4">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="flex space-x-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="min-w-[300px] h-[360px] bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const feedTitle = data.feed.title;
  const articles = data.feed.items;

  if (articles.length === 0) {
    return null;
  }

  const feedWithArticles = {
    id: feedId,
    title: feedTitle,
    items: articles,
  };

  return <ArticleCarousel feed={feedWithArticles} />;
}
