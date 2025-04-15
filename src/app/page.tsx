import { ArticleList } from "@/components/article/article-list";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Your Articles</h1>
      <ArticleList />
    </div>
  );
}
