export interface Service {
  title: string;
  summary: string;
  bullets?: string[];
  /** Both null → the card's footer line is hidden; if one is null, show the other alone. */
  timeline: string | null;
  priceFrom: string | null;
}

export const services: Record<'infra' | 'backend' | 'ai', Service[]> = {
  infra: [
    {
      title: 'Production-ready Kubernetes',
      summary: 'Take your app from "it runs on a VM" to a cluster you can trust.',
      bullets: [
        'Helm charts, autoscaling, probes and limits',
        'CI/CD from GitHub Actions to cluster',
        'Dashboards and a written runbook',
      ],
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'Reliability audit',
      summary: 'Find out what will break before your users do.',
      bullets: [
        'Review of cluster, deploys and failure modes',
        'Prioritized risks with concrete fixes',
        'Walkthrough call with your team',
      ],
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'Observability setup',
      summary: 'Alerts that page you for real problems, not noise.',
      bullets: [
        'Prometheus metrics and Grafana dashboards',
        'SLOs and alert rules that matter',
        'Structured logging cleanup',
      ],
      timeline: null,
      priceFrom: null,
    },
  ],
  backend: [
    {
      title: 'MVP backend, end to end',
      summary: 'Data model, API, auth and deployment for a product that needs to go live properly the first time.',
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'Billing & workflow automation',
      summary: 'Invoicing, tax rules, scheduled jobs and idempotent payments, so nothing gets charged twice.',
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'Performance & correctness fixes',
      summary: 'Slow endpoints, race conditions, duplicate records: find the cause, fix it, and prove it with numbers.',
      timeline: null,
      priceFrom: null,
    },
  ],
  ai: [
    {
      title: 'Self-hosted model serving',
      summary: 'Run open models on your own infrastructure, with autoscaling and cost visibility.',
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'LLM app observability',
      summary: 'Latency, token usage and cost per feature, on dashboards your team will actually use.',
      timeline: null,
      priceFrom: null,
    },
    {
      title: 'Productionizing ML pipelines',
      summary: 'Move notebooks and scripts into containerized, scheduled, monitored pipelines.',
      timeline: null,
      priceFrom: null,
    },
  ],
};
