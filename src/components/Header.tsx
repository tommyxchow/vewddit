import Link from 'next/link';

export default function Header() {
  return (
    <header className='flex flex-col gap-2 px-4 pt-8'>
      <Link className='w-fit' href='/'>
        <h1 className='text-3xl font-bold hover:underline md:text-4xl'>
          vewddit
        </h1>
      </Link>

      <div className='flex flex-col justify-between text-sm text-gray-400 md:flex-row md:text-base'>
        <p>a minimal way to browse media on Reddit</p>

        <p>
          designed and developed by{' '}
          <a
            className='underline'
            href='https://www.tommychow.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Tommy Chow
          </a>{' '}
          (
          <a
            className='underline'
            href='https://github.com/tommyxchow/vewddit'
            target='_blank'
            rel='noopener noreferrer'
          >
            source
          </a>
          )
        </p>
      </div>
    </header>
  );
}
