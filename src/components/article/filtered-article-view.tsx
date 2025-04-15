"use client";

import { useArticlesStore, ArticleFilter } from "@/stores/articles-store";
import { ArticleCard } from "./article-card";
import { useFeedsStore } from "@/stores/feeds-store";
import { useState } from "react";
import { ArticleSearch } from "./article-search";

interface FilteredArticleViewProps {
  filter?: ArticleFilter;
  title: string;
}

export function FilteredArticleView({
  filter,
  title,
}: FilteredArticleViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { getArticles } = useArticlesStore();
  const { feeds, isLoading } = useFeedsStore();

  const feed = filter?.feedId
    ? feeds.find((f) => f.id === filter.feedId)
    : undefined;

  const mergedFilter = {
    ...filter,
    searchQuery: searchQuery.trim() ? searchQuery : undefined,
  };

  const articles = getArticles(mergedFilter);

  if (articles.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-xl font-semibold mb-2">No articles found</h2>
        <p className="text-muted-foreground">
          Try adding article to{" "}
          {filter?.onlyReadLater ? "Read Later" : "Favorites"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <ArticleSearch
            value={searchQuery}
            onChangeAction={setSearchQuery}
            className="w-64"
          />
        </div>
        {feed && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p>{feed.description}</p>
            <p className="mt-1">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">
            Refreshing feeds...
          </div>
        </div>
      )}

      {articles.length === 0 && searchQuery ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
