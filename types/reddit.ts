import { z } from 'zod';

export const RedditPostResolutionSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const RedditPostSchema = z.object({
  id: z.string(),
  subreddit: z.string(),
  author: z.string(),
  title: z.string(),
  upvote_ratio: z.number(),
  ups: z.number(),
  permalink: z.string(),
  stickied: z.boolean(),
  url: z.string(),
  thumbnail: z.string(),
  post_hint: z.string().optional(),
  preview: z
    .object({
      images: z.array(
        z.object({
          source: RedditPostResolutionSchema,
          resolutions: z.array(RedditPostResolutionSchema),
          variants: z.object({
            gif: z
              .object({
                source: RedditPostResolutionSchema,
                resolutions: z.array(RedditPostResolutionSchema),
              })
              .optional(),
            mp4: z
              .object({
                source: RedditPostResolutionSchema,
                resolutions: z.array(RedditPostResolutionSchema),
              })
              .optional(),
          }),
        })
      ),
      reddit_video_preview: z
        .object({
          fallback_url: z.string(),
        })
        .optional(),
    })
    .optional(),
  media: z
    .object({
      reddit_video: z
        .object({
          fallback_url: z.string(),
        })
        .optional(),
      ombed: z
        .object({
          thumbnail_url: z.string(),
          html: z.string(),
        })
        .optional(),
      reddit_video_preview: z
        .object({
          fallback_url: z.string(),
        })
        .optional(),
    })
    .nullable(),
  media_embed: z
    .object({
      content: z.string().optional(),
    })
    .optional(),
});
export type RedditPost = z.infer<typeof RedditPostSchema>;

export const sortOptions = ['hot', 'new', 'top', 'rising'] as const;
export type SortOptions = typeof sortOptions[number];

export const timeOptions = [
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all',
] as const;
export type TimeOptions = typeof timeOptions[number];
