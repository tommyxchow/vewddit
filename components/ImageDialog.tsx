import { Dialog } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { HiArrowLeft, HiArrowRight, HiXMark } from 'react-icons/hi2';
import { parseRedditPostMedia } from '../lib/reddit/parse';
import { RedditPost } from '../types/reddit';

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
          <picture>
            <img
              className='max-h-screen'
              src={postMedia?.mediaUrls[imageIndex]}
              alt={post.title}
            />
          </picture>
        );
      case 'hosted:video':
        return (
          <video
            className='max-h-screen'
            autoPlay
            loop
            muted
            playsInline
            disableRemotePlayback
            controls
            src={postMedia?.mediaUrls[0]}
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
      className='fixed inset-0 z-50 flex w-full items-center justify-center bg-black/80 backdrop-blur'
      open
      onClose={onClose}
    >
      <Dialog.Panel>
        <button
          className='absolute top-0 right-0 m-2 rounded-full bg-black/50 p-4'
          aria-label='Close dialog'
        >
          <HiXMark className='text-3xl' onClick={onClose} />
        </button>

        {imageIndex > 0 && (
          <button
            className='absolute left-0 top-1/2 ml-2 -translate-y-1/2 rounded-full bg-black/50 p-4'
            aria-label='Go to previous image'
          >
            <HiArrowLeft className='text-3xl' onClick={goToPreviousImage} />
          </button>
        )}

        {imageIndex < postMedia?.mediaUrls.length! - 1 && (
          <button
            className='absolute top-1/2 right-0 mr-2 -translate-y-1/2 rounded-full bg-black/50 p-4'
            aria-label='Go to next image'
          >
            <HiArrowRight className='text-3xl' onClick={goToNextImage} />
          </button>
        )}

        <div className='absolute bottom-0 left-0 h-fit w-full bg-black/80 p-4 text-center'>
          <a
            className='hover:underline'
            href={'https://www.reddit.com' + post.permalink}
            target='_blank'
            rel='noreferrer'
          >
            <h1>{post.title}</h1>
          </a>
        </div>

        {renderContent()}
      </Dialog.Panel>
    </Dialog>
  );
}
