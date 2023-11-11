import Head from 'next/head';
import SearchBar from './Form';
import Header from './Header';

type LayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function Layout({ title, description, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={description} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <Header />

      <div className='sticky inset-0 z-40 bg-black bg-opacity-50 backdrop-blur'>
        <SearchBar />
      </div>

      <main className='min-h-screen'>{children}</main>
    </>
  );
}
