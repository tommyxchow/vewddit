import { RedditPost } from '@/types/reddit';

export function hasProperMedia(post: RedditPost): boolean {
  if (post.is_gallery) return true;

  if (post.post_hint === 'link' && !post.media_embed?.content) return false;

  return (
    post.post_hint != undefined && post.post_hint != 'self' && !post.stickied
  );
}

export interface PostMedia {
  hint: 'image' | 'rich:video' | 'hosted:video' | 'link';
  thumbnailUrl: string;
  mediaUrls: string[];
}

export function parseRedditPostMedia(post: RedditPost): PostMedia | null {
  if (
    post.is_gallery &&
    post.gallery_data &&
    post.gallery_data.items.length > 0 &&
    post.media_metadata
  ) {
    const galleryImageUrls: string[] = [];

    for (const item of post.gallery_data.items) {
      const mediaId = item.media_id;
      const mediaUrl = post.media_metadata[mediaId].s.u;

      galleryImageUrls.push(mediaUrl);
    }

    return {
      hint: 'image',
      thumbnailUrl:
        post.media_metadata[post.gallery_data.items[0].media_id].p.at(-1)!.u,
      mediaUrls: galleryImageUrls,
    };
  }

  switch (post.post_hint) {
    case 'image': {
      const video = post.preview?.images[0].variants?.mp4?.source.url;

      return {
        hint: video !== undefined ? 'hosted:video' : 'image',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url ?? '',
        mediaUrls: [video ?? post.url],
      };
    }
    case 'rich:video':
      return {
        hint: 'rich:video',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url ?? '',
        mediaUrls: [post.media_embed?.content ?? ''],
      };
    case 'hosted:video':
      return {
        hint: 'hosted:video',
        thumbnailUrl: post.preview?.images[0].resolutions[0].url ?? '',
        mediaUrls: [post.media?.reddit_video?.fallback_url ?? ''],
      };
    case 'link': {
      const linkVideo = post?.preview?.reddit_video_preview?.fallback_url;

      return {
        hint: linkVideo !== undefined ? 'rich:video' : 'link',
        thumbnailUrl: post.preview?.images[0].resolutions.at(-1)?.url ?? '',
        mediaUrls: [
          linkVideo ?? post.preview?.images[0].resolutions.at(-1)?.url ?? '',
        ],
      };
    }
    default:
      console.warn('Unknown post hint', post.post_hint);
      return null;
  }
}
