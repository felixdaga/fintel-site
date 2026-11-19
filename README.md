# fintel. site

Public site for [fintel.capital](https://fintel.capital): a short home, about, notes, and a live book.

```
src/
  app/                 routes
  components/          site chrome + page UI
  content/blogs/       on-site posts (one folder per slug)
  data/                catalog + extracted JSON
  lib/                 shared constants and helpers
  scripts/             extract jobs for reports
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`/api/subscribe` posts to [Loops](https://loops.so) when `LOOPS_API_KEY` is set. Emails never touch git. Optional `LOOPS_MAILING_LIST_ID` puts contacts on a specific list.

On-site blog posts: add an entry in `src/data/posts.ts` (no `externalUrl`), add `src/content/blogs/<slug>/`, and register the body in `src/content/blogs/index.ts`.
