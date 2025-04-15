"use client";

import { Feed } from "@/types/rss";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useFeedsStore } from "@/stores/feeds-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  feed: Feed;
  onEditAction: (feed: Feed) => void;
}

export function FeedItem({ feed, onEditAction }: FeedItemProps) {
  const { removeFeed } = useFeedsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pathname = usePathname();
  const isActive = pathname === `/feed/${feed.id}`;

  const handleDelete = () => {
    removeFeed(feed.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={cn(
        "group/menu-item relative p-2 flex rounded-md items-center",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
        !isActive &&
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Link
        href={`/feed/${feed.id}`}
        className="cursor-pointer w-full flex-row items-center justify-between flex whitespace-nowrap overflow-hidden"
      >
        <span className="truncate text-sm">{feed.title}</span>
      </Link>

      {feed.items.length > 0 && (
        <div className="ml-auto flex relative">
          <span className="absolute right-0 opacity-100 group-hover/menu-item:opacity-0 transition-opacity duration-250">
            <span className="ml-auto text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
              {feed.items.length}
            </span>
          </span>
          <div className="opacity-0 group-hover/menu-item:opacity-100 transition-opacity duration-250 z-50 cursor-pointer">
            <FeedItemActions
              onEditAction={() => onEditAction(feed)}
              onDeleteAction={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        feedTitle={feed.title}
      />
    </div>
  );
}
interface FeedItemActionsProps {
  onEditAction: () => void;
  onDeleteAction: () => void;
}

function FeedItemActions({
  onEditAction,
  onDeleteAction,
}: FeedItemActionsProps) {
  return (
    <div className="flex gap-1 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onEditAction();
        }}
      >
        <PencilIcon className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-destructive cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteAction();
        }}
      >
        <TrashIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feedTitle: string;
}

function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  feedTitle,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete Feed
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{feedTitle}&quot;? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="hover:bg-destructive hover:text-black"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
