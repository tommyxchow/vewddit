import { HiChevronRight } from 'react-icons/hi';

export default function Header() {
  return (
    <header className='px-4 pt-8 pb-4'>
      <h1 className='text-3xl font-bold'>vewddit</h1>
      <p className='text-sm text-neutral-400'>
        anonymously browse any subreddit&apos;s images, videos, and GIFs!
      </p>

      <form className='mt-2 flex items-baseline gap-1'>
        <p>r/</p>
        <input
          className='h-8 w-full rounded-lg px-2 py-1 placeholder:text-neutral-400'
          placeholder='subreddit'
          required
        />

        <select className='h-8 rounded-lg py-1 pl-2'>
          <option value='hot'>hot</option>
          <option value='top'>top</option>
          <option value='new'>new</option>
        </select>

        <button className='h-8 w-12 self-center rounded-lg bg-neutral-700 px-2 py-1'>
          <HiChevronRight aria-label='Search' className='m-auto text-lg' />{' '}
        </button>
      </form>
    </header>
  );
}
