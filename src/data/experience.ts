import type { RichText } from './types';

export interface Experience {
  dates: string;
  title: string;
  body: RichText;
}

export const experience: Experience[] = [
  {
    dates: '2024 — 2026',
    title: 'Software Developer · Oracle',
    body: [
      'Owned controller logic for a distributed Kubernetes platform, with guaranteed mutual exclusion across concurrent replicas. Cut scale-up latency by 21 seconds. Shipped a FIPS 140-2 DNS service with zero-downtime cutover. On-call and postmortems with SRE teams.',
    ],
  },
  {
    dates: '2023 — 2024',
    title: 'Backend Developer · Contract, automotive SaaS',
    body: [
      'Designed, deployed and maintained a production app on DigitalOcean: JWT auth with RBAC, idempotent billing with tax logic, cron-driven automation, and race-free sequential IDs.',
    ],
  },
  {
    dates: '2023',
    title: 'DevOps & Analytics Intern · Oracle',
    body: ['Containerized microservices, ran them on Kubernetes, and wired metrics into Oracle Analytics Cloud.'],
  },
  {
    dates: '2021',
    title: 'Outreachy Intern · TensorFlow',
    body: [
      'Built a ',
      { text: 'custom schema component', href: 'https://github.com/rcrowe-google/schemacomponent' },
      ' for ',
      { text: 'TFX-Addons', href: 'https://github.com/tensorflow/tfx-addons' },
      ', with code review in a distributed open-source team.',
    ],
  },
];
