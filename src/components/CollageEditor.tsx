'use client';

import { useState, useRef, useEffect } from 'react';
import { SplitPage, PageSize } from '@/types';
import PageCard from './PageCard';
import { resetPagePositions, arrangeInGrid, arrangeWithOverlap } from '@/lib/image-splitter';
import { calculateTotalJoinedDimensions } from '@/lib/dimension-calculator';

interface CollageEditorProps {
  pages: SplitPage[];
  pageSize: PageSize;
  onPagesChange: (pages: SplitPage[]) => void;
}

export default function CollageEditor({
  pages,
  pageSize,
  onPagesChange,
}: CollageEditorProps) {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePositionChange = (pageId: string, x: number, y: number) => {
    onPagesChange(
      pages.map((p) => (p.id === pageId ? { ...p, x, y } : p))
    );
  };

  const handleRotationChange = (pageId: string, rotation: number) => {
    onPagesChange(
      pages.map((p) => (p.id === pageId ? { ...p, rotation } : p))
    );
  };

  const handleBringToFront = (pageId: string) => {
    const maxZ = Math.max(...pages.map((p) => p.zIndex));
    onPagesChange(
      pages.map((p) => (p.id === pageId ? { ...p, zIndex: maxZ + 1 } : p))
    );
  };

  const handleShuffle = () => {
    onPagesChange(resetPagePositions(pages));
  };

  const handleArrangeGrid = () => {
    onPagesChange(arrangeInGrid(pages));
  };

  const handleArrangeOverlap = () => {
    onPagesChange(arrangeWithOverlap(pages));
  };

  // Calculate grid dimensions
  const rows = Math.max(...pages.map((p) => p.row), 0) + 1;
  const cols = Math.max(...pages.map((p) => p.col), 0) + 1;
  const joinedDimensions = pages.length > 0 ? calculateTotalJoinedDimensions(pages, pageSize, rows, cols) : null;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.25), 2));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setSelectedPageId(null);
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
          <button
            onClick={handleArrangeGrid}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid
          </button>
          <button
            onClick={handleArrangeOverlap}
            className="px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Overlap
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Zoom: {Math.round(scale * 100)}%</span>
          <input
            type="range"
            min="25"
            max="200"
            value={scale * 100}
            onChange={(e) => setScale(parseInt(e.target.value) / 100)}
            className="w-24 accent-violet-500"
          />
          <button
            onClick={() => setScale(1)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        className="flex-1 overflow-hidden relative bg-gray-900/50 canvas-bg"
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Grid pattern background */}
        <div 
          className="absolute inset-0 canvas-bg"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${50 * scale}px ${50 * scale}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          }}
        />

        {/* Pages container */}
        <div
          className="absolute"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {pages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              isSelected={selectedPageId === page.id}
              scale={scale}
              onSelect={() => setSelectedPageId(page.id)}
              onPositionChange={(x, y) => handlePositionChange(page.id, x, y)}
              onRotationChange={(rotation) => handleRotationChange(page.id, rotation)}
              onBringToFront={() => handleBringToFront(page.id)}
            />
          ))}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-gray-800/80 px-3 py-2 rounded-lg space-y-1">
          <p>Drag pages to move • Scroll to zoom • Alt+drag to pan</p>
          <p>{pages.length} pages • {pageSize.name} format • Grid: {cols}×{rows}</p>
          {joinedDimensions && (
            <p className="text-violet-400 font-semibold">
              📐 Joined Image: {joinedDimensions.width}×{joinedDimensions.height}mm
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
