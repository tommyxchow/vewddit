import Gallery from '@/components/Gallery';
import Layout from '@/components/Layout';
import { RedditClient, type SubredditPosts } from '@/lib/reddit/api';
import { type SortOption, type TimeOption } from '@/types/reddit';
import { type GetStaticPaths, type GetStaticProps } from 'next';
import { useRouter } from 'next/router';

interface SubredditProps {
  subreddit: string;
  subredditPosts: SubredditPosts;
}

export default function Subreddit({
  subreddit,
  subredditPosts,
}: SubredditProps) {
  const { isFallback, query } = useRouter();
  const { slug, t } = query as { slug: string[]; t: TimeOption | undefined };

  if (isFallback)
    return (
      <p className='flex min-h-screen animate-pulse items-center justify-center'>
        loading posts...
      </p>
    );

  return (
    <Layout
      title={`r/${subreddit} | Vewddit`}
      description={'Images for ' + subreddit}
    >
      <Gallery
        subreddit={subreddit}
        initialPosts={t === undefined ? subredditPosts : undefined}
        sort={slug[1] as SortOption}
        time={t}
      />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<SubredditProps> = async ({
  params,
}) => {
  try {
    const { slug } = params as { slug: string[] };

    const subreddit = slug[0];
    const sort = slug[1] as SortOption;

    const client = await RedditClient.create();
    const subredditPosts = await client.getPosts(subreddit, sort);

    return {
      props: {
        subreddit,
        subredditPosts,
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
