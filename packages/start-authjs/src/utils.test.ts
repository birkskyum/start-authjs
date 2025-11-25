import { describe, it, expect, beforeEach, vi } from 'vitest'
import { parseUrl, now, getBasePath } from './utils'

describe('parseUrl', () => {
  it('returns default URL when no input provided', () => {
    const result = parseUrl()
    expect(result.origin).toBe('http://localhost:3000')
    expect(result.path).toBe('/api/auth')
    expect(result.base).toBe('http://localhost:3000/api/auth')
  })

  it('parses a full URL string', () => {
    const result = parseUrl('https://example.com/auth')
    expect(result.origin).toBe('https://example.com')
    expect(result.path).toBe('/auth')
    expect(result.base).toBe('https://example.com/auth')
  })

  it('adds https:// to URLs without protocol', () => {
    const result = parseUrl('example.com/auth')
    expect(result.origin).toBe('https://example.com')
    expect(result.path).toBe('/auth')
  })

  it('parses URL object', () => {
    const url = new URL('https://example.com/api/auth')
    const result = parseUrl(url)
    expect(result.origin).toBe('https://example.com')
    expect(result.path).toBe('/api/auth')
  })

  it('removes trailing slash from path', () => {
    const result = parseUrl('https://example.com/auth/')
    expect(result.path).toBe('/auth')
  })

  it('uses default path when URL has root path only', () => {
    const result = parseUrl('https://example.com/')
    expect(result.path).toBe('/api/auth')
  })

  it('toString returns base URL', () => {
    const result = parseUrl('https://example.com/auth')
    expect(result.toString()).toBe('https://example.com/auth')
  })
})

describe('now', () => {
  it('returns current timestamp in seconds', () => {
    const before = Math.floor(Date.now() / 1000)
    const result = now()
    const after = Math.floor(Date.now() / 1000)

    expect(result).toBeGreaterThanOrEqual(before)
    expect(result).toBeLessThanOrEqual(after)
  })
})

describe('getBasePath', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns /api/auth by default', () => {
    expect(getBasePath()).toBe('/api/auth')
  })

  it('returns config.basePath if provided', () => {
    expect(getBasePath({ basePath: '/custom/auth', providers: [] })).toBe('/custom/auth')
  })

  it('returns AUTH_PATH env var if set', () => {
    vi.stubEnv('AUTH_PATH', '/env/auth')
    expect(getBasePath()).toBe('/env/auth')
  })

  it('prefers config.basePath over env var', () => {
    vi.stubEnv('AUTH_PATH', '/env/auth')
    expect(getBasePath({ basePath: '/config/auth', providers: [] })).toBe('/config/auth')
  })
})
