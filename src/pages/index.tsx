import Gallery from '@/components/Gallery';
import Layout from '@/components/Layout';
import { RedditClient, SubredditPosts } from '@/lib/reddit/api';
import type { GetStaticProps, NextPage } from 'next';

type HomeProps = {
  subredditPosts: SubredditPosts;
};

const Home: NextPage<HomeProps> = ({ subredditPosts }) => {
  return (
    <Layout
      title='Vewddit'
      description='A minimal way to browse media on Reddit'
    >
      <Gallery subreddit='earthporn' initialPosts={subredditPosts} />
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const reddit = await RedditClient.create();
  const subredditPosts = await reddit.getPosts('earthporn');

  return {
    props: {
      subredditPosts,
    },
    revalidate: 60,
  };
};
