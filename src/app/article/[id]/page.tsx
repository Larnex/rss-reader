"use client";

import { ArticleView } from "@/components/article/article-view";
import { useParams, useRouter } from "next/navigation";
import { useArticle } from "@/hooks/use-feed";

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;
  const { article, isLoading } = useArticle(id);

  const handleClose = () => {
    router.back();
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Article not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ArticleView article={article} onClose={handleClose} />
    </div>
  );
}
