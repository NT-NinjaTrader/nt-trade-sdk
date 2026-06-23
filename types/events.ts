/**
 * Simplified Event System for TradeSDK
 *
 * This file consolidates all event types into logical groups to reduce
 * developer confusion and eliminate redundancy.
 */

/**
 * Connection-related event types (consolidated from Connection, Health, and Reconnection events)
 */
export type ConnectionEventType =
  | 'connected' // Connection established
  | 'disconnected' // Connection lost
  | 'connecting' // Connection attempt started
  | 'connection_failed' // Connection attempt failed
  | 'health_degraded' // Health check failed or degraded
  | 'health_restored' // Health restored after degradation
  | 'reconnecting' // Reconnection attempt started
  | 'reconnect_failed'; // Reconnection attempt failed

/**
 * Connection event interface
 */
export interface ConnectionEvent {
  type: ConnectionEventType;
  timestamp: number;
  stage?: string;
  error?: string;
  attempt?: number;
  healthStatus?: any;
  previousStatus?: any;
}

/**
 * System event types (consolidated from System and other operational events)
 */
export type SystemEventType =
  | 'sdk_initialized' // SDK initialization complete
  | 'config_loaded' // Configuration loaded
  | 'health_check_started' // Health monitoring started
  | 'health_check_completed' // Health monitoring completed
  | 'rate_limit_hit' // Rate limit exceeded
  | 'cache_cleared' // Cache cleared
  | 'maintenance_mode' // Maintenance mode activated
  | 'version_update'; // Version update available

/**
 * System event interface
 */
export interface SystemEvent {
  type: SystemEventType;
  timestamp: number;
  message?: string;
  metadata?: Record<string, any>;
  healthStatus?: any;
  previousStatus?: any;
}

// Legacy type aliases for backward compatibility
export type HealthEventType = ConnectionEventType;
export type ReconnectEventType = ConnectionEventType;
export type HealthEvent = ConnectionEvent;
export type ReconnectEvent = ConnectionEvent;
