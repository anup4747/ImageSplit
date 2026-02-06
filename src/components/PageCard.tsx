'use client';

import { useRef, useState, useEffect } from 'react';
import { SplitPage } from '@/types';

interface PageCardProps {
  page: SplitPage;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onRotationChange: (rotation: number) => void;
  onBringToFront: () => void;
}

export default function PageCard({
  page,
  isSelected,
  scale,
  onSelect,
  onPositionChange,
  onRotationChange,
  onBringToFront,
}: PageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
    onBringToFront();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - page.x * scale,
      y: e.clientY - page.y * scale,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = (e.clientX - dragStart.x) / scale;
      const newY = (e.clientY - dragStart.y) / scale;
      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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

  const displayWidth = page.width * 0.15;
  const displayHeight = page.height * 0.15;

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      className={`
        absolute cursor-grab active:cursor-grabbing
        transition-shadow duration-200
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
      {/* Paper with random border */}
      <div 
        className="absolute inset-0 bg-white rounded-sm overflow-hidden"
        style={{
          border: `${page.borderWidth}px solid ${page.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        <img
          src={page.imageData}
          alt={`Page ${page.row + 1}-${page.col + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      
      {/* Page label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
        {page.row + 1},{page.col + 1}
      </div>

      {/* Rotation handle when selected */}
      {isSelected && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-violet-500 rounded-full cursor-pointer flex items-center justify-center hover:bg-violet-400 transition-colors"
          onMouseDown={(e) => {
            e.stopPropagation();
            const cardRect = cardRef.current?.getBoundingClientRect();
            if (!cardRect) return;

            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;

            const handleRotation = (moveEvent: MouseEvent) => {
              const angle = Math.atan2(
                moveEvent.clientY - centerY,
                moveEvent.clientX - centerX
              );
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )}
    </div>
  );
}
