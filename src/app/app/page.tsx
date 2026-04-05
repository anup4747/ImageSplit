'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import PageSizeSelector from '@/components/PageSizeSelector';
import CollageEditor from '@/components/CollageEditor';
import ExportPanel from '@/components/ExportPanel';
import WallSettings, { WallDimensions } from '@/components/WallSettings';
import { createPageFromImageFile } from '@/lib/page-utils';
// splitting disabled; focusing on UI only
import { PAGE_SIZES, SplitPage, PageSize } from '@/types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSizeKey, setSelectedSizeKey] = useState<string>('A4');
  // page state to satisfy UI; will remain empty
  const [pages, setPages] = useState<SplitPage[]>([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // recalc grid dims whenever pages change
  useEffect(() => {
    setRows(pages.length ? Math.max(...pages.map((p) => p.row), 0) + 1 : 0);
    setCols(pages.length ? Math.max(...pages.map((p) => p.col), 0) + 1 : 0);
  }, [pages]);
  const [wallDimensions, setWallDimensions] = useState<WallDimensions>({
    width: 0,
    height: 0,
    unit: 'cm',
  });
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isApplyingWallDimensions, setIsApplyingWallDimensions] = useState(false);

  const selectedPageSize: PageSize = PAGE_SIZES[selectedSizeKey];

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // create a page from the image and add it
    try {
      const p = await createPageFromImageFile(file);
      setPages([p]);
    } catch (err) {
      console.error('failed to add image page', err);
    }
  };

  // splitting disabled - placeholder for UI interactions
  const handleSplit = async (file: File, sizeKey: string, wallDims: WallDimensions | null) => {
    // no-op
  };

  const handleSizeChange = (sizeKey: string) => {
    setSelectedSizeKey(sizeKey);
  };

  const handleWallDimensionsChange = async (dimensions: WallDimensions) => {
    setIsApplyingWallDimensions(true);
    try {
      setWallDimensions(dimensions);
    } finally {
      setIsApplyingWallDimensions(false);
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
    setScaleFactor(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
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
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
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
            <p className="text-gray-600 text-lg">
              Upload an image and split it into printable A4, A3, or custom size pages
            </p>
          </div>

          <div className="space-y-8">
            <ImageUploader onImageSelect={handleImageSelect} isLoading={false} />

            <PageSizeSelector selectedSize={selectedSizeKey} onSizeChange={setSelectedSizeKey} />

            {previewUrl && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-3">Preview</p>
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Editor View */
        <div className="h-[calc(100vh-73px)] flex">
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            <CollageEditor pages={pages} pageSize={selectedPageSize} onPagesChange={setPages} />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-800 bg-gray-900/50 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Original Image Preview */}
              {previewUrl && (
                <div className="p-4 bg-white/50 rounded-xl border border-gray-300">
                  <p className="text-sm text-gray-600 mb-3">Original Image</p>
                  <img src={previewUrl} alt="Original" className="w-full rounded-lg" />
                </div>
              )}

              {/* Page Size Selector */}
              <PageSizeSelector selectedSize={selectedSizeKey} onSizeChange={handleSizeChange} />

              {/* Wall Settings */}
              <WallSettings
                wallDimensions={wallDimensions}
                onDimensionsChange={handleWallDimensionsChange}
                isApplying={isApplyingWallDimensions}
              />

              {/* Wall Settings */}
              <WallSettings
                wallDimensions={wallDimensions}
                onDimensionsChange={handleWallDimensionsChange}
                isApplying={isApplyingWallDimensions}
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
