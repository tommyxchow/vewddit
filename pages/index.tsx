import type { GetStaticProps, NextPage } from 'next';
import { RedditClient } from '../lib/reddit/api';
import { RedditPost } from '../types/reddit';
import Gallery from './components/Gallery';
import Layout from './components/Layout';

type HomeProps = {
  posts: RedditPost[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <Layout
      title='vewddit'
      description="anonymously browse any subreddit's images, videos, and GIFs!"
    >
      <Gallery posts={posts} />
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const reddit = await RedditClient.create();
  const posts = await reddit.getPosts('earthporn');

  return {
    props: {
      posts,
    },
  };
};
