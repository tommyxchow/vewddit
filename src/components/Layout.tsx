import Head from 'next/head';
import Form from './Form';
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

      <Form />

      <main className='min-h-screen'>{children}</main>
    </>
  );
}
