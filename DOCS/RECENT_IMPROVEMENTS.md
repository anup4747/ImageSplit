# Recent Improvements (scaffolded)

This document summarizes the initial scaffolding and small implementations added to address the first four high-priority tasks: tests, web-worker splitting, UX improvements (including undo/redo), and accessibility/i18n scaffolding.

## 1) Tests (scaffold)
- Add Jest + React Testing Library for unit and component tests.
- Install dev dependencies:

```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

- Suggested test files (create under `src/__tests__/`):
  - `dimension-calculator.test.ts` — unit tests for math logic.
  - `image-splitter.test.ts` — tests for splitting behavior using small synthetic canvases.
  - `WallSettings.test.tsx` — component tests for the Apply button and unit conversions.

- Add a basic `jest.config.js` or use `ts-jest` preset.

## 2) Web Worker (scaffold)
- Added `src/lib/image-splitter.worker.ts`.
- Notes:
  - The worker attempts to use `OffscreenCanvas` and returns blobs for each page.
  - Worker usage in Next.js requires `new Worker(new URL('./image-splitter.worker.ts', import.meta.url))` or a bundler config.
  - The message protocol:
    - Send: `{ type: 'split', imageDataUrl, pageSize }`
    - Receive: `{ type: 'result', result }` or `{ type: 'error', message }`

## 3) Undo / Redo in `CollageEditor`
- The editor now maintains a local history stack and exposes `Undo` / `Redo` buttons.
- History is pushed for these actions:
  - `Shuffle` / `Grid` / `Overlap` arrangements
  - `Bring to front`
  - `Rotation` changes
  - Drag end (so repetitive drag updates don't flood the stack)
- The history resets automatically when the parent replaces `pages` (e.g., after a new split), which prevents stale undo state.

## 4) Accessibility & i18n (scaffold)
- Suggested next steps:
  - Add ARIA attributes and `aria-label`s for toolbar and important buttons.
  - Add keyboard shortcuts for undo/redo and other actions.
  - Add `next-intl` or `react-intl` and replace hard-coded strings with translation keys.

## How to continue (recommended next tasks)
1. Wire the worker into `handleSplit()` in `src/app/page.tsx` with a graceful fallback to the existing `splitImage()`.
2. Add tests under `src/__tests__` and configure `jest.config.js`.
3. Improve history granularity (e.g., debounce drag position updates and add rotation-end hooks).
4. Add ARIA attributes and keyboard controls for key interactions.

---

If you want, I can now:
- Wire the worker into `handleSplit()` with a runtime feature-detect and fallback.
- Add `jest.config.js` and a small unit test for `calculateTotalJoinedDimensions()`.
- Add ARIA attributes and keyboard handlers for `PageCard` interactions.

Which would you like me to do next?