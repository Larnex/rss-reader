import { parseFeedData } from "@/lib/parser";
import { RSSParserError } from "@/lib/errors";
import { mockTextResponse } from "./fetch-mock-utils";

// RSS-specific mocking utilities
export function mockXmlResponse(xmlContent = "<rss></rss>") {
  return mockTextResponse(xmlContent, "application/xml");
}

export function mockHtmlResponse(
  htmlContent = "<html><body>Not RSS</body></html>"
) {
  return mockTextResponse(htmlContent, "text/html");
}

export function mockSuccessfulParse(feedData = defaultFeedData()) {
  return (parseFeedData as jest.Mock).mockResolvedValueOnce(feedData);
}

export function mockParserError(message = "Invalid RSS format") {
  return (parseFeedData as jest.Mock).mockRejectedValueOnce(
    new RSSParserError(message)
  );
}

export function defaultFeedData() {
  return {
    feed: {
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      items: [],
    },
    items: [],
  };
}
