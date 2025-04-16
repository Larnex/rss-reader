import { FilteredArticleView } from "@/components/article/filtered-article-view";

export default function UnreadPage() {
  return (
    <FilteredArticleView
      filter={{ onlyUnread: true }}
      title="Unread Articles"
    />
  );
}
