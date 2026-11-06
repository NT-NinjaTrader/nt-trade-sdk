import { config } from 'dotenv';
import { ConfigError } from '../api/errors';
import type { TdvStage } from '../types/common';
import { DEFAULT_MAINTENANCE_CONFIG } from '../types/maintenance';
import { type PresetType } from './presetConfigs';
import type { AdvancedTradeClientConfig } from './tradeClient';

// Load environment variables from .env file
config();

/**
 * Environment variable configuration interface
 */
export interface EnvConfig {
  // Required
  TRADE_SDK_STAGE: string;
  TRADE_SDK_USERNAME: string;
  TRADE_SDK_PASSWORD: string;
  TRADE_SDK_APP_ID: string;
  TRADE_SDK_APP_VERSION: string;
  TRADE_SDK_CLIENT_ID: string;
  TRADE_SDK_SEC: string;

  // Preset configuration
  TRADE_SDK_PRESET?: string;

  // Winston Logger Configuration
  TRADE_SDK_LOGGER_TYPE?: string;
  TRADE_SDK_LOGGER_LEVEL?: string;
  TRADE_SDK_LOGGER_ENABLE_CONSOLE?: string;
  TRADE_SDK_LOGGER_ENABLE_FILE?: string;
  TRADE_SDK_LOGGER_FILE_PATH?: string;
  TRADE_SDK_LOGGER_MAX_FILE_SIZE?: string;
  TRADE_SDK_LOGGER_MAX_FILES?: string;
  TRADE_SDK_LOGGER_FORMAT?: string;
  TRADE_SDK_LOGGER_ENABLE_COLORS?: string;

  TRADE_SDK_ENABLE_MD_SOCKET?: string;
  TRADE_SDK_LIVE_CLIENT?: string;
  TRADE_SDK_SIM_CLIENT?: string;

  // Socket configuration
  TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING?: string;
  TRADE_SDK_SOCKET_CONNECTION_TIMEOUT?: string;
  TRADE_SDK_SOCKET_SHARDING_DIVISOR?: string;
  TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE?: string;
  TRADE_SDK_SOCKET_SYNC_IMMEDIATE?: string;
  TRADE_SDK_SOCKET_FULL_ORG_SNAPSHOT?: string;

  // REST configuration
  TRADE_SDK_REST_REQUEST_TIMEOUT?: string;
  TRADE_SDK_REST_MAX_RETRIES?: string;
  TRADE_SDK_REST_RETRY_DELAY?: string;

  // Reconnection configuration
  TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL?: string;
  TRADE_SDK_RECONNECT_MAX_ATTEMPTS?: string;
  TRADE_SDK_RECONNECT_DELAY?: string;
  TRADE_SDK_RECONNECT_EXPONENTIAL_BACKOFF?: string;
  TRADE_SDK_RECONNECT_HEALTH_CHECK_TIMEOUT?: string;

  // Rate limiting configuration
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPS?: string;
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPM?: string;
  TRADE_SDK_RATE_LIMIT_GLOBAL_RPH?: string;
  TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER?: string;
  TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING?: string;
  TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS?: string;

  // Message queue configuration
  TRADE_SDK_MQ_MAX_RETRIES?: string;
  TRADE_SDK_MQ_RETRY_DELAY?: string;
  TRADE_SDK_MQ_ENABLE_PRIORITY?: string;
  TRADE_SDK_MQ_ENABLE_RETRIES?: string;
  TRADE_SDK_MQ_ENABLE_NETWORK_DETECTION?: string;
  TRADE_SDK_MQ_NETWORK_HEALTH_CHECK_INTERVAL?: string;
  TRADE_SDK_MQ_NETWORK_FAILURE_THRESHOLD?: string;
  TRADE_SDK_MQ_ENABLE_MAINTENANCE_QUEUING?: string;
  TRADE_SDK_MQ_QUEUE_TIMEOUT?: string;
  TRADE_SDK_MQ_ENABLE_DEDUPLICATION?: string;
  TRADE_SDK_MQ_DEDUPLICATION_WINDOW?: string;
  TRADE_SDK_MQ_CLEAR_DEDUPLICATION_AFTER_RESOLUTION?: string;
  TRADE_SDK_MQ_DEDUPLICATION_CLEAR_STRATEGY?: string;
  TRADE_SDK_MQ_DEDUPLICATION_CLEAR_DELAY?: string;

  // Maintenance configuration
  TRADE_SDK_MAINTENANCE_ENABLE_DETECTION?: string;
  TRADE_SDK_MAINTENANCE_ENABLE_AUTOMATIC_QUEUING?: string;
  TRADE_SDK_MAINTENANCE_TIMEZONE?: string;
  TRADE_SDK_MAINTENANCE_QUEUE_TIMEOUT?: string;
  TRADE_SDK_MAINTENANCE_RETRY_ATTEMPTS?: string;
}

/** Internal: loads raw config from env without validation */
function loadConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): Partial<AdvancedTradeClientConfig> {
  const config: Partial<AdvancedTradeClientConfig> = {};

  // Required credentials - only set when we have the required fields
  if (env.TRADE_SDK_USERNAME && env.TRADE_SDK_PASSWORD) {
    config.credentials = {
      name: env.TRADE_SDK_USERNAME,
      password: env.TRADE_SDK_PASSWORD,
      appId: env.TRADE_SDK_APP_ID,
      appVersion: env.TRADE_SDK_APP_VERSION,
      cid: env.TRADE_SDK_CLIENT_ID
        ? isNaN(Number(env.TRADE_SDK_CLIENT_ID))
          ? undefined // Set to undefined if not a valid number
          : Number(env.TRADE_SDK_CLIENT_ID)
        : undefined,
      sec: env.TRADE_SDK_SEC
    };

    // Store invalid values for validation
    if (env.TRADE_SDK_CLIENT_ID && isNaN(Number(env.TRADE_SDK_CLIENT_ID))) {
      (config.credentials as any)._invalidCid = env.TRADE_SDK_CLIENT_ID;
    }
  }

  // Stage (required)
  if (env.TRADE_SDK_STAGE) {
    const stage = env.TRADE_SDK_STAGE.toLowerCase();
    if (isValidStage(stage)) {
      config.stage = stage as TdvStage;
    } else {
      // Store invalid value for validation error
      (config as any)._invalidStage = env.TRADE_SDK_STAGE;
    }
  }

  // Preset configuration
  if (env.TRADE_SDK_PRESET) {
    config.preset = parsePreset(env.TRADE_SDK_PRESET);
  }

  // Logging configuration
  if (
    env.TRADE_SDK_LOGGER_TYPE ||
    env.TRADE_SDK_LOGGER_LEVEL ||
    env.TRADE_SDK_LOGGER_FORMAT ||
    env.TRADE_SDK_LOGGER_MAX_FILE_SIZE ||
    env.TRADE_SDK_LOGGER_MAX_FILES
  ) {
    // Logger configuration - preserve all values for validation
    config.logger = {
      stage: config.stage || 'devel',
      level: env.TRADE_SDK_LOGGER_LEVEL as any,
      enableConsole: parseBoolean(env.TRADE_SDK_LOGGER_ENABLE_CONSOLE),
      enableFile: parseBoolean(env.TRADE_SDK_LOGGER_ENABLE_FILE),
      logFilePath: env.TRADE_SDK_LOGGER_FILE_PATH,
      maxFileSize: parseNumber(env.TRADE_SDK_LOGGER_MAX_FILE_SIZE),
      maxFiles: parseNumber(env.TRADE_SDK_LOGGER_MAX_FILES),
      format: env.TRADE_SDK_LOGGER_FORMAT as any,
      enableColors: parseBoolean(env.TRADE_SDK_LOGGER_ENABLE_COLORS)
    };

    // Store invalid values for validation
    if (env.TRADE_SDK_LOGGER_LEVEL) {
      (config.logger as any)._invalidLevel = env.TRADE_SDK_LOGGER_LEVEL;
    }
    if (env.TRADE_SDK_LOGGER_FORMAT) {
      (config.logger as any)._invalidFormat = env.TRADE_SDK_LOGGER_FORMAT;
    }
  }
  // If no logger config is specified, Winston logger will be used as default

  // Boolean flags (flattened)
  config.enableMdSocket = parseBoolean(env.TRADE_SDK_ENABLE_MD_SOCKET);
  config.enableMultiplexing = parseBoolean(env.TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING);
  config.syncImmediate = parseBoolean(env.TRADE_SDK_SOCKET_SYNC_IMMEDIATE);
  config.fullOrgSnapshot = parseBoolean(env.TRADE_SDK_SOCKET_FULL_ORG_SNAPSHOT);

  // Client preferences (simplified)
  if (env.TRADE_SDK_LIVE_CLIENT) {
    const liveClient = env.TRADE_SDK_LIVE_CLIENT.toLowerCase();
    config.liveClient = liveClient as 'socket' | 'rest';
  }
  if (env.TRADE_SDK_SIM_CLIENT) {
    const simClient = env.TRADE_SDK_SIM_CLIENT.toLowerCase();
    config.simClient = simClient as 'socket' | 'rest';
  }

  // Socket configuration (flattened)
  if (env.TRADE_SDK_SOCKET_CONNECTION_TIMEOUT) {
    config.connectionTimeout = parseNumber(env.TRADE_SDK_SOCKET_CONNECTION_TIMEOUT);
  }
  if (env.TRADE_SDK_SOCKET_SHARDING_DIVISOR) {
    config.shardingDivisor = parseNumber(env.TRADE_SDK_SOCKET_SHARDING_DIVISOR);
  }
  if (env.TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE) {
    const shardingType = parseShardingType(env.TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE);
    if (shardingType) {
      config.shardingType = shardingType;
    } else {
      // Store invalid value for validation
      (config as any)._invalidShardingType = env.TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE;
    }
  }
  if (env.TRADE_SDK_SOCKET_ENTITY_TYPES) {
    config.entityTypes = parseEntityTypes(env);
  }

  // REST configuration is now handled by RestApi class internally

  // Reconnection configuration (flattened)
  if (env.TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL) {
    config.healthCheckInterval = parseNumber(env.TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL);
  }
  if (env.TRADE_SDK_RECONNECT_MAX_ATTEMPTS) {
    config.maxReconnectAttempts = parseNumber(env.TRADE_SDK_RECONNECT_MAX_ATTEMPTS);
  }
  if (env.TRADE_SDK_RECONNECT_DELAY) {
    config.reconnectDelay = parseNumber(env.TRADE_SDK_RECONNECT_DELAY);
  }
  if (env.TRADE_SDK_RECONNECT_EXPONENTIAL_BACKOFF) {
    config.exponentialBackoff = parseBoolean(env.TRADE_SDK_RECONNECT_EXPONENTIAL_BACKOFF);
  }
  if (env.TRADE_SDK_RECONNECT_HEALTH_CHECK_TIMEOUT) {
    config.healthCheckTimeout = parseNumber(env.TRADE_SDK_RECONNECT_HEALTH_CHECK_TIMEOUT);
  }

  // Rate limiting configuration (simplified - presence enables it)
  if (
    env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPS ||
    env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPM ||
    env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPH ||
    env.TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER ||
    env.TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING ||
    env.TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS
  ) {
    config.rateLimiting = {
      requestsPerSecond: 1000,
      requestsPerMinute: 1000,
      requestsPerHour: 5000,
      burstMultiplier: 2,
      enableBackoff: true,
      maxBackoffTime: 30000,
      logViolations: true
    };

    if (env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPS) {
      const value = parseNumber(env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPS);
      if (value !== undefined) {
        config.rateLimiting.requestsPerSecond = value;
      }
    }
    if (env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPM) {
      const value = parseNumber(env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPM);
      if (value !== undefined) {
        config.rateLimiting.requestsPerMinute = value;
      }
    }
    if (env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPH) {
      const value = parseNumber(env.TRADE_SDK_RATE_LIMIT_GLOBAL_RPH);
      if (value !== undefined) {
        config.rateLimiting.requestsPerHour = value;
      }
    }
    if (env.TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER) {
      const value = parseNumber(env.TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER);
      if (value !== undefined) {
        config.rateLimiting.burstMultiplier = value;
      }
    }
    if (env.TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING) {
      const value = parseBoolean(env.TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING);
      if (value !== undefined) {
        config.rateLimiting.enableBackoff = value;
      }
    }
    if (env.TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS) {
      const value = parseBoolean(env.TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS);
      if (value !== undefined) {
        config.rateLimiting.logViolations = value;
      }
    }
  }

  // Enhanced Message Queue configuration (completely replaces old system)
  if (
    env.TRADE_SDK_MQ_MAX_SIZE ||
    env.TRADE_SDK_MQ_ENABLE_PRIORITY ||
    env.TRADE_SDK_MQ_ENABLE_RETRIES ||
    env.TRADE_SDK_MQ_MAX_RETRIES ||
    env.TRADE_SDK_MQ_RETRY_DELAY ||
    env.TRADE_SDK_MQ_ENABLE_NETWORK_DETECTION ||
    env.TRADE_SDK_MQ_NETWORK_HEALTH_CHECK_INTERVAL ||
    env.TRADE_SDK_MQ_NETWORK_FAILURE_THRESHOLD ||
    env.TRADE_SDK_MQ_ENABLE_MAINTENANCE_QUEUING ||
    env.TRADE_SDK_MQ_QUEUE_TIMEOUT ||
    env.TRADE_SDK_MQ_ENABLE_DEDUPLICATION ||
    env.TRADE_SDK_MQ_DEDUPLICATION_WINDOW ||
    env.TRADE_SDK_MQ_CLEAR_DEDUPLICATION_AFTER_RESOLUTION ||
    env.TRADE_SDK_MQ_DEDUPLICATION_CLEAR_STRATEGY ||
    env.TRADE_SDK_MQ_DEDUPLICATION_CLEAR_DELAY
  ) {
    config.messageQueue = {
      maxSize: 1000,
      enableRetries: true,
      maxRetries: 3,
      retryDelay: 1000,
      enableMaintenanceQueuing: true,
      queueTimeout: 300000,
      enableDeduplication: true,
      deduplicationWindow: 60000
    };

    if (env.TRADE_SDK_MQ_MAX_SIZE) {
      const value = parseInt(env.TRADE_SDK_MQ_MAX_SIZE);
      if (!isNaN(value)) {
        config.messageQueue.maxSize = value;
      }
    }

    if (env.TRADE_SDK_MQ_ENABLE_RETRIES) {
      const value = parseBoolean(env.TRADE_SDK_MQ_ENABLE_RETRIES);
      if (value !== undefined) {
        config.messageQueue.enableRetries = value;
      }
    }

    if (env.TRADE_SDK_MQ_MAX_RETRIES) {
      const value = parseInt(env.TRADE_SDK_MQ_MAX_RETRIES);
      if (!isNaN(value)) {
        config.messageQueue.maxRetries = value;
      }
    }

    if (env.TRADE_SDK_MQ_RETRY_DELAY) {
      const value = parseInt(env.TRADE_SDK_MQ_RETRY_DELAY);
      if (!isNaN(value)) {
        config.messageQueue.retryDelay = value;
      }
    }

    if (env.TRADE_SDK_MQ_ENABLE_MAINTENANCE_QUEUING) {
      const value = parseBoolean(env.TRADE_SDK_MQ_ENABLE_MAINTENANCE_QUEUING);
      if (value !== undefined) {
        config.messageQueue.enableMaintenanceQueuing = value;
      }
    }

    if (env.TRADE_SDK_MQ_QUEUE_TIMEOUT) {
      const value = parseInt(env.TRADE_SDK_MQ_QUEUE_TIMEOUT);
      if (!isNaN(value)) {
        config.messageQueue.queueTimeout = value;
      }
    }

    if (env.TRADE_SDK_MQ_ENABLE_DEDUPLICATION) {
      const value = parseBoolean(env.TRADE_SDK_MQ_ENABLE_DEDUPLICATION);
      if (value !== undefined) {
        config.messageQueue.enableDeduplication = value;
      }
    }

    if (env.TRADE_SDK_MQ_DEDUPLICATION_WINDOW) {
      const value = parseInt(env.TRADE_SDK_MQ_DEDUPLICATION_WINDOW);
      if (!isNaN(value)) {
        config.messageQueue.deduplicationWindow = value;
      }
    }
  }

  // Maintenance configuration
  if (env.TRADE_SDK_MAINTENANCE_ENABLE_DETECTION) {
    config.maintenance = config.maintenance || {
      ...DEFAULT_MAINTENANCE_CONFIG
    };
    const value = parseBoolean(env.TRADE_SDK_MAINTENANCE_ENABLE_DETECTION);
    if (value !== undefined) {
      config.maintenance.enableMaintenanceDetection = value;
    }
  }

  if (env.TRADE_SDK_MAINTENANCE_ENABLE_AUTOMATIC_QUEUING) {
    config.maintenance = config.maintenance || {
      ...DEFAULT_MAINTENANCE_CONFIG
    };
    const value = parseBoolean(env.TRADE_SDK_MAINTENANCE_ENABLE_AUTOMATIC_QUEUING);
    if (value !== undefined) {
      config.maintenance.enableAutomaticQueuing = value;
    }
  }

  if (env.TRADE_SDK_MAINTENANCE_TIMEZONE) {
    config.maintenance = config.maintenance || {
      ...DEFAULT_MAINTENANCE_CONFIG
    };
    config.maintenance.timezone = env.TRADE_SDK_MAINTENANCE_TIMEZONE as 'CT' | 'ET' | 'PT' | 'UTC';
  }

  if (env.TRADE_SDK_MAINTENANCE_QUEUE_TIMEOUT) {
    config.maintenance = config.maintenance || {
      ...DEFAULT_MAINTENANCE_CONFIG
    };
    config.maintenance.queueTimeout = parseInt(env.TRADE_SDK_MAINTENANCE_QUEUE_TIMEOUT);
  }

  if (env.TRADE_SDK_MAINTENANCE_RETRY_ATTEMPTS) {
    config.maintenance = config.maintenance || {
      ...DEFAULT_MAINTENANCE_CONFIG
    };
    config.maintenance.retryAttempts = parseInt(env.TRADE_SDK_MAINTENANCE_RETRY_ATTEMPTS);
  }

  return config;
}

/**
 * Validates the configuration object and throws descriptive errors for invalid values.
 *
 * This function follows the pattern used by top SDKs like Stripe, Twilio, and AWS SDK
 * where configuration validation happens early and provides clear error messages.
 *
 * @param config - The configuration object to validate
 * @throws {ConfigError} When configuration validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const config = createConfigFromEnv();
 *   // config is now guaranteed to be valid
 * } catch (error) {
 *   if (error instanceof ConfigError) {
 *     console.error('Configuration error:', error.message);
 *   }
 * }
 * ```
 */
function validateConfig(config: Partial<AdvancedTradeClientConfig>): void {
  // Validate required fields
  if (!config.credentials) {
    throw new ConfigError(
      'Missing required credentials. Please provide valid authentication credentials.',
      {
        context: {
          missingField: 'credentials',
          reason: 'required_field_missing'
        }
      }
    );
  }

  // Validate stage value first (before checking if it's missing)
  const validStages = ['staging', 'devel', 'prod'] as const;
  if (config.stage && !validStages.includes(config.stage)) {
    throw new ConfigError(
      `Invalid stage: ${config.stage}. Must be one of: ${validStages.join(', ')}`,
      {
        context: {
          field: 'stage',
          reason: 'invalid_value',
          providedValue: config.stage,
          validValues: validStages
        }
      }
    );
  }

  // Check for invalid stage values that were stored during parsing
  if ((config as any)._invalidStage) {
    throw new ConfigError(
      `Invalid stage: ${(config as any)._invalidStage}. Must be one of: ${validStages.join(', ')}`,
      {
        context: {
          field: 'stage',
          reason: 'invalid_value',
          providedValue: (config as any)._invalidStage,
          validValues: validStages
        }
      }
    );
  }

  if (!config.stage) {
    throw new ConfigError('Missing required stage. Must be one of: staging, devel, prod', {
      context: {
        missingField: 'stage',
        reason: 'required_field_missing',
        validValues: ['staging', 'devel', 'prod']
      }
    });
  }

  // Validate credentials structure
  if (!config.credentials.name) {
    throw new ConfigError('credentials.name is required', {
      context: {
        field: 'credentials.name',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.name !== 'string') {
    throw new ConfigError('credentials.name must be a string', {
      context: {
        field: 'credentials.name',
        reason: 'invalid_type',
        providedValue: config.credentials.name,
        expectedType: 'string'
      }
    });
  }

  if (!config.credentials.password) {
    throw new ConfigError('credentials.password is required', {
      context: {
        field: 'credentials.password',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.password !== 'string') {
    throw new ConfigError('credentials.password must be a string', {
      context: {
        field: 'credentials.password',
        reason: 'invalid_type',
        providedValue: config.credentials.password,
        expectedType: 'string'
      }
    });
  }

  if (!config.credentials.appId) {
    throw new ConfigError('credentials.appId is required', {
      context: {
        field: 'credentials.appId',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.appId !== 'string') {
    throw new ConfigError('credentials.appId must be a string', {
      context: {
        field: 'credentials.appId',
        reason: 'invalid_type',
        providedValue: config.credentials.appId,
        expectedType: 'string'
      }
    });
  }

  if (!config.credentials.appVersion) {
    throw new ConfigError('credentials.appVersion is required', {
      context: {
        field: 'credentials.appVersion',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.appVersion !== 'string') {
    throw new ConfigError('credentials.appVersion must be a string', {
      context: {
        field: 'credentials.appVersion',
        reason: 'invalid_type',
        providedValue: config.credentials.appVersion,
        expectedType: 'string'
      }
    });
  }

  if (!config.credentials.cid) {
    // Check if we have an invalid cid value stored
    if ((config.credentials as any)._invalidCid) {
      throw new ConfigError('credentials.cid must be a number', {
        context: {
          field: 'credentials.cid',
          reason: 'invalid_type',
          providedValue: (config.credentials as any)._invalidCid,
          expectedType: 'number'
        }
      });
    }

    throw new ConfigError('credentials.cid is required', {
      context: {
        field: 'credentials.cid',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.cid !== 'number') {
    throw new ConfigError('credentials.cid must be a number', {
      context: {
        field: 'credentials.cid',
        reason: 'invalid_type',
        providedValue: config.credentials.cid,
        expectedType: 'number'
      }
    });
  }

  if (!config.credentials.sec) {
    throw new ConfigError('credentials.sec is required', {
      context: {
        field: 'credentials.sec',
        reason: 'required_field_missing'
      }
    });
  }
  if (typeof config.credentials.sec !== 'string') {
    throw new ConfigError('credentials.sec must be a string', {
      context: {
        field: 'credentials.sec',
        reason: 'invalid_type',
        providedValue: config.credentials.sec,
        expectedType: 'string'
      }
    });
  }

  // Validate numeric configuration values
  if (config.maxReconnectAttempts !== undefined) {
    if (!Number.isInteger(config.maxReconnectAttempts) || config.maxReconnectAttempts <= 0) {
      throw new ConfigError(
        `maxReconnectAttempts must be a positive integer, got: ${config.maxReconnectAttempts}`,
        {
          context: {
            field: 'maxReconnectAttempts',
            reason: 'invalid_value',
            providedValue: config.maxReconnectAttempts,
            expectedType: 'positive integer'
          }
        }
      );
    }
  }

  if (config.healthCheckInterval !== undefined) {
    if (!Number.isInteger(config.healthCheckInterval) || config.healthCheckInterval <= 0) {
      throw new ConfigError(
        `healthCheckInterval must be a positive integer (milliseconds), got: ${config.healthCheckInterval}`,
        {
          context: {
            field: 'healthCheckInterval',
            reason: 'invalid_value',
            providedValue: config.healthCheckInterval,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  if (config.connectionTimeout !== undefined) {
    if (!Number.isInteger(config.connectionTimeout) || config.connectionTimeout <= 0) {
      throw new ConfigError(
        `connectionTimeout must be a positive integer (milliseconds), got: ${config.connectionTimeout}`,
        {
          context: {
            field: 'connectionTimeout',
            reason: 'invalid_value',
            providedValue: config.connectionTimeout,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  if (config.connectionTimeout !== undefined) {
    if (!Number.isInteger(config.connectionTimeout) || config.connectionTimeout <= 0) {
      throw new ConfigError(
        `connectionTimeout must be a positive integer (milliseconds), got: ${config.connectionTimeout}`,
        {
          context: {
            field: 'connectionTimeout',
            reason: 'invalid_value',
            providedValue: config.connectionTimeout,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  if (config.shardingDivisor !== undefined) {
    if (!Number.isInteger(config.shardingDivisor) || config.shardingDivisor <= 0) {
      const errorMessage = config.enableMultiplexing
        ? 'shardingDivisor must be a positive integer when multiplexing is enabled'
        : `shardingDivisor must be a positive integer, got: ${config.shardingDivisor}`;

      throw new ConfigError(errorMessage, {
        context: {
          field: 'shardingDivisor',
          reason: 'invalid_value',
          providedValue: config.shardingDivisor,
          expectedType: 'positive integer'
        }
      });
    }
  }

  if (config.shardingType && !['modUserId', 'modAccountId'].includes(config.shardingType)) {
    throw new ConfigError(
      `Invalid shardingType: "${config.shardingType}". Must be one of: modUserId, modAccountId`,
      {
        context: {
          field: 'shardingType',
          reason: 'invalid_value',
          providedValue: config.shardingType,
          validValues: ['modUserId', 'modAccountId']
        }
      }
    );
  }

  // Check for invalid sharding types that were stored during parsing
  if ((config as any)._invalidShardingType) {
    throw new ConfigError(
      `Invalid shardingType: "${(config as any)._invalidShardingType}". Must be one of: modUserId, modAccountId`,
      {
        context: {
          field: 'shardingType',
          reason: 'invalid_value',
          providedValue: (config as any)._invalidShardingType,
          validValues: ['modUserId', 'modAccountId']
        }
      }
    );
  }

  // Validate reconnection configuration
  if (config.healthCheckInterval !== undefined) {
    if (!Number.isInteger(config.healthCheckInterval) || config.healthCheckInterval <= 0) {
      throw new ConfigError(
        `healthCheckInterval must be a positive integer (milliseconds), got: ${config.healthCheckInterval}`,
        {
          context: {
            field: 'healthCheckInterval',
            reason: 'invalid_value',
            providedValue: config.healthCheckInterval,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  if (config.maxReconnectAttempts !== undefined) {
    if (!Number.isInteger(config.maxReconnectAttempts) || config.maxReconnectAttempts < 0) {
      throw new ConfigError(
        `maxReconnectAttempts must be a non-negative integer, got: ${config.maxReconnectAttempts}`,
        {
          context: {
            field: 'maxReconnectAttempts',
            reason: 'invalid_value',
            providedValue: config.maxReconnectAttempts,
            expectedType: 'non-negative integer'
          }
        }
      );
    }
  }

  if (config.reconnectDelay !== undefined) {
    if (!Number.isInteger(config.reconnectDelay) || config.reconnectDelay <= 0) {
      throw new ConfigError(
        `reconnectDelay must be a positive integer (milliseconds), got: ${config.reconnectDelay}`,
        {
          context: {
            field: 'reconnectDelay',
            reason: 'invalid_value',
            providedValue: config.reconnectDelay,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  if (config.healthCheckTimeout !== undefined) {
    if (!Number.isInteger(config.healthCheckTimeout) || config.healthCheckTimeout <= 0) {
      throw new ConfigError(
        `healthCheckTimeout must be a positive integer (milliseconds), got: ${config.healthCheckTimeout}`,
        {
          context: {
            field: 'healthCheckTimeout',
            reason: 'invalid_value',
            providedValue: config.healthCheckTimeout,
            expectedType: 'positive integer (milliseconds)'
          }
        }
      );
    }
  }

  // Validate client preferences
  if (config.liveClient && !['socket', 'rest'].includes(config.liveClient)) {
    throw new ConfigError(
      `Invalid liveClient: "${config.liveClient}". Must be one of: socket, rest`,
      {
        context: {
          field: 'liveClient',
          reason: 'invalid_value',
          providedValue: config.liveClient,
          validValues: ['socket', 'rest']
        }
      }
    );
  }

  if (config.simClient && !['socket', 'rest'].includes(config.simClient)) {
    throw new ConfigError(
      `Invalid simClient: "${config.simClient}". Must be one of: socket, rest`,
      {
        context: {
          field: 'simClient',
          reason: 'invalid_value',
          providedValue: config.simClient,
          validValues: ['socket', 'rest']
        }
      }
    );
  }

  // Validate sharding configuration
  if (config.enableMultiplexing && config.shardingDivisor !== undefined) {
    if (!Number.isInteger(config.shardingDivisor) || config.shardingDivisor <= 0) {
      throw new ConfigError(
        `shardingDivisor must be a positive integer when multiplexing is enabled, got: ${config.shardingDivisor}`,
        {
          context: {
            field: 'shardingDivisor',
            reason: 'invalid_value',
            providedValue: config.shardingDivisor,
            expectedType: 'positive integer',
            condition: 'when enableMultiplexing is true'
          }
        }
      );
    }
  }

  if (config.shardingType && !['modUserId', 'modAccountId'].includes(config.shardingType)) {
    throw new ConfigError(
      `Invalid shardingType: "${config.shardingType}". Must be one of: modUserId, modAccountId`,
      {
        context: {
          field: 'shardingType',
          reason: 'invalid_value',
          providedValue: config.shardingType,
          validValues: ['modUserId', 'modAccountId']
        }
      }
    );
  }

  // Validate entity types
  if (config.entityTypes && Array.isArray(config.entityTypes)) {
    const validEntityTypes = [
      'account',
      'position',
      'order',
      'fill',
      'contract',
      'product',
      'exchange',
      'currency',
      'user',
      'alert',
      'command',
      'executionReport',
      'cashBalance',
      'orderStrategy',
      'accountRiskStatus',
      'alertSignal',
      'cashBalanceLog',
      'contractMargin'
    ] as const;

    for (let i = 0; i < config.entityTypes.length; i++) {
      const entityType = config.entityTypes[i];
      if (!entityType || !(validEntityTypes as readonly string[]).includes(entityType)) {
        throw new ConfigError(
          `Invalid entity type at index ${i}: ${entityType}. Must be one of: ${validEntityTypes.join(', ')}`,
          {
            context: {
              field: `entityTypes[${i}]`,
              reason: 'invalid_value',
              providedValue: entityType,
              validValues: validEntityTypes
            }
          }
        );
      }
    }
  }

  // Validate rate limiting configuration
  if (config.rateLimiting) {
    if (config.rateLimiting.requestsPerSecond !== undefined) {
      if (
        !Number.isInteger(config.rateLimiting.requestsPerSecond) ||
        config.rateLimiting.requestsPerSecond <= 0
      ) {
        throw new ConfigError(
          `rateLimiting.requestsPerSecond must be a positive integer, got: ${config.rateLimiting.requestsPerSecond}`,
          {
            context: {
              field: 'rateLimiting.requestsPerSecond',
              reason: 'invalid_value',
              providedValue: config.rateLimiting.requestsPerSecond,
              expectedType: 'positive integer'
            }
          }
        );
      }
    }

    if (config.rateLimiting.requestsPerMinute !== undefined) {
      if (
        !Number.isInteger(config.rateLimiting.requestsPerMinute) ||
        config.rateLimiting.requestsPerMinute <= 0
      ) {
        throw new ConfigError(
          `rateLimiting.requestsPerMinute must be a positive integer, got: ${config.rateLimiting.requestsPerMinute}`,
          {
            context: {
              field: 'rateLimiting.requestsPerMinute',
              reason: 'invalid_value',
              providedValue: config.rateLimiting.requestsPerMinute,
              expectedType: 'positive integer'
            }
          }
        );
      }
    }

    if (config.rateLimiting.requestsPerHour !== undefined) {
      if (
        !Number.isInteger(config.rateLimiting.requestsPerHour) ||
        config.rateLimiting.requestsPerHour <= 0
      ) {
        throw new ConfigError(
          `rateLimiting.requestsPerHour must be a positive integer, got: ${config.rateLimiting.requestsPerHour}`,
          {
            context: {
              field: 'rateLimiting.requestsPerHour',
              reason: 'invalid_value',
              providedValue: config.rateLimiting.requestsPerHour,
              expectedType: 'positive integer'
            }
          }
        );
      }
    }

    if (config.rateLimiting.burstMultiplier !== undefined) {
      if (
        typeof config.rateLimiting.burstMultiplier !== 'number' ||
        config.rateLimiting.burstMultiplier <= 0
      ) {
        throw new ConfigError(
          `rateLimiting.burstMultiplier must be a positive number, got: ${config.rateLimiting.burstMultiplier}`,
          {
            context: {
              field: 'rateLimiting.burstMultiplier',
              reason: 'invalid_value',
              providedValue: config.rateLimiting.burstMultiplier,
              expectedType: 'positive number'
            }
          }
        );
      }
    }
  }

  // Validate message queue configuration
  if (config.messageQueue) {
    if (config.messageQueue.maxSize !== undefined) {
      if (!Number.isInteger(config.messageQueue.maxSize) || config.messageQueue.maxSize <= 0) {
        throw new ConfigError(
          `messageQueue.maxSize must be a positive integer, got: ${config.messageQueue.maxSize}`,
          {
            context: {
              field: 'messageQueue.maxSize',
              reason: 'invalid_value',
              providedValue: config.messageQueue.maxSize,
              expectedType: 'positive integer'
            }
          }
        );
      }
    }

    if (config.messageQueue.maxRetries !== undefined) {
      if (!Number.isInteger(config.messageQueue.maxRetries) || config.messageQueue.maxRetries < 0) {
        throw new ConfigError(
          `messageQueue.maxRetries must be a non-negative integer, got: ${config.messageQueue.maxRetries}`,
          {
            context: {
              field: 'messageQueue.maxRetries',
              reason: 'invalid_value',
              providedValue: config.messageQueue.maxRetries,
              expectedType: 'non-negative integer'
            }
          }
        );
      }
    }

    if (config.messageQueue.retryDelay !== undefined) {
      if (
        !Number.isInteger(config.messageQueue.retryDelay) ||
        config.messageQueue.retryDelay <= 0
      ) {
        throw new ConfigError(
          `messageQueue.retryDelay must be a positive integer (milliseconds), got: ${config.messageQueue.retryDelay}`,
          {
            context: {
              field: 'messageQueue.retryDelay',
              reason: 'invalid_value',
              providedValue: config.messageQueue.retryDelay,
              expectedType: 'positive integer (milliseconds)'
            }
          }
        );
      }
    }

    if (config.messageQueue.enableMaintenanceQueuing !== undefined) {
      if (typeof config.messageQueue.enableMaintenanceQueuing !== 'boolean') {
        throw new ConfigError(
          `messageQueue.enableMaintenanceQueuing must be a boolean, got: ${config.messageQueue.enableMaintenanceQueuing}`,
          {
            context: {
              field: 'messageQueue.enableMaintenanceQueuing',
              reason: 'invalid_type',
              providedValue: config.messageQueue.enableMaintenanceQueuing,
              expectedType: 'boolean'
            }
          }
        );
      }
    }

    if (config.messageQueue.queueTimeout !== undefined) {
      if (
        !Number.isInteger(config.messageQueue.queueTimeout) ||
        config.messageQueue.queueTimeout <= 0
      ) {
        throw new ConfigError(
          `messageQueue.queueTimeout must be a positive integer (milliseconds), got: ${config.messageQueue.queueTimeout}`,
          {
            context: {
              field: 'messageQueue.queueTimeout',
              reason: 'invalid_value',
              providedValue: config.messageQueue.queueTimeout,
              expectedType: 'positive integer (milliseconds)'
            }
          }
        );
      }
    }

    if (config.messageQueue.enableDeduplication !== undefined) {
      if (typeof config.messageQueue.enableDeduplication !== 'boolean') {
        throw new ConfigError(
          `messageQueue.enableDeduplication must be a boolean, got: ${config.messageQueue.enableDeduplication}`,
          {
            context: {
              field: 'messageQueue.enableDeduplication',
              reason: 'invalid_type',
              providedValue: config.messageQueue.enableDeduplication,
              expectedType: 'boolean'
            }
          }
        );
      }
    }

    if (config.messageQueue.deduplicationWindow !== undefined) {
      if (
        !Number.isInteger(config.messageQueue.deduplicationWindow) ||
        config.messageQueue.deduplicationWindow <= 0
      ) {
        throw new ConfigError(
          `messageQueue.deduplicationWindow must be a positive integer (milliseconds), got: ${config.messageQueue.deduplicationWindow}`,
          {
            context: {
              field: 'messageQueue.deduplicationWindow',
              reason: 'invalid_value',
              providedValue: config.messageQueue.deduplicationWindow,
              expectedType: 'positive integer (milliseconds)'
            }
          }
        );
      }
    }
  }

  // Validate logger configuration
  if (config.logger) {
    if (config.logger.level && !['error', 'warn', 'info', 'debug'].includes(config.logger.level)) {
      throw new ConfigError(
        `Invalid logger.level: "${config.logger.level}". Must be one of: error, warn, info, debug`,
        {
          context: {
            field: 'logger.level',
            reason: 'invalid_value',
            providedValue: config.logger.level,
            validValues: ['error', 'warn', 'info', 'debug']
          }
        }
      );
    }

    if (config.logger.format && !['json', 'simple', 'detailed'].includes(config.logger.format)) {
      throw new ConfigError(
        `Invalid logger.format: "${config.logger.format}". Must be one of: json, simple, detailed`,
        {
          context: {
            field: 'logger.format',
            reason: 'invalid_value',
            providedValue: config.logger.format,
            validValues: ['json', 'simple', 'detailed']
          }
        }
      );
    }

    if (config.logger.maxFileSize !== undefined) {
      if (!Number.isInteger(config.logger.maxFileSize) || config.logger.maxFileSize <= 0) {
        throw new ConfigError(
          `logger.maxFileSize must be a positive integer (bytes), got: ${config.logger.maxFileSize}`,
          {
            context: {
              field: 'logger.maxFileSize',
              reason: 'invalid_value',
              providedValue: config.logger.maxFileSize,
              expectedType: 'positive integer (bytes)'
            }
          }
        );
      }
    }

    if (config.logger.maxFiles !== undefined) {
      if (!Number.isInteger(config.logger.maxFiles) || config.logger.maxFiles <= 0) {
        throw new ConfigError(
          `logger.maxFiles must be a positive integer, got: ${config.logger.maxFiles}`,
          {
            context: {
              field: 'logger.maxFiles',
              reason: 'invalid_value',
              providedValue: config.logger.maxFiles,
              expectedType: 'positive integer'
            }
          }
        );
      }
    }
  }
}

/**
 * Creates a complete TradeClientConfig by merging environment variables with defaults
 *
 * @param env - Optional environment variables object (defaults to process.env)
 * @returns Complete TradeClientConfig ready for SDK instantiation
 *
 * @example
 * ```typescript
 * const config = createConfigFromEnv();
 * const sdk = new TradeClient(config);
 * ```
 */
export function createConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): AdvancedTradeClientConfig {
  const envConfig = loadConfigFromEnv(env);

  // Validate the configuration before returning
  validateConfig(envConfig);

  return envConfig as AdvancedTradeClientConfig;
}

/**
 * Helper function to parse boolean environment variables
 */
function parseBoolean(value?: string): boolean | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') return true;
  if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') return false;
  return undefined;
}

/**
 * Helper function to parse number environment variables
 */
function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Helper function to validate stage values
 */
function isValidStage(stage: string): stage is TdvStage {
  return ['staging', 'devel', 'prod'].includes(stage);
}

/**
 * Helper function to parse entity types from environment
 */
function parseEntityTypes(env: NodeJS.ProcessEnv) {
  if (!env.TRADE_SDK_SOCKET_ENTITY_TYPES) return undefined;

  try {
    const entityTypes = JSON.parse(env.TRADE_SDK_SOCKET_ENTITY_TYPES);
    if (Array.isArray(entityTypes)) {
      return entityTypes;
    }
  } catch (error) {
    console.warn(
      `Invalid TRADE_SDK_SOCKET_ENTITY_TYPES: ${env.TRADE_SDK_SOCKET_ENTITY_TYPES}. Expected JSON array.`
    );
  }

  return undefined;
}

/**
 * Helper function to parse sharding type from environment
 */
function parseShardingType(value?: string): 'modUserId' | 'modAccountId' | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (['moduserid', 'modaccountid'].includes(lower)) {
    return lower === 'moduserid' ? 'modUserId' : 'modAccountId';
  }
  return undefined;
}

function parsePreset(value?: string): PresetType | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (['standard', 'minimal', 'high-frequency', 'development'].includes(lower)) {
    return lower as PresetType;
  }
  return undefined;
}

/**
 * Creates a sample .env file template
 *
 * @returns String containing a sample .env file with all available options
 */
export function createSampleEnvFile(): string {
  return `# TradeSDK Configuration
# Copy this file to .env and fill in your values

# Required Configuration
TRADE_SDK_STAGE=devel
TRADE_SDK_USERNAME=your_username
TRADE_SDK_PASSWORD=your_password
TRADE_SDK_APP_ID=your_app_id
TRADE_SDK_APP_VERSION=1.0.0
TRADE_SDK_CLIENT_ID=your_client_id
TRADE_SDK_SEC=your_api_secret

# Optional: Preset Configuration (recommended)
# TRADE_SDK_PRESET=standard
# Available presets: standard, minimal, high-frequency

# Optional: Logging Configuration
# Winston Logger Configuration (default and recommended)
# TRADE_SDK_LOGGER_TYPE=winston
# TRADE_SDK_LOGGER_LEVEL=info
# TRADE_SDK_LOGGER_ENABLE_CONSOLE=true
# TRADE_SDK_LOGGER_ENABLE_FILE=false
# TRADE_SDK_LOGGER_FILE_PATH=logs/trade-sdk.log
# TRADE_SDK_LOGGER_MAX_FILE_SIZE=10485760
# TRADE_SDK_LOGGER_MAX_FILES=5
# TRADE_SDK_LOGGER_FORMAT=detailed
# TRADE_SDK_LOGGER_ENABLE_COLORS=true

# Optional: Feature Flags
# TRADE_SDK_ENABLE_MD_SOCKET=true
# TRADE_SDK_LIVE_CLIENT=socket
# TRADE_SDK_SIM_CLIENT=socket

# Optional: Socket Configuration
# TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING=true
# TRADE_SDK_SOCKET_CONNECTION_TIMEOUT=10000
# TRADE_SDK_SOCKET_SHARDING_DIVISOR=4
# TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE=modUserId
# TRADE_SDK_SOCKET_SYNC_IMMEDIATE=true
# TRADE_SDK_SOCKET_FULL_ORG_SNAPSHOT=false
# TRADE_SDK_SOCKET_ENTITY_TYPES=["account","position","order","fill"]

# Optional: REST Configuration
# TRADE_SDK_REST_REQUEST_TIMEOUT=10000
# TRADE_SDK_REST_MAX_RETRIES=3
# TRADE_SDK_REST_RETRY_DELAY=1000

# Optional: Health & Reconnection Configuration
# TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL=30000
# TRADE_SDK_RECONNECT_MAX_ATTEMPTS=5
# TRADE_SDK_RECONNECT_DELAY=5000
# TRADE_SDK_RECONNECT_EXPONENTIAL_BACKOFF=true
# TRADE_SDK_RECONNECT_HEALTH_CHECK_TIMEOUT=5000

# Optional: Rate Limiting Configuration (presence enables it)
# TRADE_SDK_RATE_LIMIT_GLOBAL_RPS=1000
# TRADE_SDK_RATE_LIMIT_GLOBAL_RPM=1000
# TRADE_SDK_RATE_LIMIT_GLOBAL_RPH=5000
# TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER=2
# TRADE_SDK_RATE_LIMIT_ENABLE_MONITORING=true
# TRADE_SDK_RATE_LIMIT_LOG_VIOLATIONS=true

# Optional: Message Queue Configuration (presence enables it)
# TRADE_SDK_MQ_MAX_SIZE=1000
# TRADE_SDK_MQ_ENABLE_PRIORITY=true
# TRADE_SDK_MQ_ENABLE_RETRIES=true
# TRADE_SDK_MQ_MAX_RETRIES=3
# TRADE_SDK_MQ_RETRY_DELAY=1000
# TRADE_SDK_MQ_ENABLE_NETWORK_DETECTION=true
# TRADE_SDK_MQ_NETWORK_HEALTH_CHECK_INTERVAL=30000
# TRADE_SDK_MQ_NETWORK_FAILURE_THRESHOLD=5
# TRADE_SDK_MQ_ENABLE_MAINTENANCE_QUEUING=false
# TRADE_SDK_MQ_QUEUE_TIMEOUT=300000
# TRADE_SDK_MQ_ENABLE_DEDUPLICATION=false
# TRADE_SDK_MQ_DEDUPLICATION_WINDOW=60000
# TRADE_SDK_MQ_CLEAR_DEDUPLICATION_AFTER_RESOLUTION=false
# TRADE_SDK_MQ_DEDUPLICATION_CLEAR_STRATEGY=immediate
# TRADE_SDK_MQ_DEDUPLICATION_CLEAR_DELAY=60000

# Optional: Maintenance Configuration (presence enables it)
# Default maintenance windows:
# - Weekdays: 4-5PM CT
# - Friday: 4-8PM CT (extended)
# - Weekend: 10PM Saturday - 6AM Sunday CT
# TRADE_SDK_MAINTENANCE_ENABLE_DETECTION=false
# TRADE_SDK_MAINTENANCE_ENABLE_AUTOMATIC_QUEUING=false
# TRADE_SDK_MAINTENANCE_TIMEZONE=CT
# TRADE_SDK_MAINTENANCE_QUEUE_TIMEOUT=36000000
# TRADE_SDK_MAINTENANCE_RETRY_ATTEMPTS=3
`;
}
