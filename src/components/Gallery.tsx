import { type SubredditPosts } from '@/lib/reddit/api';
import { hasProperMedia } from '@/lib/reddit/parse';
import { type SortOption, type TimeOption } from '@/types/reddit';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ImageDialog from './ImageDialog';
import PostCard from './PostCard';

interface GalleryProps {
  subreddit: string;
  initialPosts?: SubredditPosts;
  sort?: SortOption;
  time?: TimeOption;
}

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
      }?raw_json=1&t=${time}&after=${after as string}`,
    ).then((res) => res.json());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
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
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      });
      observer.observe(document.getElementById('gallery-end')!);

      return () => observer.disconnect();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const alertMessageClassName = 'px-4';

  if (status === 'pending')
    return <p className={alertMessageClassName}>loading posts..</p>;
  if (status === 'error')
    return (
      <p className={alertMessageClassName}>
        failed to get posts: {error.message}
      </p>
    );

  const postsWithMedia = data.pages
    .map((page) => page.posts)
    .flat()
    .filter(hasProperMedia);

  if (postsWithMedia.length === 0 && !hasNextPage)
    return <p className={alertMessageClassName}>no posts found :(</p>;

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
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[2561px]:grid-cols-5'>
          {postsWithMedia.map((post, index) => (
            <div className='duration-500 animate-in fade-in' key={post.id}>
              <PostCard
                post={post}
                priority={index < 16}
                onClick={() => handlePostClick(index)}
              />
            </div>
          ))}
        </div>

        {hasNextPage && (
          <div id='gallery-end' className='pb-8'>
            {isFetchingNextPage && (
              <p className='animate-pulse'>Getting more posts...</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
