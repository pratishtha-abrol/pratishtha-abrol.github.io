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
  { value: '<5ms', caption: 'Client acknowledgement in Ferrum, independent of downstream endpoint latency.' },
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
  { value: '<5ms', caption: 'API response in Ferrum after moving delivery to an async worker behind a queue.' },
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
