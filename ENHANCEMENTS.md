# Image Splitter - Implementation & Enhancement Guide

## 🎯 Project Overview

Image Splitter is a Next.js-based SPA that splits large images into printable pages with intelligent wall-dimension-based auto-scaling. This document covers recent enhancements and how to use them.

---

## 🚀 Recent Enhancements (Latest Release)

### 1. Accessibility Improvements (WCAG 2.1 AA)

#### Keyboard Shortcuts
- **Undo**: `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)
- **Redo**: `Ctrl+Shift+Z` (Windows/Linux) or `Cmd+Shift+Z` (Mac)
- **Arrow Keys**: Move selected page (Hold Shift for larger increments)
- **Enter**: Select/focus a page

#### ARIA Attributes
- All interactive buttons have `aria-label` for screen readers
- Form inputs have associated labels with `id` and `htmlFor`
- Canvas region has descriptive `aria-label` with usage instructions
- Focus visible styling (blue ring) for keyboard navigation
- Tab order follows logical flow

#### Testing WCAG Compliance
```bash
# Install axe DevTools browser extension
# Run accessibility audit in browser dev tools
```

### 2. Unit & Integration Tests

#### Setup
Tests are configured with Jest + React Testing Library. To run:

```bash
npm install  # Install test dependencies
npm test     # Run all tests
npm run test:watch  # Watch mode for development
npm run test:coverage  # Generate coverage report
```

#### Test Files
- `src/__tests__/dimension-calculator.test.ts` - Math logic tests
- `src/__tests__/WallSettings.test.tsx` - Component tests

#### Writing More Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText(/expected/i)).toBeInTheDocument()
  })
})
```

Run tests continuously:
```bash
npm run test:watch
```

### 3. Web Worker Support (Experimental)

#### Overview
Image splitting is CPU-intensive. Web workers offload this to a background thread, keeping the UI responsive.

#### Current Status
- Worker scaffold created: `src/lib/image-splitter.worker.ts`
- Uses `OffscreenCanvas` for off-main-thread rendering
- Fallback to main thread if not supported

#### Enable Worker (TODO)
To integrate into `handleSplit()`:

```typescript
// src/app/page.tsx
const useWorker = typeof window !== 'undefined' && !!window.Worker

const workerSplit = async (file: File, pageSize: PageSize) => {
  const worker = new Worker(new URL('@/lib/image-splitter.worker', import.meta.url))
  const dataUrl = await fileToDataUrl(file)
  
  worker.postMessage({ type: 'split', imageDataUrl: dataUrl, pageSize })
  
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.type === 'result') resolve(e.data.result)
      else reject(new Error(e.data.message))
      worker.terminate()
    }
  })
}
```

### 4. Undo / Redo in Editor

#### Features
- Full history stack for all page operations
- Any action that modifies pages (move, rotate, arrange, shuffle) can be undone
- History persists across view changes within the same split session
- Keyboard shortcuts work instantly

#### Usage
- **Undo**: Click button or `Ctrl+Z`
- **Redo**: Click button or `Ctrl+Shift+Z`
- Buttons auto-disable when no history available

#### Implementation Details
- History stored as array of page state snapshots
- Efficient state management (resets on new split)
- Granular operations: each drag end, rotation, arrangement is a checkpoint

### 5. Code Quality & CI/CD

#### ESLint Configuration
Rules configured in `.eslintrc.json`:
- React best practices
- TypeScript strict checks
- Next.js conventions
- Strict equality (`===`)

Run linter:
```bash
npm run lint
```

#### Prettier Code Formatting
Auto-format code with `.prettierrc.json`:
- Single quotes
- Trailing commas (ES5 compatible)
- 100 char line width
- 2-space indentation

```bash
# Manual format
npx prettier --write src/

# Check format
npx prettier --check src/
```

#### GitHub Actions CI/CD
Automated checks on every push/PR:
- Lint check
- Unit tests + coverage
- TypeScript type checking
- Build validation

View results: `.github/workflows/ci.yml` in GitHub Actions tab

#### Installing Lint & Format Tools
```bash
npm install -D prettier
npm run lint
npx prettier --write .
```

### 6. Internationalization (i18n) Scaffold

#### Setup Instructions
```bash
npm install next-intl
```

#### Basic i18n Structure
Create `src/i18n/messages.ts`:

```typescript
export const messages = {
  en: {
    'app.title': 'Image Splitter',
    'app.description': 'Split images into printable pages',
    'actions.apply': 'Apply',
    'actions.undo': 'Undo',
    'actions.redo': 'Redo',
  },
  es: {
    'app.title': 'Divisor de Imágenes',
    'app.description': 'Dividir imágenes en páginas imprimibles',
    'actions.apply': 'Aplicar',
    'actions.undo': 'Deshacer',
    'actions.redo': 'Rehacer',
  },
}
```

Replace hardcoded strings with translation keys:

```tsx
// Before
<button>Apply Dimensions</button>

// After
import { useTranslations } from 'next-intl'

export default function WallSettings() {
  const t = useTranslations()
  return <button>{t('action.apply')}</button>
}
```

### 7. Error Tracking & Observability

#### Sentry Integration (Recommended)
```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

Set env var in `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

#### Analytics Setup
For simple analytics, use Vercel Analytics:

```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({children}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 📋 Quick Start for Development

### Install & Run
```bash
cd image-splitter-app
npm install
npm run dev
```

Visit `http://localhost:3000`

### Running Tests
```bash
npm test -- --watch
```

### Build for Production
```bash
npm run build
npm start
```

### Format & Lint
```bash
npx prettier --write .
npm run lint
```

---

## 🛠 Feature Checklist

- [x] Keyboard shortcuts (Ctrl+Z, arrow keys)
- [x] ARIA labels and accessible UI
- [x] Unit tests for core logic
- [x] Component tests
- [x] Jest configuration
- [x] Web Worker scaffold
- [x] Undo/Redo with history
- [x] ESLint & Prettier
- [x] GitHub Actions CI/CD
- [ ] i18n full setup
- [ ] Sentry integration
- [ ] Vercel Analytics
- [ ] E2E tests (Cypress/Playwright)

---

## 🚀 Next Steps

1. **Complete i18n**: Configure next-intl and translate UI strings
2. **Add Error Tracking**: Integrate Sentry or similar
3. **Enable Web Worker**: Wire worker into image splitting
4. **E2E Testing**: Add Cypress or Playwright tests
5. **Performance**: Optimize bundle size and Lighthouse score
6. **Mobile Responsiveness**: Improve touch gestures and mobile layout

---

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Jest Testing](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📞 Support

For issues or questions:
1. Check existing GitHub Issues
2. Review test output: `npm test`
3. Check linter: `npm run lint`
4. Read CI logs in GitHub Actions

---

**Last Updated**: February 7, 2026
**Version**: 2.0 (Accessibility & Testing Release)
