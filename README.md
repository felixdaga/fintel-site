# fintel. site

Public site for [fintel.capital](https://fintel.capital): landing, live F1 strategy, challenge leaderboard, and blogs.

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

On-site blog posts: add an entry in `src/data/posts.ts` (no `externalUrl`), add `src/content/blogs/<slug>/`, and register the body in `src/content/blogs/index.ts`.
