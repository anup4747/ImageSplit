import jsPDF from 'jspdf';
import { SplitPage, PageSize } from '@/types';

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0]; // Default to black if invalid
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

export async function generatePDF(
  page: SplitPage,
  pageSize: PageSize
): Promise<Blob> {
  // Always use landscape orientation to match editor display
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [pageSize.height, pageSize.width], // Swap dimensions for landscape
  });

  // Get PDF page dimensions in mm
  const pdfWidth = pageSize.height; // swapped for landscape
  const pdfHeight = pageSize.width;

  // Convert image dimensions from pixels to mm (96 DPI standard)
  const imgWidthMm = (page.width / 96) * 25.4;
  const imgHeightMm = (page.height / 96) * 25.4;
  const offsetMm = (page.borderWidth / 96) * 25.4; // Convert border offset to mm

  // Calculate scaling to fit image with offset on page (with some margin)
  const margin = 5; // 5mm margin from page edges
  const maxWidthMm = pdfWidth - (margin * 2) - (offsetMm * 2);
  const maxHeightMm = pdfHeight - (margin * 2) - (offsetMm * 2);
  
  let scale = 1;
  if (imgWidthMm > maxWidthMm) {
    scale = maxWidthMm / imgWidthMm;
  }
  if (imgHeightMm * scale > maxHeightMm) {
    scale = maxHeightMm / imgHeightMm;
  }

  // Scaled dimensions
  const scaledImgWidth = imgWidthMm * scale;
  const scaledImgHeight = imgHeightMm * scale;
  const scaledOffset = offsetMm * scale;

  // Center on page
  const totalWidthWithOffset = scaledImgWidth + (scaledOffset * 2);
  const totalHeightWithOffset = scaledImgHeight + (scaledOffset * 2);
  const startX = (pdfWidth - totalWidthWithOffset) / 2;
  const startY = (pdfHeight - totalHeightWithOffset) / 2;

  // Draw offset/padding background
  const [r, g, b] = hexToRgb(page.borderColor);
  pdf.setFillColor(r, g, b);
  pdf.rect(startX, startY, totalWidthWithOffset, totalHeightWithOffset, 'F');

  // Add the image in the center of the offset
  pdf.addImage(
    page.imageData,
    'PNG',
    startX + scaledOffset,
    startY + scaledOffset,
    scaledImgWidth,
    scaledImgHeight
  );

  return pdf.output('blob');
}

export async function generateAllPDFs(
  pages: SplitPage[],
  pageSize: PageSize
): Promise<Map<string, Blob>> {
  const pdfMap = new Map<string, Blob>();

  for (const page of pages) {
    const filename = `page_${page.row + 1}_${page.col + 1}.pdf`;
    const blob = await generatePDF(page, pageSize);
    pdfMap.set(filename, blob);
  }

  return pdfMap;
}

export async function generateCombinedPDF(
  pages: SplitPage[],
  pageSize: PageSize
): Promise<Blob> {
  // Always use landscape orientation to match editor display
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [pageSize.height, pageSize.width], // Swap dimensions for landscape
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    
    // Get PDF page dimensions in mm
    const pdfWidth = pageSize.height; // swapped for landscape
    const pdfHeight = pageSize.width;

    // Convert image dimensions from pixels to mm (96 DPI standard)
    const imgWidthMm = (page.width / 96) * 25.4;
    const imgHeightMm = (page.height / 96) * 25.4;
    const offsetMm = (page.borderWidth / 96) * 25.4; // Convert border offset to mm

    // Calculate scaling to fit image with offset on page (with some margin)
    const margin = 5; // 5mm margin from page edges
    const maxWidthMm = pdfWidth - (margin * 2) - (offsetMm * 2);
    const maxHeightMm = pdfHeight - (margin * 2) - (offsetMm * 2);
    
    let scale = 1;
    if (imgWidthMm > maxWidthMm) {
      scale = maxWidthMm / imgWidthMm;
    }
    if (imgHeightMm * scale > maxHeightMm) {
      scale = maxHeightMm / imgHeightMm;
    }

    // Scaled dimensions
    const scaledImgWidth = imgWidthMm * scale;
    const scaledImgHeight = imgHeightMm * scale;
    const scaledOffset = offsetMm * scale;

    // Center on page
    const totalWidthWithOffset = scaledImgWidth + (scaledOffset * 2);
    const totalHeightWithOffset = scaledImgHeight + (scaledOffset * 2);
    const startX = (pdfWidth - totalWidthWithOffset) / 2;
    const startY = (pdfHeight - totalHeightWithOffset) / 2;

    // Draw offset/padding background
    const [r, g, b] = hexToRgb(page.borderColor);
    pdf.setFillColor(r, g, b);
    pdf.rect(startX, startY, totalWidthWithOffset, totalHeightWithOffset, 'F');

    // Add the image in the center of the offset
    pdf.addImage(
      page.imageData,
      'PNG',
      startX + scaledOffset,
      startY + scaledOffset,
      scaledImgWidth,
      scaledImgHeight
    );

    // Add new page for next image (except for the last one)
    if (i < pages.length - 1) {
      pdf.addPage([pageSize.height, pageSize.width], 'landscape');
    }
  }

  return pdf.output('blob');
}
