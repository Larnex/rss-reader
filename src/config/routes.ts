export const ROUTES = {
  home: "/",
  unread: "/unread",
  favorites: "/favorites",
  readLater: "/read-later",
} as const;

export const ROUTE_LABELS: Record<keyof typeof ROUTES, string> = {
  home: "All Articles",
  unread: "Unread",
  favorites: "Favorites",
  readLater: "Read Later",
};
