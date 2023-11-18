import {
  type RedditPost,
  RedditPostSchema,
  type SortOption,
  type TimeOption,
} from '@/types/reddit';

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface RedditPostsResponse {
  data: {
    children: { data: RedditPost }[];
    after: string;
  };
}

export interface SubredditPosts {
  after: string;
  posts: RedditPost[];
}

export class RedditClient {
  constructor(private token: string) {}

  static async create(): Promise<RedditClient> {
    const url = 'https://www.reddit.com/api/v1/access_token';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_SECRET,
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (response.ok) {
      const data = (await response.json()) as AccessToken;

      return new RedditClient(data.access_token);
    } else {
      throw Error('Failed to initialize Reddit client');
    }
  }

  get(endpoint: string): Promise<Response> {
    const baseUrl = 'https://oauth.reddit.com';
    const url = baseUrl + endpoint;

    return fetch(url, {
      headers: {
        Authorization: `bearer ${this.token}`,
      },
    });
  }

  async getPosts(
    subreddit: string,
    sort?: SortOption,
    time?: TimeOption,
    after?: string,
  ): Promise<SubredditPosts> {
    const endpoint = `/r/${subreddit}${
      sort ? `/${sort}` : ''
    }?raw_json=1&t=${time}&after=${after}`;

    const response = await this.get(endpoint);

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = (await response.json()) as RedditPostsResponse;

    const posts: RedditPost[] = data.data.children.map(
      (post: { data: RedditPost }) => RedditPostSchema.parse(post.data),
    );

    return { after: data.data.after, posts };
  }
}
