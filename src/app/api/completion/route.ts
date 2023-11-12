import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const redditPostURL = `${prompt as string}.json`;

  const redditPostData = await fetch(redditPostURL);
  const [post, comments] = await redditPostData.json();

  const postData: RedditPostData = post['data']['children'][0];
  const commentsData: RedditCommentData[] = comments['data']['children'];

  const redditPostDetails: RedditPostDetails = {
    postDetails: {
      subredditName: postData.data.subreddit,
      title: postData.data.title,
      score: postData.data.score,
      upvoteRatio: postData.data.upvote_ratio,
    },
    comments: parseComments(commentsData).slice(0, 100),
  };

  console.log(redditPostDetails);

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    stream: true,
    max_tokens: 300,
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content: `
You are an AI summarizer that deals with summarizing a single Reddit post. You
will be given the post in a JSON format, which includes the post details and
most of comments. Generate a concise summary of the post (max 4 sentences), and include
the sentiment of the comments. Follow up with 5 bullet points highlighting the
most important points made in comments. Also follow up with highlights of the most
popular comments, with proper attribution. Do not repeat the title/author/subreddit.
Do not simply describe or rephrase the post or comments. Provide a sentiment of how
people feel about the post. Take into consideration the score and upvote ratio,
as well as the reply relationships as given in the id and parentId fields. Make
sure to write it in a way that is easy to scan and understand quickly.
`,
      },
      {
        role: 'user',
        content: JSON.stringify(redditPostDetails),
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

function parseComments(comments: RedditCommentData[]): RedditCommentParsed[] {
  const parsedComments: RedditCommentParsed[] = [];

  for (const comment of comments) {
    const commentData = comment.data;
    if (commentData.author === 'AutoModerator') continue;

    const trimmedCommentData: RedditCommentParsed = {
      id: commentData.name,
      parentId: commentData.parent_id,
      author: commentData.author,
      text: commentData.body,
      score: commentData.score,
      depth: commentData.depth,
    };

    parsedComments.push(trimmedCommentData);

    if (commentData.replies) {
      parsedComments.push(...parseComments(commentData.replies.data.children));
    }
  }

  return parsedComments;
}

type RedditPostData = {
  kind: string;
  data: {
    subreddit: string;
    title: string;
    score: number;
    upvote_ratio: number;
  };
};

type RedditCommentData = {
  data: {
    name: string;
    parent_id: string;
    author: string;
    body: string;
    score: number;
    depth: number;
    replies?: {
      data: {
        children: RedditCommentData[];
      };
    };
  };
};

type RedditCommentParsed = {
  id: string;
  parentId: string;
  author: string;
  text: string;
  score: number;
  depth: number;
};

type RedditPostDetails = {
  postDetails: {
    subredditName: string;
    title: string;
    score: number;
    upvoteRatio: number;
  };
  comments: RedditCommentParsed[];
};
