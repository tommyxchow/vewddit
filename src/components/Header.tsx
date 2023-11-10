import Link from 'next/link';

export default function Header() {
  return (
    <header className='px-4 pt-8'>
      <Link href='/'>
        <h1 className='flex w-fit text-3xl font-bold hover:underline md:text-4xl'>
          Vewddit
        </h1>
      </Link>

      <div className='flex flex-col justify-between text-sm text-neutral-400 md:flex-row md:text-base'>
        <p>A minimal way to browse media on Reddit</p>

        <p>
          Designed and developed by{' '}
          <a
            className='hover:underline'
            href='https://www.tommychow.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Tommy Chow
          </a>{' '}
          (
          <a
            className='hover:underline'
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
