"use client";

import { Article } from "@/types/rss";
import { BookmarkIcon, CalendarIcon, StarIcon } from "lucide-react";
import { useArticlesStore } from "@/stores/articles-store";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import noImage from "../../../public/no-image.jpg";
import { useRouter } from "next/navigation";
interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();
  const { toggleFavorite, toggleReadLater, markAsRead } = useArticlesStore();

  const handleArticleClick = () => {
    if (!article.read && !article["content:encoded"]) {
      markAsRead(article.id, true);
    }

    if (
      article["content:encoded"] &&
      article["content:encoded"].length > 1000
    ) {
      router.push(`/article/${article.id}`);
    } else {
      // Article has only a link, open in new tab
      window.open(article.link, "_blank");
    }
  };

  const publishedDate = article.isoDate || article.pubDate;
  const formattedDate = publishedDate
    ? formatDistanceToNow(new Date(publishedDate), { addSuffix: true })
    : "";

  return (
    <div
      className={cn(
        "flex-col h-96 w-full rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md flex",
        article.read ? "bg-muted/40" : "bg-card"
      )}
    >
      <div className="flex flex-col flex-1">
        <div className="mb-2 relative h-32 w-full overflow-hidden rounded-t">
          <img
            src={article.imageUrl ?? noImage.src}
            alt={article.title}
            className="transition-opacity object-cover fill-contain h-full w-full"
          />
        </div>
        <div className="flex flex-col flex-1 p-4">
          <ArticleHeader
            title={article.title}
            isRead={article.read}
            onClick={handleArticleClick}
          />

          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <CalendarIcon size={12} className="mr-1" />
            <span>{formattedDate}</span>
          </div>

          {article.author && (
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <span className="mr-1">By</span>
              <span className="font-medium">{article.author}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground line-clamp-4">
            {article.contentSnippet || article.description}
          </p>
        </div>
      </div>

      <ArticleFooter
        article={article}
        onToggleFavorite={() => toggleFavorite(article.id)}
        onToggleReadLater={() => toggleReadLater(article.id)}
      />
    </div>
  );
}

function ArticleHeader({
  title,
  isRead,
  onClick,
}: {
  title: string;
  isRead: boolean;
  onClick: () => void;
}) {
  return (
    <h3
      className={cn(
        "line-clamp-2 font-medium text-sm mb-1 cursor-pointer hover:underline",
        isRead ? "text-muted-foreground" : "text-foreground"
      )}
      onClick={onClick}
    >
      {title}
    </h3>
  );
}

function ArticleFooter({
  article,
  onToggleFavorite,
  onToggleReadLater,
}: {
  article: Article;
  onToggleFavorite: () => void;
  onToggleReadLater: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20">
      <button
        className={cn(
          "rounded-full hover:bg-muted",
          article.readLater ? "text-blue-500" : "text-muted-foreground"
        )}
        onClick={onToggleReadLater}
      >
        <BookmarkIcon
          size={22}
          className={cn(article.readLater ? "fill-blue-500" : "")}
        />
      </button>

      <button
        className={cn(
          "p-1 rounded-full hover:bg-muted",
          article.favorite ? "text-yellow-500" : "text-muted-foreground"
        )}
        onClick={onToggleFavorite}
      >
        <StarIcon
          size={22}
          className={cn(article.favorite ? "fill-yellow-500" : "")}
        />
      </button>
    </div>
  );
}
