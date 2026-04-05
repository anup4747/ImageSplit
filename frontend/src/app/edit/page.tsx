'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import PageSizeSelector from '@/components/PageSizeSelector';
import CollageEditor, { CollageEditorHandle } from '@/components/CollageEditor';
import CanvasToolbar from '@/components/CanvasToolbar';
import ExportPanel from '@/components/ExportPanel';
import WallSettings, { WallDimensions } from '@/components/WallSettings';
import { createPageFromImageFile } from '@/lib/page-utils';
import { getCurrentUser } from '@/lib/user-auth';
// splitting logic removed - focusing on UI only
import { PAGE_SIZES, SplitPage, PageSize } from '@/types';

export default function EditPage() {
  const router = useRouter();
  const editorRef = useRef<CollageEditorHandle>(null);
  // force re-render so toolbar reads latest ref values
  const [, setTick] = useState(0);
  const forceTick = useCallback(() => setTick((t) => t + 1), []);
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
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // other states retained for ExportPanel compatibility
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isApplyingWallDimensions, setIsApplyingWallDimensions] = useState(false);

  const selectedPageSize: PageSize = PAGE_SIZES[selectedSizeKey];

  useEffect(() => {
    const verifySession = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/login?redirect=/edit');
        return;
      }
      setIsAuthChecked(true);
    };

    verifySession();
  }, [router]);

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

  if (!isAuthChecked) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-slate-950 text-white font-sans selection:bg-indigo-100">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 px-10 py-12 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-xl font-semibold">Checking your session…</p>
          <p className="mt-3 text-slate-400">You will be redirected to login if you are not signed in.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/50 blur-[120px]" />
      </div>

      {/* Header - Fixed Height */}
      <motion.header
        className="relative z-20 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm p-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => router.push('/upload')}
            className="group flex items-center gap-2 cursor-pointer bg-slate-100 border border-slate-200 hover:bg-slate-200 rounded-full px-4 py-2 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium text-slate-700">Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Edit Wallframe</h1>
              <p className="text-xs text-slate-500">Arrange and customize your wall art</p>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div
        className="relative z-10 flex-1 flex overflow-hidden w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Main Editor Area (canvas) - Left */}
        <div className="flex-1 overflow-hidden relative">
          {/* Floating Canvas Toolbar */}
          <CanvasToolbar
            scale={editorRef.current?.scale ?? 1}
            canUndo={editorRef.current?.canUndo ?? false}
            canRedo={editorRef.current?.canRedo ?? false}
            onZoomIn={() => { editorRef.current?.zoomIn(); forceTick(); }}
            onZoomOut={() => { editorRef.current?.zoomOut(); forceTick(); }}
            onZoomToFit={() => { editorRef.current?.zoomToFit(); forceTick(); }}
            onResetView={() => { editorRef.current?.resetView(); forceTick(); }}
            onUndo={() => { editorRef.current?.undo(); forceTick(); }}
            onRedo={() => { editorRef.current?.redo(); forceTick(); }}
          />

          {/* Canvas */}
          <div className="absolute inset-0">
            <CollageEditor ref={editorRef} pages={pages} pageSize={selectedPageSize} onPagesChange={(p) => { setPages(p); forceTick(); }} />
          </div>
        </div>

        {/* Sidebar (right) - Fixed Width, Scrollable Y */}
        <aside className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-l border-slate-200 shadow-xl overflow-y-auto relative z-20">
          <div className="p-5 space-y-6">
            {previewUrl && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Original Image
                </p>
                <div className="relative rounded-lg overflow-hidden border border-slate-100">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto max-h-[160px] object-contain bg-white"
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:bg-slate-50/50">
              <PageSizeSelector selectedSize={selectedSizeKey} onSizeChange={handleSizeChange} />
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:bg-slate-50/50">
              <WallSettings
                wallDimensions={wallDimensions}
                onDimensionsChange={handleWallDimensionsChange}
                isApplying={isApplyingWallDimensions}
              />
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:bg-slate-50/50">
              <ExportPanel
                pages={pages}
                pageSize={selectedPageSize}
                rows={rows}
                cols={cols}
                wallDimensions={wallDimensions}
                scaleFactor={scaleFactor}
              />
            </div>

            <div className="pt-4 pb-8 flex items-center justify-center">
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Start Over
              </button>
            </div>
          </div>
        </aside>
      </motion.div>
    </main>
  );
}
