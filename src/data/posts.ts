// Writing list. Empty until the first post exists; while empty the Writing
// list, nav link and /writing/ route stay hidden (SITE_SPEC §5).
export interface PostSummary {
  title: string;
  href: string;
  date: string;
}

export const posts: PostSummary[] = [];
