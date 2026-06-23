/**
 * Unit tests for preset configurations
 * Tests the preset system and configuration merging
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyPreset, listPresets, PRESET_CONFIGS } from '../../sdks/presetConfigs';
import { TradeClient } from '../../sdks/tradeClient';
import { createTestConfig } from '../setup';

describe('Preset Configurations', () => {
  let sdk: TradeClient;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Preset Types', () => {
    it('should have all required preset types', () => {
      expect(PRESET_CONFIGS).toHaveProperty('standard');
      expect(PRESET_CONFIGS).toHaveProperty('minimal');
      expect(PRESET_CONFIGS).toHaveProperty('high-frequency');
    });

    it('should list all available presets', () => {
      const presets = listPresets();

      expect(presets).toHaveLength(4);
      expect(presets.find(p => p.name === 'standard')).toBeDefined();
      expect(presets.find(p => p.name === 'minimal')).toBeDefined();
      expect(presets.find(p => p.name === 'high-frequency')).toBeDefined();

      const standardPreset = presets.find(p => p.name === 'standard');
      const minimalPreset = presets.find(p => p.name === 'minimal');
      const hfPreset = presets.find(p => p.name === 'high-frequency');

      expect(standardPreset?.description).toContain('WebSocket clients');
      expect(minimalPreset?.description).toContain('Basic WebSocket clients');
      expect(hfPreset?.description).toContain('high-frequency trading');
    });
  });

  describe('Preset Configurations', () => {
    it('should have standard preset configuration', () => {
      const standardPreset = PRESET_CONFIGS['standard'];

      expect(standardPreset).toBeDefined();
      expect(standardPreset.liveClient).toBe('socket');
      expect(standardPreset.simClient).toBe('socket');
      expect(standardPreset.enableMdSocket).toBe(true);
      expect(standardPreset.entityTypes).toContain('account');
      expect(standardPreset.entityTypes).toContain('position');
      expect(standardPreset.entityTypes).toContain('order');
      expect(standardPreset.entityTypes).toContain('fill');
      expect(standardPreset.entityTypes).toContain('accountRiskStatus');
      expect(standardPreset.entityTypes).toContain('fillPair');
      expect(standardPreset.entityTypes).toContain('cashBalance');
    });

    it('should have minimal preset configuration', () => {
      const minimalPreset = PRESET_CONFIGS['minimal'];

      expect(minimalPreset).toBeDefined();
      expect(minimalPreset.liveClient).toBe('socket');
      expect(minimalPreset.simClient).toBe('socket');
      expect(minimalPreset.enableMdSocket).toBe(false);
      expect(minimalPreset.entityTypes).toContain('account');
      expect(minimalPreset.entityTypes).toContain('position');
      expect(minimalPreset.entityTypes).toContain('order');
      expect(minimalPreset.entityTypes).toContain('fill');
      expect(minimalPreset.entityTypes).toContain('cashBalance');
      // Minimal should not have advanced entity types
      expect(minimalPreset.entityTypes).not.toContain('accountRiskStatus');
      expect(minimalPreset.entityTypes).not.toContain('fillPair');
    });

    it('should have high-frequency preset configuration', () => {
      const hfPreset = PRESET_CONFIGS['high-frequency'];

      expect(hfPreset).toBeDefined();
      expect(hfPreset.liveClient).toBe('socket');
      expect(hfPreset.simClient).toBe('socket');
      expect(hfPreset.enableMdSocket).toBe(true);
      expect(hfPreset.entityTypes).toContain('account');
      expect(hfPreset.entityTypes).toContain('position');
      expect(hfPreset.entityTypes).toContain('order');
      expect(hfPreset.entityTypes).toContain('fill');
      expect(hfPreset.entityTypes).toContain('accountRiskStatus');
      expect(hfPreset.entityTypes).toContain('fillPair');
      expect(hfPreset.entityTypes).toContain('cashBalance');
    });
  });

  describe('Preset Application', () => {
    it('should apply standard preset correctly', () => {
      const baseConfig = {
        stage: 'staging' as const,
        credentials: {
          name: 'test-user',
          password: 'test-pass',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 'test-cid',
          sec: 'test-sec'
        }
      };

      const configWithPreset = applyPreset(baseConfig, 'standard');

      expect(configWithPreset.liveClient).toBe('socket');
      expect(configWithPreset.simClient).toBe('socket');
      expect(configWithPreset.enableMdSocket).toBe(true);
      expect(configWithPreset.entityTypes).toContain('account');
    });

    it('should allow preset overrides', () => {
      const baseConfig = {
        stage: 'staging' as const,
        credentials: {
          name: 'test-user',
          password: 'test-pass',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 'test-cid',
          sec: 'test-sec'
        },
        enableMdSocket: true // Override preset
      };

      const configWithPreset = applyPreset(baseConfig, 'standard');

      expect(configWithPreset.enableMdSocket).toBe(true); // Should use override
      expect(configWithPreset.liveClient).toBe('socket'); // Should use preset
    });

    it('should merge nested configurations correctly', () => {
      const baseConfig = {
        stage: 'staging' as const,
        credentials: {
          name: 'test-user',
          password: 'test-pass',
          appId: 'test-app',
          appVersion: '1.0.0',
          cid: 'test-cid',
          sec: 'test-sec'
        },
        rateLimiting: {
          requestsPerSecond: 25 // Override preset rate limit
        }
      };

      const configWithPreset = applyPreset(baseConfig, 'standard');

      expect(configWithPreset.rateLimiting?.requestsPerSecond).toBe(25);
      expect(configWithPreset.rateLimiting?.requestsPerMinute).toBe(500); // Should use preset
    });
  });

  describe('TradeClient Integration', () => {
    it('should initialize TradeClient with standard preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'standard'
      });

      sdk = new TradeClient(config);

      expect(sdk).toBeInstanceOf(TradeClient);
      expect(sdk).toBeDefined();
    });

    it('should initialize TradeClient with minimal preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'minimal'
      });

      sdk = new TradeClient(config);

      expect(sdk).toBeInstanceOf(TradeClient);
      expect(sdk).toBeDefined();
    });

    it('should initialize TradeClient with high-frequency preset', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'high-frequency'
      });

      sdk = new TradeClient(config);

      expect(sdk).toBeInstanceOf(TradeClient);
      expect(sdk).toBeDefined();
    });

    it('should allow preset overrides in TradeClient', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'standard',
        TRADE_SDK_ENABLE_MD_SOCKET: 'true' // Override: enable market data
      });

      sdk = new TradeClient(config);

      expect(sdk).toBeInstanceOf(TradeClient);
      expect(sdk).toBeDefined();
    });

    it('should work with preset and custom rate limiting', () => {
      const config = createTestConfig({
        TRADE_SDK_PRESET: 'minimal',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '30' // Override: custom rate limit
      });

      sdk = new TradeClient(config);

      expect(sdk).toBeInstanceOf(TradeClient);
      expect(sdk).toBeDefined();
    });
  });

  describe('Cache Configuration', () => {
    it('should have correct cache configuration for standard preset', () => {
      const standardPreset = PRESET_CONFIGS['standard'];

      expect(standardPreset.cache).toBeDefined();
      expect(standardPreset.cache?.maxEntries).toBeDefined();
      expect(standardPreset.cache?.maxEntries?.account).toBe(10000);
      expect(standardPreset.cache?.maxEntries?.position).toBe(5000);
      expect(standardPreset.cache?.maxEntries?.order).toBe(2500);
      expect(standardPreset.cache?.maxEntries?.fill).toBe(10000);
      expect(standardPreset.cache?.maxEntries?.accountRiskStatus).toBe(1000);
      expect(standardPreset.cache?.maxEntries?.fillPair).toBe(5000);
      expect(standardPreset.cache?.maxEntries?.cashBalance).toBe(1000);
    });

    it('should have correct cache configuration for minimal preset', () => {
      const minimalPreset = PRESET_CONFIGS['minimal'];

      expect(minimalPreset.cache).toBeDefined();
      expect(minimalPreset.cache?.maxEntries).toBeDefined();
      expect(minimalPreset.cache?.maxEntries?.account).toBe(1000);
      expect(minimalPreset.cache?.maxEntries?.position).toBe(500);
      expect(minimalPreset.cache?.maxEntries?.order).toBe(250);
      expect(minimalPreset.cache?.maxEntries?.fill).toBe(1000);
      expect(minimalPreset.cache?.maxEntries?.cashBalance).toBe(100);
    });

    it('should have correct cache configuration for high-frequency preset', () => {
      const hfPreset = PRESET_CONFIGS['high-frequency'];

      expect(hfPreset.cache).toBeDefined();
      expect(hfPreset.cache?.maxEntries).toBeDefined();
      expect(hfPreset.cache?.maxEntries?.account).toBe(50000);
      expect(hfPreset.cache?.maxEntries?.position).toBe(25000);
      expect(hfPreset.cache?.maxEntries?.order).toBe(10000);
      expect(hfPreset.cache?.maxEntries?.fill).toBe(50000);
      expect(hfPreset.cache?.maxEntries?.accountRiskStatus).toBe(5000);
      expect(hfPreset.cache?.maxEntries?.fillPair).toBe(25000);
      expect(hfPreset.cache?.maxEntries?.cashBalance).toBe(5000);
    });
  });

  describe('Maintenance Configuration', () => {
    it('should have correct maintenance configuration for standard preset', () => {
      const standardPreset = PRESET_CONFIGS['standard'];

      // Maintenance configuration is now hardcoded in the EnhancedMessageQueue
      expect(standardPreset.messageQueue?.enableMaintenanceQueuing).toBe(true);
    });

    it('should have correct maintenance configuration for minimal preset', () => {
      const minimalPreset = PRESET_CONFIGS['minimal'];

      // Maintenance configuration is now hardcoded in the EnhancedMessageQueue
      expect(minimalPreset.messageQueue?.enableMaintenanceQueuing).toBe(false);
    });

    it('should have correct maintenance configuration for high-frequency preset', () => {
      const hfPreset = PRESET_CONFIGS['high-frequency'];

      // Maintenance configuration is now hardcoded in the EnhancedMessageQueue
      expect(hfPreset.messageQueue?.enableMaintenanceQueuing).toBe(true);
    });
  });
});
