export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogContext = Record<string, unknown>

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
}

export interface LoggerConfig {
  minLevel?: LogLevel
  context?: LogContext
}
