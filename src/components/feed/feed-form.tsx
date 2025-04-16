"use client";

import { useState } from "react";
import { PlusIcon, Loader2Icon } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
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
import { useFeedForm } from "@/hooks/use-feed-form";
import { FormStatus } from "../ui/form-status";

export function FeedForm() {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isLoading, error, success } = useFeedForm(() => {
    // Close dialog after success with delay
    setTimeout(() => setOpen(false), 2000);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PlusIcon className="h-4 w-4" />
          <span>Add Feed</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add RSS Feed</DialogTitle>
          <DialogDescription>
            Enter the URL of an RSS feed to subscribe to it.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 mx-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormStatus error={error} success={success} />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Adding Feed...
                  </>
                ) : (
                  "Add Feed"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
