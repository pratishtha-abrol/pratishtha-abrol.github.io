// Writing list, read from the `writing` content collection (src/content/writing/*.md).
// While there are no posts the Writing list, nav links and /writing/ stay hidden
// (SITE_SPEC §5).
import { getCollection } from 'astro:content';

export interface PostSummary {
  title: string;
  href: string;
  date: string;
  iso: string;
  summary?: string;
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export async function getPosts(): Promise<PostSummary[]> {
  const entries = await getCollection('writing');
  return entries
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((e) => ({
      title: e.data.title,
      href: `/writing/${e.id}/`,
      date: formatDate(e.data.date),
      iso: e.data.date.toISOString().slice(0, 10),
      summary: e.data.summary,
    }));
}
