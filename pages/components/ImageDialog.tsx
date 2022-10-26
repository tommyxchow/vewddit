import { Dialog } from '@headlessui/react';
import { useEffect } from 'react';
import { parseRedditPostMedia } from '../../lib/reddit/parse';
import { RedditPost } from '../../types/reddit';

type ImageDialogProps = {
  post: RedditPost;
  goToPreviousImages: () => void;
  gotoNextImage: () => void;
  onClose: () => void;
};

export default function ImageDialog({
  post,
  goToPreviousImages,
  gotoNextImage,
  onClose,
}: ImageDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        goToPreviousImages();
      } else if (event.key === 'ArrowRight') {
        gotoNextImage();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPreviousImages, gotoNextImage]);

  const postMedia = parseRedditPostMedia(post);

  function renderContent() {
    switch (postMedia!.hint) {
      case 'image':
        return (
          <picture>
            <img
              className='max-h-screen'
              src={postMedia?.mediaUrl}
              alt={post.title}
            />
          </picture>
        );
      case 'hosted:video':
        return (
          <video
            autoPlay
            loop
            muted
            playsInline
            disableRemotePlayback
            controls
            src={postMedia?.mediaUrl}
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
      className='fixed inset-0 z-50 flex w-full items-center justify-center bg-black/80'
      open
      onClose={onClose}
    >
      <Dialog.Panel>{renderContent()}</Dialog.Panel>
    </Dialog>
  );
}
