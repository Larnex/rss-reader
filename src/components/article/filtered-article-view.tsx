"use client";

import { ArticleCard } from "./article-card";
import { useState } from "react";
import { ArticleSearch } from "./article-search";
import { ArticleFilter, useArticles, useFeed } from "@/hooks/use-feed";

interface FilteredArticleViewProps {
  filter?: ArticleFilter;
  title: string;
}

export function FilteredArticleView({
  filter,
  title,
}: FilteredArticleViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const feedQuery = useFeed(filter?.feedId);

  const mergedFilter = {
    ...filter,
    searchQuery: searchQuery.trim() ? searchQuery : undefined,
  };

  const { articles } = useArticles(mergedFilter);

  if (articles.length === 0 && !searchQuery) {
    return <ArticleLoading filter={filter} />;
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

        {filter?.feedId && feedQuery.data && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p>{feedQuery.data.feed.description}</p>
            <p className="mt-1">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

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

function ArticleLoading({ filter }: { filter?: ArticleFilter }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h2 className="text-xl font-semibold mb-2">No articles found</h2>
      <p className="text-muted-foreground">
        {filter?.onlyReadLater
          ? "Try adding articles to Read Later"
          : filter?.onlyFavorites
          ? "Try adding articles to Favorites"
          : filter?.onlyUnread
          ? "All articles have been read"
          : "Try subscribing to more feeds"}
      </p>
    </div>
  );
}
