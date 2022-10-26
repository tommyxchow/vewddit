import type { NextApiRequest, NextApiResponse } from 'next';
import { RedditClient, SubredditPosts } from '../../../../../lib/reddit/api';
import ErrorMessage from '../../../../../types/error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubredditPosts | ErrorMessage>
) {
  const { subreddit, after } = req.query;

  try {
    const reddit = await RedditClient.create();
    const posts = await reddit.getPosts(
      subreddit as string,
      undefined,
      undefined,
      after as string
    );

    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: 'Failed to get posts' });
  }
}
