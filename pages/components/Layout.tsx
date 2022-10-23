import Head from 'next/head';
import Header from './Header';
import ImageDialog from './ImageDialog';

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

      <main className='min-h-screen px-4'>{children}</main>
    </>
  );
}
