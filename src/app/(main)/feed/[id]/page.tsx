"use client";

import { FilteredArticleView } from "@/components/article/filtered-article-view";
import { useFeed } from "@/hooks/use-feed";
import { useParams } from "next/navigation";

export default function FeedPage() {
  const params = useParams();
  const feedId = params.id as string;
  const { data, isLoading } = useFeed(feedId);

  const title = data?.feed.title || "Feed Articles";

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <FilteredArticleView filter={{ feedId }} title={title} />;
}
