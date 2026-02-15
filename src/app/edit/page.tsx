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
              <h1 className="text-xl font-bold">Edit Wallframe</h1>
              <p className="text-xs text-gray-400">Arrange and customize your wall art</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/upload')}
              className="px-4 py-2 text-sm bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </button>
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
        </div>
      </header>

      {pages.length === 0 ? (
        /* Loading/Splitting View */
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-blue-400" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Preparing Your Wallframe
            </h2>
            <p className="text-gray-600 text-lg">Splitting your image into printable pages...</p>
          </div>

          <div className="space-y-8">
            {previewUrl && (
              <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-sm">
                <p className="text-sm text-gray-600 mb-3">Original Image</p>
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-3 py-8">
                <svg
                  className="w-6 h-6 animate-spin text-violet-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-gray-700">Splitting image...</span>
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
          <div className="w-80 border-l border-gray-200 bg-white/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Original Image Preview */}
              {previewUrl && (
                <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-sm">
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
