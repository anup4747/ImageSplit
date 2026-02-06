import { v4 as uuidv4 } from 'uuid';
import { PageSize, SplitPage, SplitResult } from '@/types';

// Border styles for random selection
const BORDER_STYLES = [
  { width: 3, color: '#ffffff' },
  { width: 4, color: '#e5e5e5' },
  { width: 5, color: '#d4d4d4' },
  { width: 3, color: '#fafafa' },
  { width: 6, color: '#f5f5f5' },
  { width: 4, color: '#ffffff' },
  { width: 2, color: '#e0e0e0' },
];

export async function splitImage(
  imageFile: File,
  pageSize: PageSize
): Promise<SplitResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const pages = performSplit(img, pageSize);
        resolve(pages);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(imageFile);
  });
}

function performSplit(img: HTMLImageElement, pageSize: PageSize): SplitResult {
  // Use landscape orientation for pages
  const pageWidth = Math.max(pageSize.widthPx, pageSize.heightPx);
  const pageHeight = Math.min(pageSize.widthPx, pageSize.heightPx);
  
  // Overlap margin - how much extra image each page captures for seamless joining
  // This is the area that will be hidden when pages overlap
  const overlapMargin = Math.floor(Math.min(pageWidth, pageHeight) * 0.15); // 15% overlap
  
  // Effective area each page covers (excluding overlap)
  const effectiveWidth = pageWidth - overlapMargin;
  const effectiveHeight = pageHeight - overlapMargin;
  
  // Calculate how many pages needed
  const cols = Math.ceil(img.width / effectiveWidth);
  const rows = Math.ceil(img.height / effectiveHeight);
  
  const pages: SplitPage[] = [];
  
  // Display scale for the editor preview
  const displayScale = 0.15;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Calculate source position - each page starts at effectiveWidth intervals
      // but captures pageWidth of content (with overlap)
      const sourceX = col * effectiveWidth;
      const sourceY = row * effectiveHeight;
      
      // How much of the image we can actually capture from this position
      const availableWidth = Math.min(pageWidth, img.width - sourceX);
      const availableHeight = Math.min(pageHeight, img.height - sourceY);
      
      // Set canvas to page size
      canvas.width = pageWidth;
      canvas.height = pageHeight;
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageWidth, pageHeight);
      
      // Draw this portion of the image (includes overlap content)
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        availableWidth,
        availableHeight,
        0,
        0,
        availableWidth,
        availableHeight
      );
      
      // Position pages so they overlap in the preview
      // The overlap in position matches the overlap in image content
      const displayWidth = pageWidth * displayScale;
      const displayHeight = pageHeight * displayScale;
      const displayOverlap = overlapMargin * displayScale;
      
      // Base position - pages overlap by the overlap margin
      const baseX = col * (displayWidth - displayOverlap) + 80;
      const baseY = row * (displayHeight - displayOverlap) + 80;
      
      // Small random offset for natural scattered look (but no rotation!)
      const randomOffsetX = (Math.random() - 0.5) * 30;
      const randomOffsetY = (Math.random() - 0.5) * 30;
      
      // Random border style
      const borderStyle = BORDER_STYLES[Math.floor(Math.random() * BORDER_STYLES.length)];
      
      pages.push({
        id: uuidv4(),
        imageData: canvas.toDataURL('image/png'),
        row,
        col,
        width: pageWidth,
        height: pageHeight,
        x: baseX + randomOffsetX,
        y: baseY + randomOffsetY,
        rotation: 0, // No rotation - pages are perfectly horizontal
        zIndex: row * cols + col,
        borderWidth: borderStyle.width,
        borderColor: borderStyle.color,
      });
    }
  }
  
  return { pages, rows, cols, pageSize };
}

export function resetPagePositions(pages: SplitPage[]): SplitPage[] {
  const displayScale = 0.15;
  const overlapRatio = 0.15; // Match the overlap margin ratio
  
  return pages.map((page, index) => {
    const displayWidth = page.width * displayScale;
    const displayHeight = page.height * displayScale;
    const displayOverlap = Math.min(displayWidth, displayHeight) * overlapRatio;
    
    // Position with overlap
    const baseX = page.col * (displayWidth - displayOverlap) + 80;
    const baseY = page.row * (displayHeight - displayOverlap) + 80;
    
    // Small random offset for scattered look
    const randomOffsetX = (Math.random() - 0.5) * 40;
    const randomOffsetY = (Math.random() - 0.5) * 40;
    
    return {
      ...page,
      x: baseX + randomOffsetX,
      y: baseY + randomOffsetY,
      rotation: 0, // No rotation - keep pages horizontal
      zIndex: index,
    };
  });
}

export function arrangeInGrid(pages: SplitPage[], spacing: number = 5): SplitPage[] {
  const displayScale = 0.15;
  
  return pages.map((page) => ({
    ...page,
    x: page.col * (page.width * displayScale + spacing) + 50,
    y: page.row * (page.height * displayScale + spacing) + 50,
    rotation: 0,
  }));
}

// Arrange pages with proper overlap to show the complete image
export function arrangeWithOverlap(pages: SplitPage[]): SplitPage[] {
  const displayScale = 0.15;
  const overlapRatio = 0.15;
  
  return pages.map((page, index) => {
    const displayWidth = page.width * displayScale;
    const displayHeight = page.height * displayScale;
    const displayOverlap = Math.min(displayWidth, displayHeight) * overlapRatio;
    
    return {
      ...page,
      x: page.col * (displayWidth - displayOverlap) + 50,
      y: page.row * (displayHeight - displayOverlap) + 50,
      rotation: 0,
      zIndex: page.row * 100 + page.col, // Proper z-order for overlap
    };
  });
}
