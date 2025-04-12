import { renderHook, act } from "@testing-library/react";
import { useFeedsStore } from "../feeds-store";
import fetchMock from "jest-fetch-mock";

// Setup fetch mock
beforeEach(() => {
  fetchMock.resetMocks();
  // Clear the store between tests
  act(() => {
    useFeedsStore.setState({ feeds: [], isLoading: false, error: null });
  });
});

// eslint-disable-next-line max-lines-per-function
describe("Feeds Store", () => {
  test("should initialize with empty state", () => {
    const { result } = renderHook(() => useFeedsStore());

    expect(result.current.feeds).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("should add a feed successfully", async () => {
    // Mock the API response for feed fetch
    fetchMock.mockResponseOnce(
      JSON.stringify({
        feed: {
          title: "Test Feed",
          description: "Test Description",
          link: "https://test-feed.com",
          items: [
            {
              title: "Item 1",
              description: "Desc",
              link: "link",
              pubDate: "today",
            },
          ],
        },
        items: [
          {
            title: "Item 1",
            description: "Desc",
            link: "link",
            pubDate: "today",
          },
        ],
      })
    );

    const { result } = renderHook(() => useFeedsStore());

    await act(async () => {
      await result.current.addFeed("https://test-feed.com");
    });

    expect(result.current.feeds.length).toBe(1);
    expect(result.current.feeds[0].title).toBe("Test Feed");
    expect(result.current.isLoading).toBe(false);
  });

  test("should handle feed loading errors", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    const { result } = renderHook(() => useFeedsStore());

    await act(async () => {
      await result.current.addFeed("https://invalid-url.com");
    });

    expect(result.current.feeds.length).toBe(0);
    expect(result.current.error).toBeTruthy();
  });

  test("should remove a feed", async () => {
    // Setup a feed first
    fetchMock.mockResponseOnce(
      JSON.stringify({
        feed: {
          title: "Test Feed",
          description: "Test Description",
          link: "https://test-feed.com",
          items: [],
        },
        items: [],
      })
    );

    const { result } = renderHook(() => useFeedsStore());

    await act(async () => {
      await result.current.addFeed("https://test-feed.com");
    });

    const feedId = result.current.feeds[0].id;

    act(() => {
      result.current.removeFeed(feedId);
    });

    expect(result.current.feeds.length).toBe(0);
  });
});
