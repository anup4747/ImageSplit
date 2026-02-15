'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Download,
  Zap,
  Palette,
  Code,
  Github,
  Mail,
  Play,
  Star,
  ChevronDown,
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import PageSizeSelector from '@/components/PageSizeSelector';
import CollageEditor from '@/components/CollageEditor';
import ExportPanel from '@/components/ExportPanel';
import WallSettings, { WallDimensions } from '@/components/WallSettings';
import { splitImage } from '@/lib/image-splitter';
import { calculateOptimalImageSize, rescaleImage } from '@/lib/dimension-calculator';
import { PAGE_SIZES, SplitPage, PageSize } from '@/types';

export default function EditPage() {
  const router = useRouter();
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
  const [originalImageDimensions, setOriginalImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isApplyingWallDimensions, setIsApplyingWallDimensions] = useState(false);

  const selectedPageSize: PageSize = PAGE_SIZES[selectedSizeKey];

  // Load image data from localStorage on component mount
  useEffect(() => {
    const storedImage = localStorage.getItem('selectedImage');
    if (storedImage) {
      try {
        const imageData = JSON.parse(storedImage);
        setPreviewUrl(imageData.previewUrl);

        // Auto-split the image
        handleSplitFromData(imageData);
      } catch (error) {
        console.error('Failed to load stored image:', error);
        router.push('/upload');
      }
    } else {
      router.push('/upload');
    }
  }, []);

  const handleSplitFromData = async (imageData: any) => {
    setIsProcessing(true);
    try {
      // Convert base64 to blob
      const response = await fetch(imageData.previewUrl);
      const blob = await response.blob();
      const file = new File([blob], imageData.name, { type: imageData.type });
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          setOriginalImageDimensions({ width: img.width, height: img.height });

          let fileToSplit = file;
          let scaledPreviewUrl = previewUrl;
          let newScaleFactor = 1;

          // If wall dimensions are set, calculate optimal image size and rescale
          if (wallDimensions && (wallDimensions.width > 0 || wallDimensions.height > 0)) {
            const optimalSize = calculateOptimalImageSize(
              img.width,
              img.height,
              wallDimensions,
              PAGE_SIZES[selectedSizeKey]
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

          setPreviewUrl(scaledPreviewUrl);

          // Split the image
          const result = await splitImage(fileToSplit, PAGE_SIZES[selectedSizeKey]);
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
    setIsApplyingWallDimensions(true);
    try {
      setWallDimensions(dimensions);
      if (selectedFile) {
        await handleSplit(selectedFile, selectedSizeKey, dimensions);
      }
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
    setOriginalImageDimensions(null);
    setScaleFactor(1);
    localStorage.removeItem('selectedImage');
    router.push('/upload');
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100">
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

          <div className="flex items-center gap-3">
            {pages.length > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-2 border border-slate-200"
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
        </div>
      </motion.header>

      <motion.main className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {pages.length === 0 ? (
          /* Loading/Splitting View */
          <div className="max-w-4xl mx-auto py-16">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Sparkles className="w-12 h-12 text-indigo-600" />
                </div>
              </motion.div>

              <h2 className="text-5xl font-bold mb-4 tracking-tight leading-[1.05]">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Preparing Your Wallframe
                </span>
              </h2>
              <p className="text-lg text-slate-600">Splitting your image into printable pages...</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {previewUrl && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 mb-3">Original Image</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                </div>
              )}

              <div className="flex items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-lg animate-pulse">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2v6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 22v-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.93 4.93l4.24 4.24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.07 19.07l-4.24-4.24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-700 font-medium">Splitting image...</p>
                      <p className="text-xs text-slate-500">
                        This may take a few moments for large images
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-600">Waiting to start splitting...</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Editor View */
          <div className="h-[calc(100vh-120px)] flex  w-full overflow-hidden">
            {/* Main Editor Area (canvas) */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-indigo-50 p-6 rounded-2xl overflow-hidden">
              <div className="p-2 mb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-full bg-white text-indigo-700 border border-indigo-100 shadow-sm hover:shadow-md">
                      Preview
                    </button>
                    <button className="px-3 py-2 rounded-full bg-white text-indigo-700 border border-indigo-100 shadow-sm hover:shadow-md">
                      Grid
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push('/upload')}
                      className="px-3 py-2 rounded-full bg-white text-indigo-700 border border-indigo-100 shadow-sm hover:shadow-md"
                    >
                      Change Image
                    </button>
                    {pages.length > 0 && (
                      <button
                        onClick={handleReset}
                        className="px-3 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                      >
                        New Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="h-full bg-white rounded-2xl  shadow-xl overflow-auto p-6">
                  <CollageEditor
                    pages={pages}
                    pageSize={selectedPageSize}
                    onPagesChange={setPages}
                  />
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
                  <PageSizeSelector
                    selectedSize={selectedSizeKey}
                    onSizeChange={handleSizeChange}
                  />
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
        )}
      </motion.main>
    </main>
  );
}
