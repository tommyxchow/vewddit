import { parseRedditPostMedia } from '@/lib/reddit/parse';
import { RedditPost } from '@/types/reddit';

type PostCardProps = {
  post: RedditPost;
  onClick: () => void;
};

export default function PostCard({ post, onClick }: PostCardProps) {
  const postMedia = parseRedditPostMedia(post);

  return (
    <article className='flex flex-col'>
      <button
        className='aspect-video overflow-clip rounded-lg transition hover:opacity-50'
        aria-label={`Open post titled: ${post.title}`}
        onClick={onClick}
      >
        <picture>
          <img
            loading='lazy'
            className='h-full w-full object-cover'
            src={postMedia?.thumbnailUrl}
            alt={post.title}
          />
        </picture>
      </button>

      <div className='p-2'>
        <h3 className='line-clamp-1 font-semibold'>
          <a
            className='hover:underline'
            target='_blank'
            href={`https://www.reddit.com${post.permalink}`}
          >
            {post.title}
          </a>
        </h3>
        <p>
          <a
            className='text-gray-400 hover:underline'
            target='_blank'
            href={`https://www.reddit.com/user/${post.author}`}
          >
            u/{post.author}
          </a>
        </p>
      </div>
    </article>
  );
}
