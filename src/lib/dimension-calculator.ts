import { PageSize, SplitPage } from '@/types';
import { WallDimensions } from '@/components/WallSettings';

/**
 * Calculate the total dimensions of the joined image (all pages combined with overlaps)
 * @param pages - Array of split pages
 * @param pageSize - The size of each page
 * @returns Object with totalWidth and totalHeight in mm
 */
export function calculateTotalJoinedDimensions(
  pages: SplitPage[],
  pageSize: PageSize,
  rows: number,
  cols: number
): { width: number; height: number } {
  // Use landscape orientation
  const pageWidth = Math.max(pageSize.widthPx, pageSize.heightPx);
  const pageHeight = Math.min(pageSize.widthPx, pageSize.heightPx);
  
  // Calculate pixels per mm at 96 DPI (96 pixels = 25.4 mm)
  const pxPerMm = 96 / 25.4;
  
  // Convert page dimensions from pixels to mm
  const pageWidthMm = pageWidth / pxPerMm;
  const pageHeightMm = pageHeight / pxPerMm;
  
  // Overlap margin ratio (must match the one used in image-splitter.ts)
  const overlapRatio = 0.15;
  const overlapWidthMm = pageWidthMm * overlapRatio;
  const overlapHeightMm = pageHeightMm * overlapRatio;
  
  // Effective area each page covers (excluding overlap)
  const effectiveWidthMm = pageWidthMm - overlapWidthMm;
  const effectiveHeightMm = pageHeightMm - overlapHeightMm;
  
  // Total dimensions: sum of all pages with overlaps accounted for
  // For multiple pages in a row/column, we only "lose" overlap margin between pages
  const totalWidthMm = effectiveWidthMm * cols + overlapWidthMm;
  const totalHeightMm = effectiveHeightMm * rows + overlapHeightMm;
  
  return {
    width: Math.round(totalWidthMm * 10) / 10,
    height: Math.round(totalHeightMm * 10) / 10,
  };
}

/**
 * Convert wall dimensions from any unit to mm
 */
export function convertWallDimensionsToMm(wallDimensions: WallDimensions): { width: number; height: number } {
  let widthMm = wallDimensions.width;
  let heightMm = wallDimensions.height;
  
  if (wallDimensions.unit === 'cm') {
    widthMm *= 10;
    heightMm *= 10;
  } else if (wallDimensions.unit === 'm') {
    widthMm *= 1000;
    heightMm *= 1000;
  } else if (wallDimensions.unit === 'ft') {
    widthMm *= 304.8; // 1 ft = 304.8 mm
    heightMm *= 304.8;
  }
  
  return { width: widthMm, height: heightMm };
}

/**
 * Check if the joined image will fit on the wall
 * @returns Object with fitStatus and details
 */
export function checkWallFit(
  joinedDimensions: { width: number; height: number },
  wallDimensions: WallDimensions
): {
  fits: boolean;
  status: 'fits' | 'warning' | 'overflow';
  widthFit: boolean;
  heightFit: boolean;
  message: string;
} {
  if (wallDimensions.width === 0 || wallDimensions.height === 0) {
    return {
      fits: true,
      status: 'fits',
      widthFit: true,
      heightFit: true,
      message: 'Set wall dimensions to check fit',
    };
  }
  
  const wallMm = convertWallDimensionsToMm(wallDimensions);
  const widthFit = joinedDimensions.width <= wallMm.width;
  const heightFit = joinedDimensions.height <= wallMm.height;
  const fits = widthFit && heightFit;
  
  let status: 'fits' | 'warning' | 'overflow' = 'fits';
  let message = '';
  
  if (!fits) {
    const widthExcess = joinedDimensions.width - wallMm.width;
    const heightExcess = joinedDimensions.height - wallMm.height;
    
    if (Math.max(widthExcess, heightExcess) > 100) {
      // More than 10cm excess
      status = 'overflow';
      message = '⚠️ Image is too large for wall! ';
    } else {
      status = 'warning';
      message = '⚠️ Image slightly exceeds wall. ';
    }
    
    if (!widthFit && !heightFit) {
      message += `Need -${Math.ceil(widthExcess)}mm width and -${Math.ceil(heightExcess)}mm height`;
    } else if (!widthFit) {
      message += `Need -${Math.ceil(widthExcess)}mm width`;
    } else {
      message += `Need -${Math.ceil(heightExcess)}mm height`;
    }
  } else {
    const spaceW = wallMm.width - joinedDimensions.width;
    const spaceH = wallMm.height - joinedDimensions.height;
    message = `✓ Perfect fit! Space: +${Math.floor(spaceW)}mm W, +${Math.floor(spaceH)}mm H`;
  }
  
  return { fits, status, widthFit, heightFit, message };
}

/**
 * Calculate required page count to fill a wall of given dimensions
 * This is useful for reverse calculation: "I want to fill a 2m x 1.5m wall"
 */
export function calculateRequiredPages(
  imageAspectRatio: number,
  wallDimensions: WallDimensions,
  pageSize: PageSize
): { rows: number; cols: number; totalPages: number; resultingWidth: number; resultingHeight: number } {
  const wallMm = convertWallDimensionsToMm(wallDimensions);
  
  // Use landscape orientation
  const pageWidth = Math.max(pageSize.widthPx, pageSize.heightPx);
  const pageHeight = Math.min(pageSize.widthPx, pageSize.heightPx);
  
  // Convert to mm
  const pxPerMm = 96 / 25.4;
  const pageWidthMm = pageWidth / pxPerMm;
  const pageHeightMm = pageHeight / pxPerMm;
  
  // Effective area per page
  const overlapRatio = 0.15;
  const effectiveWidthMm = pageWidthMm * (1 - overlapRatio);
  const effectiveHeightMm = pageHeightMm * (1 - overlapRatio);
  
  // Calculate cols and rows needed
  const cols = Math.max(1, Math.ceil(wallMm.width / effectiveWidthMm));
  const rows = Math.max(1, Math.ceil(wallMm.height / effectiveHeightMm));
  
  // Calculate resulting dimensions
  const overlapWidthMm = pageWidthMm * overlapRatio;
  const overlapHeightMm = pageHeightMm * overlapRatio;
  
  const resultingWidth = effectiveWidthMm * cols + overlapWidthMm;
  const resultingHeight = effectiveHeightMm * rows + overlapHeightMm;
  
  return {
    rows,
    cols,
    totalPages: rows * cols,
    resultingWidth: Math.round(resultingWidth * 10) / 10,
    resultingHeight: Math.round(resultingHeight * 10) / 10,
  };
}

/**
 * Calculate the optimal image size that will fill the wall with the given page configuration
 * Returns the target width and height the image should be rescaled to
 */
export function calculateOptimalImageSize(
  originalImageWidth: number,
  originalImageHeight: number,
  wallDimensions: WallDimensions,
  pageSize: PageSize
): {
  targetWidth: number;
  targetHeight: number;
  rows: number;
  cols: number;
  scaleFactor: number;
  finalJoinedWidth: number;
  finalJoinedHeight: number;
} {
  const wallMm = convertWallDimensionsToMm(wallDimensions);
  
  if (wallMm.width === 0 || wallMm.height === 0) {
    // No wall dimensions set, return original
    return {
      targetWidth: originalImageWidth,
      targetHeight: originalImageHeight,
      rows: 1,
      cols: 1,
      scaleFactor: 1,
      finalJoinedWidth: originalImageWidth,
      finalJoinedHeight: originalImageHeight,
    };
  }
  
  // Get required page count
  const aspectRatio = originalImageWidth / originalImageHeight;
  const pageConfig = calculateRequiredPages(aspectRatio, wallDimensions, pageSize);
  
  // Calculate how many pixels correspond to the wall size
  const pxPerMm = 96 / 25.4;
  const wallWidthPx = wallMm.width * pxPerMm;
  const wallHeightPx = wallMm.height * pxPerMm;
  
  // Try to fit to wall, maintaining aspect ratio
  let targetWidth = wallWidthPx;
  let targetHeight = (targetWidth / aspectRatio);
  
  // If height exceeds wall, scale down by height
  if (targetHeight > wallHeightPx) {
    targetHeight = wallHeightPx;
    targetWidth = targetHeight * aspectRatio;
  }
  
  // Calculate scale factor from original
  const scaleFactor = targetWidth / originalImageWidth;
  
  // Calculate the final joined dimensions after splitting
  const pageWidth = Math.max(pageSize.widthPx, pageSize.heightPx);
  const pageHeight = Math.min(pageSize.widthPx, pageSize.heightPx);
  const pageWidthMm = pageWidth / pxPerMm;
  const pageHeightMm = pageHeight / pxPerMm;
  
  const overlapRatio = 0.15;
  const overlapWidthMm = pageWidthMm * overlapRatio;
  const overlapHeightMm = pageHeightMm * overlapRatio;
  const effectiveWidthMm = pageWidthMm * (1 - overlapRatio);
  const effectiveHeightMm = pageHeightMm * (1 - overlapRatio);
  
  const finalJoinedWidth = Math.round((effectiveWidthMm * pageConfig.cols + overlapWidthMm) * 10) / 10;
  const finalJoinedHeight = Math.round((effectiveHeightMm * pageConfig.rows + overlapHeightMm) * 10) / 10;
  
  return {
    targetWidth: Math.round(targetWidth),
    targetHeight: Math.round(targetHeight),
    rows: pageConfig.rows,
    cols: pageConfig.cols,
    scaleFactor: Math.round(scaleFactor * 100) / 100,
    finalJoinedWidth,
    finalJoinedHeight,
  };
}

/**
 * Rescale an image to target dimensions using canvas
 */
export function rescaleImage(
  imageSrc: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}
