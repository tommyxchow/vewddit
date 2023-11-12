import { RedditPost } from '@/types/reddit';
import { useCompletion } from 'ai/react';

type SummaryProps = {
  post: RedditPost;
};

export function Summary({ post }: SummaryProps) {
  const { completion, isLoading, complete } = useCompletion();

  return (
    <div className='flex grow flex-col gap-2'>
      <h3 className='text-lg font-semibold'>how do the comments feel?</h3>

      <div className='flex grow flex-col gap-2'>
        <div className='h-48 overflow-auto rounded-xl border-2 border-gray-900 bg-gray-950 p-4 lg:h-full'>
          {!completion && (
            <button
              className='w-full rounded-lg bg-gray-900 px-4 py-2 font-semibold disabled:animate-pulse'
              disabled={isLoading}
              onClick={() =>
                complete(`https://www.reddit.com${post.permalink}`)
              }
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
