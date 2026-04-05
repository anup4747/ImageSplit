'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, MousePointer2 } from 'lucide-react';
import { SplitPage, PageSize } from '@/types';
import PageCard from './PageCard';
import { calculateTotalJoinedDimensions } from '@/lib/dimension-calculator';
import { createPageFromImageFile } from '@/lib/page-utils';

interface CollageEditorProps {
  pages: SplitPage[];
  pageSize: PageSize;
  onPagesChange: (pages: SplitPage[]) => void;
}

export interface CollageEditorHandle {
  scale: number;
  canUndo: boolean;
  canRedo: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetView: () => void;
  undo: () => void;
  redo: () => void;
}

const CollageEditor = forwardRef<CollageEditorHandle, CollageEditorProps>(
  function CollageEditor({ pages, pageSize, onPagesChange }, ref) {
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

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

    const zoomIn = () => {
      setScale((prev) => clamp(prev * 1.2, 0.25, 4));
    };

    const zoomOut = () => {
      setScale((prev) => clamp(prev / 1.2, 0.25, 4));
    };

    const resetView = () => {
      setScale(1);
      setPanOffset({ x: 0, y: 0 });
    };

    const zoomToFit = () => {
      if (!containerRef.current || pages.length === 0) {
        resetView();
        return;
      }
      // Calculate bounding box of all pages
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      pages.forEach((page) => {
        const sf = page.scaleFactor ?? 1;
        const w = page.width * sf * 0.15;
        const h = page.height * sf * 0.15;
        minX = Math.min(minX, page.x);
        minY = Math.min(minY, page.y);
        maxX = Math.max(maxX, page.x + w);
        maxY = Math.max(maxY, page.y + h);
      });

      const contentW = maxX - minX;
      const contentH = maxY - minY;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 80;
      const fitScale = Math.min(
        (rect.width - padding) / contentW,
        (rect.height - padding) / contentH,
        2
      );
      const newScale = clamp(fitScale, 0.25, 2);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setScale(newScale);
      setPanOffset({
        x: rect.width / 2 - centerX * newScale,
        y: rect.height / 2 - centerY * newScale,
      });
    };

    // Expose controls to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        scale,
        canUndo,
        canRedo,
        zoomIn,
        zoomOut,
        zoomToFit,
        resetView,
        undo: handleUndo,
        redo: handleRedo,
      }),
      [scale, canUndo, canRedo, history, historyIndex, pages]
    );

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
      // prevent scrolling of the page
      e.preventDefault();

      // Shift+scroll = horizontal pan only
      if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        setPanOffset((p) => ({ x: p.x - e.deltaY, y: p.y }));
        return;
      }

      // Figma-style: regular scroll = zoom centered on cursor
      // Also handles Ctrl/Cmd+scroll and pinch gestures
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Mouse position relative to the container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Determine zoom factor — finer for Ctrl (trackpad pinch) vs coarser for scroll
      const isCtrl = e.ctrlKey || e.metaKey;
      const sensitivity = isCtrl ? 0.01 : 0.002;
      const deltaFactor = Math.pow(2, -e.deltaY * sensitivity);

      setScale((prevScale) => {
        const newScale = clamp(prevScale * deltaFactor, 0.25, 4);
        if (newScale === prevScale) return prevScale;

        // Zoom towards cursor: keep the point under the mouse fixed
        // worldPoint = (mouseX - panX) / oldScale
        // After zoom: mouseX = worldPoint * newScale + newPanX
        // => newPanX = mouseX - worldPoint * newScale
        //            = mouseX - (mouseX - panX) / oldScale * newScale
        //            = mouseX - (mouseX - panX) * (newScale / oldScale)
        const ratio = newScale / prevScale;
        setPanOffset((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * ratio,
          y: mouseY - (mouseY - prevPan.y) * ratio,
        }));
        return newScale;
      });
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
          className="flex-1 overflow-hidden relative"
          style={{
            cursor: isPanning ? 'grabbing' : spacePressed ? 'grab' : 'default',
            touchAction: 'none',
            background: '#f8f9fb',
          }}
        >
          {/* Dot-pattern background */}
          <div
            className="canvas-bg absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1px)`,
              backgroundSize: `${24 * scale}px ${24 * scale}px`,
              backgroundPosition: `${panOffset.x % (24 * scale)}px ${panOffset.y % (24 * scale)}px`,
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
                panOffset={panOffset}
                onSelect={() => setSelectedPageId(page.id)}
                onPositionChange={(x, y) => handlePositionChange(page.id, x, y)}
                onRotationChange={(rotation) => handleRotationChange(page.id, rotation)}
                onScaleChange={(sf) => handleScaleChange(page.id, sf)}
                onBringToFront={() => handleBringToFront(page.id)}
                onDragEnd={() => pushHistory(pages)}
              />
            ))}
          </div>

          {/* Empty state */}
          {pages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-lg shadow-indigo-100/50"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <ImagePlus className="w-9 h-9 text-indigo-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500">No pages yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an image or drop one here to begin
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Bottom-left info bar */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm">
              <MousePointer2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Scroll to zoom at cursor</span>
              <span className="text-slate-300">•</span>
              <span>Space+drag to pan</span>
              <span className="text-slate-300">•</span>
              <span>Drag pages to move</span>
            </div>
            {pages.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                <span className="font-semibold text-indigo-600">{pages.length}</span>
                <span className="text-slate-500">
                  {pages.length === 1 ? 'page' : 'pages'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{pageSize.name}</span>
                {joinedDimensions && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-indigo-500 font-medium">
                      📐 {joinedDimensions.width}×{joinedDimensions.height}mm
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default CollageEditor;
