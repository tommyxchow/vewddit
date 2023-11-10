import type { NextApiRequest, NextApiResponse } from 'next';
import { RedditClient, SubredditPosts } from '../../../../../lib/reddit/api';
import ErrorMessage from '../../../../../types/error';
import { TimeOptions, SortOptions } from '../../../../../types/reddit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubredditPosts | ErrorMessage>
) {
  const { subreddit, sort, t, after } = req.query;

  try {
    const reddit = await RedditClient.create();

    const posts = await reddit.getPosts(
      subreddit as string,
      sort as SortOptions,
      t as TimeOptions,
      after as string
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
}
