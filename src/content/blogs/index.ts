import type { ComponentType } from "react";
import GeopolReportPost from "./geopol-trade-war-2018/post";

/**
 * On-site post bodies, keyed by slug from `src/data/posts.ts`.
 *
 * On-site post: omit `externalUrl` in posts.ts, add a folder under
 * `src/content/blogs/<slug>/` with a default-export body, and register it here.
 */
export const postBodies: Record<string, ComponentType> = {
  "geopol-trade-war-2018": GeopolReportPost,
};
