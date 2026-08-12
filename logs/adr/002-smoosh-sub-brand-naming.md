# ADR-002: Smoosh Sub-Brand Naming Architecture

**Status:** Accepted
**Date:** 2026-07-10
**Deciders:** Shawn Hiatt
**Related:** ADR-001, v0.5.0

---

## Context

Smoosh (formerly a single tool) is becoming a *family* of browser-based
compression tools. We need a naming system that scales to future tools
(PDF, SVG, video, etc.) without confusing users, and that reuses the strong
"Smoosh" name as both a brand and a call-to-action. We also need a hard rule
against reintroducing any "boost"/"bst" legacy naming.

---

## Decision

Adopt a parent-brand + type-first sub-brand system:

| Concept | Name | Usage |
|---|---|---|
| Parent brand / suite | **Smoosh** | Repo name, logo wordmark, package name, Figma plugin name, Vercel project, domain |
| Sub-brand / tool | **`{Type} Smoosh`** (type-first) | "Image Smoosh", "PDF Smoosh". Page titles, tool switcher labels, marketing copy |
| The verb | **smoosh** (lowercase in prose) | CTAs: "Smoosh 5 images", "Export & Smoosh" |

Rules:

- **Type-first, always.** "Image Smoosh", never "Smoosh Images" as a product
  name. (The verb phrase "smoosh images" in prose is fine; the *product* is
  "Image Smoosh".)
- "Smoosh" alone always refers to the suite/parent. A tool is never called just
  "Smoosh" in user-facing copy going forward.
- CTA buttons keep the verb form (`Smoosh {n} image(s)`, `Export & Smoosh`).
  CTAs are not renamed to "Image Smoosh".
- Internal identifiers stay lowercase-kebab under the parent: `smoosh`,
  `smoosh-figma-plugin`. Future tools become modules in this repo
  (e.g. `src/app/tools/pdf/`), not separate repos.
- **No boost/bst, ever.** New names, slugs, and domains must never contain
  "boost" or "bst". The only exemption is append-only history (`logs/`, git
  history, prior ADRs).

---

## Consequences

### Positive

- Scannable family naming — every tool reads as "`{Type} Smoosh`", instantly
  grouped under one brand.
- "Smoosh" anchors each name *and* doubles as the CTA verb, so brand and action
  reinforce each other.
- Tools ship as routes/modules in one repo and one deployment, not separate
  products — shared upload/queue/download shell, lower maintenance.

### Negative

- "Smoosh" alone becomes ambiguous if used loosely; copy must consistently pair
  it with a type or use it as the verb.
- Type-first ordering ("Image Smoosh") is slightly less natural than the verb
  phrase and requires editorial discipline.

### Neutral

- Existing single-tool assets (logo wordmark, Figma plugin marketplace name)
  stay parent-branded as "Smoosh"; the tool identity lives in page titles/UI.

---

## Alternatives Considered

### Alternative 1: Keep "Smoosh" as a single product name
**Rejected because:** it does not scale — a second compression tool would have
no consistent way to relate to the first.

### Alternative 2: Verb-first sub-brands ("Smoosh Images", "Smoosh PDFs")
**Rejected because:** it collides with the CTA verb phrasing and does not sort
or group cleanly; type-first names line up as a family.

### Alternative 3: Separate products/repos per tool
**Rejected because:** it multiplies deployments, domains, and duplicated shell
code; tools as modules in one repo share the staged pipeline.

---

## Notes

- Encodes the decision recorded in project memory (2026-07-10).
- Family scaling guidance (module structure, routing, candidate tools) lives in
  the Appendix of `guidelines/spec-image-smoosh-rebrand.md`.
