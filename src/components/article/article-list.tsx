"use client";

import { useFeedsStore } from "@/stores/feeds-store";
import { ArticleCarousel } from "./article-carousel";
import { useEffect, useState } from "react";
import { useArticlesStore } from "../../stores/articles-store";
import { ArticleCard } from "./article-card";
import { ArticleSearch } from "./article-search";

export function ArticleList() {
  const { feeds, refreshAllFeeds, isLoading } = useFeedsStore();
  const { articles } = useArticlesStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    refreshAllFeeds();
  }, [refreshAllFeeds]);

  const filteredArticles = searchQuery
    ? articles.filter((article) =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // If search is active, show filtered results
  const isSearchActive = searchQuery.trim().length > 0;

  if (feeds.length === 0) {
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
            Search Results ({filteredArticles.length})
          </h2>
          {filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      ) : (
        feeds.map((feed) => <ArticleCarousel key={feed.id} feed={feed} />)
      )}
    </div>
  );
}
