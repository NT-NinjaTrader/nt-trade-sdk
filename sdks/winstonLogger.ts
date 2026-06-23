import * as winston from 'winston';
import type { TdvStage } from '../types/common';

export interface WinstonLoggerConfig {
  stage: TdvStage;
  level?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  logFilePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  format?: 'json' | 'simple' | 'detailed';
  enableColors?: boolean;
  logVerbosity?: 'minimal' | 'normal' | 'verbose' | 'debug';
}

/**
 * Winston-based logger for the TradeSDK
 *
 * Provides structured logging with multiple transport options, log levels,
 * and configurable formatting for production use.
 */
export class WinstonLogger {
  private logger: winston.Logger;
  public stage: TdvStage; // Make stage public for compatibility
  public verbose: boolean = false; // Add verbose property for compatibility
  private config: WinstonLoggerConfig;

  constructor(config: WinstonLoggerConfig) {
    this.config = config;
    this.stage = config.stage;

    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Ensure we have a valid log level
    const logLevel = this.config.level || 'info';

    // Console transport
    if (this.config.enableConsole !== false) {
      transports.push(
        new winston.transports.Console({
          level: logLevel,
          format: this.getConsoleFormat()
        })
      );
    }

    // File transport
    if (this.config.enableFile && this.config.logFilePath) {
      transports.push(
        new winston.transports.File({
          filename: this.config.logFilePath,
          level: logLevel,
          maxsize: this.config.maxFileSize || 10 * 1024 * 1024, // 10MB
          maxFiles: this.config.maxFiles || 5,
          format: this.getFileFormat()
        })
      );
    }

    // Error file transport (always enabled if file logging is enabled)
    if (this.config.enableFile && this.config.logFilePath) {
      const errorLogPath = this.config.logFilePath.replace('.log', '.error.log');
      transports.push(
        new winston.transports.File({
          filename: errorLogPath,
          level: 'error',
          maxsize: this.config.maxFileSize || 10 * 1024 * 1024, // 10MB
          maxFiles: this.config.maxFiles || 5,
          format: this.getFileFormat()
        })
      );
    }

    const logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
      ),
      defaultMeta: {
        service: 'trade-sdk',
        stage: this.stage,
        version: process.env.npm_package_version || '1.0.0'
      },
      transports,
      // Handle uncaught exceptions and rejections
      exceptionHandlers:
        this.config.enableFile && this.config.logFilePath
          ? [
              new winston.transports.File({
                filename: this.config.logFilePath.replace('.log', '.exceptions.log'),
                maxsize: this.config.maxFileSize || 10 * 1024 * 1024,
                maxFiles: this.config.maxFiles || 5
              })
            ]
          : [],
      rejectionHandlers:
        this.config.enableFile && this.config.logFilePath
          ? [
              new winston.transports.File({
                filename: this.config.logFilePath.replace('.log', '.rejections.log'),
                maxsize: this.config.maxFileSize || 10 * 1024 * 1024,
                maxFiles: this.config.maxFiles || 5
              })
            ]
          : []
    });

    return logger;
  }

  private getConsoleFormat() {
    if (this.config.format === 'json') {
      return winston.format.combine(winston.format.timestamp(), winston.format.json());
    }

    if (this.config.format === 'detailed') {
      return winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stage, service, ...meta }) => {
          stage =
            stage ||
            (meta?.data as Record<string, any>)?.stage ||
            (meta?.metadata as Record<string, any>)?.stage ||
            '<unknown>';
          service =
            service ||
            (meta?.data as Record<string, any>)?.service ||
            (meta?.metadata as Record<string, any>)?.service ||
            '<unknown>';
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} [${service}:${stage}] ${level.toUpperCase()}: ${message}${metaStr}`;
        })
      );
    }

    // Simple format (default)
    return winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.colorize({ all: this.config.enableColors !== false }),
      winston.format.printf(({ timestamp, level, message, stage, service, ...meta }) => {
        stage =
          stage ||
          (meta?.data as Record<string, any>)?.stage ||
          (meta?.metadata as Record<string, any>)?.stage ||
          '<unknown>';
        service =
          service ||
          (meta?.data as Record<string, any>)?.service ||
          (meta?.metadata as Record<string, any>)?.service ||
          '<unknown>';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${service}:${stage}] ${level}: ${message}${metaStr}`;
      })
    );
  }

  private getFileFormat() {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  // Main logging methods with verbosity control
  error(message: string, meta?: Record<string, any>): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  // Verbosity-aware logging methods
  logMinimal(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('minimal')) {
      this.info(message, meta);
    }
  }

  logNormal(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('normal')) {
      this.info(message, meta);
    }
  }

  logVerbose(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('verbose')) {
      this.info(message, meta);
    }
  }

  logDebug(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      this.info(message, meta);
    }
  }

  // Verbosity check helper
  private shouldLog(verbosity: 'minimal' | 'normal' | 'verbose' | 'debug'): boolean {
    const verbosityLevels = { minimal: 1, normal: 2, verbose: 3, debug: 4 };
    const currentLevel = verbosityLevels[this.config.logVerbosity || 'normal'] || 2;
    const requestedLevel = verbosityLevels[verbosity] || 2;
    return requestedLevel <= currentLevel;
  }

  // Legacy compatibility method
  log(message: string, meta?: Record<string, any>): void {
    this.info(message, meta);
  }

  // Structured logging methods
  logTrade(message: string, tradeData?: Record<string, any>): void {
    this.info(message, { category: 'trade', ...tradeData });
  }

  logConnection(message: string, connectionData?: Record<string, any>): void {
    this.info(message, { category: 'connection', ...connectionData });
  }

  logHealth(message: string, healthData?: Record<string, any>): void {
    this.info(message, { category: 'health', ...healthData });
  }

  // Consolidated health logging - single log entry with comprehensive health status
  logHealthConsolidated(
    message: string,
    overallHealth: boolean,
    healthComponents: Record<string, any>,
    performanceMetrics?: Record<string, any>
  ): void {
    this.info(message, {
      category: 'health_consolidated',
      overall: overallHealth,
      components: healthComponents,
      performance: performanceMetrics,
      timestamp: new Date().toISOString()
    });
  }

  logError(message: string, error?: Error, context?: Record<string, any>): void {
    this.error(message, {
      category: 'error',
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        : undefined,
      ...context
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, meta?: Record<string, any>): void {
    this.debug(`Performance: ${operation} completed in ${duration}ms`, {
      category: 'performance',
      operation,
      duration,
      ...meta
    });
  }

  // Enhanced performance monitoring methods
  logApiCall(
    endpoint: string,
    method: string,
    duration: number,
    statusCode?: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`API ${method} ${endpoint}`, duration, {
      type: 'api_call',
      endpoint,
      method,
      statusCode,
      ...meta
    });
  }

  logWebSocketMessage(
    messageType: string,
    duration: number,
    messageSize?: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`WebSocket ${messageType}`, duration, {
      type: 'websocket_message',
      messageType,
      messageSize,
      ...meta
    });
  }

  logCacheOperation(
    operation: 'hit' | 'miss' | 'set' | 'evict',
    key: string,
    duration: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`Cache ${operation}`, duration, {
      type: 'cache_operation',
      operation,
      key,
      ...meta
    });
  }

  logQueueOperation(
    operation: 'enqueue' | 'dequeue' | 'process',
    queueSize: number,
    duration: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`Queue ${operation}`, duration, {
      type: 'queue_operation',
      operation,
      queueSize,
      ...meta
    });
  }

  // Performance alerts and warnings
  logPerformanceWarning(
    operation: string,
    duration: number,
    threshold: number,
    meta?: Record<string, any>
  ): void {
    this.warn(`Performance warning: ${operation} took ${duration}ms (threshold: ${threshold}ms)`, {
      category: 'performance_warning',
      operation,
      duration,
      threshold,
      ...meta
    });
  }

  logPerformanceAlert(
    operation: string,
    duration: number,
    threshold: number,
    meta?: Record<string, any>
  ): void {
    this.error(`Performance alert: ${operation} took ${duration}ms (threshold: ${threshold}ms)`, {
      category: 'performance_alert',
      operation,
      duration,
      threshold,
      ...meta
    });
  }

  // Throughput and rate metrics
  logThroughput(
    operation: string,
    count: number,
    timeWindow: number,
    meta?: Record<string, any>
  ): void {
    const rate = (count / timeWindow) * 1000; // operations per second
    this.logPerformance(`Throughput ${operation}`, 0, {
      type: 'throughput',
      operation,
      count,
      timeWindow,
      rate,
      ...meta
    });
  }

  logRateLimit(
    operation: string,
    currentRate: number,
    limit: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`Rate limit ${operation}`, 0, {
      type: 'rate_limit',
      operation,
      currentRate,
      limit,
      utilization: (currentRate / limit) * 100,
      ...meta
    });
  }

  // Memory and resource usage
  logMemoryUsage(
    operation: string,
    memoryUsage: NodeJS.MemoryUsage,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`Memory usage ${operation}`, 0, {
      type: 'memory_usage',
      operation,
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      ...meta
    });
  }

  // Batch operation metrics
  logBatchOperation(
    operation: string,
    batchSize: number,
    totalDuration: number,
    avgDuration: number,
    meta?: Record<string, any>
  ): void {
    this.logPerformance(`Batch ${operation}`, totalDuration, {
      type: 'batch_operation',
      operation,
      batchSize,
      totalDuration,
      avgDuration,
      throughput: (batchSize / totalDuration) * 1000,
      ...meta
    });
  }

  // Configuration methods
  setLevel(level: string): void {
    this.logger.level = level;
  }

  addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  removeTransport(transport: winston.transport): void {
    this.logger.remove(transport);
  }

  // Get logger instance for advanced usage
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }

  // Cleanup
  close(): Promise<void> {
    return new Promise(resolve => {
      this.logger.end(() => resolve());
    });
  }
}

/**
 * Factory function to create a Winston logger with common configurations
 */
export function createWinstonLogger(config: WinstonLoggerConfig): WinstonLogger {
  return new WinstonLogger(config);
}

/**
 * Default Winston logger configuration for different environments
 */
export const DEFAULT_WINSTON_CONFIGS = {
  development: {
    level: 'info',
    enableConsole: true,
    enableFile: false,
    format: 'detailed' as const,
    enableColors: true,
    logVerbosity: 'normal' as const
  },
  staging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
    logFilePath: 'logs/trade-sdk-staging.log',
    format: 'detailed' as const,
    enableColors: true,
    logVerbosity: 'normal' as const
  },
  production: {
    level: 'warn',
    enableConsole: false,
    enableFile: true,
    logFilePath: 'logs/trade-sdk-production.log',
    format: 'json' as const,
    enableColors: false,
    logVerbosity: 'minimal' as const
  },
  demo: {
    level: 'info',
    enableConsole: true,
    enableFile: false,
    format: 'simple' as const,
    enableColors: true,
    logVerbosity: 'normal' as const
  }
} as const;
