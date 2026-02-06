'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import PageSizeSelector from '@/components/PageSizeSelector';
import CollageEditor from '@/components/CollageEditor';
import ExportPanel from '@/components/ExportPanel';
import WallSettings, { WallDimensions } from '@/components/WallSettings';
import { splitImage } from '@/lib/image-splitter';
import { calculateOptimalImageSize, rescaleImage } from '@/lib/dimension-calculator';
import { PAGE_SIZES, SplitPage, PageSize } from '@/types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSizeKey, setSelectedSizeKey] = useState<string>('A4');
  const [pages, setPages] = useState<SplitPage[]>([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wallDimensions, setWallDimensions] = useState<WallDimensions>({
    width: 0,
    height: 0,
    unit: 'cm',
  });
  const [originalImageDimensions, setOriginalImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const selectedPageSize: PageSize = PAGE_SIZES[selectedSizeKey];

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Auto-split when image is selected
    await handleSplit(file, selectedSizeKey, null);
  };

  const handleSplit = async (file: File, sizeKey: string, wallDims: WallDimensions | null) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          // Store original dimensions
          setOriginalImageDimensions({ width: img.width, height: img.height });

          let fileToSplit = file;
          let scaledPreviewUrl = previewUrl;
          let newScaleFactor = 1;

          // If wall dimensions are set, calculate optimal image size and rescale
          if (wallDims && (wallDims.width > 0 || wallDims.height > 0)) {
            const optimalSize = calculateOptimalImageSize(
              img.width,
              img.height,
              wallDims,
              PAGE_SIZES[sizeKey]
            );
            newScaleFactor = optimalSize.scaleFactor;
            setScaleFactor(newScaleFactor);

            // Rescale the image
            const rescaledDataUrl = await rescaleImage(
              e.target?.result as string,
              optimalSize.targetWidth,
              optimalSize.targetHeight
            );

            // Create a blob from the rescaled image for splitting
            const response = await fetch(rescaledDataUrl);
            const blob = await response.blob();
            fileToSplit = new File([blob], file.name, { type: 'image/png' });
            scaledPreviewUrl = rescaledDataUrl;
          } else {
            setScaleFactor(1);
          }

          // Set the preview to scaled image
          setPreviewUrl(scaledPreviewUrl);

          // Split the image
          const result = await splitImage(fileToSplit, PAGE_SIZES[sizeKey]);
          setPages(result.pages);
          setRows(result.rows);
          setCols(result.cols);
        };
        img.onerror = () => {
          console.error('Failed to load image');
          setIsProcessing(false);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Split failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSizeChange = async (sizeKey: string) => {
    setSelectedSizeKey(sizeKey);
    if (selectedFile) {
      await handleSplit(selectedFile, sizeKey, wallDimensions);
    }
  };

  const handleWallDimensionsChange = async (dimensions: WallDimensions) => {
    setWallDimensions(dimensions);
    if (selectedFile) {
      await handleSplit(selectedFile, selectedSizeKey, dimensions);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPages([]);
    setRows(0);
    setCols(0);
    setWallDimensions({
      width: 0,
      height: 0,
      unit: 'cm',
    });
    setOriginalImageDimensions(null);
    setScaleFactor(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Image Splitter</h1>
              <p className="text-xs text-gray-400">Split images into printable pages</p>
            </div>
          </div>
          
          {pages.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Image
            </button>
          )}
        </div>
      </header>

      {pages.length === 0 ? (
        /* Upload View */
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Split Your Image Into Pages
            </h2>
            <p className="text-gray-400 text-lg">
              Upload an image and split it into printable A4, A3, or custom size pages
            </p>
          </div>

          <div className="space-y-8">
            <ImageUploader onImageSelect={handleImageSelect} />
            
            <PageSizeSelector
              selectedSize={selectedSizeKey}
              onSizeChange={setSelectedSizeKey}
            />

            {previewUrl && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-3">Preview</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-3 py-8">
                <svg className="w-6 h-6 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-gray-300">Splitting image...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Editor View */
        <div className="h-[calc(100vh-73px)] flex">
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            <CollageEditor
              pages={pages}
              pageSize={selectedPageSize}
              onPagesChange={setPages}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-800 bg-gray-900/50 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Original Image Preview */}
              {previewUrl && (
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">Original Image</p>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* Page Size Selector */}
              <PageSizeSelector
                selectedSize={selectedSizeKey}
                onSizeChange={handleSizeChange}
              />

              {/* Wall Settings */}
              <WallSettings
                wallDimensions={wallDimensions}
                onDimensionsChange={handleWallDimensionsChange}
              />

              {/* Export Panel */}
              <ExportPanel
                pages={pages}
                pageSize={selectedPageSize}
                rows={rows}
                cols={cols}
                wallDimensions={wallDimensions}
                scaleFactor={scaleFactor}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
