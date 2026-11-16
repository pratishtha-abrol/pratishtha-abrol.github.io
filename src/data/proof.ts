// Proof strips, terminal card and key/value strips, per page.

export interface Stat {
  value: string;
  caption: string;
}

export const infraStats: Stat[] = [
  { value: '−21s', caption: 'Cluster scale-up latency cut at Oracle, by reworking scheduling and synchronization.' },
  {
    value: '0 downtime',
    caption: 'FIPS 140-2 compliant DNS cutover into production Kubernetes networking. Adopted by 2 teams.',
  },
  { value: '0 lost', caption: 'Accepted events lost in Ferrum crash tests, including a kill -9 mid-delivery that recovered in 2.6 s.' },
];

export const backendStats: Stat[] = [
  {
    value: '0 duplicates',
    caption: "Sequential job IDs under concurrent writes, and idempotent billing that can't double-invoice.",
  },
  {
    value: '12 models',
    caption: 'MongoDB schema designed end to end for vehicles, customers, jobs and multi-tier billing.',
  },
  { value: '<6ms', caption: 'p95 ingest latency in Ferrum at up to 900 events/s, because delivery happens off the request path.' },
];

export const infraTerminal: Array<[key: string, value: string]> = [
  ['Role', 'Platform / SRE'],
  ['Focus', 'Kubernetes, CI/CD, observability'],
  ['Previously', 'Oracle, 2024–2026'],
  ['Stack', 'Go · Python · Helm · Prometheus'],
  ['Location', 'India · remote'],
  ['Status', 'Ready'],
];

export const backendStack: Array<[label: string, value: string]> = [
  ['LANGUAGES', 'Python · Go · JavaScript · SQL'],
  ['FRAMEWORKS', 'FastAPI · Express · React'],
  ['DATA', 'PostgreSQL · MongoDB · Redis'],
  ['PATTERNS', 'REST · event-driven · JWT/RBAC'],
];
