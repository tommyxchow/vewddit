import { parseRedditPostMedia } from '@/lib/reddit/parse';
import { RedditPost } from '@/types/reddit';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { HiArrowLeft, HiArrowRight, HiXMark } from 'react-icons/hi2';

type ImageDialogProps = {
  post: RedditPost;
  goToPreviousPost: () => void;
  goToNextPost: () => void;
  onClose: () => void;
};

export default function ImageDialog({
  post,
  goToPreviousPost,
  goToNextPost,
  onClose,
}: ImageDialogProps) {
  const postMedia = parseRedditPostMedia(post);

  const [imageIndex, setImageIndex] = useState(0);

  const goToPreviousImage = useCallback(() => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  }, [imageIndex]);

  const goToNextImage = useCallback(() => {
    if (imageIndex < postMedia?.mediaUrls.length! - 1) {
      setImageIndex(imageIndex + 1);
    }
  }, [imageIndex, postMedia?.mediaUrls.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowLeft':
          goToPreviousImage();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
        case 'ArrowUp':
          setImageIndex(0);
          goToPreviousPost();
          break;
        case 'ArrowDown':
          setImageIndex(0);
          goToNextPost();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousImage, goToNextImage, goToPreviousPost, goToNextPost]);

  function renderContent() {
    switch (postMedia!.hint) {
      case 'image':
        return (
          <Image
            // Use !important to override the default classes from the Image
            // component when the fill prop is used.
            className='m-auto !h-fit max-h-screen !w-fit'
            src={postMedia!.mediaUrls[imageIndex]}
            alt={post.title}
            fill
            unoptimized
            onClick={(event) => event.stopPropagation()}
          />
        );
      case 'hosted:video':
        return (
          <video
            className='absolute h-full max-h-fit w-full max-w-fit'
            autoPlay
            loop
            muted
            playsInline
            disableRemotePlayback
            controls
            src={postMedia?.mediaUrls[0]}
            onClick={(event) => event.stopPropagation()}
          />
        );
      case 'rich:video':
      case 'link':
        return (
          <div
            dangerouslySetInnerHTML={{ __html: post.media_embed?.content! }}
          />
        );
    }
  }

  return (
    <Dialog
      className='fixed inset-0 z-50 bg-black/50 backdrop-blur duration-200 ease-out animate-in fade-in'
      open
      onClose={onClose}
    >
      <Dialog.Panel className='flex h-full w-full flex-col lg:flex-row'>
        <div
          className='relative flex grow items-center justify-center'
          onClick={onClose}
        >
          <button
            className='absolute right-0 top-0 z-50 m-2 rounded-full bg-black/50 p-2 md:p-4'
            aria-label='Close dialog'
            onClick={onClose}
          >
            <HiXMark className='text-2xl md:text-3xl' />
          </button>

          {imageIndex > 0 && (
            <button
              className='absolute left-0 top-1/2 z-50 ml-2 -translate-y-1/2 rounded-full bg-black/50 p-2 md:p-4'
              aria-label='Go to previous image'
              onClick={goToPreviousImage}
            >
              <HiArrowLeft className='text-2xl md:text-3xl' />
            </button>
          )}

          {imageIndex < postMedia?.mediaUrls.length! - 1 && (
            <button
              className='absolute right-0 top-1/2 z-50 mr-2 -translate-y-1/2 rounded-full bg-black/50 p-2 md:p-4'
              aria-label='Go to next image'
              onClick={goToNextImage}
            >
              <HiArrowRight className='text-2xl md:text-3xl' />
            </button>
          )}

          {renderContent()}
        </div>

        <div className='z-50 flex flex-col gap-4 border-t border-gray-800 bg-black p-8 lg:w-[350px] lg:border-l'>
          <Dialog.Title className='text-xl font-bold'>
            {post.title}
          </Dialog.Title>
          <Dialog.Description>
            Posted by u/{post.author} in r/{post.subreddit}
          </Dialog.Description>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
