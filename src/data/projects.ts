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
    title: 'Ferrum webhook API',
    summary:
      'FastAPI gateway and async worker over Redis and PostgreSQL. Cache-aside lookups cut from 22ms to 1.2ms on hits, with invalidation on every write.',
    links: [{ label: 'View code ↗', href: 'https://github.com/ferrum-webhooks/ferrum-webhook-relay-core' }],
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
  title: 'Ferrum: a webhook delivery platform, built in the open.',
  lead: 'Ingestion is decoupled from delivery, so a slow customer endpoint never slows down the sender.',
  flow: {
    main: [
      { label: 'Sender' },
      { label: 'FastAPI gateway', key: true },
      { label: 'Redis queue' },
      { label: 'Async worker', key: true },
      { label: 'Endpoint' },
    ],
    supporting: ['PostgreSQL · persistence', 'Prometheus · metrics', 'Kubernetes · HPA, probes, limits'],
  } satisfies ArchitectureFlow,
  columns: [
    {
      title: 'Built',
      body: 'Gateway + async worker over Redis, PostgreSQL, Kubernetes with autoscaling, Prometheus metrics, and GitHub Actions → GHCR → cluster deploys.',
    },
    {
      title: 'Measured',
      body: '135 req/s at 0% errors (k6, 50 VUs, 60s). Client ack under 5ms. Cache-aside lookups from 22ms to 1.2ms on hits.',
    },
    {
      title: 'Next',
      body: 'AWS with EKS + Terraform, deliberate failure injection with written postmortems, then Vault, ArgoCD and mTLS.',
    },
  ],
  links: [
    { label: 'Core repo ↗', href: 'https://github.com/ferrum-webhooks/ferrum-webhook-relay-core' },
    { label: 'Infra repo ↗', href: 'https://github.com/ferrum-webhooks/infra' },
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
