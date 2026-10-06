import type { Link } from './types';

export interface Publication {
  journal: string;
  title: string;
  authors: string[];
  /** Author rendered in bold. */
  owner: string;
  summary: string;
  links: Link[];
}

export const publications: Publication[] = [
  {
    journal: 'The European Physical Journal D · Vol. 79, Article 11 · 2025 · Peer-reviewed',
    title: "Maximal Secret Reconstruction, Teleportation and Bell's Inequality",
    authors: ['Pratishtha Abrol', 'Pahulpreet Singh', 'Indranil Chakrabarty'],
    owner: 'Pratishtha Abrol',
    summary:
      'In quantum secret sharing, a dealer distributes a quantum state so that a reconstructor can recover it only with help from an assistant. This paper asks which pure three-qubit states make the best resources for that task, given limits on how well each dealer–receiver channel could be used for teleportation.',
    links: [
      { label: 'Journal version ↗', href: 'https://doi.org/10.1140/epjd/s10053-025-00955-6' },
      { label: 'arXiv:2404.01212 ↗', href: 'https://arxiv.org/abs/2404.01212' },
    ],
  },
];

export const keyResults = [
  {
    title: 'Maximal reconstruction states',
    body: "For a fixed maximum teleportation fidelity across the dealer's two channels, we characterized the states that reach the highest possible reconstruction fidelity, and gave them a single-parameter canonical form (MSR states).",
  },
  {
    title: 'A Bell-CHSH bound',
    body: 'Similarly, for a fixed maximum Bell-CHSH value across the dealer–reconstructor and dealer–assistant channels, we found the best reconstruction fidelity that can be achieved.',
  },
  {
    title: 'A mutual exclusivity',
    body: "Every secret-shareable state satisfies Bell's inequality in both dealer partitions. So pure three-qubit states whose bipartite channels violate Bell's inequality are not suitable resources for secret sharing.",
  },
];

export const thesis = {
  meta: 'MS by Research · IIIT Hyderabad · 2025',
  title: 'Characterization of Maximal Quantum Secret Reconstruction in a 3-qubit Scenario',
  summary:
    'Builds on the paper above to identify the best candidate resource states for quantum secret sharing, setting a practical limit on information transfer in a resource-theoretic view of secret sharing.',
  summaryLink: { label: 'IIIT Hyderabad summary ↗', href: 'https://blogs.iiit.ac.in/monthly_news/pratishtha-abrol/' } as Link,
};

export const researchAreas = {
  areas: 'Quantum secret sharing · Teleportation · Bell nonlocality · Entanglement as a resource',
  coursework: 'Quantum Information & Communication · Open Quantum Systems',
};
