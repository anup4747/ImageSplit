'use client';

import { useState, useRef, useEffect } from 'react';
import { SplitPage, PageSize } from '@/types';
import PageCard from './PageCard';
import { calculateTotalJoinedDimensions } from '@/lib/dimension-calculator';
import { createPageFromImageFile } from '@/lib/page-utils';

interface CollageEditorProps {
  pages: SplitPage[];
  pageSize: PageSize;
  onPagesChange: (pages: SplitPage[]) => void;
}

export default function CollageEditor({ pages, pageSize, onPagesChange }: CollageEditorProps) {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<SplitPage[][]>([pages]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Reset history when parent supplies a brand-new pages set (e.g., split result)
  useEffect(() => {
    setHistory([pages]);
    setHistoryIndex(0);
  }, [pages.length]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Keyboard shortcuts for undo/redo (Ctrl/Cmd + Z / Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, history, historyIndex]);

  const pushHistory = (prevPages: SplitPage[]) => {
    setHistory((h) => {
      const upTo = h.slice(0, historyIndex + 1);
      const next = [...upTo, prevPages];
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    onPagesChange(history[newIndex]);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    onPagesChange(history[newIndex]);
  };

  const handlePositionChange = (pageId: string, x: number, y: number) => {
    onPagesChange(pages.map((p) => (p.id === pageId ? { ...p, x, y } : p)));
  };

  const handleRotationChange = (pageId: string, rotation: number) => {
    pushHistory(pages);
    onPagesChange(pages.map((p) => (p.id === pageId ? { ...p, rotation } : p)));
  };

  const handleScaleChange = (pageId: string, scaleFactor: number) => {
    pushHistory(pages);
    onPagesChange(pages.map((p) => (p.id === pageId ? { ...p, scaleFactor } : p)));
  };

  const handleBringToFront = (pageId: string) => {
    pushHistory(pages);
    const maxZ = Math.max(...pages.map((p) => p.zIndex));
    onPagesChange(pages.map((p) => (p.id === pageId ? { ...p, zIndex: maxZ + 1 } : p)));
  };

  const handleDeleteSelected = () => {
    if (selectedPageId) {
      pushHistory(pages);
      onPagesChange(pages.filter((p) => p.id !== selectedPageId));
      setSelectedPageId(null);
    }
  };

  // Calculate grid dimensions
  const rows = Math.max(...pages.map((p) => p.row), 0) + 1;
  const cols = Math.max(...pages.map((p) => p.col), 0) + 1;
  const joinedDimensions =
    pages.length > 0 ? calculateTotalJoinedDimensions(pages, pageSize, rows, cols) : null;

  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

  const addPage = async (file: File) => {
    try {
      const newPage = await createPageFromImageFile(file);
      // assign zIndex based on current length
      newPage.zIndex = pages.length;
      onPagesChange([...pages, newPage]);
    } catch (err) {
      console.error('Failed to add page from file', err);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom when Ctrl/Cmd (or pinch on many devices) is used. Otherwise pan.
    const isZoomGesture = e.ctrlKey || e.metaKey;
    if (isZoomGesture) {
      e.preventDefault();
      const deltaFactor = e.deltaY > 0 ? 0.9 : 1.1;

      const rect = containerRef.current?.getBoundingClientRect();
      const cx = rect ? e.clientX - rect.left : 0;
      const cy = rect ? e.clientY - rect.top : 0;

      setScale((prevScale) => {
        const newScale = clamp(prevScale * deltaFactor, 0.25, 2);

        // pan' = pan + (cursor - pan) * (1 - newScale/prevScale)
        setPanOffset((prevPan) => ({
          x: prevPan.x + (cx - prevPan.x) * (1 - newScale / prevScale),
          y: prevPan.y + (cy - prevPan.y) * (1 - newScale / prevScale),
        }));

        return newScale;
      });

      return;
    }

    // Horizontal scroll when Shift is held
    if (e.shiftKey) {
      e.preventDefault();
      setPanOffset((p) => ({ x: p.x - e.deltaY, y: p.y }));
      return;
    }

    // Default: vertical pan (scroll wheel)
    e.preventDefault();
    setPanOffset((p) => ({ x: p.x, y: p.y - e.deltaY }));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === containerRef.current ||
      (e.target as HTMLElement).classList.contains('canvas-bg')
    ) {
      setSelectedPageId(null);
      if (e.button === 1 || (e.button === 0 && (e.altKey || spacePressed))) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    setScale((prevScale) => {
      const target = prevScale < 1.25 ? 1.5 : 1;
      setPanOffset((prevPan) => {
        const contentX = (cx - prevPan.x) / prevScale;
        const contentY = (cy - prevPan.y) / prevScale;
        return {
          x: cx - contentX * target,
          y: cy - contentY * target,
        };
      });
      return target;
    });
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

  // Spacebar to enable pan (hold)
  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(true);
      }

      // delete/backspace removes selected page
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageId) {
        onPagesChange(pages.filter((p) => p.id !== selectedPageId));
        setSelectedPageId(null);
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    const onBlur = () => setSpacePressed(false);

    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      window.removeEventListener('blur', onBlur);
    };
  }, [selectedPageId, pages, onPagesChange]);


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      addPage(file);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Canvas */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Image pages editor canvas. Drag pages to reposition, use arrow keys to move selected page, scroll to zoom, Alt+drag to pan; drop image to add"
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onDoubleClick={handleDoubleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex-1 overflow-hidden relative bg-white"
        style={{
          cursor: isPanning ? 'grabbing' : spacePressed ? 'grab' : 'default',
          touchAction: 'none',
        }}
      >

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
              panOffset={panOffset}
              onSelect={() => setSelectedPageId(page.id)}
              onPositionChange={(x, y) => handlePositionChange(page.id, x, y)}
              onRotationChange={(rotation) => handleRotationChange(page.id, rotation)}
              onScaleChange={(sf) => handleScaleChange(page.id, sf)}
              onBringToFront={() => handleBringToFront(page.id)}
              onDragEnd={() => pushHistory(pages)}
            />
          ))}
          {pages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
              <span>Drop an image to begin</span>
            </div>
          )}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-700 bg-white/90 px-3 py-2 rounded-lg space-y-1 shadow">
          <p>Drag pages to move • Pinch/Ctrl+Scroll to zoom • Alt/Space+drag to pan</p>
          <p>
            {pages.length} pages • {pageSize.name} format
          </p>
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
