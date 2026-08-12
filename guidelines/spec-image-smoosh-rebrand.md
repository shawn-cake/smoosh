# Spec: "Image Smoosh" Sub-Brand Rebrand + Repo & Vercel Rename

**Status:** Ready to execute
**Target executor:** Claude Opus 4.8 (Claude Code session in this repo)
**Version bump:** 0.4.0 → 0.5.0
**Date authored:** 2026-07-10

---

## 1. Context

Smoosh (formerly SmooshBoost) is a browser-based image compression tool with a
companion Figma plugin. In v0.4.0 the "Boost" metadata feature was removed and
the product was renamed to **Smoosh**.

Decision (2026-07-10): **Smoosh** becomes the *parent brand* for a family of
compression tools. Each tool is a sub-brand named `{Type} Smoosh`. The current
app becomes the first tool: **Image Smoosh**. Future tools may include
PDF Smoosh, SVG Smoosh, Video Smoosh, etc.

**Zero-legacy rule (Shawn, 2026-07-10):** no instance of "boost" or "bst" may
survive on any *living* surface — code, config, docs, repo name, Vercel
project, domains. This includes retiring the `smshbst.vercel.app` domain via a
coordinated migration (Phase 4–5). The only exemption is append-only history
(`logs/CHANGELOG.md`, `logs/DEVLOG.md`, existing ADRs, git history), which is
kept intact.

This spec covers:

1. Codifying the naming architecture (ADR).
2. Rebranding the app surface to "Image Smoosh" under the "Smoosh" parent.
3. Renaming stale `smooshboost-*` files; purging boost/bst from living docs.
4. Renaming the GitHub repo `shawn-cake/smooshboost` → `shawn-cake/smoosh`.
5. **Migrating the Vercel project + domain off `smshbst.vercel.app`** — with a
   hard checkpoint where the executor STOPS and alerts Shawn to do the Vercel
   dashboard work.
6. Version bump + changelog/devlog per this repo's log-file-genius conventions.

This spec does **not** build any new compression tools or a multi-tool shell.
Structural prep guidance lives in Appendix A for a future phase.

---

## 2. Naming architecture (the rules — encode these in an ADR)

| Concept | Name | Usage |
|---|---|---|
| Parent brand / suite | **Smoosh** | Repo name, logo wordmark, package name, Figma plugin name, Vercel project, domain |
| Sub-brand / tool | **`{Type} Smoosh`** (type-first) | "Image Smoosh", "PDF Smoosh". Page titles, tool switcher labels, marketing copy |
| The verb | **smoosh** (lowercase in prose) | CTAs: "Smoosh 5 images", "Export & Smoosh" |

Rules:

- **Type-first, always.** "Image Smoosh", never "Smoosh Images" as a product
  name. (The verb phrase "smoosh images" in prose is fine; the *product* is
  "Image Smoosh".) The README currently says "Smoosh Images" — fix it.
- "Smoosh" alone always refers to the suite/parent. A tool is never called
  just "Smoosh" in user-facing copy going forward.
- CTA buttons keep the verb form: `Smoosh {n} image(s)`, `Export & Smoosh`.
  Do not change CTA copy to "Image Smoosh".
- Internal identifiers stay lowercase-kebab under the parent: `smoosh`,
  `smoosh-figma-plugin`. Future tools become modules in this repo
  (e.g. `src/app/tools/pdf/`), not separate repos.
- **No boost/bst, ever.** New names, slugs, and domains must never contain
  "boost" or "bst".

Deliverable: write `logs/adr/002-smoosh-sub-brand-naming.md` following the
format of `logs/adr/001-adopt-log-file-genius.md`, capturing the table and
rules above plus a short rationale (scannable family naming, "Smoosh" anchors
each name and doubles as the CTA verb, tools ship as routes/modules in one
repo rather than separate products).

---

## 3. Execution phases

Phases 0–3 are safe, self-contained repo work. **Phase 4 is a hard checkpoint**
— the executor must stop and hand off to Shawn before any domain-dependent
change in Phase 5.

### Phase 0 — Preflight

1. `git status` — the working tree has a modified `.claude/settings.local.json`;
   leave it uncommitted/unstaged (local tooling config).
2. Create a branch: `rebrand/image-smoosh`.
3. Run `npm run test:run` and `npm run build` to confirm a green baseline.

### Phase 1 — App-surface rebrand

| File | Change |
|---|---|
| `index.html` | `<title>Smoosh — Image Compression</title>` → `<title>Image Smoosh</title>`. If a meta description exists, update to "Image Smoosh — part of the Smoosh compression suite". |
| `src/app/components/layout/Footer.tsx` | `alt="Smoosh - Image Compression"` → `alt="Smoosh"` (logo is the parent wordmark). Optionally add a small `Image Smoosh` text line near the logo **only if it causes no layout shift** (Shawn's hard UX rule); otherwise alt-text change only. |
| CTA copy (`ProcessingButtons.tsx`, upload empty-state, etc.) | **No change.** Verb CTAs stay per §2. |
| `src/app/services/download/zipService.ts` | **No change** to the `Smoosh {date}.zip` filename (parent brand is correct here). |
| `packages/figma-plugin/ui-template.html` | If a heading/subtitle exists, it may read "Image Smoosh"; CTAs (`Export & Smoosh`) unchanged. Only edit if a clear heading exists — do not restructure the UI. If changed, rebuild the plugin (`ui.html` is generated). |
| `packages/figma-plugin/manifest.json` `"name"` | **Leave as "Smoosh"** (parent brand; the plugin is the Image Smoosh surface but its marketplace name stays parent-branded). |

Do NOT touch `src/assets/logo.svg` / `public/favicon.svg` — logo redesign is
out of scope (the wordmark already says Smoosh).

Domain-bearing files (`compression.ts`, `api/tinypng.ts`, manifest
`allowedDomains`) are handled in Phase 5, **after** the checkpoint — do not
edit them in this phase.

### Phase 2 — Docs, file renames & boost/bst purge

1. `git mv` the stale guideline files:
   - `guidelines/smooshboost-technical-spec.md` → `guidelines/smoosh-technical-spec.md`
   - `guidelines/smooshboost-quick-reference.md` → `guidelines/smoosh-quick-reference.md`
   - `guidelines/smooshboost-project-knowledge.md` → `guidelines/smoosh-project-knowledge.md`
2. Inside those files and `guidelines/guidelines.md`: replace all
   "SmooshBoost"/"smooshboost" with "Smoosh"/"smoosh" and fix cross-references
   to the renamed filenames. Per the zero-legacy rule, do **not** keep
   "formerly SmooshBoost" framing in living docs.
3. `README.md`:
   - Reframe the opening: **Smoosh** is a compression suite; **Image Smoosh**
     is its first tool (browser image compression + Figma plugin).
   - Fix "Smoosh Images" → "Image Smoosh" (§2 type-first rule).
   - **Remove the "Formerly SmooshBoost" note entirely** — product history
     lives only in `logs/CHANGELOG.md`.
   - Update any clone URL to `https://github.com/shawn-cake/smoosh.git`.
   - Update the deployed-app / plugin-proxy URL references to the new domain
     placeholder; finalize in Phase 5.
   - Add a short "Roadmap / family" line: future `{Type} Smoosh` tools ship as
     modules in this repo.
4. **History exemption:** `logs/CHANGELOG.md`, `logs/DEVLOG.md`, and existing
   ADRs keep historical "SmooshBoost" mentions (append-only logs).
5. Purge sweep: `grep -riE "boost|bst" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist .`
   — after Phases 0–5, remaining hits must ONLY be in: `logs/` (history),
   `package-lock.json` (regenerate via `npm install` if its `name` field is
   stale — check), built plugin artifacts (`ui.html`, `code.js` — rebuilt in
   Phase 5), and false positives inside base64/WASM blobs. Anything else, fix.
   (`.claude/settings.local.json` contains a `WebFetch(domain:smshbst.vercel.app)`
   permission — update it to the new domain in Phase 5.)

### Phase 3 — Repo rename (GitHub)

1. `gh repo rename smoosh -R shawn-cake/smooshboost` (requires gh auth; if it
   fails, flag as a manual step: GitHub → Settings → rename to `smoosh`).
   GitHub auto-redirects the old URL.
2. Update the local remote:
   `git remote set-url origin https://github.com/shawn-cake/smoosh.git`
3. `git fetch` to confirm. `.gitmodules` points at an external repo
   (log-file-genius) — no change.
4. Vercel's Git integration follows GitHub renames via the app installation,
   but Shawn should confirm the link in the dashboard at the Phase 4 checkpoint.

### Phase 4 — ⛔ CHECKPOINT: Vercel migration (STOP and alert Shawn)

**Executor: stop here.** Do not proceed to Phase 5 until Shawn confirms the
dashboard work is done and provides the final production domain. Alert him
with exactly this ask:

> **Shawn — Vercel dashboard steps needed now:**
> 1. Rename the Vercel project (currently `smshbst` or similar) to **`smoosh`**.
>    The production domain becomes `<name>.vercel.app` for whatever name is
>    available — `smoosh.vercel.app` may be taken globally; fallbacks that
>    honor the no-boost/no-bst rule: `smoosh-cake`, `cake-smoosh`,
>    `smooshsuite`. (Or attach a custom domain, e.g.
>    `smoosh.cakewebsites.com`, and treat that as production.)
> 2. Confirm the project is still linked to the renamed GitHub repo
>    (`shawn-cake/smoosh`) and that auto-deploys still work.
> 3. *(Optional, smoother cutover)* If Vercel allows it, re-add
>    `smshbst.vercel.app` as an extra domain on the project temporarily so the
>    already-published Figma plugin keeps its TinyPNG proxy until the
>    republish lands; remove it in Phase 7. If it can't be re-added, skip —
>    see the breakage note below.
> 4. Reply with the final production domain.

**Breakage window (acceptable, degrade-only):** from the moment the old
domain dies until the republished plugin reaches users, the plugin's TinyPNG
proxy calls fail — but `compression.ts` already falls back to in-browser
OxiPNG for PNG, and JPG/WebP compression is fully client-side. The web app
itself is unaffected (it calls `/api/tinypng` same-origin on whatever domain
serves it). So worst case is temporarily weaker PNG ratios, not an outage.

### Phase 5 — Domain cutover in code (only after Phase 4 confirmation)

Let `NEW_DOMAIN` = the domain Shawn confirms (e.g. `https://smoosh.vercel.app`).

1. `packages/figma-plugin/src/compression.ts` —
   `const TINYPNG_BASE = 'https://smshbst.vercel.app/api/tinypng'` → `${NEW_DOMAIN}/api/tinypng`.
2. `api/tinypng.ts` — replace `https://smshbst.vercel.app` in
   `ALLOWED_ORIGINS` with `NEW_DOMAIN` (keep `'null'` — that is the Figma
   plugin iframe origin).
3. `packages/figma-plugin/manifest.json` — replace `https://smshbst.vercel.app`
   in `allowedDomains` with `NEW_DOMAIN` (keep the fonts domains).
4. Update the README/doc references from Phase 2 with the real domain.
5. `.claude/settings.local.json` — update the `WebFetch(domain:…)` permission
   to the new domain (leave uncommitted).
6. Rebuild the plugin: `cd packages/figma-plugin && npm run build`.
7. Re-run the Phase 2.5 purge sweep; confirm no non-exempt boost/bst hits.

### Phase 6 — Version + logs

1. Bump `package.json` and `packages/figma-plugin/package.json` to `0.5.0`.
2. `logs/CHANGELOG.md` entry for 0.5.0 (follow existing format): sub-brand
   architecture adopted, app rebranded to Image Smoosh, repo renamed
   smooshboost → smoosh, Vercel project/domain migrated off smshbst,
   guideline files renamed, ADR-002 added.
3. `logs/DEVLOG.md` entry per the repo's log-file-genius convention.
4. Commit(s) on `rebrand/image-smoosh`; suggested message:
   `Adopt Smoosh sub-brand architecture; rebrand to Image Smoosh; retire smshbst domain [v0.5.0]`.
   Do not push or merge without Shawn's go-ahead — **note that the plugin fix
   only reaches users after push → Vercel deploy → Figma republish**, so
   recommend pushing promptly once Shawn approves.

### Phase 7 — Verification

1. `npm run test:run` — green. `npm run build` — clean; `dist/index.html`
   title says "Image Smoosh".
2. Plugin build clean; `grep -c smshbst packages/figma-plugin/code.js ui.html`
   returns 0 (real hits, not WASM-blob false positives).
3. After Shawn pushes and Vercel deploys: `curl -s ${NEW_DOMAIN}` returns the
   app; a test call to `${NEW_DOMAIN}/api/tinypng` behaves (401/400 without
   payload is fine — just not 404).
4. Run the dev server and visually confirm: title, footer, no layout shift,
   CTA copy unchanged, drag-drop → Smoosh → download flow works.
5. Final purge sweep (Phase 2.5 grep) — only exempt hits remain.
6. `git remote -v` shows `smoosh.git` and `git fetch` succeeds.

---

## 4. Explicitly out of scope

- Building a multi-tool shell, routing, or any second Smoosh tool (Appendix A).
- Logo/favicon redesign.
- Rewriting append-only history (`logs/`, git history).
- Renaming the local folder (see §5).
- Publishing the Figma plugin (manual, see §5).

---

## 5. Manual steps for Shawn (executor: list these in the final report; attempt none of them)

1. **Phase 4 Vercel dashboard work** — the executor will stop and prompt you
   (project rename, domain choice, optional temporary `smshbst` alias).
2. **Push + deploy:** review `rebrand/image-smoosh`, push/merge so Vercel
   deploys to the new domain. The plugin republish depends on this being live.
3. **Figma plugin republish:** publish the rebuilt plugin (new manifest
   `allowedDomains` + new proxy URL). Users pick up published updates
   automatically; until then PNG falls back to in-browser OxiPNG.
4. **Retire the alias:** if you added `smshbst.vercel.app` as a temporary
   domain in Phase 4, remove it once the republished plugin has been live for
   a few days. That is the last "bst" anywhere.
5. **Local folder rename:** `mv ~/Documents/Cake/Projects/smooshboost ~/Documents/Cake/Projects/smoosh`
   — *after* the working session ends. Claude Code project history and
   auto-memory are keyed to the folder path; copy the memory dir
   (`~/.claude/projects/-Users-shawnhiatt-...-smooshboost/memory`) to the new
   path key to carry it over.

---

## Appendix A — How the family scales (guidance, not tasks)

The staged pipeline (drop files → queue → confirm format → smoosh → download
individually or as ZIP) is file-type agnostic. When tool #2 arrives:

- **Structure:** promote the current app to `src/app/tools/image/`; shared
  shell (upload dropzone, queue, progress, download/ZIP, layout) stays in
  `src/app/components/`. Each tool declares: accepted MIME types, format
  options panel, and a `smoosh(file, options) → CompressedFile` service.
- **Routing:** one deployment, tools as routes — `/` (tool switcher or
  redirect to `/image`), `/image`, `/pdf`. No subdomains, no separate repos.
- **Candidate tools, roughly in order of effort:**
  - **SVG Smoosh** — SVGO is pure JS, runs in-browser; easiest second tool
    and proves the multi-tool shell.
  - **PDF Smoosh** — image recompression inside PDFs (pdf-lib + existing
    jSquash codecs), or Ghostscript-WASM for full optimization; medium effort.
  - **GIF Smoosh** — GIF → animated WebP transcode; medium.
  - **Font Smoosh** — WOFF2 subsetting (harfbuzzjs); niche but agency-useful.
  - **Video Smoosh** — ffmpeg.wasm is heavy (~30MB, slow); likely needs
    server-side processing. Do last.
- **Figma plugin** stays image-only; it is the "Image Smoosh for Figma"
  surface and does not need to follow the multi-tool shell.
