import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Feed } from "@/types/rss";
import { createFeed, defaultFeeds, fetchFeed } from "@/lib/feed-helpers";

// Type definitions for our feed store
interface FeedsState {
  feeds: Feed[];
  isLoading: boolean;
  error: string | null;

  // Feed actions
  addFeed: (url: string) => Promise<Feed | null>;
  updateFeed: (id: string, feedData: Partial<Feed>) => Promise<void>;
  removeFeed: (id: string) => void;
  refreshFeed: (id: string) => Promise<void>;
  refreshAllFeeds: () => Promise<void>;

  // Feed setup
  resetToDefaults: () => void;
}

// Create the store with persistence
export const useFeedsStore = create<FeedsState>()(
  persist(
    // eslint-disable-next-line max-lines-per-function
    (set, get) => ({
      feeds: [],
      isLoading: false,
      error: null,

      // Add a new feed by URL
      addFeed: async (url: string) => {
        set({ isLoading: true, error: null });

        try {
          const { feed: rssFeed } = await fetchFeed(url);

          // Check if feed with this URL already exists
          const existingFeed = get().feeds.find(
            (feed) => feed.link === rssFeed.link
          );
          if (existingFeed) {
            set({
              isLoading: false,
              error: `Feed "${rssFeed.title}" is already in your list`,
            });
            return null;
          }
          const newFeed = createFeed(rssFeed, url);

          // Add it to our feeds list
          set((state) => ({
            feeds: [...state.feeds, newFeed],
            isLoading: false,
          }));

          return newFeed;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to add feed",
          });
          return null;
        }
      },

      // Update an existing feed
      updateFeed: async (id: string, feedData: Partial<Feed>) => {
        const currentFeeds = get().feeds;
        const feedToUpdate = currentFeeds.find((feed) => feed.id === id);

        if (!feedToUpdate) {
          set({
            error: `Feed with ID "${id}" not found.`,
            isLoading: false,
          });
          return;
        }

        const newUrl = feedData.feedUrl;
        const isUrlChanging = newUrl && newUrl !== feedToUpdate.feedUrl;

        if (isUrlChanging) {
          set({ isLoading: true, error: null });
          const duplicateFeed = currentFeeds.find(
            (feed) => feed.id !== id && feed.feedUrl === newUrl
          );

          if (duplicateFeed) {
            set({
              error: `Feed "${feedData.title}" already exists.`,
              isLoading: false,
            });
            return;
          }

          try {
            const { feed: rssFeed } = await fetchFeed(newUrl);
            console.log(" updateFeed: rssFeed:", rssFeed);

            set((state) => ({
              feeds: state.feeds.map((feed) =>
                feed.id === id
                  ? {
                      id: feed.id,
                      ...rssFeed,
                      unreadCount: rssFeed.items.length,
                      feedUrl: newUrl,
                      lastUpdated: new Date(),
                      ...Object.fromEntries(
                        Object.entries(feedData).filter(
                          ([key]) => key !== "feedUrl"
                        )
                      ),
                    }
                  : feed
              ),
              isLoading: false,
              error: null, // Clear error on success
            }));
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : `Failed to fetch feed from new URL: ${newUrl}`,
              isLoading: false,
            });
            return;
          }
        } else {
          set((state) => ({
            feeds: state.feeds.map((feed) =>
              feed.id === id ? { ...feed, ...feedData } : feed
            ),
            error: null,
          }));
        }
      },

      // Remove a feed
      removeFeed: (id: string) => {
        set((state) => ({
          feeds: state.feeds.filter((feed) => feed.id !== id),
        }));
      },

      // Refresh a specific feed
      refreshFeed: async (id: string) => {
        const { feeds } = get();
        const feedToRefresh = feeds.find((feed) => feed.id === id);

        if (!feedToRefresh) return;

        set({ isLoading: true, error: null });

        try {
          const { feed: rssFeed } = await fetchFeed(feedToRefresh.feedUrl);

          // Update the feed with new data
          set((state) => ({
            feeds: state.feeds.map((feed) =>
              feed.id === id
                ? {
                    ...feed,
                    ...rssFeed,
                    lastUpdated: new Date(),
                    // We'll handle unreadCount in a more sophisticated way when we implement articles
                  }
                : feed
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to refresh feed",
          });
        }
      },

      // Refresh all feeds
      refreshAllFeeds: async () => {
        const { feeds } = get();

        set({ isLoading: true, error: null });

        try {
          await Promise.all(feeds.map((feed) => get().refreshFeed(feed.id)));

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to refresh feeds",
          });
        }
      },

      // Reset to default feeds
      resetToDefaults: async () => {
        set({ feeds: [], isLoading: true, error: null });

        try {
          // Add each default feed
          for (const feedInfo of defaultFeeds) {
            await get().addFeed(feedInfo.url);
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load default feeds",
          });
        }
      },
    }),
    {
      name: "rss-feeds-storage", // localStorage key
      onRehydrateStorage: () => (state) => {
        // If no feeds are stored, initialize with defaults
        if (!state || state.feeds.length === 0) {
          // Use setTimeout to ensure this runs after rehydration completes
          setTimeout(() => {
            useFeedsStore.getState().resetToDefaults();
          }, 0);
        }
      },
    }
  )
);
