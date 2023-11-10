import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SubredditPosts } from '../lib/reddit/api';
import { hasProperMedia } from '../lib/reddit/parse';
import { SortOptions, TimeOptions } from '../types/reddit';
import ImageDialog from './ImageDialog';
import PostCard from './PostCard';

type GalleryProps = {
  subreddit: string;
  initialPosts?: SubredditPosts;
  sort?: SortOptions;
  time?: TimeOptions;
};

export default function Gallery({
  subreddit,
  initialPosts,
  sort,
  time,
}: GalleryProps) {
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);

  function handlePostClick(index: number) {
    setSelectedPostIndex(index);
    setShowImageDialog(true);
  }

  const fetchPosts = async ({ pageParam: after }: { pageParam: unknown }) =>
    fetch(
      `/api/r/${subreddit}/posts${
        sort ? `/${sort}` : ''
      }?raw_json=1&t=${time}&after=${after}`,
    ).then((res) => res.json());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<SubredditPosts>({
    queryKey: ['subredditPosts', subreddit, sort, time],
    queryFn: fetchPosts,
    initialPageParam: null,
    initialData: initialPosts && {
      pageParams: [null],
      pages: [initialPosts],
    },
    getNextPageParam: (lastPage) => lastPage.after,
  });

  // Create an intersection observer to load more posts when the user scrolls to
  // the bottom of the page.
  useEffect(() => {
    if (hasNextPage) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage();
      });
      observer.observe(document.getElementById('gallery-end')!);

      return () => observer.disconnect();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error') return <p>Failed to get posts</p>;

  const postsWithMedia = data.pages
    .map((page) => page.posts)
    .flat()
    .filter(hasProperMedia);

  if (postsWithMedia.length === 0 && !hasNextPage) return <p>No posts found</p>;

  return (
    <>
      {showImageDialog && (
        <ImageDialog
          post={postsWithMedia[selectedPostIndex]}
          goToPreviousPost={() =>
            selectedPostIndex > 0 && setSelectedPostIndex(selectedPostIndex - 1)
          }
          goToNextPost={() =>
            selectedPostIndex < postsWithMedia.length - 1 &&
            setSelectedPostIndex(selectedPostIndex + 1)
          }
          onClose={() => setShowImageDialog(false)}
        />
      )}

      <div className='flex flex-col items-center gap-8 px-4'>
        <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3'>
          {postsWithMedia.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(index)}
            />
          ))}
        </div>

        {hasNextPage && (
          <div id='gallery-end' className='pb-8'>
            {isFetchingNextPage && (
              <p className='animate-pulse'>loading more posts...</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
