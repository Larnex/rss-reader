import React, { RefObject, useEffect, useRef } from "react";
import { Article } from "@/types/rss";
import { processHtml } from "@/lib/article-helpers";
import { useArticlesStore } from "@/stores/articles-store";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ArticleContent } from "./article-content";
import ArticleProgress from "./article-progress";
import { toast } from "sonner";

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const content = article["content:encoded"] || article.content;
  const containerRef = useRef<HTMLDivElement>(null);
  const { markAsRead } = useArticlesStore();
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Walk up the DOM tree to find the scrollable parent
      let parent = containerRef.current.parentElement;
      while (parent) {
        const computedStyle = window.getComputedStyle(parent);
        const overflow =
          computedStyle.getPropertyValue("overflow") ||
          computedStyle.getPropertyValue("overflow-y");

        if (overflow === "auto" || overflow === "scroll") {
          scrollableRef.current = parent as HTMLDivElement;
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

  const progress = useScrollProgress(scrollableRef as RefObject<HTMLElement>);

  useEffect(() => {
    if (progress >= 0.9 && !article.read) {
      markAsRead(article.id);
      toast("Article marked as read", {
        description: `You've finished reading "${article.title}"`,
        position: "bottom-right",
        duration: 5000,
      });
    }
  }, [progress, article.id, article.read, article.title, markAsRead]);

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No content available to display</p>
      </div>
    );
  }

  const processedContent = processHtml(content);

  return (
    <div className="article-container" ref={containerRef}>
      <ArticleProgress progress={progress} />
      <ArticleContent
        title={article.title}
        author={article.author}
        pubDate={article.pubDate}
        content={processedContent || ""}
      />
    </div>
  );
}
