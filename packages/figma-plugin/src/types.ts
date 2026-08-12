// ── Messages FROM sandbox TO UI ──

export interface SelectionUpdateMsg {
  type: 'SELECTION_UPDATE';
  count: number;
}

// Format the user picked in the UI. JPG/PNG export directly from Figma;
// WEBP exports a lossless PNG from Figma that the UI transcodes to WebP.
export type OutputFormat = 'JPG' | 'PNG' | 'WEBP';

export interface ExportedFile {
  name: string;
  // Sent as a Uint8Array, not number[]. Figma's postMessage supports Uint8Array
  // natively; expanding it to a plain array costs ~8-16 bytes of sandbox heap
  // per image byte and aborts the plugin VM on large batches.
  data: Uint8Array;
  // MIME of the bytes Figma actually produced (PNG for both PNG and WEBP targets).
  type: 'image/png' | 'image/jpeg';
  // The format the user requested — drives which codec the UI runs.
  targetFormat: OutputFormat;
}

// Export is streamed one file per message so neither side ever holds the whole
// batch: EXPORT_BEGIN, then one EXPORT_FILE per successful export, then
// EXPORT_DONE. `total` is the layer count; `sent` is how many actually exported.

export interface ExportBeginMsg {
  type: 'EXPORT_BEGIN';
  total: number;
}

export interface ExportFileMsg {
  type: 'EXPORT_FILE';
  file: ExportedFile;
}

export interface ExportDoneMsg {
  type: 'EXPORT_DONE';
  sent: number;
}

// ── Messages FROM UI TO sandbox ──

export interface ExportRequestMsg {
  type: 'EXPORT_REQUEST';
  format: OutputFormat;
  scale: number;
}

// ── Compression result for UI display ──

export interface CompressionResultItem {
  originalName: string;
  originalSize: number;
  compressedData: ArrayBuffer;
  compressedSize: number;
  mimeType: string;
  extension: string;
  engine: 'mozjpeg' | 'tinypng' | 'oxipng' | 'webp';
}
