import { type RedditPost } from '@/types/reddit';
import { useCompletion } from 'ai/react';

interface SummaryProps {
  post: RedditPost;
}

export function Summary({ post }: SummaryProps) {
  const { completion, isLoading, complete } = useCompletion();

  async function handleOnClick() {
    await complete(`https://www.reddit.com${post.permalink}`);
  }

  return (
    <div className='flex grow flex-col gap-2'>
      <h3 className='text-lg font-semibold'>how are the comments feeling?</h3>

      <div className='flex grow flex-col gap-2'>
        <div className='h-48 overflow-auto rounded-xl border-2 border-gray-900 bg-gray-950 p-4 lg:h-full'>
          {!completion && (
            <button
              className='w-full rounded-lg border-2 border-transparent bg-gray-900 px-4 py-2 font-semibold transition-colors hover:border-gray-800 active:bg-gray-800 disabled:animate-pulse'
              disabled={isLoading}
              onClick={handleOnClick}
            >
              {isLoading ? 'generating summary...' : 'generate a summary'}
            </button>
          )}

          <output className='self-start whitespace-pre-wrap'>
            {completion}
          </output>
        </div>

        <p className='self-end text-xs text-gray-400'>powered by OpenAI</p>
      </div>
    </div>
  );
}
