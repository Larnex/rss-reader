import { isValidRSSData, isValidRSSItem } from "../validators";

describe("RSS Validators", () => {
  describe("isValidRSSData", () => {
    it("should return true for valid RSS data", () => {
      const validData = {
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        items: [],
      };

      expect(isValidRSSData(validData)).toBe(true);
    });

    it("should return false for invalid RSS data", () => {
      const testCases = [
        null,
        undefined,
        {},
        { title: "Test" },
        { title: "Test", description: "Test" },
        { title: "Test", description: "Test", link: "http://example.com" },
        {
          title: "Test",
          description: "Test",
          link: "http://example.com",
          items: "not-array",
        },
      ];

      testCases.forEach((testCase) => {
        expect(isValidRSSData(testCase)).toBe(false);
      });
    });
  });

  describe("isValidRSSItem", () => {
    it("should return true for valid RSS item", () => {
      const validItem = {
        title: "Test Item",
        link: "http://example.com/item",
        description: "Test Description",
        pubDate: "Mon, 06 Sep 2021 00:00:00 GMT",
      };

      expect(isValidRSSItem(validItem)).toBe(true);
    });

    it("should return false for invalid RSS items", () => {
      const testCases = [
        null,
        undefined,
        {},
        { title: "Test" },
        { title: "Test", link: "http://example.com" },
        { title: "Test", link: "http://example.com", description: "Test" },
      ];

      testCases.forEach((testCase) => {
        expect(isValidRSSItem(testCase)).toBe(false);
      });
    });
  });
});
