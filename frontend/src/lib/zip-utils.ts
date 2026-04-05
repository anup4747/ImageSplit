import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SplitPage, PageSize } from '@/types';
import { generateAllPDFs, generateCombinedPDF } from './pdf-generator';

export async function downloadImagesAsZip(
  pages: SplitPage[],
  filename: string = 'split-images.zip'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('images');

  if (!folder) {
    throw new Error('Failed to create zip folder');
  }

  for (const page of pages) {
    const imageName = `page_${page.row + 1}_${page.col + 1}.png`;
    // Convert base64 data URL to blob
    const base64Data = page.imageData.split(',')[1];
    folder.file(imageName, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, filename);
}

export async function downloadPDFsAsZip(
  pages: SplitPage[],
  pageSize: PageSize,
  filename: string = 'split-pdfs.zip'
): Promise<void> {
  const zip = new JSZip();

  // Generate combined PDF with all pages
  const combinedPdf = await generateCombinedPDF(pages, pageSize);
  zip.file('combined-pages.pdf', combinedPdf);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, filename);
}
