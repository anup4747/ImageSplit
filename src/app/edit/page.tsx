'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import PageSizeSelector from '@/components/PageSizeSelector';
import CollageEditor from '@/components/CollageEditor';
import ExportPanel from '@/components/ExportPanel';
import WallSettings, { WallDimensions } from '@/components/WallSettings';
import { createPageFromImageFile } from '@/lib/page-utils';
// splitting logic removed - focusing on UI only
import { PAGE_SIZES, SplitPage, PageSize } from '@/types';

export default function EditPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSizeKey, setSelectedSizeKey] = useState<string>('A4');
  // page-related state remains for UI but will not be populated by splitting
  const [pages, setPages] = useState<SplitPage[]>([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  // whenever pages change, recalc grid dims
  useEffect(() => {
    setRows(pages.length > 0 ? Math.max(...pages.map((p) => p.row), 0) + 1 : 0);
    setCols(pages.length > 0 ? Math.max(...pages.map((p) => p.col), 0) + 1 : 0);
  }, [pages]);
  // preview image (loaded from localStorage) - no splitting will occur
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wallDimensions, setWallDimensions] = useState<WallDimensions>({
    width: 0,
    height: 0,
    unit: 'cm',
  });
  // other states retained for ExportPanel compatibility
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isApplyingWallDimensions, setIsApplyingWallDimensions] = useState(false);

  const selectedPageSize: PageSize = PAGE_SIZES[selectedSizeKey];

  // Load image data from localStorage on component mount and set preview
  useEffect(() => {
    const storedImage = localStorage.getItem('selectedImage');
    if (storedImage) {
      try {
        const imageData = JSON.parse(storedImage);
        setPreviewUrl(imageData.previewUrl);
        // optionally set selectedFile if needed later
      } catch (error) {
        console.error('Failed to load stored image:', error);
      }
    }
  }, []);

  // when preview becomes available, create initial page
  useEffect(() => {
    if (previewUrl && pages.length === 0) {
      const makePage = async () => {
        try {
          let file = selectedFile;
          if (!file) {
            const resp = await fetch(previewUrl);
            const blob = await resp.blob();
            file = new File([blob], 'image.png', { type: blob.type });
          }
          if (file) {
            const page = await createPageFromImageFile(file);
            setPages([page]);
          }
        } catch (err) {
          console.error('Error creating initial page', err);
        }
      };
      makePage();
    }
  }, [previewUrl, selectedFile, pages.length]);

  //Splitting removed - no longer needed

  // splitting removed - placeholder for future UI interactions

  const handleSizeChange = (sizeKey: string) => {
    setSelectedSizeKey(sizeKey);
    // no splitting performed
  };

  const handleWallDimensionsChange = async (dimensions: WallDimensions) => {
    setIsApplyingWallDimensions(true);
    try {
      setWallDimensions(dimensions);
      // no split performed
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
    localStorage.removeItem('selectedImage');
    router.push('/upload');
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans selection:bg-indigo-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/50 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => router.push('/upload')}
            className="group flex items-center gap-3 cursor-pointer bg-slate-100 border border-slate-300 backdrop-blur-md hover:bg-slate-200 rounded-full px-4 py-2 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium text-slate-700">Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Edit Wallframe</h1>
              <p className="text-xs text-slate-500">Arrange and customize your wall art</p>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.main
        className="relative z-10 flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Editor View (UI focus) */}
        <div className="flex-1 flex w-full overflow-hidden">
          {/* Main Editor Area (canvas) */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
            <div className="flex-1">
              <div className="h-full bg-white shadow-xl overflow-auto">
                <CollageEditor pages={pages} pageSize={selectedPageSize} onPagesChange={setPages} />
              </div>
            </div>
          </div>

          {/* Sidebar (right) */}
          <aside className="w-80 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl overflow-auto">
            <div className="space-y-6">
              {previewUrl && (
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 mb-3">Original Image</p>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full rounded-lg object-contain"
                  />
                </div>
              )}

              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <PageSizeSelector selectedSize={selectedSizeKey} onSizeChange={handleSizeChange} />
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <WallSettings
                  wallDimensions={wallDimensions}
                  onDimensionsChange={handleWallDimensionsChange}
                  isApplying={isApplyingWallDimensions}
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200">
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
          </aside>

          {/* removed duplicate canvas - single canvas on the left is used */}
        </div>
      </motion.main>
    </main>
  );
}
