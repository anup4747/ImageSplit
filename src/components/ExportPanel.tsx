'use client';

import { useState } from 'react';
import { SplitPage, PageSize } from '@/types';
import { WallDimensions } from './WallSettings';
import { downloadImagesAsZip, downloadPDFsAsZip } from '@/lib/zip-utils';
import { calculateTotalJoinedDimensions, checkWallFit } from '@/lib/dimension-calculator';

interface ExportPanelProps {
  pages: SplitPage[];
  pageSize: PageSize;
  rows: number;
  cols: number;
  wallDimensions?: WallDimensions;
  scaleFactor?: number;
}

export default function ExportPanel({
  pages,
  pageSize,
  rows,
  cols,
  wallDimensions,
  scaleFactor = 1,
}: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'images' | 'pdfs' | null>(null);

  const joinedDimensions = calculateTotalJoinedDimensions(pages, pageSize, rows, cols);
  const wallFitInfo = wallDimensions ? checkWallFit(joinedDimensions, wallDimensions) : null;

  const handleExportImages = async () => {
    setIsExporting(true);
    setExportType('images');
    try {
      await downloadImagesAsZip(pages);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExportPDFs = async () => {
    setIsExporting(true);
    setExportType('pdfs');
    try {
      await downloadPDFsAsZip(pages, pageSize);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white/50 rounded-xl border border-gray-300">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Split Info</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-100/50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Pages</p>
            <p className="text-xl font-bold text-gray-900">{pages.length}</p>
          </div>
          <div className="bg-gray-100/50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Grid</p>
            <p className="text-xl font-bold text-gray-900">
              {cols}×{rows}
            </p>
          </div>
          <div className="bg-gray-100/50 rounded-lg p-3 col-span-2">
            <p className="text-gray-500 text-xs">Page Size</p>
            <p className="text-lg font-semibold text-gray-900">
              {pageSize.name} ({pageSize.width}×{pageSize.height}mm)
            </p>
          </div>
          <div className="bg-gray-100/50 rounded-lg p-3 col-span-2">
            <p className="text-gray-500 text-xs">Joined Image Size</p>
            <p className="text-lg font-semibold text-gray-900">
              {joinedDimensions.width}×{joinedDimensions.height}mm
            </p>
          </div>
          {scaleFactor !== 1 && (
            <div className="bg-violet-100/30 rounded-lg p-3 col-span-2 border border-violet-300/50">
              <p className="text-gray-500 text-xs">Image Scaling</p>
              <p className="text-lg font-semibold text-violet-700">
                {Math.round(scaleFactor * 100)}% of original
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wall Fit Status */}
      {wallFitInfo && wallDimensions && (wallDimensions.width > 0 || wallDimensions.height > 0) && (
        <div
          className={`p-4 rounded-xl border transition-all ${
            wallFitInfo.status === 'fits'
              ? 'bg-emerald-100/30 border-emerald-300/50'
              : wallFitInfo.status === 'warning'
                ? 'bg-yellow-100/30 border-yellow-300/50'
                : 'bg-red-100/30 border-red-300/50'
          }`}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l-2 2m0 0l7-7 7 7"
              />
            </svg>
            Wall Fit Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Joined Image:</span>
              <span
                className={`font-semibold ${wallFitInfo.fits ? 'text-emerald-700' : 'text-red-700'}`}
              >
                {joinedDimensions.width}×{joinedDimensions.height}mm
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wall Space:</span>
              <span className="font-semibold text-blue-700">
                {Math.round(
                  wallDimensions.width *
                    (wallDimensions.unit === 'cm' ? 10 : wallDimensions.unit === 'm' ? 1000 : 304.8)
                )}
                ×
                {Math.round(
                  wallDimensions.height *
                    (wallDimensions.unit === 'cm' ? 10 : wallDimensions.unit === 'm' ? 1000 : 304.8)
                )}
                mm
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <p
                className={`text-xs font-medium ${
                  wallFitInfo.status === 'fits'
                    ? 'text-emerald-700'
                    : wallFitInfo.status === 'warning'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                }`}
              >
                {wallFitInfo.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleExportImages}
          disabled={isExporting}
          className={`
            w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
            flex items-center justify-center gap-2 cursor-pointer
            ${
              isExporting && exportType === 'images'
                ? 'bg-gray-300 text-gray-600 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25'
            }
          `}
        >
          {isExporting && exportType === 'images' ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Export as Images (ZIP)
            </>
          )}
        </button>

        <button
          onClick={handleExportPDFs}
          disabled={isExporting}
          className={`
            w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
            flex items-center justify-center gap-2 cursor-pointer
            ${
              isExporting && exportType === 'pdfs'
                ? 'bg-gray-700 text-gray-400 cursor-wait'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
            }
          `}
        >
          {isExporting && exportType === 'pdfs' ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
              Generating PDFs...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Export as PDFs (ZIP)
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        PDFs are print-ready at {pageSize.name} size
      </p>
    </div>
  );
}
