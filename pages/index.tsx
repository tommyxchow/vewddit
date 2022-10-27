import type { GetStaticProps, NextPage } from 'next';
import { RedditClient, SubredditPosts } from '../lib/reddit/api';
import Gallery from './components/Gallery';
import Layout from './components/Layout';

type HomeProps = {
  subredditPosts: SubredditPosts;
};

const Home: NextPage<HomeProps> = ({ subredditPosts }) => {
  return (
    <Layout
      title='vewddit'
      description="anonymously browse any subreddit's images, videos, and GIFs!"
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
