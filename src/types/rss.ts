export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
  language?: string;
  lastBuildDate?: string;
  generator?: string;
}

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  "content:encoded"?: string;
  "content:encodedSnippet"?: string;
  creator?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    type: string;
    length: string;
  };
  guid?: string;
  isoDate?: string;
}

export interface Feed extends RSSFeed {
  id: string;
  feedUrl: string;
  lastUpdated: Date;
  unreadCount: number;
}

export interface Article extends Omit<RSSItem, "enclosure"> {
  id: string;
  feedId: string;
  read: boolean;
  favorite: boolean;
  readLater: boolean;
  imageUrl?: string;
  author?: string;
}
