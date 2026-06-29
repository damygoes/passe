import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Logger, createLogger } from '../logger'

// Helpers — suppress real console output and capture calls
function spyLog() {
  return vi.spyOn(console, 'log').mockImplementation(() => {})
}
function spyWarn() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}
function spyError() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

// In the test environment NODE_ENV === 'test', so a plain new Logger() defaults to minLevel 'warn'.
// All tests that need debug/info output create a logger with an explicit minLevel.

describe('level filtering', () => {
  it('emits messages at or above minLevel', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).debug('visible')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('suppresses messages below minLevel', () => {
    const logSpy = spyLog()
    const log = new Logger({ minLevel: 'warn' })
    log.debug('suppressed')
    log.info('also suppressed')
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('warn is emitted when minLevel is warn', () => {
    const spy = spyWarn()
    new Logger({ minLevel: 'warn' }).warn('audible')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('error is emitted when minLevel is warn', () => {
    const spy = spyError()
    new Logger({ minLevel: 'warn' }).error('critical')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})

describe('default minLevel by NODE_ENV', () => {
  it('defaults to "warn" in the test environment, suppressing info', () => {
    const spy = spyLog()
    new Logger().info('should be suppressed')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('defaults to "warn" in the test environment, passing warn', () => {
    const spy = spyWarn()
    new Logger().warn('audible')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})

describe('console method routing (pretty format)', () => {
  it('routes debug and info to console.log', () => {
    const spy = spyLog()
    const log = new Logger({ minLevel: 'debug' })
    log.debug('d')
    log.info('i')
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })

  it('routes warn to console.warn', () => {
    const spy = spyWarn()
    new Logger({ minLevel: 'debug' }).warn('w')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('routes error to console.error', () => {
    const spy = spyError()
    new Logger({ minLevel: 'debug' }).error('e')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})

describe('log line content', () => {
  it('includes the message text', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('hello world')
    expect(spy.mock.calls[0]![0]).toContain('hello world')
    spy.mockRestore()
  })

  it('includes the level in uppercase', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg')
    expect(spy.mock.calls[0]![0]).toContain('INFO')
    spy.mockRestore()
  })

  it('includes a timestamp string', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg')
    // ISO timestamp starts with a 4-digit year
    expect(spy.mock.calls[0]![0]).toMatch(/\d{4}-\d{2}-\d{2}T/)
    spy.mockRestore()
  })
})

describe('context merging', () => {
  it('passes per-call context as the second console arg', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg', { userId: 'u1' })
    expect(spy).toHaveBeenCalledWith(expect.any(String), { userId: 'u1' })
    spy.mockRestore()
  })

  it('merges config context with per-call context, per-call wins on collision', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug', context: { service: 'api', env: 'dev' } }).info('msg', {
      env: 'override',
    })
    expect(spy).toHaveBeenCalledWith(expect.any(String), { service: 'api', env: 'override' })
    spy.mockRestore()
  })

  it('omits the context arg entirely when no context is provided', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg')
    expect(spy).toHaveBeenCalledWith(expect.any(String))
    expect(spy.mock.calls[0]!.length).toBe(1)
    spy.mockRestore()
  })

  it('strips "module" from the context arg and uses it as a line prefix instead', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg', { module: 'auth', userId: 'u1' })
    expect(spy).toHaveBeenCalledWith(expect.any(String), { userId: 'u1' })
    spy.mockRestore()
  })

  it('includes [module] in the log line when module is provided in context', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg', { module: 'trips' })
    expect(spy.mock.calls[0]![0]).toContain('[trips]')
    spy.mockRestore()
  })

  it('emits no ctx arg when module is the only context key', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'debug' }).info('msg', { module: 'auth' })
    expect(spy.mock.calls[0]!.length).toBe(1)
    spy.mockRestore()
  })
})

describe('child()', () => {
  it('inherits parent config context and adds child context', () => {
    const spy = spyLog()
    const parent = new Logger({ minLevel: 'debug', context: { service: 'api' } })
    parent.child({ module: 'trips' }).info('msg')
    const [line, ctx] = spy.mock.calls[0]!
    expect(line).toContain('[trips]')
    expect(ctx).toEqual({ service: 'api' })
    spy.mockRestore()
  })

  it('child context does not affect the parent', () => {
    const spy = spyLog()
    const parent = new Logger({ minLevel: 'debug', context: { service: 'api' } })
    parent.child({ extra: 'x' })
    parent.info('parent msg')
    const [, ctx] = spy.mock.calls[0]!
    expect(ctx).toEqual({ service: 'api' })
    expect(ctx).not.toHaveProperty('extra')
    spy.mockRestore()
  })

  it('inherits minLevel from the parent', () => {
    const spy = spyLog()
    const child = new Logger({ minLevel: 'warn' }).child({ module: 'auth' })
    child.info('suppressed')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('structured format (NODE_ENV=production)', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  it('emits valid JSON to console.log for info level', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'info' }).info('structured msg')
    const parsed = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(parsed.level).toBe('info')
    expect(parsed.message).toBe('structured msg')
    expect(typeof parsed.timestamp).toBe('string')
    spy.mockRestore()
  })

  it('emits valid JSON to console.warn for warn level', () => {
    const spy = spyWarn()
    new Logger({ minLevel: 'info' }).warn('warning')
    const parsed = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(parsed.level).toBe('warn')
    spy.mockRestore()
  })

  it('emits valid JSON to console.error for error level', () => {
    const spy = spyError()
    new Logger({ minLevel: 'info' }).error('boom')
    const parsed = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(parsed.level).toBe('error')
    expect(parsed.message).toBe('boom')
    spy.mockRestore()
  })

  it('includes context in the JSON output', () => {
    const spy = spyLog()
    new Logger({ minLevel: 'info' }).info('msg', { requestId: 'r1' })
    const parsed = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(parsed.context).toEqual({ requestId: 'r1' })
    spy.mockRestore()
  })
})

describe('createLogger', () => {
  it('returns a Logger instance with the given config', () => {
    const log = createLogger({ minLevel: 'debug' })
    expect(log).toBeInstanceOf(Logger)
    const spy = spyLog()
    log.debug('reachable')
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})
