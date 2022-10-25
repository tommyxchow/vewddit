import type { NextApiRequest, NextApiResponse } from 'next';
import { RedditClient } from '../../../../../lib/reddit/api';
import ErrorMessage from '../../../../../types/error';
import { RedditPost } from '../../../../../types/reddit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RedditPost[] | ErrorMessage>
) {
  const { subreddit } = req.query;

  try {
    const reddit = await RedditClient.create();
    const posts = await reddit.getPosts(subreddit as string);

    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: 'Failed to get posts' });
  }
}
