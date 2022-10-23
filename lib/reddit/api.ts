import { RedditPost } from '../../types/reddit';

type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export class RedditClient {
  private token?: string;

  async init() {
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

      this.token = data.access_token;
    } else {
      throw Error(response.statusText);
    }
  }

  async get(endpoint: string) {
    const baseUrl = 'https://oauth.reddit.com';
    const url = baseUrl + endpoint;

    const response = await fetch(url, {
      headers: {
        Authorization: `bearer ${this.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw Error(response.statusText);
    }
  }

  async getPosts(subreddit: string, limit: number) {
    const endpoint = `/r/${subreddit}/hot?limit=${limit}&raw_json=1`;

    const response = await this.get(endpoint);

    const posts = response.data.children.map(
      (post: { data: RedditPost }) => post.data
    ) as RedditPost[];

    return posts;
  }
}
