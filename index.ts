/**
 * TradeAPI SDK for TypeScript
 *
 * Main entry point for the TradeAPI SDK.
 */

// Core SDK
export { PartnerSdk, type PartnerSdkConfig } from './sdks/partnerSdk';

// API Clients
export { ApiClient } from './sdks/apiClient';
export { MdApiClient } from './sdks/mdApiClient';
export { RestApi } from './sdks/restApi';

// Connection and socket management
export { ConnectionManager } from './sdks/connectionManager';
export { MultiplexSocket } from './sdks/multiplexSocket';
export { Socket } from './sdks/socket';

// Configuration utilities
export { createConfigFromEnv, createSampleEnvFile } from './sdks/configLoader';

// Preset configuration
export { getPreset, listPresets, PRESET_TYPES, type PresetType } from './sdks/presetConfigs';

// Message handling and queues
export { EnhancedMessageQueue, type EnhancedMessageQueueConfig } from './sdks/enhancedMessageQueue';

// Rate limiting and monitoring
export { HealthMonitor } from './sdks/healthMonitor';
export { RateLimiter, type RateLimitConfig } from './sdks/rateLimiter';

// Caching
export { CacheManager } from './sdks/cacheManager';

// Logging
export { createWinstonLogger, DEFAULT_WINSTON_CONFIGS, WinstonLogger } from './sdks/winstonLogger';

// Type definitions
export type * from './types/common';
export type * from './types/events';
export type * from './types/maintenance';
export type * from './types/runtime';
export type * from './api/mdTypes';
export type * from './api/types';

// API endpoints and errors
export * from './api/endpoints';
export * from './api/errors';

// Constants
export * from './data/constants';

// Authentication utilities
export * from './utils/authenticate';
