import type { ComponentType } from "react";

/**
 * On-site post bodies, keyed by slug from `src/data/posts.ts`.
 *
 * 1. Add metadata in `src/data/posts.ts` (no `externalUrl`).
 * 2. Create `src/content/blogs/<slug>.tsx` with a default export.
 * 3. Register it here.
 */
export const postBodies: Record<string, ComponentType> = {
  // "example-slug": ExamplePost,
};
