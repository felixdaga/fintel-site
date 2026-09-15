# fintel. site

Public site for [fintel.capital](https://fintel.capital): home, scoreboard, live agent, blogs, and about us.

```
src/
  app/                 routes
  components/          site chrome + page UI
  content/blogs/       on-site posts (one folder per slug)
  data/                catalog + extracted JSON
  lib/                 shared constants and helpers
  scripts/             extract jobs for leaderboard / reports
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Eval-list signups go to [Loops](https://loops.so). Set `LOOPS_API_KEY` in `.env.local` (and Vercel). Emails never touch git or the site database. Optional `LOOPS_MAILING_LIST_ID` puts contacts on a specific list.

On-site blog posts: add an entry in `src/data/posts.ts` (no `externalUrl`), add `src/content/blogs/<slug>/`, and register the body in `src/content/blogs/index.ts`.
