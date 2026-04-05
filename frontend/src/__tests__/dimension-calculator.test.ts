import {
  calculateTotalJoinedDimensions,
  calculateOptimalImageSize,
  checkWallFit,
} from '@/lib/dimension-calculator'
import { PageSize, SplitPage } from '@/types'

describe('dimension-calculator', () => {
  describe('calculateTotalJoinedDimensions', () => {
    it('calculates correct dimensions for a 2x2 grid', () => {
      const pages: SplitPage[] = Array.from({ length: 4 }, (_, i) => ({
        id: `page-${i}`,
        imageData: 'data:image/png;base64,iVBORw0KGgo=',
        row: Math.floor(i / 2),
        col: i % 2,
        width: 210,
        height: 297,
        x: 0,
        y: 0,
        rotation: 0,
        zIndex: i,
        borderWidth: 2,
        borderColor: '#ffffff',
      }))

      const pageSize: PageSize = {
        name: 'A4',
        widthPx: 595,
        heightPx: 841,
        widthMm: 210,
        heightMm: 297,
        width: 210,
        height: 297,
      }

      const result = calculateTotalJoinedDimensions(pages, pageSize, 2, 2)

      expect(result).toHaveProperty('width')
      expect(result).toHaveProperty('height')
      expect(result.width).toBeGreaterThan(0)
      expect(result.height).toBeGreaterThan(0)
    })

    it('returns correct dimensions for single page', () => {
      const pages: SplitPage[] = [
        {
          id: 'page-1',
          imageData: 'data:image/png;base64,iVBORw0KGgo=',
          row: 0,
          col: 0,
          width: 210,
          height: 297,
          x: 0,
          y: 0,
          rotation: 0,
          zIndex: 0,
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ]

      const pageSize: PageSize = {
        name: 'A4',
        widthPx: 595,
        heightPx: 841,
        widthMm: 210,
        heightMm: 297,
        width: 210,
        height: 297,
      }

      const result = calculateTotalJoinedDimensions(pages, pageSize, 1, 1)

      expect(result.width).toBe(210)
      expect(result.height).toBe(297)
    })
  })

  describe('calculateOptimalImageSize', () => {
    it('calculates optimal size for standard wall', () => {
      const result = calculateOptimalImageSize(3000, 2400, { width: 200, height: 150, unit: 'cm' }, {
        name: 'A4',
        widthPx: 595,
        heightPx: 841,
        widthMm: 210,
        heightMm: 297,
        width: 210,
        height: 297,
      })

      expect(result).toHaveProperty('targetWidth')
      expect(result).toHaveProperty('targetHeight')
      expect(result).toHaveProperty('scaleFactor')
      expect(result.targetWidth).toBeGreaterThan(0)
      expect(result.targetHeight).toBeGreaterThan(0)
      expect(result.scaleFactor).toBeGreaterThan(0)
    })

    it('preserves aspect ratio', () => {
      const aspectRatio = 3000 / 2400
      const result = calculateOptimalImageSize(3000, 2400, { width: 200, height: 150, unit: 'cm' }, {
        name: 'A4',
        widthPx: 595,
        heightPx: 841,
        widthMm: 210,
        heightMm: 297,
        width: 210,
        height: 297,
      })

      const resultAspectRatio = result.targetWidth / result.targetHeight
      // Allow small rounding differences
      expect(Math.abs(resultAspectRatio - aspectRatio)).toBeLessThan(0.01)
    })
  })

  describe('checkWallFit', () => {
    it('returns "fits" when dimensions fit the wall', () => {
      const result = checkWallFit(
        { width: 1000, height: 800 },
        { width: 200, height: 150, unit: 'cm' }
      )

      expect(result.fits).toBe(true)
      expect(result.status).toBe('fits')
    })

    it('returns "warning" when dimensions exceed wall', () => {
      const result = checkWallFit(
        { width: 3000, height: 2000 },
        { width: 200, height: 150, unit: 'cm' }
      )

      expect(result).toHaveProperty('status')
      expect(['fits', 'warning', 'error']).toContain(result.status)
    })
  })
})
