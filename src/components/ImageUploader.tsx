"use client";

import { useCallback, useState } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function ImageUploader({
  onImageSelect,
  isLoading = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onImageSelect(files[0]);
      }
    },
    [onImageSelect],
  );

  return (
    <div
      onDragOver={isLoading ? undefined : handleDragOver}
      onDragLeave={isLoading ? undefined : handleDragLeave}
      onDrop={isLoading ? undefined : handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out
        ${
          isLoading
            ? "border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-60"
            : isDragging
              ? "border-violet-500 bg-violet-500/10 scale-[1.02] cursor-pointer"
              : "border-gray-600 hover:border-violet-400 hover:bg-gray-800/50 cursor-pointer"
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          {isLoading ? (
            <svg
              className="w-8 h-8 text-white animate-spin"
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
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-lg font-medium text-white">
            {isLoading ? "Processing image..." : "Drop your image here"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {isLoading ? "Please wait" : "or click to browse"}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {isLoading
            ? "Splitting image into pages..."
            : "Supports PNG, JPG, WEBP"}
        </p>
      </div>
    </div>
  );
}
