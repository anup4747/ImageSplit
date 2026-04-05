export interface PageSize {
  name: string;
  width: number; // in mm
  height: number; // in mm
  widthPx: number; // at 96 DPI
  heightPx: number; // at 96 DPI
}

export const PAGE_SIZES: Record<string, PageSize> = {
  A4: {
    name: 'A4',
    width: 210,
    height: 297,
    widthPx: 794,
    heightPx: 1123,
  },
  A3: {
    name: 'A3',
    width: 297,
    height: 420,
    widthPx: 1123,
    heightPx: 1587,
  },
  Letter: {
    name: 'Letter',
    width: 216,
    height: 279,
    widthPx: 816,
    heightPx: 1056,
  },
  Legal: {
    name: 'Legal',
    width: 216,
    height: 356,
    widthPx: 816,
    heightPx: 1346,
  },
};

export interface SplitPage {
  id: string;
  imageData: string; // base64 data URL
  row: number;
  col: number;
  width: number;
  height: number;
  // Position in the collage editor
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  // Random border styling
  borderWidth: number;
  borderColor: string;
  // user-adjustable scale relative to original dimensions
  scaleFactor?: number;
}

export interface SplitResult {
  pages: SplitPage[];
  rows: number;
  cols: number;
  pageSize: PageSize;
}
