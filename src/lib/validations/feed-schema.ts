import { z } from "zod";

export const feedFormSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => url.trim() !== "", {
      message: "URL is required",
    }),
});

export type FeedFormValues = z.infer<typeof feedFormSchema>;
