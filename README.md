# [vewddit](https://vewddit.vercel.app/)

<div>
    <img width='49%' src='https://github.com/tommyxchow/vewddit/assets/54859075/9cabee37-9e4d-491a-8a4c-9d39e42a7c00'>
    <img width='49%' src='https://github.com/tommyxchow/vewddit/assets/54859075/1dfe939f-5558-402e-9440-93f734e22d3d'>
</div>

A web app for Reddit focused on browsing visual media.

## Background

I wanted to build something related to Reddit since I use it on a daily basis. I occasionally go on Reddit to grab wallpapers for my phone and desktop, so I decided to make a web app focused on the browsing the visual media without the noise of votes, awards, comments, etc.

## Stack

- [Next.js](https://nextjs.org/) (pages router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Headless UI](https://headlessui.com/) (dialog)
- [React/Tanstack Query](https://tanstack.com/query/latest)
- [Vercel AI SDK](https://sdk.vercel.ai/docs) (OpenAI comment summaries)
- [Vercel](https://vercel.com/) (deployment and edge functions)

## Setup

Sign up for the Reddit and OpenAI APIs. Get your credentials and set them in the environment variables:

```plaintext
# .env.local
REDDIT_CLIENT_ID=
REDDIT_SECRET=
OPENAI_API_KEY=
```

## License

vewddit is licensed under [MIT](LICENSE).
