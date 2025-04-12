import fetchMock from "jest-fetch-mock";
import { parseFeedData } from "@/lib/parser";
import { GET } from "../route";
import {
  createApiRequest,
  expectErrorResponse,
  expectSuccessResponse,
} from "@/__test-utils__/api-utils";
import {
  mockNetworkError,
  mockHttpError,
  mockTextResponse,
} from "@/__test-utils__/fetch-mock-utils";
import {
  mockXmlResponse,
  mockHtmlResponse,
  mockSuccessfulParse,
  mockParserError,
  defaultFeedData,
} from "@/__test-utils__/rss-utils";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => ({
      status: options.status || 200,
      json: async () => data,
      headers: new Headers(),
    })),
  },
  NextRequest: jest.fn(function (url) {
    this.url = url.toString();
    this.nextUrl = new URL(url);
  }),
}));

// Mock the parser function
jest.mock("@/lib/parser");

// Setup fetch mock
fetchMock.enableMocks();

// eslint-disable-next-line max-lines-per-function
describe("RSS API Route", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it("should return 400 if URL is not provided", async () => {
    // Create request without URL parameter
    const request = createApiRequest("/api/rss");

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(response, 400, "Feed URL is required");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should return 400 if URL does not point to RSS feed", async () => {
    // Mock a non-RSS response
    mockHtmlResponse();

    // Create request with URL parameter
    const url = "http://example.com";
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(
      response,
      400,
      "URL does not point to a valid RSS feed"
    );
    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  it("should return parsed feed data for valid RSS feed", async () => {
    // Prepare test data
    const url = "http://example.com/feed.xml";
    const mockData = defaultFeedData();

    // Mock responses
    mockXmlResponse("<rss></rss>");
    mockSuccessfulParse(mockData);

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectSuccessResponse(response, mockData);
    expect(fetchMock).toHaveBeenCalledWith(url);
    expect(parseFeedData).toHaveBeenCalledWith("<rss></rss>");
  });

  it("should handle network errors", async () => {
    // Prepare test data
    const url = "http://example.com/feed.xml";
    const errorMessage = "Network error";

    // Mock a network error
    mockNetworkError(errorMessage);

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(response, 500, errorMessage);
    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  it("should handle HTTP errors", async () => {
    // Prepare test data
    const url = "http://example.com/feed.xml";

    // Mock an HTTP error
    mockHttpError(404);

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(response, 404, "HTTP error! status: 404");
    expect(fetchMock).toHaveBeenCalledWith(url);
  });

  it("should handle parser errors with 400 status", async () => {
    // Prepare test data
    const url = "http://example.com/feed.xml";
    const errorMessage = "Invalid RSS format";

    // Mock responses
    mockXmlResponse();
    mockParserError(errorMessage);

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(response, 400, errorMessage);
    expect(fetchMock).toHaveBeenCalledWith(url);
    expect(parseFeedData).toHaveBeenCalledWith("<rss></rss>");
  });

  it("should handle generic errors with 500 status", async () => {
    // Prepare test data
    const url = "http://example.com/feed.xml";
    const errorMessage = "Unexpected error";

    // Mock responses
    mockXmlResponse();
    (parseFeedData as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectErrorResponse(response, 500, errorMessage);
    expect(fetchMock).toHaveBeenCalledWith(url);
    expect(parseFeedData).toHaveBeenCalledWith("<rss></rss>");
  });

  it("should handle RSS feeds with different content types", async () => {
    // Test with "text/xml" content type
    const url = "http://example.com/feed.xml";
    const mockData = defaultFeedData();

    // Mock responses
    mockTextResponse("<rss></rss>", "text/xml");
    mockSuccessfulParse(mockData);

    // Create request
    const request = createApiRequest("/api/rss", { url });

    // Call the route handler
    const response = await GET(request);

    // Assert the response
    await expectSuccessResponse(response, mockData);
    expect(fetchMock).toHaveBeenCalledWith(url);
    expect(parseFeedData).toHaveBeenCalledWith("<rss></rss>");
  });
});
