import {
  RedditPost,
  TimeOptions,
  SortOptions,
  RedditPostSchema,
} from '../../types/reddit';

type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type SubredditPosts = {
  after: string;
  posts: RedditPost[];
};

export class RedditClient {
  constructor(private token: string) {}

  static async create(): Promise<RedditClient> {
    const url = 'https://www.reddit.com/api/v1/access_token';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_SECRET
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (response.ok) {
      const data: AccessToken = await response.json();

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
    sort?: SortOptions,
    time?: TimeOptions,
    after?: string
  ): Promise<SubredditPosts> {
    const endpoint = `/r/${subreddit}${
      sort ? `/${sort}` : ''
    }?raw_json=1&t=${time}&after=${after}`;

    const response = await this.get(endpoint);

    if (response.ok) {
      const data = await response.json();

      const after: string = data.data.after;

      const posts: RedditPost[] = data.data.children.map(
        (post: { data: RedditPost }) => RedditPostSchema.parse(post.data)
      );

      return { after, posts };
    } else {
      throw Error(response.statusText);
    }
  }
}
