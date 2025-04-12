import { parseFeedData } from "../parser";
import { RSSParserError } from "../errors";

describe("parseFeedData", () => {
  const validRSSData = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Test Feed</title>
        <description>Test Description</description>
        <link>http://example.com</link>
        <language>en</language>
        <lastBuildDate>Mon, 06 Sep 2021 00:00:00 GMT</lastBuildDate>
        <item>
          <title>Test Item</title>
          <description>Test Item Description</description>
          <link>http://example.com/item</link>
          <pubDate>Mon, 06 Sep 2021 00:00:00 GMT</pubDate>
          <guid>http://example.com/item</guid>
        </item>
      </channel>
    </rss>
  `;

  it("should parse valid RSS feed data", async () => {
    const result = await parseFeedData(validRSSData);

    expect(result).toEqual({
      feed: {
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        language: "en",
        lastBuildDate: "Mon, 06 Sep 2021 00:00:00 GMT",
        items: expect.arrayContaining([
          expect.objectContaining({
            title: "Test Item",
            description: "Test Item Description",
            link: "http://example.com/item",
            pubDate: "Mon, 06 Sep 2021 00:00:00 GMT",
            guid: "http://example.com/item",
          }),
        ]),
      },
      items: expect.arrayContaining([
        expect.objectContaining({
          title: "Test Item",
          description: "Test Item Description",
          link: "http://example.com/item",
          pubDate: "Mon, 06 Sep 2021 00:00:00 GMT",
          guid: "http://example.com/item",
        }),
      ]),
    });
  });

  it("should throw error for empty data", async () => {
    await expect(parseFeedData("")).rejects.toThrow(RSSParserError);
    await expect(parseFeedData("   ")).rejects.toThrow(RSSParserError);
  });

  it("should throw error for invalid XML", async () => {
    const invalidXML = "<not>valid</xml>";
    await expect(parseFeedData(invalidXML)).rejects.toThrow(RSSParserError);
  });

  it("should throw error for non-RSS XML", async () => {
    const nonRSSXML = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <root>
        <title>Not RSS</title>
      </root>
    `;
    await expect(parseFeedData(nonRSSXML)).rejects.toThrow(RSSParserError);
  });
});
