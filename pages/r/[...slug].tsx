import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { SortOptions, TimeOptions } from '../../types/reddit';
import Gallery from '../../components/Gallery';
import Layout from '../../components/Layout';

type SubredditProps = {
  subreddit: string;
};

export default function Subreddit({ subreddit }: SubredditProps) {
  const { isFallback, query } = useRouter();
  const { slug, t } = query as { slug: string[]; t: TimeOptions | undefined };

  if (isFallback) return <p>Loading...</p>;

  return (
    <Layout
      title={`r/${subreddit} | vewddit`}
      description={'Images for ' + subreddit}
    >
      <Gallery subreddit={subreddit} sort={slug[1] as SortOptions} time={t} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<SubredditProps> = async ({
  params,
}) => {
  const { slug } = params as { slug: string[] };

  const subreddit = slug[0];

  return {
    props: {
      subreddit,
    },
  };
};
