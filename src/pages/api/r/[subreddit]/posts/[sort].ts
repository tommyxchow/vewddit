import { RedditClient, type SubredditPosts } from '@/lib/reddit/api';
import type ErrorMessage from '@/types/error';
import { type SortOption, type TimeOption } from '@/types/reddit';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubredditPosts | ErrorMessage>,
) {
  const { subreddit, sort, t, after } = req.query;

  try {
    const reddit = await RedditClient.create();

    const posts = await reddit.getPosts(
      subreddit as string,
      sort as SortOption,
      t as TimeOption,
      after as string,
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
}
