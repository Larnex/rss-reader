import { FilteredArticleView } from "@/components/article/filtered-article-view";

export default function FavoritesPage() {
  return (
    <FilteredArticleView
      filter={{ onlyFavorites: true }}
      title="Favorite Articles"
    />
  );
}
