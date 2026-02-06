# Wall Dimensions Feature - Complete Guide

## Overview
The Wall Dimensions feature is a **smart auto-scaling system** that automatically resizes your image and recalculates page splits to perfectly fill your wall space. No more printing too many pages or having an image that's too small - the app calculates exactly how many pages you need!

## How It Works - Two Modes

### Mode 1: Basic - Check if Image Fits (No Wall Dimensions)
1. Upload image
2. Choose page size (A4, A3, etc.)
3. Image is split into pages
4. See total dimensions and export

### Mode 2: Smart - Auto-Scale for Wall (With Wall Dimensions)
1. Enter your wall dimensions (W × H)
2. Upload image
3. App **automatically**:
   - Calculates optimal image size to fill wall
   - Resizes image to that size
   - Recalculates page grid
   - Shows exact number of pages needed
4. Everything fits perfectly!

## Detailed Workflow

### Step 1: Set Wall Dimensions (Optional but Recommended)
In the editor sidebar, expand "Wall Dimensions":
- **Width**: Horizontal space on your wall
- **Height**: Vertical space on your wall  
- **Unit**: cm, m (meters), or ft (feet)

**Example**: Wall that's 2 meters × 1.5 meters
→ Enter: 200 cm × 150 cm

### Step 2: Upload Your Image
- Click upload or drag-and-drop your image
- Image preview appears
- If wall dimensions are set: **Image automatically rescales**
- If not: Uses original image size

### Step 3: Choose Page Size
Select from A4, A3, Letter, Legal (or stick with default A4)

**What happens**:
- If wall dimensions are set: Pages recalculate instantly
- Shows new page grid (e.g., 3×2 instead of 4×3)
- Total image size updates to match wall

### Step 4: Review & Export
Check the sidebar:
- **Split Info**: Pages needed, grid layout, joined image size
- **Image Scaling**: Shows % of original (if rescaled)
- **Wall Fit Status**: ✓ Fits perfectly / ⚠️ Warning / ❌ Overflow
- Export as PDFs or Images

## Smart Scaling Examples

### Example 1: Small Wall
```
Wall: 100cm × 80cm (small wall area)
Original Image: 3000×2400px

Result:
- Image rescaled to ~50% (50cm × 40cm display size)
- Only 2×2 = 4 pages needed (instead of 6×5 = 30 pages!)
- Joined result: 100cm × 80cm (perfect fit)
```

### Example 2: Large Wall
```
Wall: 300cm × 200cm (large feature wall)
Original Image: 3000×2400px

Result:
- Image rescaled to 300% (9000×7200px)
- Needs 5×4 = 20 pages
- Joined result: 2995×2390mm (fills wall nearly perfectly)
```

### Example 3: No Wall Set (Original Size)
```
Wall: Not set
Original Image: 3000×2400px, A4 pages

Result:
- No scaling (image remains 3000×2400px)
- Split into 4×3 = 12 pages (based on original)
- Joined result: 1500×1200mm
```

## Key Features

### 🎯 Automatic Calculation
- Set wall dimensions → App calculates required pages
- Change page size → Automatic recalculation
- Update wall dimensions → Instant resplitting

### 📐 Perfect Fit
- Image scaled to use maximum wall space
- Maintains original aspect ratio
- All pages printed with proper overlap

### 🔄 Real-time Feedback
- See scaling % in Export Panel
- Watch page grid change in real-time
- View total dimensions as you adjust

### 📊 Smart Status Messages
- ✓ "Perfect fit! Space: +500mm W, +300mm H"
- ⚠️ "Image slightly exceeds wall. Need -200mm width"
- ❌ "Image too large! Need -1000mm width, -500mm height"

## Technical Implementation

### Image Rescaling Logic
1. **Get original image dimensions** (width × height)
2. **Calculate optimal size** to fit wall:
   - Factor in page overlap (15%)
   - Consider aspect ratio
   - Maximize use of wall space
3. **Rescale image** to calculated dimensions
4. **Re-split** rescaled image into pages
5. **Display** new page grid and dimensions

### Calculations

**DPI Conversion** (96 DPI standard):
```
96 pixels = 25.4 mm
1 pixel = 0.264583 mm
1 mm = 3.779528 pixels
```

**Optimal Image Size**:
```
If wall = 2000mm × 1500mm
And image aspect = 1.25 (width/height)

Fitting by width: 2000mm width → 1600mm height
Fitting by height: 1500mm height → 1875mm width (exceeds!)

Result: Use width-based: 2000 × 1600 mm
Scale factor: (2000 / original_width)
```

**Page Grid Calculation**:
```
Page width in mm = page_width_px / (96/25.4)
Effective width = page_width_mm × (1 - 0.15)  // 15% overlap

Cols needed = ceil(target_width / effective_width)
Rows needed = ceil(target_height / effective_height)
```

**Final Joined Dimensions**:
```
Total Width = (effective_width × cols) + (page_width_mm × 0.15)
Total Height = (effective_height × rows) + (page_height_mm × 0.15)
```

## Files Changed

### New/Modified Files:
- **`src/lib/dimension-calculator.ts`** (Enhanced)
  - `calculateOptimalImageSize()` - NEW: Calculates target size + scale factor
  - `rescaleImage()` - NEW: Canvas-based image resizing
  - `calculateRequiredPages()` - Already existed
  - `checkWallFit()` - Already existed

- **`src/app/page.tsx`** (Enhanced)
  - Added `originalImageDimensions` state
  - Added `scaleFactor` state
  - Updated `handleSplit()` to rescale image based on wall
  - Added `handleWallDimensionsChange()` to trigger resplit
  - Now passes `scaleFactor` to ExportPanel

- **`src/components/ExportPanel.tsx`** (Enhanced)
  - Added `scaleFactor` prop
  - Shows "Image Scaling: X% of original" when rescaled
  - Displays calculation info

- **`src/components/CollageEditor.tsx`** (Enhanced)
  - Shows page grid and joined dimensions in info overlay

## Use Cases

### 1. **Exact Wall Filling**
"I want to fill my 2m × 1.5m wall perfectly"
- Set: 200cm × 150cm
- Upload photo
- Get: Exact page count + sizing info
- Print & hang with confidence

### 2. **Photo Collage**
"I have 4 small photos to arrange on wall"
- Measure combined desired size: 100cm × 100cm
- Set wall dimensions
- Upload stitched image
- Get: 2×2 grid (4 pages) that fills space

### 3. **Poster Creation**
"Print a movie poster for bedroom wall"
- Wall space: 80cm × 120cm
- Upload poster image
- App auto-scales to fit perfectly
- Print exact number of pages needed

### 4. **Large Format Art**
"Create a 3×3 page mural"
- Set wall: 300cm × 300cm (9 page grid)
- Upload 3000×3000px image
- App scales perfectly
- All 9 pages fit together seamlessly

## Advanced: Manual Override

Currently, the app automatically scales. For manual control:
1. Don't set wall dimensions
2. Upload any size image
3. Manual page size selection
4. Edit pages freely in editor

**Future**: Add toggle for "Auto-scale mode" vs "Manual mode"

## Troubleshooting

**Q: Image looks smaller/larger than before?**
A: If wall dimensions are set, image is rescaled to fill wall. This is intentional! Unset wall dimensions to use original size.

**Q: Wrong number of pages?**
A: Check:
1. Wall dimensions are set correctly
2. Page size is appropriate for wall
3. Image aspect ratio (portrait vs landscape)

**Q: Scaling looks wrong?**
A: The system maintains aspect ratio perfectly. If result seems odd, verify:
1. Original image dimensions
2. Wall dimensions in correct unit
3. Page size in settings

**Q: Can I see the scale factor?**
A: Yes! Check Export Panel → "Image Scaling: X% of original"

## Tips & Tricks

### For Best Results:
1. ✓ Measure your wall accurately
2. ✓ Use high-resolution images (3000×3000px minimum)
3. ✓ Set wall dimensions BEFORE uploading image
4. ✓ Use larger page sizes (A3, not A5) for fewer pages
5. ✓ Leave 5-10cm margin around wall for final adjustments

### Testing Scaling:
1. Upload test image
2. Set wall: 50cm × 50cm
3. Watch it scale down (should be <20% of original)
4. Set wall: 300cm × 300cm
5. Watch it scale up (should be 150-200% of original)
6. Notice page count adjusts automatically

## Future Enhancements

1. **Preview canvas**: See how image will look on wall
2. **Custom margins**: Add border around final image
3. **Manual scale override**: Set exact scale % 
4. **Batch operations**: Process multiple images
5. **Save configurations**: Remember wall dimensions/settings
6. **Advanced grid**: Non-rectangular page arrangements

## Mathematical Foundation

The feature uses vector geometry and aspect ratio preservation:

```
Given:
- Original image: W₀ × H₀, aspect ratio A = W₀/H₀
- Wall space: W_wall × H_wall
- Page dimensions: P_w × P_h

Find: Optimal image size (W_target × H_target)

Logic:
1. Try fitting by width: W_target = W_wall, H_target = W_wall/A
2. If H_target > H_wall, scale by height instead
3. Use smaller result (conserves wall space)

Result: Image fills wall optimally while maintaining aspect ratio
```

## Performance Notes

- Image rescaling: ~100-500ms (depends on size)
- Re-splitting: ~200-1000ms (depends on page count)
- Canvas rendering: Hardware accelerated
- Memory: Temporary (rescaled image discarded after split)
