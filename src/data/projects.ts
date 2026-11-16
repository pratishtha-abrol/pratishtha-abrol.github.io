import type { Link } from './types';

export interface FlowNode {
  label: string;
  /** Accent-bordered key node. */
  key?: boolean;
}

export interface ArchitectureFlow {
  main: FlowNode[];
  supporting: string[];
}

export interface FeaturedProject {
  meta: string;
  title: string;
  summary: string;
  bullets: string[];
  stack: string[];
}

export interface ProjectCard {
  meta: string;
  title: string;
  summary: string;
  links: Link[];
}

// Backend page: featured case study + three cards.
export const backendFeatured: FeaturedProject = {
  meta: 'Contract · 2023 – 2024 · Automotive SaaS',
  title: 'Workshop management platform, solo, from schema to production',
  summary:
    'Designed, built and deployed the whole product for a paying client: backend, React front end and scheduled jobs on DigitalOcean App Platform, used daily by 20+ staff.',
  bullets: [
    'Multi-tier billing with CGST/SGST tax logic, 4 payment modes, and idempotent operations',
    'Timezone-aware, race-free sequential job numbering',
    'JWT auth with role-based access control and environment-aware CORS',
    '6 cron-driven batch jobs replacing manual billing work',
    '40+ component React app with route guards, multi-step flows and PDF reports',
  ],
  stack: ['Node · Express', 'MongoDB · aggregation pipelines', 'React · jsPDF', 'DigitalOcean App Platform'],
};

export const backendProjects: ProjectCard[] = [
  {
    meta: 'Personal project · 2026',
    title: 'Ferrum webhook delivery platform',
    summary:
      'FastAPI gateway and crash-safe worker over PostgreSQL and Redis: transactional outbox, leases, retries scheduled in the database. About 990 events/s with 4 API processes on one laptop.',
    links: [
      { label: 'Engineering notes ↗', href: 'https://github.com/ferrum-webhooks/docs/blob/main/engineering/README.md' },
      { label: 'Gateway repo ↗', href: 'https://github.com/ferrum-webhooks/ferrum-webhook-gateway' },
    ],
  },
  {
    meta: 'Oracle · 2024 – 2026',
    title: 'Distributed controller logic',
    summary:
      'Concurrency-safe key assignment across controller replicas, guaranteeing mutual exclusion in a production Kubernetes platform.',
    links: [{ label: 'More on the infra side →', href: '/infra/' }],
  },
  {
    meta: 'Project · MERN',
    title: 'Job portal with dual-role RBAC',
    summary:
      'Applicant and recruiter roles, Google OAuth, fuzzy search, résumé upload, and cascade rules that keep data consistent.',
    links: [{ label: 'View code ↗', href: 'https://github.com/pratishtha-abrol/MERN-job-application-portal' }],
  },
];

// Infra page: Ferrum case study.
export const ferrum = {
  title: 'Ferrum: a webhook delivery platform that does not lose events.',
  lead: 'An event and its pending deliveries are saved in one database transaction. A relay, a Redis stream and crash-safe workers do the rest, so a slow or broken receiver never slows the sender.',
  flow: {
    main: [
      { label: 'Sender' },
      { label: 'FastAPI gateway', key: true },
      { label: 'Postgres outbox' },
      { label: 'Redis stream' },
      { label: 'Async worker', key: true },
      { label: 'Receiver' },
    ],
    supporting: [
      'PostgreSQL · system of record',
      'OpenTelemetry · one trace per event',
      'Prometheus · metrics',
      'Kubernetes · Helm chart, default-deny network policy (validated offline)',
    ],
  } satisfies ArchitectureFlow,
  columns: [
    {
      title: 'Built',
      body: 'Transactional outbox, at-least-once delivery with leases and crash recovery, retries scheduled in the database, signed deliveries (Standard Webhooks), an SSRF guard, tenant isolation, traces and metrics, and a Kubernetes chart with a manifest security checker.',
    },
    {
      title: 'Measured',
      body: 'About 990 events/s with 4 API processes and p95 under 6 ms up to 900 events/s, on one laptop with everything co-located. No lost events in the crash tests. Login memory cut from 806 MB to 106 MB. A deadlock at 200 clients fixed (6 of 120 requests before, 120 of 120 after).',
    },
    {
      title: 'Honest limits',
      body: 'One database and one Redis, no backups, no encryption between components. The Helm chart and network policies are checked offline but not yet installed on a real cluster. The docs list future improvements.',
    },
  ],
  links: [
    { label: 'Engineering notes ↗', href: 'https://github.com/ferrum-webhooks/docs/blob/main/engineering/README.md' },
    { label: 'Gateway ↗', href: 'https://github.com/ferrum-webhooks/ferrum-webhook-gateway' },
    { label: 'Worker ↗', href: 'https://github.com/ferrum-webhooks/ferrum-webhook-worker' },
    { label: 'Infra ↗', href: 'https://github.com/ferrum-webhooks/infra' },
  ] as Link[],
};

// Infra page: "Also" aside.
export const alsoProjects = {
  shellC: {
    label: 'Shell-C ↗',
    href: 'https://github.com/pratishtha-abrol/Shell-C',
    body: 'A Unix shell from scratch in C: pipes, redirection, signals, process control.',
  },
  // Certification list; CKA is shown only when site.certs.ckaInProgress is true.
  certs: ['Claude Code in Action (Anthropic)', 'Linux & Git (Coursera)'],
};

// AI page: Crucible featured project. Benchmarks and links come from site.crucible.
export const crucible = {
  status: 'In progress',
  title: 'Crucible: a self-hosted LLM inference gateway on Kubernetes.',
  lead: 'An OpenAI-compatible gateway in front of self-hosted models, built for the problems teams hit once an LLM feature has real traffic: cost, latency, fairness between tenants, and safe model upgrades.',
  flow: {
    main: [
      { label: 'Client · OpenAI SDK' },
      { label: 'Go gateway', key: true },
      { label: 'Router · canary' },
      { label: 'Model servers', key: true },
    ],
    supporting: [
      'Redis · token rate limits',
      'Postgres · usage & keys',
      'Prometheus · TTFT, tokens/s',
      'KEDA · queue-based scaling',
    ],
  } satisfies ArchitectureFlow,
  features: [
    { title: 'Streaming proxy', body: 'OpenAI-compatible API with token streaming, so existing SDKs work unchanged.' },
    { title: 'Token-aware limits', body: 'Per-key budgets measured in tokens, not requests, with usage accounting.' },
    { title: 'Scale on real load', body: 'Autoscaling on queue depth and in-flight requests instead of CPU.' },
    { title: 'Safe model upgrades', body: 'Canary routing between model versions, gated by an eval suite in CI.' },
  ],
};

// AI page: ML pipelines section.
export const mlPipelines: ProjectCard[] = [
  {
    meta: 'Outreachy · 2021',
    title: 'TFX custom schema component',
    summary:
      'Built a schema component for TFX-Addons, the community extension library for TensorFlow Extended pipelines, through code review with maintainers.',
    links: [
      { label: 'Component ↗', href: 'https://github.com/rcrowe-google/schemacomponent' },
      { label: 'TFX-Addons ↗', href: 'https://github.com/tensorflow/tfx-addons' },
    ],
  },
  {
    meta: 'Oracle · 2023',
    title: 'Metrics into analytics',
    summary: 'Containerized microservices on Kubernetes and connected them to Oracle Analytics Cloud for metrics visibility.',
    links: [],
  },
];
