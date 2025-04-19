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
import { useState } from "react";
import { FeedsList } from "../feed/feed-list";
import { FeedForm } from "../feed/feed-form";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import {
  useUserPreferencesStore,
  FeedSubscription,
} from "@/stores/user-preferences-store";
import { useAllFeeds, useArticles } from "@/hooks/use-feed";

const NAV_ITEMS = [
  { icon: HomeIcon, label: "All Articles", active: true },
  { icon: InboxIcon, label: "Unread", active: false },
  { icon: StarIcon, label: "Favorites", active: false },
  { icon: BookmarkIcon, label: "Read Later", active: false },
];

export function AppSidebar() {
  const { subscribedFeeds } = useUserPreferencesStore();
  const { isLoading, refetch } = useAllFeeds();

  const [isFeedFormOpen, setIsFeedFormOpen] = useState(false);
  const [feedToEdit, setFeedToEdit] = useState<FeedSubscription | null>(null);

  const handleAddFeedClick = () => {
    setFeedToEdit(null);
    setIsFeedFormOpen(true);
  };

  const handleEditFeedClick = (feed: FeedSubscription) => {
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
            onClick={refetch}
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </SidebarHeader>
        <SidebarContent>
          <MainNavigation items={NAV_ITEMS} />
          <SidebarSeparator />
          <FeedsList feeds={subscribedFeeds} onEditFeed={handleEditFeedClick} />
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
  const { articlePreferences } = useUserPreferencesStore();
  const { articles } = useArticles();

  const pathname = usePathname();

  const getArticlesLength = () => articles.length;

  const getUnreadCount = () => {
    return articles.filter((article) => {
      const articleId = article.guid || article.link;
      const prefs = articlePreferences[articleId];
      return !prefs?.read;
    }).length;
  };

  const getFavoritesCount = () => {
    return articles.filter((article) => {
      const articleId = article.guid || article.link;
      const prefs = articlePreferences[articleId];
      return prefs?.favorite;
    }).length;
  };

  const getReadLaterCount = () => {
    return articles.filter((article) => {
      const articleId = article.guid || article.link;
      const prefs = articlePreferences[articleId];
      return prefs?.readLater;
    }).length;
  };

  const labelToRouteKey: Record<string, keyof typeof ROUTES> = {
    "All Articles": "home",
    Unread: "unread",
    Favorites: "favorites",
    "Read Later": "readLater",
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const routeKey = labelToRouteKey[item.label];
        const route = ROUTES[routeKey];

        const count =
          item.label === "All Articles"
            ? getArticlesLength()
            : item.label === "Unread"
            ? getUnreadCount()
            : item.label === "Favorites"
            ? getFavoritesCount()
            : getReadLaterCount();

        return (
          <Link href={route} key={item.label} passHref>
            <SidebarMenuButton
              key={item.label}
              isActive={pathname === route}
              tooltip={item.label}
              className="cursor-pointer"
            >
              <item.icon />
              <div className="flex items-center justify-between w-full">
                <span>{item.label}</span>
                <span className="ml-auto text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
                  {count}
                </span>
              </div>
            </SidebarMenuButton>
          </Link>
        );
      })}
    </SidebarMenu>
  );
}
