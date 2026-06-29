import type { LogContext, LogEntry, LoggerConfig, LogLevel } from './types'

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function getDefaultMinLevel(): LogLevel {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') return 'warn'
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return typeof window !== 'undefined' ? 'warn' : 'info'
  }
  return 'debug'
}

function formatPretty(entry: LogEntry): void {
  const module = entry.context?.module
  const prefix = module ? ` [${module}]` : ''
  const line = `${entry.timestamp} ${entry.level.toUpperCase()}${prefix} ${entry.message}`
  const ctx = entry.context
    ? Object.fromEntries(Object.entries(entry.context).filter(([k]) => k !== 'module'))
    : undefined
  const hasCtx = ctx && Object.keys(ctx).length > 0

  if (entry.level === 'error') {
    hasCtx ? console.error(line, ctx) : console.error(line)
  } else if (entry.level === 'warn') {
    hasCtx ? console.warn(line, ctx) : console.warn(line)
  } else {
    hasCtx ? console.log(line, ctx) : console.log(line)
  }
}

function formatStructured(entry: LogEntry): void {
  const line = JSON.stringify(entry)
  if (entry.level === 'error') {
    console.error(line)
  } else if (entry.level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export class Logger {
  private readonly config: LoggerConfig
  private readonly minLevel: number

  constructor(config: LoggerConfig = {}) {
    this.config = config
    this.minLevel = LEVELS[config.minLevel ?? getDefaultMinLevel()]
  }

  private emit(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVELS[level] < this.minLevel) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context:
        this.config.context || context
          ? { ...this.config.context, ...context }
          : undefined,
    }

    const isProd =
      typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

    if (isProd) {
      formatStructured(entry)
    } else {
      formatPretty(entry)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.emit('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.emit('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.emit('warn', message, context)
  }

  error(message: string, context?: LogContext): void {
    this.emit('error', message, context)
  }

  child(context: LogContext): Logger {
    return new Logger({
      ...this.config,
      context: { ...this.config.context, ...context },
    })
  }
}

export const logger = new Logger()

export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config)
}
