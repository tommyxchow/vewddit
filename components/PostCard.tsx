import { parseRedditPostMedia } from '../lib/reddit/parse';
import { RedditPost } from '../types/reddit';

type PostCardProps = {
  post: RedditPost;
  onClick: () => void;
};

export default function PostCard({ post, onClick }: PostCardProps) {
  const postMedia = parseRedditPostMedia(post);

  return (
    <button aria-label={`Open post titled: ${post.title}`} onClick={onClick}>
      <article className='aspect-video border-2 border-white border-opacity-0 transition hover:border-opacity-100'>
        <picture>
          <img
            loading='lazy'
            className='h-full w-full object-cover'
            src={postMedia?.thumbnailUrl}
            alt={post.title}
          />
        </picture>
      </article>
    </button>
  );
}
