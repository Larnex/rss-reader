"use client";

import { useArticlesStore } from "@/stores/articles-store";
import { ArticleView } from "@/components/article/article-view";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { getArticlesById } = useArticlesStore();

  const id = params.id as string;
  const articles = id ? getArticlesById(id) : undefined;
  const article = articles && articles.length > 0 ? articles[0] : undefined;

  const handleClose = () => {
    router.back();
  };

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
