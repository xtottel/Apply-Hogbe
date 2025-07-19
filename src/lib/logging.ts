// lib/logging.ts
export class LoggingService {
  private static instance: LoggingService;
  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public log(message: string, level: 'info' | 'warn' | 'error' = 'info', data?: unknown) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };
    
    // Console logging
    if (level === 'info') console.log(logEntry);
    if (level === 'warn') console.warn(logEntry);
    if (level === 'error') console.error(logEntry);

    // Here you could add:
    // - Send to logging service (Sentry, Loggly, etc.)
    // - Save to database
    // - Send to external monitoring
  }

  // Additional methods for different log types
  public info(message: string, data?: unknown) {
    this.log(message, 'info', data);
  }

  public warn(message: string, data?: unknown) {
    this.log(message, 'warn', data);
  }

  public error(message: string, error?: unknown) {
    this.log(message, 'error', error);
  }
}

// Singleton instance
export const logger = LoggingService.getInstance();