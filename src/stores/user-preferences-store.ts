import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import localForage from "localforage";
import { defaultFeeds } from "../lib/feed-helpers";

export interface FeedSubscription {
  id: string;
  url: string;
  title: string;
}

interface ArticleStatus {
  read: boolean;
  favorite: boolean;
  readLater: boolean;
}

interface UserPreferences {
  subscribedFeeds: FeedSubscription[];
  articlePreferences: Record<string, ArticleStatus>;

  // Actions
  addFeed: (url: string, title: string) => string;
  removeFeed: (id: string) => void;
  updateFeedTitle: (id: string, title: string) => void;
  updateArticleStatus: (
    articleId: string,
    status: Partial<{
      read: boolean;
      favorite: boolean;
      readLater: boolean;
    }>
  ) => void;
}

export const useUserPreferencesStore = create<UserPreferences>()(
  persist(
    (set, get) => ({
      subscribedFeeds: [],
      articlePreferences: {},

      addFeed: (url: string, title: string): string => {
        // Use the getter function instead of circular reference
        const currentState = get();
        const existingFeed = currentState.subscribedFeeds.find(
          (feed: FeedSubscription) => feed.url === url
        );

        if (existingFeed) {
          // Return existing feed ID if URL already exists
          return existingFeed.id;
        }

        // Create new feed if not a duplicate
        const id = crypto.randomUUID();
        set((state) => ({
          subscribedFeeds: [...state.subscribedFeeds, { id, url, title }],
        }));
        return id;
      },
      removeFeed: (id) => {
        set((state) => ({
          subscribedFeeds: state.subscribedFeeds.filter(
            (feed) => feed.id !== id
          ),
        }));
      },

      updateFeedTitle: (id: string, title: string) => {
        set((state) => ({
          subscribedFeeds: state.subscribedFeeds.map((feed) =>
            feed.id === id ? { ...feed, title } : feed
          ),
        }));
      },

      updateArticleStatus: (articleId, status) => {
        set((state) => ({
          articlePreferences: {
            ...state.articlePreferences,
            [articleId]: {
              ...(state.articlePreferences[articleId] || {
                read: false,
                favorite: false,
                readLater: false,
              }),
              ...status,
            },
          },
        }));
      },
    }),
    {
      name: "user-preferences-storage",
      storage: createJSONStorage(() => localForage),
      onRehydrateStorage: () => (state) => {
        if (state?.subscribedFeeds.length === 0) {
          setTimeout(() => {
            for (const feed of defaultFeeds) {
              useUserPreferencesStore.getState().addFeed(feed.url, feed.title);
            }
          }, 0);
        }
      },
    }
  )
);
