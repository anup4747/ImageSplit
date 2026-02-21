'use client';

import { useRef, useState, useEffect } from 'react';
import { SplitPage } from '@/types';

interface PageCardProps {
  page: SplitPage;
  isSelected: boolean;
  scale: number;
  panOffset?: { x: number; y: number };
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onRotationChange: (rotation: number) => void;
  onScaleChange: (scale: number) => void;
  onBringToFront: () => void;
  onDragEnd?: () => void;
}

export default function PageCard({
  page,
  isSelected,
  scale,
  panOffset = { x: 0, y: 0 },
  onSelect,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onBringToFront,
  onDragEnd,
}: PageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Keyboard navigation: arrow keys to move selected page
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1; // Hold Shift for larger steps
      let moved = false;
      let newX = page.x;
      let newY = page.y;

      if (e.key === 'ArrowUp') {
        newY -= step;
        moved = true;
      } else if (e.key === 'ArrowDown') {
        newY += step;
        moved = true;
      } else if (e.key === 'ArrowLeft') {
        newX -= step;
        moved = true;
      } else if (e.key === 'ArrowRight') {
        newX += step;
        moved = true;
      }

      if (moved) {
        e.preventDefault();
        onPositionChange(newX, newY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, page.x, page.y, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
    onBringToFront();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (page.x * scale + panOffset.x),
      y: e.clientY - (page.y * scale + panOffset.y),
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = (e.clientX - dragStart.x - panOffset.x) / scale;
      const newY = (e.clientY - dragStart.y - panOffset.y) / scale;
      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (typeof onDragEnd === 'function') onDragEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, scale, onPositionChange]);

  const sf = page.scaleFactor ?? 1;
  const displayWidth = page.width * sf * 0.15;
  const displayHeight = page.height * sf * 0.15;

  return (
    <div
      ref={cardRef}
      role="img"
      tabIndex={isSelected ? 0 : -1}
      aria-label={`Page ${page.row + 1}-${page.col + 1} (${page.width}×${page.height}mm)${isSelected ? ' - selected' : ''}`}
      aria-selected={isSelected}
      onMouseDown={handleMouseDown}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isSelected) {
          onSelect();
          onBringToFront();
        }
      }}
      className={`
        absolute cursor-grab active:cursor-grabbing
        transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''}
        ${isDragging ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/30'}
      `}
      style={{
        left: page.x * scale,
        top: page.y * scale,
        width: displayWidth * scale,
        height: displayHeight * scale,
        transform: `rotate(${page.rotation}deg)`,
        zIndex: page.zIndex,
        transformOrigin: 'center center',
      }}
    >
      {/* image content without border */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={page.imageData}
          alt={`Page ${page.row + 1}-${page.col + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Page label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
        {page.row + 1},{page.col + 1}
      </div>

      {/* Rotation handle when selected */}
      {isSelected && (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-label="Rotate page"
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-violet-500 rounded-full cursor-pointer flex items-center justify-center hover:bg-violet-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onMouseDown={(e) => {
              e.stopPropagation();
              const cardRect = cardRef.current?.getBoundingClientRect();
              if (!cardRect) return;

              const centerX = cardRect.left + cardRect.width / 2;
              const centerY = cardRect.top + cardRect.height / 2;

              const handleRotation = (moveEvent: MouseEvent) => {
                const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
                const degrees = (angle * 180) / Math.PI + 90;
                onRotationChange(degrees);
              };

              const stopRotation = () => {
                window.removeEventListener('mousemove', handleRotation);
                window.removeEventListener('mouseup', stopRotation);
              };

              window.addEventListener('mousemove', handleRotation);
              window.addEventListener('mouseup', stopRotation);
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          {/* resize handles */}
          {['tl','tr','bl','br'].map((corner) => (
            <div
              key={corner}
              className={`absolute w-4 h-4 bg-white border border-gray-600 cursor-${corner}-resize`}
              style={{
                top: corner.includes('t') ? '-8px' : undefined,
                bottom: corner.includes('b') ? '-8px' : undefined,
                left: corner.includes('l') ? '-8px' : undefined,
                right: corner.includes('r') ? '-8px' : undefined,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const initScale = sf;
                const handleMove = (moveEvent: MouseEvent) => {
                  const dx = moveEvent.clientX - startX;
                  const dy = moveEvent.clientY - startY;
                  // project change along diagonal direction
                  const delta = (dx + dy) / 2;
                  const contentDelta = delta / (scale * 0.15);
                  let newScale = initScale + contentDelta / page.width;
                  if (newScale < 0.1) newScale = 0.1;
                  onScaleChange(newScale);
                };
                const stop = () => {
                  window.removeEventListener('mousemove', handleMove);
                  window.removeEventListener('mouseup', stop);
                };
                window.addEventListener('mousemove', handleMove);
                window.addEventListener('mouseup', stop);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
