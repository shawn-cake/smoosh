# Image Smoosh - Design Guidelines

## Overview

This document defines the visual design system for Image Smoosh, a browser-based image compression tool for Cake marketing agency. The design should feel professional, clean, and highly functional—prioritizing clarity and ease of use for batch image compression workflows.

---

## Color Palette

### Primary Colors

| Name | HEX | Usage |
|------|-----|-------|
| **Cake Blue** | `#4074A8` | Primary actions, active states, links, processing indicators, focus rings |
| **Cake Yellow** | `#F2A918` | Secondary actions, highlights, warnings, quota notifications |

### Blue Tints (for backgrounds, hover states, borders)

| Name | HEX | Usage |
|------|-----|-------|
| Blue 50 | `#EBF1F7` | Light backgrounds, hover states |
| Blue 100 | `#D1E0EE` | Selected item backgrounds, focus rings |
| Blue 200 | `#A3C1DD` | Borders, dividers on blue elements |
| Blue 700 | `#2D5276` | Darker text on blue, pressed states |
| Blue 900 | `#1A3044` | Deep contrast, headings on light backgrounds |

### Yellow Tints

| Name | HEX | Usage |
|------|-----|-------|
| Yellow 50 | `#FEF7E6` | Warning backgrounds, quota notification panels |
| Yellow 100 | `#FDE9B8` | Highlight backgrounds |
| Yellow 700 | `#B87D0E` | Warning text, darker accents |

### Grays (Neutral Palette)

| Name | HEX | Usage |
|------|-----|-------|
| Gray 50 | `#F9FAFB` | Page backgrounds |
| Gray 100 | `#F3F4F6` | Panel backgrounds, input backgrounds |
| Gray 200 | `#E5E7EB` | Borders, dividers |
| Gray 300 | `#D1D5DB` | Drop zone border, disabled states |
| Gray 400 | `#9CA3AF` | Placeholder text, muted icons, queued status |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 600 | `#4B5563` | Body text (primary) |
| Gray 700 | `#374151` | Headings, labels |
| Gray 800 | `#1F2937` | Dark headings, high contrast text |
| Gray 900 | `#111827` | Maximum contrast text |

### Semantic Colors

| Name | HEX | Usage |
|------|-----|-------|
| Success | `#059669` | Complete status, savings display, successful operations |
| Success Light | `#D1FAE5` | Success backgrounds |
| Error | `#DC2626` | Error states, failed compression, destructive actions |
| Error Light | `#FEE2E2` | Error backgrounds |
| Warning | `#F2A918` | Warnings, quota alerts (uses Cake Yellow) |
| Info | `#4074A8` | Info states, processing (uses Cake Blue) |

---

## Typography

### Font Stack

- **Body Font:** Spline Sans Mono (Google Fonts) — used for all body text, labels, inputs, captions, and UI elements
- **Heading Font:** Syne (Google Fonts) — used exclusively for headings (e.g. "Upload Images") via `font-heading` utility class
- **Monospace:** Spline Sans Mono, "SF Mono", "Fira Code", Consolas, monospace (same as body font; used for file sizes, technical data)
- **Logo Font:** Syne Extra Bold (Google Fonts) — used as the design source for the SVG logo. "smoosh" is stylized in lowercase
- **CSS Variables:** `--font-sans` and `--font-mono` both map to Spline Sans Mono; `--font-heading` maps to Syne

### Fluid Scaling

The UI uses fluid scaling via `clamp()` on the root `font-size`:
- **≤ 1024px viewport:** 16px (100%)
- **≥ 1200px viewport:** 19.2px (120%)
- **Between:** Smooth linear interpolation
- All spacing tokens use `rem` units, so the entire UI scales proportionally with the root font-size
- The header logo uses a fixed `width` attribute and is unaffected by scaling

### Font Size Downshift Convention

Because Spline Sans Mono's monospaced glyphs read visually larger than proportional fonts, all body/UI text sizes are downshifted one level from their semantic Tailwind class:
- `text-lg` elements → use `text-base`
- `text-base` elements → use `text-sm`
- `text-sm` elements → use `text-xs`
- `text-xs` stays `text-xs`
- Syne heading text (`font-heading`) is NOT downshifted

### Type Scale

| Element | Tailwind Class | Font | Weight |
|---------|---------------|------|--------|
| H1 (Page Title, e.g. "Upload Images") | `text-2xl font-heading` | Syne | 600 (Semibold) |
| H2 (Section Title, e.g. "Output Format") | `text-base font-heading` | Syne | 600 (Semibold) |
| Body / Labels | `text-xs` | Spline Sans Mono | 400–500 |
| Caption / Small Text | `text-xs` | Spline Sans Mono | 400 |
| Button (sm/md) | `text-xs` | Spline Sans Mono | 500 (Medium) |
| Button (lg) | `text-sm` | Spline Sans Mono | 500 (Medium) |
| Stats / Savings Display | `text-base font-mono` | Spline Sans Mono | 600 (Semibold) |

### Text Colors

- **Primary text:** Gray 800 (`#1F2937`)
- **Secondary text:** Gray 500 (`#6B7280`)
- **Muted/placeholder:** Gray 400 (`#9CA3AF`)
- **Links:** Cake Blue (`#4074A8`)
- **Error text:** Error (`#DC2626`)
- **Success text:** Success (`#059669`)

---

## Spacing System

Use an 8px base grid. All spacing tokens are `rem`-based so they scale with the fluid root font-size:

| Token | Value | Base px (at 16px root) | Usage |
|-------|-------|------------------------|-------|
| space-1 | 0.25rem | 4px | Tight spacing, inline elements |
| space-2 | 0.5rem | 8px | Small gaps, icon padding |
| space-3 | 0.75rem | 12px | Input padding, small margins |
| space-4 | 1rem | 16px | Standard gaps between elements |
| space-5 | 1.25rem | 20px | Section padding |
| space-6 | 1.5rem | 24px | Card padding, larger gaps |
| space-8 | 2rem | 32px | Section margins |
| space-10 | 2.5rem | 40px | Major section breaks |
| space-12 | 3rem | 48px | Page margins |

---

## Layout

### Overall Structure

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
│ OUTPUT FORMAT (confirm before smooshing)                        │
│ ( ) JPG   ( ) PNG   (x) WebP (default)                          │
│                                                                 │
│ [Smoosh 5 images]                                               │
│                                                                 │
│ QUEUE                                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [thumb] filename.png                                       │ │
│ │         1.4 MB → 448 KB (68% smaller)                      │ │
│ │         ✓ Complete · TinyPNG                               │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ [thumb] photo.jpg                                          │ │
│ │         Processing...                              ●       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ SUMMARY BAR                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 5 images · 8.2 MB → 2.1 MB · 74% total savings             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ DOWNLOAD SECTION                                                │
│   [Download All (ZIP)]    [Clear Queue]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Background

The page uses a radial gradient background on `body` with `min-height: 100vh`:
```css
background: radial-gradient(circle at 50% 30%, #ffffff, #fefeff, #f6f9fc, #e2ecf4, #d5e2ef, #d1e0ee, #d1e0ee, #cddded, #c0d4e8, #acc7e0, #a4c2dd, #a3c1dd);
```

### Dimensions

- **Content area max-width:** 45rem (~720px at base, ~864px at 120% scale, centered)
- **Minimum viewport:** 768px (tablet and up)
- **Header height:** 64px
- **Content scroll:** Independent scrolling with `overflow-y-auto`

---

## Components

### Buttons

**Primary Button**
- Background: Cake Blue (`#4074A8`)
- Text: White
- Border radius: 6px
- Padding: 10px 16px
- Hover: Blue 700 (`#2D5276`)
- Active: Blue 900 (`#1A3044`)

**Secondary Button**
- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Text: Gray 700 (`#374151`)
- Border radius: 6px
- Padding: 10px 16px
- Hover: Gray 50 (`#F9FAFB`) background

**Accent Button (for "Download All", key CTAs)**
- Background: Cake Yellow (`#F2A918`)
- Text: Gray 900 (`#111827`) — for accessibility
- Border radius: 6px
- Hover: Yellow 700 (`#B87D0E`)

**Ghost/Text Button**
- Background: Transparent
- Text: Cake Blue (`#4074A8`)
- Padding: 8px 12px
- Hover: Blue 50 (`#EBF1F7`) background

**Destructive Button**
- Background: Error (`#DC2626`)
- Text: White
- Hover: Darker red (`#B91C1C`)

**Icon-Only Button (for Download, Remove)**
- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Text: Gray 700 (`#374151`)
- Padding: 12px (px-3 py-2)
- Border radius: 6px
- Hover: Gray 50 (`#F9FAFB`) background
- Requires tooltip for accessibility

### Input Fields

- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Border radius: 6px
- Padding: 10px 12px
- Font size: 14px
- Focus: Border Cake Blue (`#4074A8`), box-shadow: 0 0 0 3px Blue 100 (`#D1E0EE`)
- Error: Border Error (`#DC2626`)
- Placeholder: Gray 400 (`#9CA3AF`)

### Text Areas

- Same styling as inputs
- Minimum height: 80px
- Resize: vertical

### Checkboxes / Toggles

- Unchecked: Gray 300 border, white background
- Checked: Cake Blue background, white checkmark
- Focus: Blue 100 ring

### Cards / Panels

- Background: White
- Border: 1px solid Gray 200 (`#E5E7EB`)
- Border radius: 8px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

### Collapsible Sections

- Header: Gray 700 text, clickable with chevron icon
- Chevron rotates 90° when expanded
- Content area has subtle top border when expanded

### File Upload Zone

- Border: 2px dashed Gray 300 (`#D1D5DB`)
- Background: Gray 50 (`#F9FAFB`)
- Border radius: 8px
- Padding: 32px
- Hover/Drag active: Border Cake Blue, Background Blue 50
- Icon: Upload icon in Gray 400, turns Blue on hover

### Queue Item

- Background: White
- Border: 1px solid Gray 200 (`#E5E7EB`)
- Border radius: 8px
- Padding: 16px
- Thumbnail: 48px × 48px, border-radius 4px
- Hover: Gray 50 background

---

## Processing Controls

### Format Selector

**Position:** Below the upload zone, shown once images are in the queue

**Behavior:**
- Compression does NOT run automatically on upload — files queue and wait for the user
- User confirms the output format before compression runs
- Options: JPG, PNG, WebP — WebP is the default
- Format conversion among JPG/PNG/WebP is supported (e.g. JPG → WebP)

---

### Smoosh Button

**Appears:** After images are uploaded and the output format is confirmed

**Styling:**
- Background: Primary Blue (`#4074A8`)
- Text: White, 14px medium
- Padding: 12px 24px
- Border radius: 6px
- Hover: Blue 700 (`#2D5276`)
- Icon: `fa-compress` (left of text)
- Label: "Smoosh {n} image(s)"

**During Compression:**
- Button changes to: `[Compressing... 1 of 5]` with spinner
- Up to 3 images are compressed concurrently (batch limit: 20)
- "Cancel" button appears (gray, bordered)

---

### Summary Bar

```
┌─────────────────────────────────────────────────────────┐
│ 5 images · 8.2 MB → 2.1 MB · 74% total savings         │
└─────────────────────────────────────────────────────────┘
```

Shown above the download section once compression completes:
- Font: 13px regular
- Color: Gray 600
- Format: `X images · [total before] → [total after] · Y% total savings`

---

### Download Section

```
┌─────────────────────────────────────────────────────────┐
│ DOWNLOAD SECTION                                        │
│                                                         │
│ [Download All (ZIP)]  [Clear Queue]                    │
│                                                         │
│ Or download individually:                               │
│ • filename.png (448 KB) [↓]                             │
│ • photo.jpg (612 KB) [↓]                                │
└─────────────────────────────────────────────────────────┘
```

**"Download All" Button:**
- Text: "Download All (ZIP)"
- Bundles every compressed image into a single ZIP
- Background: Accent Yellow
- Icon: `fa-file-zipper`

**Individual Downloads:**
- Each queue item can be downloaded on its own
- Format: `filename.ext (size)`

---

### Toast/Notifications

Implemented using **Sonner** library for consistent toast notifications.

- Background: Gray 800 (`#1F2937`)
- Text: White
- Border radius: 8px
- Padding: 12px 16px
- Position: Bottom right
- Success variant: Left border 4px Success
- Error variant: Left border 4px Error
- Warning variant: Left border 4px Cake Yellow

---

## Status Indicators

| Status | Visual | Color | Description |
|--------|--------|-------|-------------|
| Queued | Circle outline | Gray 400 | Waiting to process |
| Compressing | Spinner | Cake Blue | Smoosh phase active |
| Complete | Checkmark | Success | All processing done |
| Error | X icon | Error | Processing failed |

### Queue Item States

**Queued state:**
```
[thumb] filename.png
        Waiting...                                  ○
```

**Processing state:**
```
[thumb] filename.png
        Compressing...                              ●
```

**Complete state:**
```
[thumb] filename.png
        1.4 MB → 448 KB (68% smaller)
        ✓ Complete · TinyPNG                       [↓]
```

**Error state:**
```
[thumb] filename.png
        ✗ Compression failed: Network error       [Retry]
```

---

## Icons

Use **FontAwesome** icons throughout.

### Common Icons

| Action | Icon |
|--------|------|
| Upload | `fa-upload` |
| Download | `fa-download` |
| Compress/Smoosh | `fa-compress` |
| Delete/Remove | `fa-trash` |
| Retry | `fa-rotate-right` |
| Expand/Collapse | `fa-chevron-down` / `fa-chevron-right` |
| Close | `fa-times` |
| Check/Success | `fa-check` |
| Error | `fa-xmark` |
| Warning | `fa-exclamation-triangle` |
| Info | `fa-info-circle` |
| Image | `fa-image` |
| File | `fa-file` |
| ZIP | `fa-file-zipper` |
| Clear | `fa-broom` |
| Cancel | `fa-ban` |

### Icon Sizes

- Small (inline): 12px
- Default: 16px
- Medium: 20px
- Large (empty states): 48px

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0, 0, 0, 0.05) | Subtle lift |
| shadow | 0 1px 3px rgba(0, 0, 0, 0.1) | Cards, queue items |
| shadow-md | 0 4px 6px rgba(0, 0, 0, 0.1) | Elevated elements |
| shadow-lg | 0 10px 15px rgba(0, 0, 0, 0.1) | Modals, popovers |
| shadow-xl | 0 25px 50px rgba(0, 0, 0, 0.25) | Large modals |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Badges, thumbnails, small elements |
| radius | 6px | Buttons, inputs |
| radius-md | 8px | Cards, panels, upload zone |
| radius-lg | 12px | Modals, large containers |

---

## States

### Interactive Element States

1. **Default** — Base appearance
2. **Hover** — Slight background/color change
3. **Focus** — Blue outline ring (for accessibility)
4. **Active/Pressed** — Darker shade
5. **Disabled** — 50% opacity, cursor not-allowed
6. **Loading** — Spinner icon, disabled interaction

### Processing Status Display

Display in queue item:
- **Queued:** "Waiting..." with circle outline, Gray 400
- **Compressing:** "Compressing..." with spinner, Cake Blue
- **Complete:** File size savings with checkmark, Success
- **Error:** Error message with retry link, Error

---

## Responsive Considerations

While designed for desktop/tablet (768px minimum), ensure:
- Upload zone remains usable on smaller screens
- Queue items stack properly
- Buttons remain tappable (44x44px minimum)
- Content area scrolls independently

---

## Accessibility

- Minimum touch target: 44x44px
- Focus states visible on all interactive elements
- Color contrast minimum 4.5:1 for text
- Form labels associated with inputs
- Error messages linked to fields via aria-describedby
- Keyboard navigation support for all interactions
- Tooltips on icon-only buttons

---

## Animation & Transitions

- Duration: 150ms for micro-interactions, 200ms for larger transitions
- Easing: ease-in-out for most, ease-out for enters, ease-in for exits
- Properties to animate: opacity, transform, background-color, border-color
- Avoid animating width/height (use transform: scale instead)
- Progress spinners: Infinite rotation, 1s duration

---

## Shared Form Components

### ControlledInput

Text input with consistent styling.

```
inputClass = 'w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm
              text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8]
              focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]'
```

### ControlledTextarea

Multiline text with same styling as input.

### Checkbox

Toggle with label.

### Section

Collapsible accordion section with ARIA `aria-expanded` attribute.

- Chevron rotates 90° when expanded
- Content area has subtle top border when expanded

---

## Design Principles

1. **Clarity over cleverness** — Every element should have obvious purpose
2. **Generous whitespace** — Don't crowd the interface
3. **Progressive disclosure** — Collapse complexity, reveal on demand
4. **Consistent patterns** — Same action = same appearance everywhere
5. **Informative feedback** — Always show processing status (toast notifications, inline status)
6. **Error prevention** — Validate file types and sizes before processing
7. **Accessibility first** — Tooltips for icons, ARIA attributes, keyboard navigation
8. **Efficiency focused** — Batch operations, minimal clicks to complete workflow
