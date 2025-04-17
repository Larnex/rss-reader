"use client";

import { Article } from "@/types/rss";
import {
  BookmarkIcon,
  CalendarIcon,
  BookOpenCheck,
  BookOpen,
  ExternalLinkIcon,
  StarIcon,
} from "lucide-react";
import { useArticlesStore } from "@/stores/articles-store";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/article-helpers";
import noImage from "../../../public/no-image.jpg";
import { useRouter } from "next/navigation";
interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();
  const { toggleFavorite, toggleReadLater, markAsRead } = useArticlesStore();

  const hasFullContent: boolean = article["content:encoded"]
    ? article["content:encoded"].length > 1000
    : false;

  const publishedDate = article.isoDate || article.pubDate;
  const formattedDate = publishedDate ? formatDate(publishedDate) : "";

  const handleArticleClick = () => {
    if (!article.read && !hasFullContent) {
      markAsRead(article.id, true);
    }

    if (hasFullContent) {
      router.push(`/article/${article.id}`);
    } else {
      // Article has only a link, open in new tab
      window.open(article.link, "_blank");
    }
  };

  const handleReadToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(article.id, !article.read);
  };

  return (
    <div
      className={cn(
        "flex-col h-96 w-full rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md flex",
        article.read ? "bg-muted/80" : "bg-card"
      )}
    >
      <div className="flex flex-col flex-1">
        <div className="mb-2 relative h-32 w-full overflow-hidden rounded-t">
          <img
            src={article.imageUrl ?? noImage.src}
            alt={article.title}
            className="transition-opacity object-cover fill-contain h-full w-full"
          />
          {!hasFullContent && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
              <ExternalLinkIcon size={24} className="mb-1" />
              <span className="text-xs font-medium">Opens in browser</span>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <ArticleHeader
            title={article.title}
            author={article.author}
            isRead={article.read}
            onClick={handleArticleClick}
            hasFullContent={hasFullContent}
          />

          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <CalendarIcon size={12} className="mr-1" />
            <span>{formattedDate}</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-4">
            {article.contentSnippet || article.description}
          </p>
        </div>
      </div>

      <ArticleFooter
        article={article}
        onToggleFavorite={() => toggleFavorite(article.id)}
        onToggleReadLater={() => toggleReadLater(article.id)}
        onToggleRead={handleReadToggle}
      />
    </div>
  );
}

function ArticleHeader({
  title,
  author,
  isRead,
  onClick,
  hasFullContent,
}: {
  title: string;
  author?: string;
  isRead: boolean;
  onClick: () => void;
  hasFullContent: boolean;
}) {
  return (
    <div
      className="flex flex-col justify-between"
      onClick={onClick}
      style={{ cursor: hasFullContent ? "pointer" : "default" }}
    >
      <h3
        className={cn(
          "line-clamp-2 font-medium text-sm mb-1 cursor-pointer hover:underline",
          isRead ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {title}
      </h3>
      {!hasFullContent && (
        <ExternalLinkIcon
          size={14}
          className="text-muted-foreground flex-shrink-0 ml-1 mt-1"
        />
      )}

      {author && (
        <div className="flex text-xs text-muted-foreground mb-2">
          <span className="mr-1">By</span>
          <span className="font-medium">{author}</span>
        </div>
      )}
    </div>
  );
}

function ArticleFooter({
  article,
  onToggleFavorite,
  onToggleReadLater,
  onToggleRead,
}: {
  article: Article;
  onToggleFavorite: () => void;
  onToggleReadLater: () => void;
  onToggleRead: (e: React.MouseEvent) => void;
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
          article.read ? "text-green-500" : "text-primary"
        )}
        onClick={onToggleRead}
        title={article.read ? "Mark as unread" : "Mark as read"}
      >
        {article.read ? <BookOpenCheck size={22} /> : <BookOpen size={22} />}
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
