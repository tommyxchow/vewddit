import { parseRedditPostMedia } from '@/lib/reddit/parse';
import { type RedditPost } from '@/types/reddit';
import Image from 'next/image';

interface PostCardProps {
  post: RedditPost;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const postMedia = parseRedditPostMedia(post);

  return (
    <article className='flex flex-col'>
      <button
        className='relative aspect-video transition hover:opacity-50'
        aria-label={`Open post titled: ${post.title}`}
        onClick={onClick}
      >
        <Image
          className='rounded-lg object-cover '
          src={postMedia!.thumbnailUrl}
          fill
          alt={post.title}
          unoptimized
        />
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
