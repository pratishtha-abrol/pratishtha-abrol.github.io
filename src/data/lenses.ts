// Hub page: lens cards and background strip.

export interface Lens {
  path: string;
  href: string;
  title: string;
  summary: string;
  footer: string;
}

export const lenses: Lens[] = [
  {
    path: '/INFRA',
    href: '/infra/',
    title: 'Platform & reliability',
    summary: 'Kubernetes, CI/CD, observability and SRE. Where most of my production work lives.',
    footer: 'Oracle · Ferrum · SRE services →',
  },
  {
    path: '/BACKEND',
    href: '/backend/',
    title: 'Backend & full-stack',
    summary: 'APIs, data models and business logic that stay correct under concurrency.',
    footer: 'SaaS billing · APIs · React →',
  },
  {
    path: '/AI',
    href: '/ai/',
    title: 'AI infrastructure',
    summary: 'Serving, scaling and observing models in production, backed by research depth.',
    footer: 'LLM serving · TFX · MLOps →',
  },
  {
    path: '/RESEARCH',
    href: '/research/',
    title: 'Quantum information',
    summary: 'Secret sharing, teleportation and Bell nonlocality in three-qubit systems.',
    footer: 'EPJ D 2025 · MS thesis →',
  },
];

export const background: Array<[label: string, value: string]> = [
  ['INDUSTRY', 'Oracle, 2023 – 2026'],
  ['EDUCATION', 'IIIT Hyderabad, B.Tech + MS by Research'],
  ['OPEN SOURCE', 'Outreachy · TensorFlow TFX'],
  ['RESEARCH', 'Published in EPJ D, 2025'],
];
