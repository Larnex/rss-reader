"use client";

import * as React from "react";
import {
  RssIcon,
  InboxIcon,
  StarIcon,
  HomeIcon,
  BookmarkIcon,
  RefreshCw,
  PlusIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useFeedsStore } from "@/stores/feeds-store";
import { useState } from "react";
import { FeedsList } from "../feed/feed-list";
import { Feed } from "@/types/rss";
import { FeedForm } from "../feed/feed-form";
import { Button } from "../ui/button";
import { useArticlesStore } from "@/stores/articles-store";

const NAV_ITEMS = [
  { icon: HomeIcon, label: "All Articles", active: true },
  { icon: InboxIcon, label: "Unread", active: false },
  { icon: StarIcon, label: "Favorites", active: false },
  { icon: BookmarkIcon, label: "Read Later", active: false },
];

export function AppSidebar() {
  const { feeds, refreshAllFeeds, isLoading } = useFeedsStore();

  const [isFeedFormOpen, setIsFeedFormOpen] = useState(false);
  const [feedToEdit, setFeedToEdit] = useState<Feed | null>(null);

  const handleAddFeedClick = () => {
    setFeedToEdit(null);
    setIsFeedFormOpen(true);
  };

  const handleEditFeedClick = (feed: Feed) => {
    setFeedToEdit(feed);
    setIsFeedFormOpen(true);
  };

  const handleFeedFormClose = () => {
    setIsFeedFormOpen(false);
    setFeedToEdit(null);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex  items-center justify-between px-4">
          <SidebarTitle />
          <RefreshCw
            onClick={refreshAllFeeds}
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </SidebarHeader>
        <SidebarContent>
          <MainNavigation items={NAV_ITEMS} />
          <SidebarSeparator />
          <FeedsList feeds={feeds} onEditFeed={handleEditFeedClick} />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button size="sm" className="gap-2" onClick={handleAddFeedClick}>
            <PlusIcon className="h-4 w-4" />
            <span>Add Feed</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <FeedForm
        isOpen={isFeedFormOpen}
        onOpenChangeAction={setIsFeedFormOpen}
        onCloseAction={handleFeedFormClose}
        feedToEdit={feedToEdit}
      />
    </>
  );
}

function SidebarTitle() {
  return (
    <div className="flex items-center gap-2">
      <RssIcon className="h-6 w-6" />
      <span className="font-semibold">RSS Reader</span>
    </div>
  );
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  active: boolean;
}

interface MainNavigationProps {
  items: NavItem[];
}

function MainNavigation({ items }: MainNavigationProps) {
  const {
    getArticlesLength,
    getFavoritesCount,
    getUnreadCount,
    getReadLaterCount,
  } = useArticlesStore();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuButton
          key={item.label}
          isActive={item.active}
          tooltip={item.label}
        >
          <item.icon />
          <div className="flex items-center justify-between w-full">
            <span>{item.label}</span>
            <span className="ml-auto text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
              {item.label === "All Articles"
                ? getArticlesLength()
                : item.label === "Unread"
                ? getUnreadCount()
                : item.label === "Favorites"
                ? getFavoritesCount()
                : getReadLaterCount()}
            </span>
          </div>
        </SidebarMenuButton>
      ))}
    </SidebarMenu>
  );
}
