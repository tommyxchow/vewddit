import { RedditPost } from '../../types/reddit';
import { parseRedditPostMedia } from '../../lib/reddit/parse';

type PostCardProps = {
  post: RedditPost;
  onClick: () => void;
};

export default function PostCard({ post, onClick }: PostCardProps) {
  const postMedia = parseRedditPostMedia(post);

  return (
    <article
      className='aspect-video border-2 border-white border-opacity-0 transition hover:border-opacity-100'
      onClick={onClick}
    >
      <picture>
        <img
          className='h-full w-full object-cover'
          src={postMedia?.thumbnailUrl!}
          alt={post.title}
        />
      </picture>
    </article>
  );
}
