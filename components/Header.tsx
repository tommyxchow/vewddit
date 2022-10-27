import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { SortOptions, sortOptions, timeOptions } from '../types/reddit';

export default function Header() {
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState<SortOptions>('hot');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subreddit = event.currentTarget.subreddit.value;
    const sort = event.currentTarget.sort.value;
    const time = selectedSort == 'top' && event.currentTarget.time.value;

    router.push(`/r/${subreddit}/${sort}${time ? `?t=${time}` : ''}`);
  }

  return (
    <header className='px-4 pt-8 pb-4 md:px-8'>
      <Link href='/'>
        <a className='flex w-fit hover:underline'>
          <h1 className='text-3xl font-bold'>vewddit</h1>
        </a>
      </Link>

      <p className='text-sm text-neutral-400'>
        anonymously browse any subreddit&apos;s images, videos, and GIFs
      </p>

      <form className='mt-2 flex items-baseline gap-1' onSubmit={handleSubmit}>
        <p>r/</p>
        <input
          id='subreddit'
          className='h-8 w-full rounded-lg px-2 py-1 placeholder:text-neutral-400'
          placeholder='subreddit'
          required
        />

        <select
          id='sort'
          className='h-8 rounded-lg py-1 pl-2'
          onChange={(event) =>
            setSelectedSort(event.currentTarget.value as SortOptions)
          }
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selectedSort === 'top' && (
          <select id='time' className='h-8 rounded-lg py-1 pl-2'>
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <button className='h-8 w-12 self-center rounded-lg bg-neutral-700 px-2 py-1'>
          <HiChevronRight aria-label='Search' className='m-auto text-lg' />{' '}
        </button>
      </form>
    </header>
  );
}
