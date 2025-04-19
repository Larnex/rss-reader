/* eslint-disable max-lines-per-function */
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  feedFormSchema,
  type FeedFormValues,
} from "@/lib/validations/feed-schema";
import {
  FeedSubscription,
  useUserPreferencesStore,
} from "@/stores/user-preferences-store";
import { queryClient } from "../lib/query-client";
import { fetchFeed } from "./use-feed";
import { useMutation } from "@tanstack/react-query";

export type UseFeedFormReturn = {
  form: UseFormReturn<FeedFormValues>;
  onSubmit: (values: FeedFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isEditMode: boolean;
};

export type UseFeedFormProps = {
  feedToEdit: FeedSubscription | null;
  onSuccess?: () => void;
};

export function useFeedForm({
  feedToEdit = null,
  onSuccess,
}: UseFeedFormProps): UseFeedFormReturn {
  const isEditMode = !!feedToEdit;
  const { addFeed, removeFeed, updateFeedTitle, subscribedFeeds } =
    useUserPreferencesStore();

  const form = useForm<FeedFormValues>({
    resolver: zodResolver(feedFormSchema),
    defaultValues: {
      url: feedToEdit?.url || "",
      title: feedToEdit?.title || "",
    },
  });

  useEffect(() => {
    form.reset({ url: feedToEdit?.url || "", title: feedToEdit?.title || "" });
  }, [feedToEdit, form]);

  const titleUpdateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => {
      updateFeedTitle(id, title);
      return Promise.resolve(`Successfully updated feed title`);
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const feedMutation = useMutation({
    mutationFn: async ({
      url,
      existingId,
    }: {
      url: string;
      existingId?: string;
    }) => {
      const duplicateFeed = subscribedFeeds.find(
        (feed) => feed.url === url && feed.id !== existingId
      );

      if (duplicateFeed) {
        throw new Error(
          `Feed with URL "${url}" already exists as "${duplicateFeed.title}"`
        );
      }

      const feedData = await fetchFeed(url);

      if (existingId) {
        removeFeed(existingId);
        addFeed(url, feedData.feed.title);
        queryClient.invalidateQueries({ queryKey: ["feed", existingId] });
        return `Successfully updated "${feedData.feed.title}"`;
      } else {
        const newFeedId = addFeed(url, feedData.feed.title);
        queryClient.prefetchQuery({
          queryKey: ["feed", newFeedId],
          queryFn: () => Promise.resolve(feedData),
        });
        return `Successfully added "${feedData.feed.title}"`;
      }
    },
    onSuccess: () => {
      form.reset({ url: "", title: "" });
      onSuccess?.();
    },
  });

  const onSubmit = async (values: FeedFormValues) => {
    if (isEditMode && feedToEdit) {
      if (values.url === feedToEdit.url && values.title !== feedToEdit.title) {
        titleUpdateMutation.mutate({
          id: feedToEdit.id,
          title: values.title || "",
        });
        return;
      }

      feedMutation.mutate({ url: values.url, existingId: feedToEdit.id });
    } else {
      feedMutation.mutate({ url: values.url });
    }
  };

  const isLoading = titleUpdateMutation.isPending || feedMutation.isPending;
  const error =
    titleUpdateMutation.error?.message || feedMutation.error?.message || null;
  const success = titleUpdateMutation.data || feedMutation.data || null;

  return {
    form,
    onSubmit,
    isLoading,
    error,
    success,
    isEditMode,
  };
}
