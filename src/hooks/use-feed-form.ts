import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFeedsStore } from "@/stores/feeds-store";
import {
  feedFormSchema,
  type FeedFormValues,
} from "@/lib/validations/feed-schema";
import { Feed } from "@/types/rss";

export type UseFeedFormReturn = {
  form: UseFormReturn<FeedFormValues>;
  onSubmit: (values: FeedFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isEditMode: boolean;
};

export type UseFeedFormProps = {
  feedToEdit: Feed | null;
  onSuccess?: () => void;
};

// eslint-disable-next-line max-lines-per-function
export function useFeedForm({
  feedToEdit = null,
  onSuccess,
}: UseFeedFormProps): UseFeedFormReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEditMode = !!feedToEdit;

  const { addFeed, updateFeed } = useFeedsStore();

  const form = useForm<FeedFormValues>({
    resolver: zodResolver(feedFormSchema),
    defaultValues: {
      url: feedToEdit?.feedUrl || "",
    },
  });

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    form.reset({ url: feedToEdit?.feedUrl || "" });
  }, [feedToEdit, form]);

  useEffect(() => {
    const unsubscribe = useFeedsStore.subscribe((state, prevState) => {
      if (state.error && state.error !== prevState.error) {
        setError(state.error);
        setSuccess(null);
      }

      if (!state.error && prevState.error) {
        setError(null);
      }

      if (state.isLoading !== prevState.isLoading) {
        setIsLoading(state.isLoading);
      }
    });
    return unsubscribe;
  }, []);

  const onSubmit = async (values: FeedFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    useFeedsStore.setState({ error: null });

    try {
      if (isEditMode && feedToEdit) {
        await updateFeed(feedToEdit.id, {
          feedUrl: values.url,
        });
        const storeError = useFeedsStore.getState().error;

        if (!storeError) {
          setSuccess(`Successfully updated "${feedToEdit.title}"`);
          setError(null);
          setIsLoading(false);
          form.reset({ url: "" });
          onSuccess?.();
          setSuccess(null);
        } else {
          setError(storeError || "Failed to update feed.");
        }
      } else {
        const newFeed = await addFeed(values.url);
        const storeError = useFeedsStore.getState().error;

        if (newFeed && !storeError) {
          setSuccess(`Successfully added "${newFeed.title}"`);
          setError(null);
          setIsLoading(false);
          form.reset({ url: "" });
          onSuccess?.();
        } else {
          setError(storeError || "Failed to add feed.");
        }
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
    success,
    isEditMode,
  };
}
