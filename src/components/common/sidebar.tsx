"use client";

import * as React from "react";
import {
  RssIcon,
  InboxIcon,
  StarIcon,
  HomeIcon,
  BookmarkIcon,
  RefreshCwIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FeedForm } from "@/components/feed/feed-form";
import { useFeedsStore } from "@/stores/feeds-store";

export function AppSidebar() {
  const { feeds, refreshAllFeeds, isLoading } = useFeedsStore();

  return (
    <Sidebar>
      <SidebarHeader className="flex  items-center justify-between px-4">
        <RssIcon className="h-6 w-6" />
        <span className="font-semibold">RSS Reader</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={refreshAllFeeds}
          disabled={isLoading}
          title="Refresh all feeds"
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton isActive={true} tooltip="All Articles">
            <HomeIcon />
            <span>All Articles</span>
          </SidebarMenuButton>
          <SidebarMenuButton tooltip="Unread">
            <InboxIcon />
            <span>Unread</span>
          </SidebarMenuButton>
          <SidebarMenuButton tooltip="Favorites">
            <StarIcon />
            <span>Favorites</span>
          </SidebarMenuButton>
          <SidebarMenuButton tooltip="Read Later">
            <BookmarkIcon />
            <span>Read Later</span>
          </SidebarMenuButton>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroupLabel>
          <span>My Feeds</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuSub>
            {feeds.map((feed) => (
              <SidebarMenuSubButton key={feed.id}>
                <span className="flex-1 min-w-0 truncate whitespace-nowrap overflow-hidden">
                  {feed.title}
                </span>
                {feed.unreadCount > 0 && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
                    {feed.unreadCount}
                  </span>
                )}
              </SidebarMenuSubButton>
            ))}
            {feeds.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground italic">
                No feeds yet
              </div>
            )}
          </SidebarMenuSub>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <FeedForm />
      </SidebarFooter>
    </Sidebar>
  );
}
