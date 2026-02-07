"use client";

import { useState, useEffect } from "react";

export interface WallDimensions {
  width: number; // in cm
  height: number; // in cm
  unit: "cm" | "m" | "ft";
}

interface WallSettingsProps {
  wallDimensions: WallDimensions;
  onDimensionsChange: (dimensions: WallDimensions) => void;
  isApplying?: boolean;
}

export default function WallSettings({
  wallDimensions,
  onDimensionsChange,
  isApplying = false,
}: WallSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [pendingDimensions, setPendingDimensions] =
    useState<WallDimensions>(wallDimensions);

  // Sync pending dimensions when parent wallDimensions change (after successful apply)
  useEffect(() => {
    setPendingDimensions(wallDimensions);
  }, [wallDimensions]);

  const handleWidthChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setPendingDimensions({ ...pendingDimensions, width: num });
  };

  const handleHeightChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setPendingDimensions({ ...pendingDimensions, height: num });
  };

  const handleApply = () => {
    onDimensionsChange(pendingDimensions);
  };

  const hasChanges =
    pendingDimensions.width !== wallDimensions.width ||
    pendingDimensions.height !== wallDimensions.height ||
    pendingDimensions.unit !== wallDimensions.unit;

  const handleUnitChange = (unit: "cm" | "m" | "ft") => {
    // Convert current values to new unit
    let newWidth = pendingDimensions.width;
    let newHeight = pendingDimensions.height;

    // First convert to cm
    if (pendingDimensions.unit === "m") {
      newWidth *= 100;
      newHeight *= 100;
    } else if (pendingDimensions.unit === "ft") {
      newWidth *= 30.48;
      newHeight *= 30.48;
    }

    // Then convert from cm to new unit
    if (unit === "m") {
      newWidth /= 100;
      newHeight /= 100;
    } else if (unit === "ft") {
      newWidth /= 30.48;
      newHeight /= 30.48;
    }

    setPendingDimensions({
      width: Math.round(newWidth * 100) / 100,
      height: Math.round(newHeight * 100) / 100,
      unit,
    });
  };

  // Calculate wall size in cm for display
  const getWallInCm = () => {
    let w = pendingDimensions.width;
    let h = pendingDimensions.height;
    if (pendingDimensions.unit === "m") {
      w *= 100;
      h *= 100;
    } else if (pendingDimensions.unit === "ft") {
      w *= 30.48;
      h *= 30.48;
    }
    return { width: Math.round(w), height: Math.round(h) };
  };

  const wallCm = getWallInCm();

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-300"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          Wall Dimensions
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {/* Unit selector */}
          <div className="flex gap-1">
            {(["cm", "m", "ft"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => handleUnitChange(unit)}
                className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                  pendingDimensions.unit === unit
                    ? "bg-violet-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          {/* Width input */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Width</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pendingDimensions.width || ""}
                onChange={(e) => handleWidthChange(e.target.value)}
                placeholder="Width"
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              />
              <span className="text-gray-400 text-sm w-8">
                {pendingDimensions.unit}
              </span>
            </div>
          </div>

          {/* Height input */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Height</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pendingDimensions.height || ""}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder="Height"
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              />
              <span className="text-gray-400 text-sm w-8">
                {pendingDimensions.unit}
              </span>
            </div>
          </div>

          {/* Wall size info */}
          {wallCm.width > 0 && wallCm.height > 0 && (
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
              Wall: {wallCm.width} × {wallCm.height} cm
            </div>
          )}

          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={!hasChanges || isApplying}
            className={`w-full mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              isApplying
                ? "bg-gray-700 text-gray-400 cursor-wait"
                : hasChanges
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isApplying && (
              <svg
                className="w-4 h-4 animate-spin"
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
            )}
            {isApplying
              ? "Applying..."
              : hasChanges
                ? "Apply Dimensions"
                : "No Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
