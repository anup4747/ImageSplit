'use client';
import { useEffect } from 'react';

export default function TrackpadZoomBlocker() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Laptop trackpads trigger 'wheel' events with ctrlKey: true for pinch-to-zoom
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 'passive: false' is the critical part to allow blocking the zoom
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return null; // This component doesn't render anything
}
