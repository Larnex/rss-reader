import { FilteredArticleView } from "@/components/article/filtered-article-view";

export default function ReadLaterPage() {
  return (
    <FilteredArticleView
      filter={{ onlyReadLater: true }}
      title="Read Later Articles"
    />
  );
}
