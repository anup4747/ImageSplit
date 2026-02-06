'use client';

import { PAGE_SIZES } from '@/types';

interface PageSizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function PageSizeSelector({
  selectedSize,
  onSizeChange,
}: PageSizeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300">Page Size</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(PAGE_SIZES).map(([key, size]) => (
          <button
            key={key}
            onClick={() => onSizeChange(key)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                selectedSize === key
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }
            `}
          >
            <span className="block font-semibold">{size.name}</span>
            <span className="text-xs opacity-75">
              {size.width} × {size.height}mm
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
