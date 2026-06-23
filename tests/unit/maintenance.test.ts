import { describe, expect, it } from 'vitest';
import {
  CENTRAL_TIME_MAINTENANCE_WINDOWS,
  DEFAULT_MAINTENANCE_CONFIG,
  getActiveMaintenanceWindows,
  isMaintenanceActive
} from '../../types/maintenance';

describe('Maintenance Windows', () => {
  describe('Default Configuration', () => {
    it('should have three maintenance windows defined', () => {
      expect(CENTRAL_TIME_MAINTENANCE_WINDOWS).toHaveLength(3);
    });

    it('should have weekday evening maintenance (4-5PM CT)', () => {
      const weekdayWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(w => w.id === 'weekday_evening');
      expect(weekdayWindow).toBeDefined();
      expect(weekdayWindow?.description).toBe('Monday through Friday 4PM-5PM CT');
      expect(weekdayWindow?.priority).toBe('medium');
    });

    it('should have Friday extended maintenance (4-8PM CT)', () => {
      const fridayWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(w => w.id === 'friday_extended');
      expect(fridayWindow).toBeDefined();
      expect(fridayWindow?.description).toBe('Friday 4PM-8PM CT');
      expect(fridayWindow?.priority).toBe('high');
    });

    it('should have weekend maintenance (10PM Saturday - 6AM Sunday CT)', () => {
      const weekendWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(
        w => w.id === 'weekend_maintenance'
      );
      expect(weekendWindow).toBeDefined();
      expect(weekendWindow?.description).toBe('Saturday 10PM through Sunday 6AM CT');
      expect(weekendWindow?.priority).toBe('high');
    });
  });

  describe('Default Maintenance Config', () => {
    it('should use Central Time maintenance windows', () => {
      expect(DEFAULT_MAINTENANCE_CONFIG.maintenanceWindows).toBe(CENTRAL_TIME_MAINTENANCE_WINDOWS);
    });

    it('should have CT timezone', () => {
      expect(DEFAULT_MAINTENANCE_CONFIG.timezone).toBe('CT');
    });

    it('should have 10 hour queue timeout', () => {
      expect(DEFAULT_MAINTENANCE_CONFIG.queueTimeout).toBe(10 * 60 * 60 * 1000); // 10 hours
    });
  });

  describe('Maintenance Window Logic', () => {
    it('should detect weekday evening maintenance correctly', () => {
      const weekdayWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(w => w.id === 'weekday_evening');
      expect(weekdayWindow).toBeDefined();

      // Test Monday 4:30 PM CT (should be active)
      // Create a date that represents 4:30 PM CT on a Monday
      const monday430pm = new Date('2024-01-01T16:30:00-06:00'); // Monday 4:30 PM CT
      expect(weekdayWindow?.isActive(monday430pm)).toBe(true);

      // Test Monday 3:30 PM CT (should not be active)
      const monday330pm = new Date('2024-01-01T15:30:00-06:00'); // Monday 3:30 PM CT
      expect(weekdayWindow?.isActive(monday330pm)).toBe(false);

      // Test Saturday 4:30 PM CT (should not be active)
      const saturday430pm = new Date('2024-01-06T16:30:00-06:00'); // Saturday 4:30 PM CT
      expect(weekdayWindow?.isActive(saturday430pm)).toBe(false);
    });

    it('should detect Friday extended maintenance correctly', () => {
      const fridayWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(w => w.id === 'friday_extended');
      expect(fridayWindow).toBeDefined();

      // Test Friday 6:00 PM CT (should be active)
      const friday6pm = new Date('2024-01-05T18:00:00-06:00'); // Friday 6:00 PM CT
      expect(fridayWindow?.isActive(friday6pm)).toBe(true);

      // Test Friday 3:00 PM CT (should not be active)
      const friday3pm = new Date('2024-01-05T15:00:00-06:00'); // Friday 3:00 PM CT
      expect(fridayWindow?.isActive(friday3pm)).toBe(false);

      // Test Monday 6:00 PM CT (should not be active)
      const monday6pm = new Date('2024-01-01T18:00:00-06:00'); // Monday 6:00 PM CT
      expect(fridayWindow?.isActive(monday6pm)).toBe(false);
    });

    it('should detect weekend maintenance correctly', () => {
      const weekendWindow = CENTRAL_TIME_MAINTENANCE_WINDOWS.find(
        w => w.id === 'weekend_maintenance'
      );
      expect(weekendWindow).toBeDefined();

      // Test Saturday 11:00 PM CT (should be active)
      const saturday11pm = new Date('2024-01-06T23:00:00-06:00'); // Saturday 11:00 PM CT
      expect(weekendWindow?.isActive(saturday11pm)).toBe(true);

      // Test Sunday 3:00 AM CT (should be active)
      const sunday3am = new Date('2024-01-07T03:00:00-06:00'); // Sunday 3:00 AM CT
      expect(weekendWindow?.isActive(sunday3am)).toBe(true);

      // Test Saturday 9:00 PM CT (should not be active)
      const saturday9pm = new Date('2024-01-06T21:00:00-06:00'); // Saturday 9:00 PM CT
      expect(weekendWindow?.isActive(saturday9pm)).toBe(false);

      // Test Sunday 7:00 AM CT (should not be active)
      const sunday7am = new Date('2024-01-07T07:00:00-06:00'); // Sunday 7:00 AM CT
      expect(weekendWindow?.isActive(sunday7am)).toBe(false);
    });
  });

  describe('Maintenance Detection Functions', () => {
    it('should detect active maintenance windows', () => {
      // Test with default config
      const isActive = isMaintenanceActive(DEFAULT_MAINTENANCE_CONFIG);
      // This will depend on the current time, so we just test that it doesn't throw
      expect(typeof isActive).toBe('boolean');
    });

    it('should get active maintenance windows', () => {
      const activeWindows = getActiveMaintenanceWindows(DEFAULT_MAINTENANCE_CONFIG);
      // This will depend on the current time, so we just test that it returns an array
      expect(Array.isArray(activeWindows)).toBe(true);
    });
  });
});
