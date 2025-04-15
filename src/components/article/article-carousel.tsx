"use client";

import { Feed } from "@/types/rss";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArticleCard } from "./article-card";
import { useArticlesStore } from "@/stores/articles-store";
import { useMemo } from "react";

interface ArticleCarouselProps {
  feed: Feed;
}

export function ArticleCarousel({ feed }: ArticleCarouselProps) {
  const allArticles = useArticlesStore((state) => state.articles);

  // Memoize the filtered articles to prevent infinite loops
  const articles = useMemo(() => {
    return allArticles.filter((article) => article.feedId === feed.id);
  }, [allArticles, feed.id]);

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 px-8 sm:px-10 md:px-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold truncate">{feed.title}</h2>
        <div className="text-sm text-muted-foreground whitespace-nowrap ml-2">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </div>
      </div>
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
        className="select-none cursor-grab"
      >
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1 h-full">
                <ArticleCard article={article} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
