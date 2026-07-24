import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePasseApi } from '../context'
import { BASE_URL, createWrapper } from './test-utils'

describe('usePasseApi', () => {
  it('exposes the raw transport details alongside fetchApi', async () => {
    const { result } = renderHook(() => usePasseApi(), { wrapper: createWrapper() })

    expect(result.current.baseUrl).toBe(BASE_URL)
    await expect(result.current.getToken()).resolves.toBe('test-token')
    expect(typeof result.current.fetchApi).toBe('function')
  })
})
