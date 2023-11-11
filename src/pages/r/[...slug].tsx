import Gallery from '@/components/Gallery';
import Layout from '@/components/Layout';
import { RedditClient, SubredditPosts } from '@/lib/reddit/api';
import { SortOptions, TimeOptions } from '@/types/reddit';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

type SubredditProps = {
  subreddit: string;
  subredditPosts: SubredditPosts;
};

export default function Subreddit({
  subreddit,
  subredditPosts,
}: SubredditProps) {
  const { isFallback, query } = useRouter();
  const { slug, t } = query as { slug: string[]; t: TimeOptions | undefined };

  if (isFallback)
    return (
      <p className='flex min-h-screen animate-pulse items-center justify-center'>
        Loading...
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
        sort={slug[1] as SortOptions}
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
    const sort = slug[1] as SortOptions;

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
