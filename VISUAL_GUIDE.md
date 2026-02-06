# Visual Guide - Wall Dimensions Auto-Scaling

## 🎬 Visual Workflow

### The Complete Flow

```
USER INTERFACE
─────────────────────────────────────────────────────────

[Wall Dimensions Panel]
┌────────────────────────────┐
│ Width:   [200]   [cm]  ✓  │ ← Set FIRST
│ Height:  [150]   [cm]  ✓  │
│ Wall: 2000 × 1500 mm       │
└────────────────────────────┘
        ↓
[Upload Area]
┌────────────────────────────┐
│  Drag image or click ↓     │
│   [Upload Portrait]        │ ← Upload image
│                            │
│   File: photo.jpg          │
│   Size: 3000×2400px        │
└────────────────────────────┘
        ↓
[Processing - Automatic]
┌────────────────────────────┐
│  ⚙️ Rescaling image...      │
│  ⏱️ Calculating pages...    │
│  ✓ Ready!                  │
└────────────────────────────┘
        ↓
[Export Panel - Results]
┌────────────────────────────┐
│ Pages: 4                   │
│ Grid: 2×2                  │
│ Joined: 1950×1560mm        │
├────────────────────────────┤
│ Image Scaling: 65% ⭐      │ ← Shows scaling
├────────────────────────────┤
│ ✓ Perfect fit!             │
│ Space: +50mm H, +50mm W    │
└────────────────────────────┘
```

---

## 📊 Scaling Comparison

### Scenario Comparison

```
SCENARIO 1: Small Wall (50cm × 50cm)
───────────────────────────────────

Input Image: 3000×2400px (Large photo)
               │
               ↓
    Wall requires: 500×400px
               │
               ↓
    Scale Factor: 16.7%
               │
               ↓
    Result: 500×400px image
             └─→ 1×1 = 1 PAGE ONLY
             └─→ Perfect for small space


SCENARIO 2: Medium Wall (150cm × 100cm)
──────────────────────────────────────────

Input Image: 3000×2400px (Same photo)
               │
               ↓
    Wall requires: 1500×1200px
               │
               ↓
    Scale Factor: 50%
               │
               ↓
    Result: 1500×1200px image
             └─→ 2×2 = 4 PAGES
             └─→ Easy to manage


SCENARIO 3: Large Wall (300cm × 250cm)
──────────────────────────────────────────

Input Image: 3000×2400px (Same photo)
               │
               ↓
    Wall requires: 3000×2500px
               │
               ↓
    Scale Factor: 104%
               │
               ↓
    Result: 3000×2500px image
             └─→ 3×3 = 9 PAGES
             └─→ Impressive feature wall
```

---

## 🔄 Process Diagrams

### Image Rescaling Process

```
User Uploads Image
        ↓
   [Read Image]
   Width: 3000px
   Height: 2400px
        ↓
   [Wall Set?]
    ↙      ↘
  YES      NO
   ↓       ↓
   ↓    [Split Original]
   ↓    [Show Results]
   ↓
[Calculate Optimal Size]
   ├─ Wall: 2000×1500mm
   ├─ Aspect: 1.25
   ├─ Try width: 2000mm → 1600mm height
   ├─ Check height: 1600 > 1500? YES, too tall
   ├─ Try height: 1500mm → 1875mm width
   ├─ Check width: 1875 < 2000? YES, fits!
   └─ Result: 1875×1500mm (62% of original)
        ↓
[Rescale Image on Canvas]
   ├─ Create canvas 1875×1500px
   ├─ Draw original image scaled
   ├─ Convert to PNG data URL
   └─ Create blob from data
        ↓
[Re-split Rescaled Image]
   ├─ Grid: 2×2 pages
   ├─ Page size: A4
   └─ Total: 4 pages
        ↓
[Display Results]
   ├─ Pages: 4
   ├─ Scaling: 62%
   └─ Status: ✓ Perfect fit
```

### Page Grid Calculation

```
After rescaling image to 1875×1500px:

A4 Page in pixels: 1123×794px (at 96 DPI)
                        │
                        ↓
        Effective (with 15% overlap):
        1123 × 0.85 = 953px
        794 × 0.85 = 674px
                        │
        Need to cover: 1875×1500px
                        │
                        ↓
        Columns = ceil(1875/953) = 2
        Rows = ceil(1500/674) = 3
                        │
                        ↓
        Grid: 2×3 = 6 PAGES

Visual Layout:
┌─────┬─────┐
│  1  │  2  │ Row 1
├─────┼─────┤
│  3  │  4  │ Row 2
├─────┼─────┤
│  5  │  6  │ Row 3
└─────┴─────┘
```

---

## 📈 Scaling Ranges

```
Scale Factor Distribution:

┌─────────────────────────────────────────────────┐
│ 10%        30%        50%        100%      300% │
├─────────────────────────────────────────────────┤
│  ↓          ↓          ↓           ↓         ↓  │
│ Tiny      Small      Medium    Original   Large │
│ Wall      Wall        Wall     Size      Wall   │
│          
│ 1-2 pages  2-4 pages  4-8 pages  8-15 pages  20+ pages
│ Best for   Small      Typical   High-res   Feature
│ stamps     shelves    walls     images     walls
└─────────────────────────────────────────────────┘

Examples:
─────────

[Tiny Wall 30cm×30cm] → 15-20% → 1-2 pages
[Small Wall 100×100cm] → 30-50% → 4-9 pages  
[Medium Wall 200×150cm] → 60-90% → 6-12 pages
[Large Wall 300×300cm] → 100-150% → 12-25 pages
[Huge Wall 500×300cm] → 150-250% → 20-40 pages
```

---

## 🎨 UI State Changes

### State During Interaction

```
INITIAL STATE
──────────────
Uploaded: ❌
Wall Dims: ❌
Pages: 0
Scaling: —

        ↓
USER SETS WALL DIMENSIONS
──────────────
Uploaded: ❌
Wall Dims: ✓ (200×150cm)
Pages: 0
Scaling: —
Panel: Waits for image

        ↓
USER UPLOADS IMAGE
──────────────
Uploaded: ✓ (3000×2400px)
Wall Dims: ✓ (200×150cm)
Pages: ⏳ Calculating...
Scaling: ⏳ Calculating...
Panel: Shows processing

        ↓
APP COMPLETES RESCALING
──────────────
Uploaded: ✓ (3000×2400px)
Wall Dims: ✓ (200×150cm)
Pages: ✓ 4 pages
Scaling: ✓ 65% of original
Grid: 2×2
Joined: 1950×1560mm
Panel: Shows ✓ Perfect fit!

        ↓
USER CHANGES PAGE SIZE
──────────────
Uploaded: ✓ (3000×2400px)
Wall Dims: ✓ (200×150cm)
Pages: ⏳ Recalculating...
Scaling: ✓ 65% (unchanged)
Grid: ⏳ Updating...
Panel: Shows processing

        ↓
APP RECALCULATES PAGES
──────────────
Uploaded: ✓ (3000×2400px)
Wall Dims: ✓ (200×150cm)
Pages: ✓ 2 pages (if A3)
Scaling: ✓ 65% (unchanged)
Grid: 2×1 (if A3)
Joined: 1950×1560mm
Panel: Shows ✓ Perfect fit!
```

---

## 📐 Mathematical Visualization

### Aspect Ratio Preservation

```
Original Image: 1200×800px (3:2 ratio)
                    │
                    ↓
        Aspect Ratio = 1200/800 = 1.5
                    │
                    ↓
Wall: 300mm×200mm (3:2 ratio)
                    │
                    ↓
        Wall Aspect = 300/200 = 1.5
                    │
                    ↓
        PERFECT MATCH! No distortion
        
Target: 300×200mm (preserves aspect)


Original Image: 1200×800px (3:2 ratio)
                    │
                    ↓
        Aspect Ratio = 1.5
                    │
                    ↓
Wall: 200mm×300mm (2:3 ratio)
                    │
                    ↓
        Wall Aspect = 0.667
                    │
                    ↓
        DIFFERENT RATIO - needs adaptation
        
Fit by width: 200mm → 200/1.5 = 133mm height (fits!)
Fit by height: 300mm → 300×1.5 = 450mm width (too wide!)

Target: 200×133mm (preserves aspect, fits wall)
```

---

## 🎯 Real-World Examples

### Example 1: Birthday Poster

```
GOAL: Print large birthday photo for party
WALL: 1m × 1.2m (vertical orientation)

SETUP:
├─ Wall Dimensions: 100cm × 120cm
└─ Photo: 2000×3000px (portrait)

PROCESSING:
├─ Image aspect: 0.667 (portrait)
├─ Wall aspect: 0.833
├─ Optimal: ~800×1200px
├─ Scale: 40% of original
└─ Pages: A4 gives 2×3 = 6 pages

RESULT: 6 A4 pages, perfectly fill wall ✓
```

### Example 2: Family Photo Wall

```
GOAL: Create feature wall with multiple photos
WALL: 2m × 1.5m (horizontal gallery wall)

SETUP:
├─ Wall Dimensions: 200cm × 150cm
├─ Stitched Image: 5000×4000px (landscape)
└─ Page Size: A3 (for fewer pages)

PROCESSING:
├─ Image aspect: 1.25 (landscape)
├─ Wall aspect: 1.333
├─ Optimal: ~2000×1600px
├─ Scale: 40% of original
└─ Pages: A3 gives 2×2 = 4 pages

RESULT: 4 A3 pages, stunning gallery ✓
```

### Example 3: Office Art

```
GOAL: Professional artwork for office wall
WALL: 1.2m × 0.8m (wide, short)

SETUP:
├─ Wall Dimensions: 120cm × 80cm
├─ Art Image: 3000×2400px (4:3 ratio)
└─ Page Size: Letter

PROCESSING:
├─ Image aspect: 1.25
├─ Wall aspect: 1.5
├─ Optimal: ~1500×1200px
├─ Scale: 50% of original
└─ Pages: Letter gives 2×1 = 2 pages

RESULT: Just 2 pages, professional finish ✓
```

---

## 🎛️ Control Flow

```
┌──────────────────────────────────────────────────┐
│           USER INTERACTIONS                       │
└──────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
   Set Wall    Upload      Change
   Dimensions  Image       Page Size
        │           │           │
        └───────────┼───────────┘
                    ↓
        ┌──────────────────────────┐
        │  CALCULATE OPTIMAL SIZE  │
        ├──────────────────────────┤
        │ • Wall dimensions        │
        │ • Image aspect ratio     │
        │ • Page size/overlap      │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  RESCALE IMAGE (Canvas)  │
        ├──────────────────────────┤
        │ • Create canvas          │
        │ • Scale image on canvas  │
        │ • Convert to data URL    │
        │ • Create blob            │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  SPLIT RESCALED IMAGE    │
        ├──────────────────────────┤
        │ • Calculate page grid    │
        │ • Generate page images   │
        │ • Calculate positions    │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │   UPDATE UI STATE        │
        ├──────────────────────────┤
        │ • Set pages array        │
        │ • Set grid (rows×cols)   │
        │ • Set scale factor       │
        │ • Show wall fit status   │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │   DISPLAY IN UI          │
        ├──────────────────────────┤
        │ • Editor: shows pages    │
        │ • Panel: shows info      │
        │ • Buttons: export ready  │
        └──────────────────────────┘
```

---

## 🚀 Performance Visualization

```
OPERATION TIMELINE
──────────────────

Get Image Dims     │
<1ms              ├─ INSTANT
                  │
Calculate Optimal  │
<10ms             ├─ INSTANT
                  │
Rescale Image      │ GPU ACCELERATED
100-500ms         ├─ FAST
                  │
Re-split Pages     │
200-1000ms        ├─ QUICK
                  │
Update UI          │
<50ms             ├─ INSTANT
                  │
User Sees Results  TOTAL: <2 seconds
                  
🎯 Ready to export in under 2 seconds!
```

---

## ✨ Summary

The visual guide shows:
- ✓ Complete user interaction flow
- ✓ Automatic rescaling process
- ✓ Page grid calculation
- ✓ Real-world use cases
- ✓ State management visualization
- ✓ Performance metrics

All designed to give you perfect wall art every time! 🎨
