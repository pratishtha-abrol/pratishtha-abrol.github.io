# Tagged links

Add `?ref=<tag>` to any link to your site. The weekly digest then shows how many
visits each tag brought, which pages they opened, and which of your résumé/email
links they clicked. Tags are lowercase letters, digits and `. _ ~ -`.

Make one from the repo root:

```
node scripts/tag-link.mjs acme-application /infra/
# https://pratishtha-abrol.github.io/infra/?ref=acme-application
```

Suggested tags

| Where you share it | Tag | Land them on |
|---|---|---|
| LinkedIn profile / About | `linkedin` | `/` |
| Résumé PDF header | `cv-pdf` | `/infra/` (or the lens for that résumé) |
| GitHub profile README | `github-readme` | `/` |
| A job application | `<company>-application` | the lens matching the role |
| A recruiter email | `<company>-recruiter` | the lens matching the role |
| Twitter/X or Bluesky bio | `social` | `/` |

A visitor's tag is remembered for their tab, so it also attaches to the pages they
open next and to an intro-form message.
