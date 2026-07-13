import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useIsMobile } from '../hooks/use-mobile'

function mockMatchMedia() {
  const listeners = new Set<() => void>()
  const mql = {
    addEventListener: vi.fn((_: string, cb: () => void) => listeners.add(cb)),
    removeEventListener: vi.fn((_: string, cb: () => void) => listeners.delete(cb)),
  }
  window.matchMedia = vi.fn().mockReturnValue(mql)
  return { mql, fire: () => listeners.forEach((cb) => cb()) }
}

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('useIsMobile', () => {
  it('returns true when innerWidth is below the 768px breakpoint on mount', () => {
    mockMatchMedia()
    setInnerWidth(500)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('returns false when innerWidth is at or above the 768px breakpoint on mount', () => {
    mockMatchMedia()
    setInnerWidth(1024)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('updates when the media query change listener fires', () => {
    const { fire } = mockMatchMedia()
    setInnerWidth(1024)

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    setInnerWidth(500)
    act(() => {
      fire()
    })

    expect(result.current).toBe(true)
  })

  it('removes the change listener on unmount', () => {
    const { mql } = mockMatchMedia()
    setInnerWidth(1024)

    const { unmount } = renderHook(() => useIsMobile())
    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
