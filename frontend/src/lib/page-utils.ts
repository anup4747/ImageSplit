import { v4 as uuidv4 } from 'uuid';
import { SplitPage } from '@/types';

// Simple helper for converting an image File into a `SplitPage` object
// The resulting page will sit at (0,0) with no rotation and minimal styling.
export async function createPageFromImageFile(file: File): Promise<SplitPage> {
  return new Promise<SplitPage>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // random-ish border styles to keep the "scrap of paper" look
        const BORDER_STYLES = [
          { width: 3, color: '#ffffff' },
          { width: 4, color: '#e5e5e5' },
          { width: 5, color: '#d4d4d4' },
          { width: 3, color: '#fafafa' },
          { width: 6, color: '#f5f5f5' },
          { width: 4, color: '#ffffff' },
          { width: 2, color: '#e0e0e0' },
        ];
        const borderStyle = BORDER_STYLES[Math.floor(Math.random() * BORDER_STYLES.length)];

        resolve({
          id: uuidv4(),
          imageData: e.target?.result as string,
          row: 0,
          col: 0,
          width,
          height,
          x: 0,
          y: 0,
          rotation: 0,
          zIndex: 0,
          borderWidth: 0, // no border by default
          borderColor: borderStyle.color,
          scaleFactor: 1,
        });
      };
      img.onerror = () => reject(new Error('failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('failed to read file'));
    reader.readAsDataURL(file);
  });
}
