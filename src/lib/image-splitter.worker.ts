// image-splitter.worker.ts
// Minimal web worker scaffold for splitting images off the main thread.
// Message protocol:
// postMessage({ type: 'split', imageDataUrl, pageSize })
// worker posts: { type: 'result', result } or { type: 'error', message }

self.addEventListener('message', async (ev: MessageEvent) => {
  const data = ev.data;
  if (!data || data.type !== 'split') return;

  try {
    const { imageDataUrl, pageSize } = data;

    // Create an image and perform split similar to performSplit
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        // replicate performSplit logic (simplified)
        const pageWidth = Math.max(pageSize.widthPx, pageSize.heightPx);
        const pageHeight = Math.min(pageSize.widthPx, pageSize.heightPx);
        const overlapMargin = Math.floor(Math.min(pageWidth, pageHeight) * 0.15);
        const effectiveWidth = pageWidth - overlapMargin;
        const effectiveHeight = pageHeight - overlapMargin;
        const cols = Math.ceil(img.width / effectiveWidth);
        const rows = Math.ceil(img.height / effectiveHeight);

        const pages: any[] = [];
        const displayScale = 0.15;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const canvas = new OffscreenCanvas(pageWidth, pageHeight);
            const ctx = canvas.getContext('2d')!;
            const sourceX = col * effectiveWidth;
            const sourceY = row * effectiveHeight;
            const availableWidth = Math.min(pageWidth, img.width - sourceX);
            const availableHeight = Math.min(pageHeight, img.height - sourceY);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageWidth, pageHeight);

            // drawImage cannot take HTMLImageElement on OffscreenCanvas in all environments.
            // We'll attempt using an intermediate canvas when necessary.
            const temp = new OffscreenCanvas(availableWidth, availableHeight);
            const tctx = temp.getContext('2d')!;
            tctx.drawImage(img as unknown as CanvasImageSource, sourceX, sourceY, availableWidth, availableHeight, 0, 0, availableWidth, availableHeight);
            ctx.drawImage(temp, 0, 0);

            const blobPromise = canvas.convertToBlob({ type: 'image/png' });
            // push a placeholder — converting to dataURL in worker may require additional steps
            pages.push({ row, col, blobPromise });
          }
        }

        // Resolve all blobs (this may be heavy; consumer can stream instead)
        const resolvedPages = await Promise.all(
          pages.map(async (p) => ({ row: p.row, col: p.col, blob: await p.blobPromise }))
        );

        self.postMessage({ type: 'result', result: { pages: resolvedPages, rows, cols, pageSize } });
      } catch (err: any) {
        self.postMessage({ type: 'error', message: String(err) });
      }
    };
    img.onerror = (e) => {
      self.postMessage({ type: 'error', message: 'Failed to load image in worker' });
    };
    img.src = imageDataUrl;
  } catch (err: any) {
    self.postMessage({ type: 'error', message: String(err) });
  }
});
