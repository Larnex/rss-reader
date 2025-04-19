import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { FeedItem } from "./feed-item";
import { FeedSubscription } from "@/stores/user-preferences-store";

interface FeedsListProps {
  feeds: FeedSubscription[];
  onEditFeed: (feed: FeedSubscription) => void;
}

export function FeedsList({ feeds, onEditFeed }: FeedsListProps) {
  return (
    <>
      <SidebarGroupLabel>
        <span>My Feeds</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuSub>
          {feeds.length === 0 ? (
            <EmptyFeedsList />
          ) : (
            feeds.map((feed) => (
              <FeedItem key={feed.id} feed={feed} onEditAction={onEditFeed} />
            ))
          )}
        </SidebarMenuSub>
      </SidebarMenu>
    </>
  );
}

function EmptyFeedsList() {
  return (
    <div className="px-3 py-2 text-sm text-muted-foreground italic">
      No feeds yet
    </div>
  );
}
