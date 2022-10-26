export default function Footer() {
  return (
    <footer className='flex justify-between p-4 text-sm text-neutral-400 md:p-8'>
      <p>
        designed and developed by{' '}
        <a
          className='hover:underline'
          href='https://www.tommychow.com/'
          target='_blank'
          rel='noopener noreferrer'
        >
          tommy chow
        </a>
      </p>

      <a
        className='hover:underline'
        href='https://github.com/tommyxchow/vewddit'
        target='_blank'
        rel='noopener noreferrer'
      >
        source
      </a>
    </footer>
  );
}
