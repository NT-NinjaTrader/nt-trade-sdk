/**
 * Maintenance Window Configuration and Detection
 *
 * This module handles automatic detection of maintenance windows and
 * configures which endpoints should be queued during maintenance.
 */

export interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  isActive: (date?: Date) => boolean;
  priority: 'low' | 'medium' | 'high';
  affectedEndpoints: string[];
  queueBehavior: 'queue_all' | 'queue_specific' | 'queue_none';
}

export interface MaintenanceConfig {
  enableMaintenanceDetection: boolean;
  enableAutomaticQueuing: boolean;
  maintenanceWindows: MaintenanceWindow[];
  timezone: 'CT' | 'ET' | 'PT' | 'UTC';
  queueTimeout: number; // milliseconds
  retryAttempts: number;
}

/**
 * Central Time maintenance windows
 */
export const CENTRAL_TIME_MAINTENANCE_WINDOWS: MaintenanceWindow[] = [
  {
    id: 'weekday_evening',
    name: 'Weekday Evening Maintenance',
    description: 'Monday through Friday 4PM-5PM CT',
    priority: 'medium',
    affectedEndpoints: [
      '/user/signuporganizationmember',
      '/user/createevaluationusers',
      '/user/opendemoaccount',
      '/user/createevaluationaccounts'
    ],
    queueBehavior: 'queue_specific',
    isActive: (date = new Date()) => {
      const ctDate = convertToCentralTime(date);
      const day = ctDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = ctDate.getHours();

      // Monday (1) through Friday (5), 4PM-5PM CT
      return day >= 1 && day <= 5 && hour >= 16 && hour < 17;
    }
  },
  {
    id: 'friday_extended',
    name: 'Friday Extended Maintenance',
    description: 'Friday 4PM-8PM CT',
    priority: 'high',
    affectedEndpoints: [
      '/user/signuporganizationmember',
      '/user/createevaluationusers',
      '/user/opendemoaccount',
      '/user/createevaluationaccounts'
    ],
    queueBehavior: 'queue_specific',
    isActive: (date = new Date()) => {
      const ctDate = convertToCentralTime(date);
      const day = ctDate.getDay();
      const hour = ctDate.getHours();

      // Friday (5), 4PM-8PM CT
      return day === 5 && hour >= 16 && hour < 20;
    }
  },
  {
    id: 'weekend_maintenance',
    name: 'Weekend Maintenance',
    description: 'Saturday 10PM through Sunday 6AM CT',
    priority: 'high',
    affectedEndpoints: [
      '/user/signuporganizationmember',
      '/user/createevaluationusers',
      '/user/opendemoaccount',
      '/user/createevaluationaccounts'
    ],
    queueBehavior: 'queue_specific',
    isActive: (date = new Date()) => {
      const ctDate = convertToCentralTime(date);
      const day = ctDate.getDay();
      const hour = ctDate.getHours();
      const minute = ctDate.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      // Saturday (6) 10PM (22:00) through Sunday (0) 6AM (06:00)
      if (day === 6) {
        return timeInMinutes >= 22 * 60; // Saturday 10PM onwards
      } else if (day === 0) {
        return timeInMinutes < 6 * 60; // Sunday before 6AM
      }

      return false;
    }
  }
];

/**
 * Default maintenance configuration
 */
export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enableMaintenanceDetection: true,
  enableAutomaticQueuing: true,
  maintenanceWindows: CENTRAL_TIME_MAINTENANCE_WINDOWS,
  timezone: 'CT',
  queueTimeout: 10 * 60 * 60 * 1000, // 10 hours (covers longest maintenance window + buffer)
  retryAttempts: 3
};

/**
 * Convert a date to Central Time
 * Note: This is a simplified conversion - in production, you might want to use a library like date-fns-tz
 */
export function convertToCentralTime(date: Date): Date {
  // Get the current timezone offset
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;

  // Central Time is UTC-6 (CST) or UTC-5 (CDT)
  // For simplicity, we'll use UTC-6 (CST)
  // In production, you'd want to handle daylight saving time properly
  const centralTime = new Date(utc - 6 * 3600000);

  return centralTime;
}

/**
 * Check if any maintenance window is currently active
 */
export function isMaintenanceActive(config: MaintenanceConfig, date = new Date()): boolean {
  if (!config.enableMaintenanceDetection) {
    return false;
  }

  return config.maintenanceWindows.some(window => window.isActive(date));
}

/**
 * Get the currently active maintenance windows
 */
export function getActiveMaintenanceWindows(
  config: MaintenanceConfig,
  date = new Date()
): MaintenanceWindow[] {
  if (!config.enableMaintenanceDetection) {
    return [];
  }

  return config.maintenanceWindows.filter(window => window.isActive(date));
}

/**
 * Check if an endpoint should be queued during maintenance
 */
export function shouldQueueDuringMaintenance(
  endpoint: string,
  config: MaintenanceConfig,
  date = new Date()
): boolean {
  if (!config.enableMaintenanceDetection || !config.enableAutomaticQueuing) {
    return false;
  }

  const activeWindows = getActiveMaintenanceWindows(config, date);

  return activeWindows.some(
    window =>
      window.affectedEndpoints.includes(endpoint) && window.queueBehavior === 'queue_specific'
  );
}

/**
 * Get maintenance window information for an endpoint
 */
export function getMaintenanceInfoForEndpoint(
  endpoint: string,
  config: MaintenanceConfig,
  date = new Date()
): MaintenanceWindow | null {
  if (!config.enableMaintenanceDetection) {
    return null;
  }

  const activeWindows = getActiveMaintenanceWindows(config, date);

  return activeWindows.find(window => window.affectedEndpoints.includes(endpoint)) || null;
}
