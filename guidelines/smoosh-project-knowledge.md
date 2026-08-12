# Image Smoosh - Project Knowledge Document

**Tagline:** Smoosh images for the web

## Project Overview

**Image Smoosh** is a browser-based image compression tool designed for digital marketing agencies. It is the first tool in the **Smoosh** compression suite, and ships with a companion Figma plugin. Images are compressed for web performance through a staged, confirm-first workflow: drop files, confirm the output format, then smoosh.

### Core Purpose
Provide an efficient, agency-focused interface for fast batch image compression that shrinks file sizes for web performance.

### Target Users
- **Primary:** Digital marketing agencies optimizing client images
- **Secondary:** Web developers and SEO specialists
- **Skill level:** Marketing professionals comfortable with web tools

---

## Workflow

Staged compression: drop files, confirm the output format, then smoosh.
```
Upload → Confirm format → [Smoosh] → Download
```

---

## Streamlined Workflow

### Compression
Strip images down to optimal file size using intelligent compression routing.

- **Confirm-first** — Files queue on drop; compression runs when the user confirms the output format and clicks the Smoosh button (no auto-compress on upload)
- Compression removes existing metadata
- Automatic engine selection based on format
- Batch processing up to 20 images
- Progress shown in status bar

```
WORKFLOW DIAGRAM

Upload Images
    ↓
┌─────────────────────────────────────────────┐
│ [FORMAT SELECTOR]                           │
│ Confirm the output format for the batch     │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ [SMOOSH BUTTON]                             │
│ Click "Smoosh {n} image(s)" to start        │
│ Compression runs on click                   │
│ Progress shown in status bar                │
│ Existing metadata stripped                  │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ [QUEUE]                                     │
│ Each image shows:                           │
│   ├── Thumbnail + filename                  │
│   └── Status + savings                      │
└─────────────────────────────────────────────┘
    ↓
Download individually or as a single ZIP
```

---

## Compression Routing Logic

### TinyPNG API
- **Use for:** PNG → PNG compression only
- **Fallback:** If monthly API quota (500 free compressions) is exhausted, route to Squoosh
- **API Key:** Environment variable or user-provided
- **File size limit:** 5MB per image

### Squoosh (Client-Side)
- **Use for:**
  - JPG → MozJPG
  - JPG → WebP
  - PNG → WebP
- **Also use when:** TinyPNG quota is exhausted (for PNG → PNG)
- **Execution:** Runs entirely client-side via WebAssembly
- **Settings:** Optimal/default quality settings (no user adjustment)

### Routing Decision Tree
```
INPUT IMAGE
    │
    ├── PNG file
    │   └── Output: PNG?
    │       ├── YES → TinyPNG API (if quota available)
    │       │         └── Quota exhausted? → Squoosh
    │       └── NO (WebP) → Squoosh
    │
    └── JPG/JPEG file
        └── Output: MozJPG or WebP → Squoosh
```

---

## Core Features

### 1. Image Upload
- **Drag and drop zone** - Primary upload method
- **File picker button** - Secondary method ("Select Files")
- **Batch limit:** 20 images maximum per session
- **Supported input formats:** PNG, JPG, JPEG, WebP
- **Security validation:** Two-layer validation (MIME type + magic byte verification)

### 2. Output Format Selection
- PNG → PNG (TinyPNG)
- JPG → MozJPG (Squoosh)
- JPG → WebP (Squoosh)
- PNG → WebP (Squoosh)

### 3. Compression Queue View
Display a list of queued images showing:
- Thumbnail preview
- Filename
- Original file size
- Status (Queued / Compressing / Complete / Error)
- Compression engine used
- Savings after completion:
  - **Primary:** Percentage saved (e.g., "72% smaller")
  - **Secondary:** Absolute size reduction (e.g., "1.2 MB → 340 KB")

### 4. Summary Statistics
After batch completion, display:
- Total original size
- Total compressed size
- Total savings percentage (primary)
- Total savings in MB/KB (secondary)

### 5. Download Options
- **Individual downloads** - Button per image
- **Download all as ZIP** - Single button for entire batch
  - Button text: "Download All (ZIP)"
- **Filename handling:**
  - Preserve original filenames
  - Change extension if format changed
  - Optional: SEO-friendly rename (slugify)

**Individual Download List:**
- Format: `filename.ext (size)`

### 6. Error Handling

**Errors (stop processing):**
- **File too large:** Display notification if image exceeds 5MB
- **Invalid format:** Notify if uploaded file is not PNG/JPG/WebP
- **API quota exceeded:** Automatically switch to Squoosh, notify user
- **Network errors:** Display retry option

---

## User Interface Requirements

### Design System Reference

For complete design specifications, see `guidelines.md`. Key tokens summarized below.

### Colors

```
Primary Colors:
Cake Blue:       #4074A8  (buttons, active states, processing)
Cake Yellow:     #F2A918  (warnings, quota notifications, accent CTAs)

Blue Tints:
Blue 50:         #EBF1F7  (hover backgrounds)
Blue 100:        #D1E0EE  (focus rings)
Blue 200:        #A3C1DD  (borders on blue elements)
Blue 700:        #2D5276  (pressed states)
Blue 900:        #1A3044  (deep contrast)

Yellow Tints:
Yellow 50:       #FEF7E6  (warning backgrounds)
Yellow 100:      #FDE9B8  (highlight backgrounds)
Yellow 700:      #B87D0E  (warning text)

Grays:
Gray 50:         #F9FAFB  (page background)
Gray 100:        #F3F4F6  (panel backgrounds)
Gray 200:        #E5E7EB  (borders, dividers)
Gray 300:        #D1D5DB  (drop zone border, disabled states)
Gray 400:        #9CA3AF  (placeholder text, muted icons)
Gray 500:        #6B7280  (secondary text)
Gray 600:        #4B5563  (body text primary)
Gray 700:        #374151  (headings, labels)
Gray 800:        #1F2937  (dark headings)
Gray 900:        #111827  (maximum contrast)

Semantic:
Success:         #059669  (complete status, savings display)
Success Light:   #D1FAE5  (success backgrounds)
Error:           #DC2626  (errors, failures)
Error Light:     #FEE2E2  (error backgrounds)
```

### Typography

- **Body Font:** Spline Sans Mono (Google Fonts) — all body text, labels, inputs, captions, UI elements
- **Heading Font:** Syne (Google Fonts) — headings only (e.g. "Upload Images") via `font-heading` class
- **CSS Variables:** `--font-sans` and `--font-mono` → Spline Sans Mono; `--font-heading` → Syne
- Body/label text: `text-xs` (downshifted from text-sm for Spline Sans Mono visual sizing)
- Headings: `text-2xl` / `text-base` with `font-heading` (Syne, semibold)
- Stats/savings: `text-base font-mono` semibold, Success Green
- **Fluid scaling:** Root font-size scales from 16px (≤1024px) to 19.2px (≥1200px) via `clamp()`

### Spacing

- Base unit: 8px grid (rem-based tokens for fluid scaling)
- Tokens: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem
- Generous whitespace throughout

### Component Patterns

- Border radius: 6px for buttons/inputs, 8px for cards/panels, 4px for badges
- Shadows: Minimal, `0 1px 3px rgba(0,0,0,0.1)` for elevation
- Focus states: 3px Blue 100 ring
- Transitions: 150ms ease for hover/focus states

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ smoosh                   [minimal branding]                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ UPLOAD ZONE                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │              Drop images here                               │ │
│ │                    or                                       │ │
│ │              [Select Files]                                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ FORMAT SELECTOR                                                 │
│ Confirm the output format for the batch                         │
│                                                                 │
│ PROCESSING BUTTON                                              │
│ [Smoosh 5 images]                                               │
│                                                                 │
│ QUEUE                                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [thumb] filename.png                                       │ │
│ │         1.4 MB → 448 KB (68% smaller)                      │ │
│ │         ✓ Compressed · TinyPNG                             │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ [thumb] photo.jpg                                          │ │
│ │         Compressing...                               ●     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ SUMMARY BAR                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 5 images · 8.2 MB → 2.1 MB · 74% total savings             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ DOWNLOAD SECTION                                                │
│   [Download All (ZIP)]                  [Clear Queue]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Main content:** max-width 720px, centered with generous padding

### Status Indicators

| Status | Visual | Color |
|--------|--------|-------|
| Queued | Circle outline | Gray 400 |
| Compressing | Spinner | Cake Blue |
| Complete | Checkmark | Success |
| Error | X icon | Error |

### Queue Item States

**Compressing state:**
```
[thumb] filename.png
        Compressing...                              ●
```

**Complete:**
```
[thumb] filename.png
        1.4 MB → 448 KB (68% smaller)
        ✓ Complete · TinyPNG
```

**Compression error state:**
```
[thumb] filename.png
        ✗ Compression failed: Network error       [Retry]
```

---

## Technical Requirements

### API Integrations

#### TinyPNG
- Endpoint: `https://api.tinify.com/shrink`
- Authentication: HTTP Basic Auth with API key
- Request: POST with image binary
- Response: JSON with compressed image URL
- Track `Compression-Count` header for quota monitoring

#### Squoosh
- Uses `@jsquash/jpeg`, `@jsquash/oxipng`, `@jsquash/webp` (via WASM)
- MozJPG encoder for JPG output
- WebP encoder for WebP output
- OxiPNG encoder for PNG fallback

### State Management
- Track each image through compression
- Calculate savings after compression
- Aggregate totals for summary

### File Handling
- FileReader API for local files
- Blob URLs for previews and downloads
- JSZip for batch ZIP generation

---

## Expansion Considerations

### Future Features (v2+)
- **URL import:** Bulk image URLs in a textarea (one URL per line)
- **Web Worker compression:** Run compression in a Web Worker to prevent UI blocking
- **Export report:** CSV/PDF summary for client deliverables
- **Filename slugification:** Auto-rename for SEO-friendly URLs
- **API mode:** Headless processing for automation
- **Team features:** Usage tracking

### Extensibility Points
- Additional compression engines
- Custom output formats
- Integration with DAM systems
- Webhook notifications on completion

---

## Session Behavior
- No persistent history (each visit is fresh)
- No user accounts required for core functionality
- Optional team features would require authentication (future)

---

## Deployment Context
- Static hosting (Vercel, Netlify, or custom server)
- Environment variables for API keys
- Optional backend proxy for API key security

---

## File Naming Convention
- Compressed files keep original filename by default
- Extension changes only if format changes:
  - `photo.jpg` → `photo.jpg` (MozJPG)
  - `photo.jpg` → `photo.webp` (WebP conversion)
  - `image.png` → `image.webp` (WebP conversion)
  - `image.png` → `image.png` (TinyPNG)
- Future: Optional SEO-friendly slugification

---

## Success Metrics
- Images compress with expected savings (target: 50-80% reduction)
- Clear indication of which optimizations were applied
- Easy batch download workflow
- Graceful handling of errors and edge cases
- Faster than manual optimization workflows
</content>
</invoke>
