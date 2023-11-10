import { SortOptions, sortOptions, timeOptions } from '@/types/reddit';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { HiChevronRight } from 'react-icons/hi2';

export default function Form() {
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
    <form
      className='sticky inset-0 z-10 flex items-baseline gap-1 p-4 backdrop-blur'
      onSubmit={handleSubmit}
    >
      <p className='font-medium'>r/</p>
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

      <select
        id='time'
        className='h-8 rounded-lg py-1 pl-2'
        disabled={selectedSort !== 'top'}
      >
        {timeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button className='h-8 w-12 self-center rounded-lg bg-neutral-700 px-2 py-1'>
        <HiChevronRight aria-label='Search' className='m-auto text-lg' />{' '}
      </button>
    </form>
  );
}
