import { useMemo, useState } from 'react';
import { RedditPost } from '../../types/reddit';
import { hasProperMedia } from '../../lib/reddit/parse';
import ImageDialog from './ImageDialog';
import PostCard from './PostCard';

type GalleryProps = {
  posts: RedditPost[];
};

export default function Gallery({ posts }: GalleryProps) {
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const postsWithMedia = posts.filter(hasProperMedia);

  function handlePostClick(index: number) {
    setSelectedPostIndex(index);
    setShowImageDialog(true);
  }

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

      <div className='grid gap-2 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {postsWithMedia.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => handlePostClick(index)}
          />
        ))}
      </div>
    </>
  );
}
