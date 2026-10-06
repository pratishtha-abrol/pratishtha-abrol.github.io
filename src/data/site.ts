// Single source for contact links, resumes, prices and benchmarks.
// null = not known yet; the UI hides anything that depends on it (SITE_SPEC §5).
export const site = {
  name: 'Pratishtha Abrol',
  email: 'pratishthaabrol@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pratishtha-abrol/',
  github: 'https://github.com/pratishtha-abrol',
  calendar: null as string | null, // Calendly / Cal.com link
  scholar: null as string | null, // Google Scholar or ORCID
  responseTime: null as string | null, // e.g. "two working days"
  resumes: { infra: '/resume/Pratishtha_CV.pdf', backend: null, ai: null } as Record<'infra' | 'backend' | 'ai', string | null>,
  paper: {
    doi: 'https://doi.org/10.1140/epjd/s10053-025-00955-6',
    arxiv: 'https://arxiv.org/abs/2404.01212',
  },
  thesisPdf: null as string | null,
  researchTools: null as string | null,
  certs: { ckaInProgress: false },
  crucible: {
    repo: null as string | null,
    writeup: null as string | null,
    benchmarks: {
      ttftP95: null as string | null,
      overhead: null as string | null,
      costPer1M: null as string | null,
    },
  },
};
