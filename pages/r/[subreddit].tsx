import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RedditClient } from '../../lib/reddit/api';
import { RedditPost } from '../../types/reddit';
import Gallery from '../components/Gallery';
import Layout from '../components/Layout';

type SubredditProps = {
  subreddit: string;
  posts: RedditPost[];
};

export default function Subreddit({ subreddit, posts }: SubredditProps) {
  const { isFallback } = useRouter();

  if (isFallback) return <div>Loading...</div>;

  return (
    <Layout title={subreddit} description={'Images for ' + subreddit}>
      <Gallery posts={posts} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { subreddit } = params as { subreddit: string };

    const client = await RedditClient.create();
    const posts = await client.getPosts(subreddit);

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
