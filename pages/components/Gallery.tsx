import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SubredditPosts } from '../../lib/reddit/api';
import { hasProperMedia } from '../../lib/reddit/parse';
import { SortOptions, TimeOptions } from '../../types/reddit';
import ImageDialog from './ImageDialog';
import PostCard from './PostCard';

type GalleryProps = {
  subreddit: string;
  initialData?: SubredditPosts;
  sort?: SortOptions;
  time?: TimeOptions;
};

export default function Gallery({
  subreddit,
  initialData,
  sort,
  time,
}: GalleryProps) {
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);

  function handlePostClick(index: number) {
    setSelectedPostIndex(index);
    setShowImageDialog(true);
  }

  const fetchPosts = async ({ pageParam: after = undefined }) =>
    fetch(
      `/api/r/${subreddit}/posts${
        sort ? `/${sort}` : ''
      }?raw_json=1&t=${time}&after=${after}`
    ).then((res) => res.json());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<SubredditPosts>(
    ['subredditPosts', subreddit, sort, time],
    fetchPosts,
    {
      initialData: initialData && {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => lastPage.after,
    }
  );

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Failed to get posts</p>;

  const postsWithMedia = data.pages
    .map((page) => page.posts)
    .flat()
    .filter(hasProperMedia);

  return (
    <>
      {showImageDialog && (
        <ImageDialog
          post={postsWithMedia[selectedPostIndex]}
          goToPreviousImages={() =>
            selectedPostIndex > 0 && setSelectedPostIndex(selectedPostIndex - 1)
          }
          gotoNextImage={() =>
            selectedPostIndex < postsWithMedia.length - 1 &&
            setSelectedPostIndex(selectedPostIndex + 1)
          }
          onClose={() => setShowImageDialog(false)}
        />
      )}

      <div className='flex flex-col items-center gap-8'>
        <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3'>
          {postsWithMedia.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(index)}
            />
          ))}
        </div>

        {isFetching ? (
          <p>Fetching...</p>
        ) : (
          <button onClick={() => fetchNextPage()}>Get more</button>
        )}
      </div>
    </>
  );
}
