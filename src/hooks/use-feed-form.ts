import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFeedsStore } from "@/stores/feeds-store";
import {
  feedFormSchema,
  type FeedFormValues,
} from "@/lib/validations/feed-schema";

export function useFeedForm(onSuccess?: () => void) {
  const [success, setSuccess] = useState<string | null>(null);
  const { addFeed, isLoading, error } = useFeedsStore();

  const form = useForm<FeedFormValues>({
    resolver: zodResolver(feedFormSchema),
    defaultValues: { url: "" },
  });

  const onSubmit = async (values: FeedFormValues) => {
    setSuccess(null);
    const feed = await addFeed(values.url);

    if (feed) {
      setSuccess(`Successfully added "${feed.title}"`);
      form.reset();
      onSuccess?.();
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
    success,
  };
}
