# Image Smoosh - Quick Reference Card

**Tagline:** Smoosh your images

## What is Image Smoosh?
A browser-based image compression tool for digital marketing agencies — the first tool in the **Smoosh** suite. Compress images for web performance, right in the browser, then download individually or as a ZIP.

---

## Workflow

```
Drop files → Queue → Confirm format → Smoosh → Download
```

| Phase | What Happens | Trigger |
|-------|--------------|---------|
| Queue | Files are added to the queue; no processing yet | Automatic on drop |
| Confirm | User picks the output format for the batch | Manual |
| Smoosh | Compress queued images (strips existing metadata) | Click the Smoosh button |
| Download | Save results individually or as a single ZIP | Manual |

---

## Compression Routing

| Input | Output | Engine |
|-------|--------|--------|
| PNG | PNG | TinyPNG API (OxiPNG fallback) |
| PNG | WebP | @jsquash/webp |
| PNG | MozJPG | @jsquash/jpeg |
| JPG | MozJPG | @jsquash/jpeg |
| JPG | WebP | @jsquash/webp |
| JPG | PNG | TinyPNG API (OxiPNG fallback) |
| WebP | WebP | @jsquash/webp |
| WebP | MozJPG | @jsquash/jpeg |
| WebP | PNG | TinyPNG API (OxiPNG fallback) |

---

## Key Constraints

| Constraint | Value |
|------------|-------|
| Max batch size | 20 images |
| Max file size | 5 MB per image |
| Supported inputs | PNG, JPG, JPEG, WebP |
| Supported outputs | PNG, WebP, MozJPG |
| TinyPNG free quota | 500/month |

---

## Core Features

**Upload**
- [x] Drag and drop
- [x] File picker

**Smoosh (Compression)**
- [x] Compression on demand (Smoosh button)
- [x] Auto engine routing (MozJPG, OxiPNG, WebP)
- [x] Savings display per image
- [x] Progress indicator in status bar

**Download**
- [x] Individual downloads per image
- [x] ZIP download ("Download All")
- [x] Filename preservation
- [x] Format conversion summary in summary bar

---

## UI Sections

1. **Header** — Logo + info tooltip (top right)
2. **Upload Zone** — Drag/drop + file picker
3. **Format Selector** — Confirm output format for the batch (WebP default)
4. **Queue** — Images with status and savings
5. **Processing Status** — Compression progress bar
6. **Summary Bar** — Total savings + format conversion info
7. **Download Section** — Download All + Clear Queue buttons

---

## Status States

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Queued | ○ | Gray 400 | Waiting to compress |
| Compressing | ● | Cake Blue | Compression in progress |
| Complete | ✓ | Success | Ready for download |
| Error | ✗ | Error | Compression failed |

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Cake Blue | `#4074A8` | Primary actions, processing |
| Blue 50 | `#EBF1F7` | Hover backgrounds |
| Blue 100 | `#D1E0EE` | Focus rings |
| Blue 700 | `#2D5276` | Pressed states |
| Cake Yellow | `#F2A918` | Warnings, accent CTAs |
| Yellow 50 | `#FEF7E6` | Warning backgrounds |
| Yellow 700 | `#B87D0E` | Warning text |
| Success | `#059669` | Complete, savings |
| Error | `#DC2626` | Errors, failures |
| Gray 800 | `#1F2937` | Primary text |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 300 | `#D1D5DB` | Borders |
| Gray 100 | `#F3F4F6` | Backgrounds |

### Typography

| Token | Value |
|-------|-------|
| Body Font | Spline Sans Mono (`--font-sans`, `--font-mono`) |
| Heading Font | Syne (`--font-heading`) — headings only |
| Scaling | Fluid: 100% at ≤1024px → 120% at ≥1200px via `clamp()` |
| Body text class | `text-xs` (downshifted from text-sm for mono visual sizing) |
| Heading classes | `text-2xl font-heading` (H1), `text-base font-heading` (H2) |

### Spacing & Radii

| Token | Value |
|-------|-------|
| Base unit | 8px grid (rem-based: 0.25rem–3rem) |
| radius-sm | 4px (badges) |
| radius | 6px (buttons, inputs) |
| radius-md | 8px (cards, panels) |
| radius-lg | 12px (modals) |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript 5.9 |
| Styling | Tailwind CSS |
| Build | Vite |
| Compression | TinyPNG + @jsquash libraries (MozJPEG, OxiPNG, WebP via WASM) |
| ZIP | JSZip |
| Icons | FontAwesome |
| Toasts | Sonner |

---

## File Output Naming

Original filename preserved. Extension changes if format changes:
- `photo.jpg` → `photo.jpg` (MozJPG)
- `photo.jpg` → `photo.webp` (WebP)
- `image.png` → `image.png` (TinyPNG)
- `image.png` → `image.webp` (WebP)

---

## Error Types

| Error | Cause | Type |
|-------|-------|------|
| `file_too_large` | Exceeds 5MB | Error |
| `invalid_format` | Not PNG/JPG/WebP | Error |
| `batch_limit_exceeded` | More than 20 images | Error |
| `quota_exceeded` | TinyPNG limit reached | Error |
| `compression_failed` | Engine error | Error |

---

## Target Users

- Digital marketing agencies
- SEO specialists
- Web developers optimizing client assets

---

## Future Features (v2+)

- Client presets
- Export report (CSV/PDF)
- Filename slugification
- API mode
- Team features
