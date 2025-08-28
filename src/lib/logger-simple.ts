/**
 * Simple Production-Ready Logger for XRPL.Sale
 * Structured logging with environment awareness
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'API' | 'COMPONENT' | 'ERROR' | 'PERFORMANCE' | 'USER';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
  error?: Error;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, category, message, data, error } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;
    
    let logMessage = `${prefix} ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: any, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: this.sanitizeData(data),
      error,
      context: {
        isServer: this.isServer,
        userAgent: this.isServer ? 'server' : navigator.userAgent,
        url: this.isServer ? 'server' : window.location.href
      }
    };

    const formattedMessage = this.formatMessage(entry);

    // Console output with appropriate method
    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // Store in browser for debug panel
    if (!this.isServer) {
      this.storeLogEntry(entry);
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return undefined;
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'cookie'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private storeLogEntry(entry: LogEntry): void {
    if (!this.isServer) {
      try {
        const stored = localStorage.getItem('xrpl_debug_logs');
        const logs = stored ? JSON.parse(stored) : [];
        logs.push(entry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('xrpl_debug_logs', JSON.stringify(logs));
      } catch (error) {
        console.warn('Failed to store log entry:', error);
      }
    }
  }

  // Public API methods
  debug(message: string, data?: any, error?: Error): void {
    this.log('debug', 'COMPONENT', message, data, error);
  }

  info(message: string, data?: any, error?: Error): void {
    this.log('info', 'COMPONENT', message, data, error);
  }

  warn(message: string, data?: any, error?: Error): void {
    this.log('warn', 'COMPONENT', message, data, error);
  }

  error(message: string, data?: any, error?: Error): void {
    this.log('error', 'ERROR', message, data, error);
  }

  // Category-specific methods
  api(level: LogLevel, message: string, data?: any, error?: Error): void {
    this.log(level, 'API', message, data, error);
  }

  component(level: LogLevel, message: string, data?: any, error?: Error): void {
    this.log(level, 'COMPONENT', message, data, error);
  }

  performance(message: string, data?: any): void {
    this.log('info', 'PERFORMANCE', message, data);
  }

  user(message: string, data?: any): void {
    this.log('info', 'USER', message, data);
  }

  // Debug utility methods
  getLogs(): LogEntry[] {
    if (this.isServer) return [];
    
    try {
      const stored = localStorage.getItem('xrpl_debug_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    if (!this.isServer) {
      localStorage.removeItem('xrpl_debug_logs');
    }
  }

  exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }
}

export const logger = new Logger();

// Browser debug access
if (!logger['isServer']) {
  (globalThis as any).xrplLogger = logger;
}