import React from "react";
import { Article } from "@/types/rss";
import { ArticleReader } from "./article-reader";

interface ArticleViewProps {
  article: Article;
  onClose?: () => void;
}

export function ArticleView({ article, onClose }: ArticleViewProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground flex items-center"
        >
          <span className="mr-2">←</span> Back
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <ArticleReader article={article} />
      </div>
    </div>
  );
}
