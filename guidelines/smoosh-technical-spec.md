# Image Smoosh - Technical Specification

**Tagline:** Smoosh images for the web

## Architecture Overview

Image Smoosh follows a staged processing pipeline: files are validated and queued on upload, the user confirms the output format, and compression runs on demand.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UPLOAD    │ →  │   CONFIRM   │ →  │   SMOOSH    │ →  Download
│   Phase     │    │   Format    │    │  (On click) │
└─────────────┘    └─────────────┘    └─────────────┘
     Files          Choose output      Engine routing
     Validation     (WebP default)     Size reduction
```

### Workflow

| Phase | Description |
|-------|-------------|
| **Upload** | Files validated and added to the queue |
| **Confirm Format** | User selects the output format (WebP default) |
| **Smoosh** | Compression runs when the user clicks the Smoosh button |
| **Download** | Individual files or a single ZIP |

### Staged Processing

1. **Upload** — Files added to queue and validated
2. **Confirm Format** — User selects the output format (WebP by default)
3. **Smoosh** — User clicks the Smoosh button; compression runs (up to 3 concurrent)
4. **Download** — Individual or ZIP download

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 with TypeScript 5.9 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Compression | @jsquash libraries (MozJPEG, OxiPNG, WebP via WASM) - dynamically imported |
| ZIP Generation | JSZip |
| Icons | FontAwesome |
| Toasts | Sonner |
| Hosting | Static (Vercel, Netlify, etc.) |

---

## Design Tokens (Tailwind CSS v4)

> **Note:** This project uses **Tailwind CSS v4** with CSS-based theme configuration in `src/styles/index.css` (using `@theme` blocks), not a JavaScript `tailwind.config.js` file. The token values below are provided as reference.

### Color Tokens

| Token | Value |
|-------|-------|
| `--color-primary` | `#4074A8` |
| `--color-primary-50` | `#EBF1F7` |
| `--color-primary-100` | `#D1E0EE` |
| `--color-primary-200` | `#A3C1DD` |
| `--color-primary-700` | `#2D5276` |
| `--color-primary-900` | `#1A3044` |
| `--color-accent` | `#F2A918` |
| `--color-accent-50` | `#FEF7E6` |
| `--color-accent-100` | `#FDE9B8` |
| `--color-accent-700` | `#B87D0E` |
| `--color-success` | `#059669` |
| `--color-success-light` | `#D1FAE5` |
| `--color-error` | `#DC2626` |
| `--color-error-light` | `#FEE2E2` |
| `--color-gray-50` | `#F9FAFB` |
| `--color-gray-100` | `#F3F4F6` |
| `--color-gray-200` | `#E5E7EB` |
| `--color-gray-300` | `#D1D5DB` |
| `--color-gray-400` | `#9CA3AF` |
| `--color-gray-500` | `#6B7280` |
| `--color-gray-600` | `#4B5563` |
| `--color-gray-700` | `#374151` |
| `--color-gray-800` | `#1F2937` |
| `--color-gray-900` | `#111827` |

### Typography Tokens

| Token | Value |
|-------|-------|
| `--font-sans` | `Spline Sans Mono, SF Mono, Fira Code, Consolas, monospace` (body font) |
| `--font-mono` | `Spline Sans Mono, SF Mono, Fira Code, Consolas, monospace` (same as sans) |
| `--font-heading` | `Syne, sans-serif` (headings only, via `font-heading` utility) |

**Fluid root font-size:** `clamp(16px, calc(16px + (100vw - 1024px) * 3.2 / 176), 19.2px)` — scales from 100% at ≤1024px to 120% at ≥1200px.

**Font size downshift convention:** Spline Sans Mono body text is downshifted one Tailwind class (text-sm → text-xs, text-base → text-sm, text-lg → text-base). Syne headings are NOT downshifted.

### Spacing, Radius, Shadow Tokens

| Token | Value |
|-------|-------|
| `--spacing-1` | `0.25rem` (4px at base) |
| `--spacing-2` | `0.5rem` (8px at base) |
| `--spacing-3` | `0.75rem` (12px at base) |
| `--spacing-4` | `1rem` (16px at base) |
| `--spacing-5` | `1.25rem` (20px at base) |
| `--spacing-6` | `1.5rem` (24px at base) |
| `--spacing-8` | `2rem` (32px at base) |
| `--spacing-10` | `2.5rem` (40px at base) |
| `--spacing-12` | `3rem` (48px at base) |
| `--radius-sm` | `4px` |
| `--radius-DEFAULT` | `6px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| `--shadow-DEFAULT` | `0 1px 3px rgba(0, 0, 0, 0.1)` |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` |
| `--shadow-xl` | `0 25px 50px rgba(0, 0, 0, 0.25)` |
| `--transition-duration` | `150ms` |
| `--transition-timing` | `ease-in-out` |

---

## Data Structures

### Image Item
```typescript
interface ImageItem {
  id: string;                              // Unique identifier (UUID)
  file: File;                              // Original file object
  name: string;                            // Original filename
  originalSize: number;                    // Size in bytes
  inputFormat: 'png' | 'jpg' | 'webp';     // Detected input format
  outputFormat: 'png' | 'mozjpg' | 'webp'; // Target output format

  // Processing state
  status: ImageStatus;
  engine: 'tinypng' | 'oxipng' | 'mozjpeg' | 'webp' | null;  // CompressionEngine type

  // Compression results
  compressedSize: number | null;
  compressedBlob: Blob | null;
  thumbnail: string | null;                // Data URL for preview

  // Error handling
  error: string | null;
}

type ImageStatus =
  | 'queued'
  | 'compressing'
  | 'complete'
  | 'error';
```

### App State

> **Note:** There is no single `AppState` interface. State is managed via composable React hooks:
> - `useImageQueue` — image list, add/remove/update operations
> - `useCompression` — compression via the Smoosh button, engine routing, progress
> - `useDownload` — individual file download and ZIP archive generation
>
> Each hook encapsulates its own state and exposes actions/selectors to the `App.tsx` component.

---

## API Integration Details

### TinyPNG API

#### Authentication
```
Authorization: Basic base64(api:YOUR_API_KEY)
```

#### Compress Request
```http
POST https://api.tinify.com/shrink
Content-Type: image/png
Authorization: Basic [base64 encoded key]

[binary image data]
```

#### Response (Success)
```json
{
  "input": {
    "size": 1478,
    "type": "image/png"
  },
  "output": {
    "size": 912,
    "type": "image/png",
    "width": 100,
    "height": 100,
    "ratio": 0.617,
    "url": "https://api.tinify.com/output/..."
  }
}
```

#### Quota Tracking
```
Response Header: Compression-Count: 42
```

On 429 error or `Compression-Count >= 500`:
- Set `tinypngQuotaExhausted = true`
- Route subsequent PNG→PNG to Squoosh
- Notify user

### @jsquash Client-Side Compression

Compression codecs are dynamically imported from `@jsquash` packages (WASM-based, runs in browser):

#### MozJPEG Encoding
```typescript
const { encode } = await import('@jsquash/jpeg');
const result = await encode(imageData, { quality: 75, progressive: true, ... });
```

#### WebP Encoding
```typescript
const { encode } = await import('@jsquash/webp');
const result = await encode(imageData, { quality: 75 });
```

#### OxiPNG Optimization (Fallback for PNG)
```typescript
const { optimise } = await import('@jsquash/oxipng');
const result = await optimise(pngBuffer, { level: 2 });
```

---

## Compression Routing

Routing is based solely on the output format (not the input format):

```typescript
type CompressionEngine = 'tinypng' | 'oxipng' | 'mozjpeg' | 'webp';

function getCompressionEngine(
  _inputFormat: InputFormat,
  outputFormat: OutputFormat
): CompressionEngine {
  switch (outputFormat) {
    case 'png':
      return tinypngQuotaExhausted ? 'oxipng' : 'tinypng';
    case 'mozjpg':
      return 'mozjpeg';
    case 'webp':
      return 'webp';
    default:
      return 'webp';
  }
}
```

---

## Processing Pipeline

### Hook-Based Architecture

The processing pipeline uses composable React hooks rather than batch processing functions:

#### `useCompression` Hook
- **Starts compression** when the user clicks the Smoosh button (after confirming the output format)
- Processes up to **3 images concurrently** via a bounded work-stealing pool (`forEachWithConcurrency`); each worker handles its own errors so one failure never aborts the batch
- Uses `getCompressionEngine()` to select the appropriate engine based on output format
- Updates each image's status (`compressing` -> `complete` or `error`) as processing completes
- Tracks TinyPNG quota exhaustion and falls back to OxiPNG for PNG output

#### `useDownload` Hook
- Provides individual file download per image
- Provides ZIP archive download for all completed images via JSZip

#### `useImageQueue` Hook
- Manages the image list state (add, remove, update)
- Tracks per-image status and processing results

---

## File Validation

File validation uses a two-layer approach for security:
1. **MIME type validation** - Quick check of file.type
2. **Magic byte validation** - Verifies actual file content matches expected format

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_BATCH_SIZE = 20;
const VALID_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Magic bytes for format verification
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]; // PNG header
const JPEG_MAGIC = [0xff, 0xd8, 0xff]; // JPEG header
const RIFF_MAGIC = [0x52, 0x49, 0x46, 0x46]; // "RIFF" for WebP
const WEBP_MAGIC = [0x57, 0x45, 0x42, 0x50]; // "WEBP" at bytes 8-11

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates file magic bytes to prevent spoofed file extensions
 */
async function validateMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const isPNG = PNG_MAGIC.every((byte, i) => bytes[i] === byte);
  if (isPNG) return true;

  const isJPEG = JPEG_MAGIC.every((byte, i) => bytes[i] === byte);
  if (isJPEG) return true;

  // Check for WebP (RIFF header at 0-3, WEBP at 8-11)
  const isRIFF = RIFF_MAGIC.every((byte, i) => bytes[i] === byte);
  const isWEBP = WEBP_MAGIC.every((byte, i) => bytes[i + 8] === byte);
  return isRIFF && isWEBP;
}

async function validateFile(file: File): Promise<ValidationResult> {
  const errors: string[] = [];

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`"${file.name}" exceeds 5MB limit (${formatBytes(file.size)})`);
  }

  if (!VALID_TYPES.includes(file.type)) {
    errors.push(`"${file.name}" is not a supported format (PNG, JPG, or WebP only)`);
  }

  // Verify magic bytes match claimed type
  const validMagicBytes = await validateMagicBytes(file);
  if (!validMagicBytes) {
    errors.push(`"${file.name}" file content does not match its extension`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// `validateBatch` only performs the synchronous batch-count check.
// Per-file validation (`validateFile`) is async (it awaits magic-byte
// reads), so it must NOT be called synchronously here — doing so would push
// unresolved Promises and silently skip the content check. Per-file
// validation happens separately in `filterValidFiles`, which awaits each
// `validateFile` via `Promise.all`.
function validateBatch(files: File[], existingCount: number): ValidationResult {
  const errors: string[] = [];

  if (existingCount + files.length > MAX_BATCH_SIZE) {
    errors.push(`Batch limit is ${MAX_BATCH_SIZE} images. You have ${existingCount} and are adding ${files.length}.`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Filters valid files, awaiting the async magic-byte check on each.
async function filterValidFiles(
  files: File[]
): Promise<{ valid: File[]; errors: string[] }> {
  const results = await Promise.all(
    files.map(async (file) => ({ file, result: await validateFile(file) }))
  );

  const valid: File[] = [];
  const errors: string[] = [];
  for (const { file, result } of results) {
    if (result.valid) valid.push(file);
    else errors.push(...result.errors);
  }
  return { valid, errors };
}
```

---

## ZIP Download

```typescript
import JSZip from 'jszip';

async function downloadAsZip(images: ImageItem[]): Promise<void> {
  const zip = new JSZip();

  const completed = images.filter(
    img => img.status === 'complete' && img.compressedBlob
  );

  completed.forEach(img => {
    const outputFilename = getOutputFilename(img.name, img.outputFormat);
    zip.file(outputFilename, img.compressedBlob!);
  });

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smoosh-${Date.now()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

function getOutputFilename(original: string, outputFormat: string): string {
  const baseName = original.replace(/\.[^/.]+$/, '');

  switch (outputFormat) {
    case 'webp':
      return `${baseName}.webp`;
    case 'mozjpg':
      return `${baseName}.jpg`;
    case 'png':
    default:
      return `${baseName}.png`;
  }
}
```

---

## Savings Calculation

```typescript
interface Savings {
  percentage: string;
  absolute: string;
  savedBytes: number;
}

function calculateSavings(originalSize: number, compressedSize: number): Savings {
  const savedBytes = originalSize - compressedSize;
  const percentage = ((savedBytes / originalSize) * 100).toFixed(0);

  return {
    percentage: `${percentage}%`,
    absolute: `${formatBytes(originalSize)} → ${formatBytes(compressedSize)}`,
    savedBytes
  };
}

function calculateTotalSavings(images: ImageItem[]): Savings {
  const completed = images.filter(img => img.status === 'complete');

  const totalOriginal = completed.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = completed.reduce((sum, img) => sum + (img.compressedSize || 0), 0);

  return calculateSavings(totalOriginal, totalCompressed);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
```

---

## Component Structure

```
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── types.ts                           # All TypeScript types & constants
│   ├── components/
│   │   ├── download/
│   │   │   └── DownloadSection.tsx
│   │   ├── format/
│   │   │   └── FormatSelector.tsx         # Output format selection
│   │   ├── layout/
│   │   │   └── Footer.tsx
│   │   ├── processing/
│   │   │   └── ProcessingButtons.tsx       # Compression progress display
│   │   ├── queue/
│   │   │   ├── ImageQueue.tsx
│   │   │   ├── QueueItem.tsx              # Individual image in queue
│   │   │   └── StatusIndicator.tsx        # Status icon/spinner
│   │   ├── summary/
│   │   │   └── SummaryBar.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Spinner.tsx
│   │   └── upload/
│   │       └── UploadZone.tsx             # Drag/drop + file picker
│   ├── hooks/
│   │   ├── index.ts                       # Re-exports all hooks
│   │   ├── useCompression.ts              # Compression via the Smoosh button
│   │   ├── useDownload.ts                 # Individual & ZIP download
│   │   ├── useFileValidation.ts           # MIME + magic byte validation
│   │   └── useImageQueue.ts               # Image state management
│   ├── services/
│   │   ├── compression/
│   │   │   ├── compressionRouter.ts       # Engine selection & routing
│   │   │   ├── squooshService.ts          # @jsquash WASM encoders
│   │   │   └── tinypngService.ts          # TinyPNG API client
│   │   └── download/
│   │       └── zipService.ts              # ZIP archive generation
│   └── utils/
│       ├── detectFormat.ts                # MIME type detection
│       ├── fileHelpers.ts                 # Thumbnails, downloads, decode
│       ├── formatBytes.ts                 # Byte formatting
│       └── generateId.ts                  # UUID generation
├── styles/
│   └── index.css                          # Tailwind CSS v4 theme config
└── test/
    └── setup.ts                           # Test setup with mocks
```

---

## Environment Variables

```env
# .env
TINYPNG_API_KEY=your_tinypng_key
```

> **Note:** The `TINYPNG_API_KEY` is loaded via `loadEnv` in `vite.config.ts` (not a `VITE_`-prefixed variable exposed to the client). In production, a Vercel serverless function at `api/tinypng/[...path].ts` proxies requests to the TinyPNG API, keeping the API key server-side.

---

## Error Types

```typescript
type ErrorType =
  | 'file_too_large'
  | 'invalid_format'
  | 'batch_limit_exceeded'
  | 'quota_exceeded'
  | 'network_error'
  | 'url_fetch_failed'
  | 'compression_failed';

interface AppNotification {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  errorType?: ErrorType;
  message: string;
  dismissable: boolean;
  autoDismiss: number | false;
}
```

---

## Browser Compatibility

### Required APIs
- File API
- Drag and Drop API
- Fetch API
- Blob / URL.createObjectURL
- Web Workers
- WebAssembly

### Minimum Versions
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

---

## Performance Considerations

1. **Thumbnail generation:** Create at upload time, not during render
2. **Bounded concurrency:** Up to 3 images are compressed at once via a work-stealing pool (`forEachWithConcurrency` in `useCompression`). Network-bound TinyPNG requests parallelize fully; CPU-bound WASM encodes still overlap their async decode/canvas steps. The cap keeps the browser responsive on large batches.
3. **Web Worker:** Run Squoosh compression off main thread
4. **Memory management:** Revoke object URLs when no longer needed
5. **Progress indication:** Update UI during long operations
6. **Dynamic WASM imports:** Compression codecs (@jsquash/jpeg, @jsquash/webp, @jsquash/oxipng) are dynamically imported at runtime to reduce initial bundle size
7. **React.memo optimization:** QueueItem component uses React.memo with useCallback handlers to prevent unnecessary re-renders when other queue items update
