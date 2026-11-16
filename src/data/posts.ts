// Writing list shown on /infra/ and /writing/. Each entry matches a Markdown file in
// src/content/writing/. While this list is empty the Writing list and nav link stay hidden.
export interface PostSummary {
  title: string;
  href: string;
  date: string;
}

export const posts: PostSummary[] = [
  { title: 'The two lines of code that lied to my users', href: '/writing/never-lose-an-accepted-event/', date: 'Nov 2026' },
  { title: '"Exactly once" doesn\'t exist, so I killed my own workers', href: '/writing/at-least-once-delivery-and-kill-9/', date: 'Nov 2026' },
  { title: 'At 200 users my API didn\'t slow down. It stopped.', href: '/writing/connection-pool-thread-pool-deadlock/', date: 'Nov 2026' },
  { title: 'Fifty logins killed my server, and the fix was in how Linux gives memory back', href: '/writing/argon2-threads-and-glibc/', date: 'Nov 2026' },
  { title: 'My first benchmark results were wrong in three different ways', href: '/writing/benchmarks-that-lied/', date: 'Nov 2026' },
  { title: 'The same bytes, 350 ms later: lessons from proxying an LLM stream', href: '/writing/proxying-llm-streams/', date: 'Nov 2026' },
];
