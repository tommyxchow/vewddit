import { RedditPost } from '../../types/reddit';

export function hasProperMedia(post: RedditPost): boolean {
  if (post.post_hint === 'link' && !post.media_embed?.content) return false;

  return (
    post.post_hint != undefined && post.post_hint != 'self' && !post.stickied
  );
}

export type PostMedia = {
  hint: 'image' | 'rich:video' | 'hosted:video' | 'link';
  thumbnailUrl: string;
  mediaUrl: string;
};

export function parseRedditPostMedia(post: RedditPost): PostMedia | null {
  switch (post.post_hint) {
    case 'image':
      const video = post.preview?.images[0].variants?.mp4?.source.url;

      return {
        hint: video !== undefined ? 'hosted:video' : 'image',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url!,
        mediaUrl: video ?? post.url,
      };

    case 'rich:video':
      return {
        hint: 'rich:video',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url!,
        mediaUrl: post.media_embed?.content!,
      };
    case 'hosted:video':
      return {
        hint: 'hosted:video',
        thumbnailUrl: post.preview?.images[0].resolutions[0].url!,
        mediaUrl: post.media?.reddit_video?.fallback_url!,
      };
    case 'link':
      const linkVideo = post?.preview?.reddit_video_preview?.fallback_url;

      return {
        hint: linkVideo !== undefined ? 'rich:video' : 'link',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url!,
        mediaUrl: linkVideo ?? post.preview?.images[0].resolutions.at(-1)?.url!,
      };
    // case 'self':
    //   return {
    //     thumbnailUrl: post.preview?.images[0].source.url!,
    //     mediaUrl: post.preview?.images[0].source.url!,
    //   };
    default:
      return null;
  }
}
