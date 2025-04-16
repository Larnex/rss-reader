"use client";

import { FilteredArticleView } from "@/components/article/filtered-article-view";
import { useFeedsStore } from "@/stores/feeds-store";
import { useParams } from "next/navigation";

export default function FeedPage() {
  const params = useParams();
  const feedId = params.id as string;
  const { feeds } = useFeedsStore();

  const feed = feeds.find((f) => f.id === feedId);
  const title = feed?.title || "Feed Articles";

  return <FilteredArticleView filter={{ feedId }} title={title} />;
}
