'use client';

import { motion } from 'framer-motion';
import {
    ZoomIn,
    ZoomOut,
    Maximize,
    RotateCcw,
    Undo2,
    Redo2,
    Hand,
    MousePointer2,
} from 'lucide-react';

interface CanvasToolbarProps {
    scale: number;
    canUndo: boolean;
    canRedo: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomToFit: () => void;
    onResetView: () => void;
    onUndo: () => void;
    onRedo: () => void;
}

export default function CanvasToolbar({
    scale,
    canUndo,
    canRedo,
    onZoomIn,
    onZoomOut,
    onZoomToFit,
    onResetView,
    onUndo,
    onRedo,
}: CanvasToolbarProps) {
    const zoomPercent = Math.round(scale * 100);

    return (
        <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl px-2 py-1.5 shadow-lg shadow-black/5"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
        >
            {/* Undo / Redo */}
            <ToolButton
                icon={<Undo2 className="w-4 h-4" />}
                label="Undo (Ctrl+Z)"
                onClick={onUndo}
                disabled={!canUndo}
            />
            <ToolButton
                icon={<Redo2 className="w-4 h-4" />}
                label="Redo (Ctrl+Shift+Z)"
                onClick={onRedo}
                disabled={!canRedo}
            />

            <Separator />

            {/* Zoom controls */}
            <ToolButton
                icon={<ZoomOut className="w-4 h-4" />}
                label="Zoom Out"
                onClick={onZoomOut}
                disabled={scale <= 0.25}
            />

            <div className="flex items-center justify-center min-w-[52px] px-2 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 select-none">
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    {zoomPercent}%
                </span>
            </div>

            <ToolButton
                icon={<ZoomIn className="w-4 h-4" />}
                label="Zoom In"
                onClick={onZoomIn}
                disabled={scale >= 4}
            />

            <Separator />

            {/* View controls */}
            <ToolButton
                icon={<Maximize className="w-4 h-4" />}
                label="Fit to View"
                onClick={onZoomToFit}
            />
            <ToolButton
                icon={<RotateCcw className="w-4 h-4" />}
                label="Reset View"
                onClick={onResetView}
            />
        </motion.div>
    );
}

function ToolButton({
    icon,
    label,
    onClick,
    disabled = false,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <motion.button
            title={label}
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150
        ${disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : active
                        ? 'bg-indigo-100 text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                }
      `}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.92 }}
        >
            {icon}
        </motion.button>
    );
}

function Separator() {
    return <div className="w-px h-5 bg-slate-200/80 mx-1" />;
}
