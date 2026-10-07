// Single source for contact links, resumes, prices and benchmarks.
// null = not known yet; the UI hides anything that depends on it (SITE_SPEC §5).
export const site = {
  name: 'Pratishtha Abrol',
  email: 'pratishthaabrol@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pratishtha-abrol/',
  github: 'https://github.com/pratishtha-abrol',
  calendar: null as string | null, // Calendly / Cal.com link
  scholar: 'https://scholar.google.com/citations?hl=en&user=2qBrbjwAAAAJ' as string | null,
  orcid: 'https://orcid.org/0009-0001-1581-2226' as string | null,
  responseTime: 'two working days' as string | null,
  resumes: { infra: '/resume/Pratishtha_CV.pdf', backend: null, ai: null, research: '/resume/Pratishtha_Research_CV.pdf' } as Record<
    'infra' | 'backend' | 'ai' | 'research',
    string | null
  >,
  paper: {
    doi: 'https://doi.org/10.1140/epjd/s10053-025-00955-6',
    arxiv: 'https://arxiv.org/abs/2404.01212',
  },
  thesisPdf: null as string | null,
  researchTools: 'Python · Qiskit · Cirq · Mathematica' as string | null,
  certs: { ckaInProgress: true },
  // URL of the deployed stats Worker (see worker/README.md). null = no tracking and no intro form.
  // Set it with the PUBLIC_STATS_ENDPOINT build variable, e.g. https://pa-site-stats.<you>.workers.dev
  stats: { endpoint: (import.meta.env.PUBLIC_STATS_ENDPOINT as string | undefined) || null } as { endpoint: string | null },
  crucible: {
    repo: 'https://github.com/pratishtha-abrol/crucible' as string | null,
    writeup: null as string | null,
    benchmarks: {
      ttftP95: null as string | null,
      overhead: null as string | null,
      costPer1M: null as string | null,
    },
  },
};
