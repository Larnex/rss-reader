"use client";

import { useFeedsStore } from "@/stores/feeds-store";
import { ArticleCarousel } from "./article-carousel";
import { useEffect } from "react";

export function ArticleList() {
  const { feeds, refreshAllFeeds, isLoading } = useFeedsStore();

  useEffect(() => {
    refreshAllFeeds();
  }, [refreshAllFeeds]);

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
    <div className="space-y-10 py-6">
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">
            Refreshing feeds...
          </div>
        </div>
      )}

      {feeds.map((feed) => (
        <ArticleCarousel key={feed.id} feed={feed} />
      ))}
    </div>
  );
}
