"use client";

import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormStatus } from "../ui/form-status";
import { useFeedForm, UseFeedFormProps } from "@/hooks/use-feed-form";
import { FeedFormValues } from "@/lib/validations/feed-schema";
import { UseFormReturn } from "react-hook-form";

interface FeedFormProps extends UseFeedFormProps {
  isOpen: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onCloseAction: () => void;
}

export function FeedForm({
  isOpen,
  onOpenChangeAction,
  onCloseAction,
  feedToEdit,
}: FeedFormProps) {
  const { form, onSubmit, isLoading, error, success, isEditMode } = useFeedForm(
    { feedToEdit, onSuccess: onCloseAction }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit" : "Add"} RSS Feed</DialogTitle>
          <DialogDescription>
            Enter the URL of an RSS feed to subscribe to it.
          </DialogDescription>
        </DialogHeader>

        <FeedFormContent
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FeedFormContentProps {
  form: UseFormReturn<FeedFormValues>;
  onSubmit: (values: FeedFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isEditMode: boolean;
}

function FeedFormContent({
  form,
  onSubmit,
  isLoading,
  error,
  success,
  isEditMode,
}: FeedFormContentProps) {
  return (
    <div className="mt-6 mx-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* URL field */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/rss" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the full URL of the RSS feed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form status (error/success messages) */}
          <FormStatus error={error} success={success} />

          {/* Submit button */}
          <SubmitButton isLoading={isLoading} isEditMode={isEditMode} />
        </form>
      </Form>
    </div>
  );
}

// Submit button component
interface SubmitButtonProps {
  isLoading: boolean;
  isEditMode: boolean;
}

function SubmitButton({ isLoading, isEditMode }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          {isEditMode ? "Updating" : "Adding"} Feed...
        </>
      ) : (
        <>{isEditMode ? "Update" : "Add"} Feed</>
      )}
    </Button>
  );
}
