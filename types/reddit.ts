export type RedditPost = {
  id: string;
  subreddit: string;
  author: string;
  title: string;
  upvote_ratio: number;
  ups: number;
  permalink: string;
  is_self: boolean;
  stickied: boolean;
  url: string;
  thumbnail?: string;
  post_hint?: string;
  preview?: {
    images: [
      {
        source: RedditPostResolution;
        resolutions: RedditPostResolution[];
        variants?: {
          gif?: {
            source: RedditPostResolution;
            resolutions: RedditPostResolution[];
          };
          mp4?: {
            source: RedditPostResolution;
            resolutions: RedditPostResolution[];
          };
        };
      }
    ];
    reddit_video_preview?: {
      fallback_url: string;
    };
  };
  media?: {
    reddit_video?: {
      fallback_url: string;
    };
    oembed?: {
      thumbnail_url: string;
      html: string;
    };
    reddit_video_preview?: {
      fallback_url: string;
    };
  };
  media_embed?: {
    content: string;
  };
};

type RedditPostResolution = {
  url: string;
  width: number;
  height: number;
};

export type SortTime = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
export type SortType = 'hot' | 'new' | 'top';
