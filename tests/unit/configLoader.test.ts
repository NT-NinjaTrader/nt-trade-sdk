import { beforeEach, describe, expect, it } from 'vitest';
import { ConfigError } from '../../api/errors';
import { createConfigFromEnv, createSampleEnvFile } from '../../sdks/configLoader';

describe('ConfigLoader Validation', () => {
  let mockEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Reset mock environment for each test
    mockEnv = {
      TRADE_SDK_STAGE: 'devel',
      TRADE_SDK_USERNAME: 'testuser',
      TRADE_SDK_PASSWORD: 'testpass',
      TRADE_SDK_APP_ID: 'testapp',
      TRADE_SDK_APP_VERSION: '1.0.0',
      TRADE_SDK_CLIENT_ID: '12345',
      TRADE_SDK_SEC: 'testsecret'
    };
  });

  describe('Required Fields Validation', () => {
    it('should throw ConfigError when credentials are missing', () => {
      delete mockEnv.TRADE_SDK_USERNAME;

      expect(() => createConfigFromEnv(mockEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(mockEnv)).toThrow('Missing required credentials');
    });

    it('should throw ConfigError when stage is missing', () => {
      delete mockEnv.TRADE_SDK_STAGE;

      expect(() => createConfigFromEnv(mockEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(mockEnv)).toThrow('Missing required stage');
    });

    it('should throw ConfigError when username or password is missing', () => {
      const requiredFields = ['TRADE_SDK_USERNAME', 'TRADE_SDK_PASSWORD'];

      for (const field of requiredFields) {
        const testEnv = { ...mockEnv };
        delete testEnv[field as keyof NodeJS.ProcessEnv];

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow('Missing required credentials');
      }
    });

    it('should throw ConfigError when optional credential fields are invalid', () => {
      // Test with invalid cid (non-numeric)
      const testEnv = { ...mockEnv, TRADE_SDK_CLIENT_ID: 'invalid' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow('credentials.cid must be a number');
    });
  });

  describe('Stage Validation', () => {
    it('should accept valid stages', () => {
      const validStages = ['staging', 'devel', 'prod'];

      for (const stage of validStages) {
        const testEnv = { ...mockEnv, TRADE_SDK_STAGE: stage };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should reject invalid stages', () => {
      const invalidStages = ['invalid', 'test', 'local', 'dev'];

      for (const stage of invalidStages) {
        const testEnv = { ...mockEnv, TRADE_SDK_STAGE: stage };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid stage: ${stage}`);
        expect(() => createConfigFromEnv(testEnv)).toThrow('Must be one of: staging, devel, prod');
      }
    });
  });

  describe('Numeric Value Validation', () => {
    it('should reject negative timeouts', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '-1000' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow('must be a positive integer');
    });

    it('should reject zero timeouts', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '0' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow('must be a positive integer');
    });

    it('should reject non-integer timeouts', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '1000.5' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow('must be a positive integer');
    });

    it('should accept valid positive integers', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_CONNECTION_TIMEOUT: '5000' };

      expect(() => createConfigFromEnv(testEnv)).not.toThrow();
    });

    it('should validate maxReconnectAttempts', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RECONNECT_MAX_ATTEMPTS: '-1' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'maxReconnectAttempts must be a positive integer'
      );
    });

    it('should validate healthCheckInterval', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL: '0' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'healthCheckInterval must be a positive integer'
      );
    });
  });

  describe('Client Preferences Validation', () => {
    it('should accept valid liveClient values', () => {
      const validClients = ['socket', 'rest'];

      for (const client of validClients) {
        const testEnv = { ...mockEnv, TRADE_SDK_LIVE_CLIENT: client };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should reject invalid liveClient values', () => {
      const invalidClients = ['websocket', 'http', 'grpc', 'invalid'];

      for (const client of invalidClients) {
        const testEnv = { ...mockEnv, TRADE_SDK_LIVE_CLIENT: client };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid liveClient: "${client}"`);
        expect(() => createConfigFromEnv(testEnv)).toThrow('Must be one of: socket, rest');
      }
    });

    it('should accept valid simClient values', () => {
      const validClients = ['socket', 'rest'];

      for (const client of validClients) {
        const testEnv = { ...mockEnv, TRADE_SDK_SIM_CLIENT: client };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should reject invalid simClient values', () => {
      const invalidClients = ['websocket', 'http', 'grpc', 'invalid'];

      for (const client of invalidClients) {
        const testEnv = { ...mockEnv, TRADE_SDK_SIM_CLIENT: client };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid simClient: "${client}"`);
        expect(() => createConfigFromEnv(testEnv)).toThrow('Must be one of: socket, rest');
      }
    });
  });

  describe('Sharding Configuration Validation', () => {
    it('should validate shardingDivisor when multiplexing is enabled', () => {
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING: 'true',
        TRADE_SDK_SOCKET_SHARDING_DIVISOR: '0'
      };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'shardingDivisor must be a positive integer when multiplexing is enabled'
      );
    });

    it('should accept valid shardingType values', () => {
      const validTypes = ['modUserId', 'modAccountId'];

      for (const type of validTypes) {
        const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE: type };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should reject invalid shardingType values', () => {
      const invalidTypes = ['modUser', 'modAccount', 'hash', 'invalid'];

      for (const type of invalidTypes) {
        const testEnv = { ...mockEnv, TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE: type };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid shardingType: "${type}"`);
        expect(() => createConfigFromEnv(testEnv)).toThrow(
          'Must be one of: modUserId, modAccountId'
        );
      }
    });
  });

  describe('Entity Types Validation', () => {
    it('should accept valid entity types', () => {
      const validTypes = ['account', 'position', 'order', 'fill'];
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_SOCKET_ENTITY_TYPES: JSON.stringify(validTypes)
      };

      expect(() => createConfigFromEnv(testEnv)).not.toThrow();
    });

    it('should reject invalid entity types', () => {
      const invalidTypes = ['invalid', 'test', 'unknown'];

      for (const type of invalidTypes) {
        const testEnv = {
          ...mockEnv,
          TRADE_SDK_SOCKET_ENTITY_TYPES: JSON.stringify([type])
        };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(
          `Invalid entity type at index 0: ${type}`
        );
      }
    });

    it('should provide context for array index in entity types', () => {
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_SOCKET_ENTITY_TYPES: JSON.stringify(['account', 'invalid', 'position'])
      };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow('Invalid entity type at index 1: invalid');
    });
  });

  describe('Rate Limiting Validation', () => {
    it('should validate globalRequestsPerSecond', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '-5' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'rateLimiting.requestsPerSecond must be a positive integer'
      );
    });

    it('should validate globalRequestsPerMinute', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RATE_LIMIT_GLOBAL_RPM: '0' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'rateLimiting.requestsPerMinute must be a positive integer'
      );
    });

    it('should validate globalRequestsPerHour', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RATE_LIMIT_GLOBAL_RPH: '1000.5' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'rateLimiting.requestsPerHour must be a positive integer'
      );
    });

    it('should validate burstMultiplier', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER: '-1.5' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'rateLimiting.burstMultiplier must be a positive number'
      );
    });

    it('should accept valid rate limiting values', () => {
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '10',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPM: '500',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPH: '10000',
        TRADE_SDK_RATE_LIMIT_BURST_MULTIPLIER: '2.5'
      };

      expect(() => createConfigFromEnv(testEnv)).not.toThrow();
    });
  });

  describe('Message Queue Validation', () => {
    it('should validate maxSize', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_MQ_MAX_SIZE: '0' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'messageQueue.maxSize must be a positive integer'
      );
    });

    it('should validate maxRetries (non-negative)', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_MQ_MAX_RETRIES: '-1' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'messageQueue.maxRetries must be a non-negative integer'
      );
    });

    it('should accept zero maxRetries', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_MQ_MAX_RETRIES: '0' };

      expect(() => createConfigFromEnv(testEnv)).not.toThrow();
    });

    it('should validate retryDelay', () => {
      const testEnv = { ...mockEnv, TRADE_SDK_MQ_RETRY_DELAY: '0' };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'messageQueue.retryDelay must be a positive integer'
      );
    });
  });

  describe('Logger Configuration Validation', () => {
    it('should validate logger level', () => {
      const invalidLevels = ['invalid', 'trace', 'fatal'];

      for (const level of invalidLevels) {
        const testEnv = { ...mockEnv, TRADE_SDK_LOGGER_LEVEL: level };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid logger.level: "${level}"`);
        expect(() => createConfigFromEnv(testEnv)).toThrow(
          'Must be one of: error, warn, info, debug'
        );
      }
    });

    it('should accept valid logger levels', () => {
      const validLevels = ['error', 'warn', 'info', 'debug'];

      for (const level of validLevels) {
        const testEnv = {
          ...mockEnv,
          TRADE_SDK_LOGGER_TYPE: 'winston',
          TRADE_SDK_LOGGER_LEVEL: level
        };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should validate logger format', () => {
      const invalidFormats = ['invalid', 'xml', 'yaml'];

      for (const format of invalidFormats) {
        const testEnv = {
          ...mockEnv,
          TRADE_SDK_LOGGER_TYPE: 'winston',
          TRADE_SDK_LOGGER_FORMAT: format
        };

        expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
        expect(() => createConfigFromEnv(testEnv)).toThrow(`Invalid logger.format: "${format}"`);
        expect(() => createConfigFromEnv(testEnv)).toThrow(
          'Must be one of: json, simple, detailed'
        );
      }
    });

    it('should accept valid logger formats', () => {
      const validFormats = ['json', 'simple', 'detailed'];

      for (const format of validFormats) {
        const testEnv = {
          ...mockEnv,
          TRADE_SDK_LOGGER_TYPE: 'winston',
          TRADE_SDK_LOGGER_FORMAT: format
        };
        expect(() => createConfigFromEnv(testEnv)).not.toThrow();
      }
    });

    it('should validate maxFileSize', () => {
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_LOGGER_TYPE: 'winston',
        TRADE_SDK_LOGGER_MAX_FILE_SIZE: '-1024'
      };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'logger.maxFileSize must be a positive integer'
      );
    });

    it('should validate maxFiles', () => {
      const testEnv = {
        ...mockEnv,
        TRADE_SDK_LOGGER_TYPE: 'winston',
        TRADE_SDK_LOGGER_MAX_FILES: '0'
      };

      expect(() => createConfigFromEnv(testEnv)).toThrow(ConfigError);
      expect(() => createConfigFromEnv(testEnv)).toThrow(
        'logger.maxFiles must be a positive integer'
      );
    });
  });

  describe('Error Context and Messages', () => {
    it('should provide detailed error context for missing credentials', () => {
      delete mockEnv.TRADE_SDK_USERNAME;

      try {
        createConfigFromEnv(mockEnv);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        if (error instanceof ConfigError) {
          expect(error.context).toEqual({
            missingField: 'credentials',
            reason: 'required_field_missing'
          });
        }
      }
    });

    it('should provide detailed error context for invalid stage', () => {
      mockEnv.TRADE_SDK_STAGE = 'invalid';

      try {
        createConfigFromEnv(mockEnv);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        if (error instanceof ConfigError) {
          expect(error.context).toEqual({
            field: 'stage',
            reason: 'invalid_value',
            providedValue: 'invalid',
            validValues: ['staging', 'devel', 'prod']
          });
        }
      }
    });

    it('should provide detailed error context for invalid numeric values', () => {
      mockEnv.TRADE_SDK_SOCKET_CONNECTION_TIMEOUT = '-5000';

      try {
        createConfigFromEnv(mockEnv);
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigError);
        if (error instanceof ConfigError) {
          expect(error.context).toEqual({
            field: 'connectionTimeout',
            reason: 'invalid_value',
            providedValue: -5000,
            expectedType: 'positive integer (milliseconds)'
          });
        }
      }
    });
  });

  describe('Successful Validation', () => {
    it('should successfully validate a complete valid configuration', () => {
      const completeEnv = {
        ...mockEnv,
        TRADE_SDK_LOGGER_TYPE: 'winston',
        TRADE_SDK_LOGGER_LEVEL: 'info',
        TRADE_SDK_LOGGER_FORMAT: 'detailed',
        TRADE_SDK_LOGGER_VERBOSITY: 'normal',
        TRADE_SDK_LIVE_CLIENT: 'socket',
        TRADE_SDK_SIM_CLIENT: 'rest',
        TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING: 'true',
        TRADE_SDK_SOCKET_SHARDING_DIVISOR: '4',
        TRADE_SDK_SOCKET_SHARDING_EXPRESSION_TYPE: 'modUserId',
        TRADE_SDK_RATE_LIMIT_GLOBAL_RPS: '10',
        TRADE_SDK_MQ_MAX_SIZE: '1000'
      };

      expect(() => createConfigFromEnv(completeEnv)).not.toThrow();

      const config = createConfigFromEnv(completeEnv);
      expect(config.stage).toBe('devel');
      expect(config.credentials?.name).toBe('testuser');
      expect(config.logger).toBeDefined();
      expect(config.liveClient).toBe('socket');
      expect(config.simClient).toBe('rest');
    });

    it('should successfully validate minimal valid configuration', () => {
      expect(() => createConfigFromEnv(mockEnv)).not.toThrow();

      const config = createConfigFromEnv(mockEnv);
      expect(config.stage).toBe('devel');
      expect(config.credentials?.name).toBe('testuser');
      expect(config.credentials?.password).toBe('testpass');
      expect(config.credentials?.appId).toBe('testapp');
      expect(config.credentials?.appVersion).toBe('1.0.0');
      expect(config.credentials?.cid).toBe(12345);
      expect(config.credentials?.sec).toBe('testsecret');
    });
  });

  describe('createSampleEnvFile Function', () => {
    it('should generate a sample .env file with all optional defaults commented out', () => {
      const sampleEnv = createSampleEnvFile();

      // Should contain required configuration
      expect(sampleEnv).toContain('TRADE_SDK_STAGE=devel');
      expect(sampleEnv).toContain('TRADE_SDK_USERNAME=your_username');
      expect(sampleEnv).toContain('TRADE_SDK_PASSWORD=your_password');
      expect(sampleEnv).toContain('TRADE_SDK_APP_ID=your_app_id');
      expect(sampleEnv).toContain('TRADE_SDK_APP_VERSION=1.0.0');
      expect(sampleEnv).toContain('TRADE_SDK_CLIENT_ID=your_client_id');
      expect(sampleEnv).toContain('TRADE_SDK_SEC=your_api_secret');

      // Should contain commented optional defaults
      expect(sampleEnv).toContain('# TRADE_SDK_LOGGER_TYPE=winston');
      expect(sampleEnv).toContain('# TRADE_SDK_LOGGER_LEVEL=info');
      expect(sampleEnv).toContain('# TRADE_SDK_ENABLE_MD_SOCKET=true');
      expect(sampleEnv).toContain('# TRADE_SDK_SOCKET_ENABLE_MULTIPLEXING=true');
      expect(sampleEnv).toContain('# TRADE_SDK_SOCKET_CONNECTION_TIMEOUT=10000');
      expect(sampleEnv).toContain('# TRADE_SDK_REST_REQUEST_TIMEOUT=10000');
      expect(sampleEnv).toContain('# TRADE_SDK_RECONNECT_HEALTH_CHECK_INTERVAL=30000');
      expect(sampleEnv).toContain('# TRADE_SDK_RATE_LIMIT_GLOBAL_RPS=10');
      expect(sampleEnv).toContain('# TRADE_SDK_MQ_MAX_SIZE=1000');
      expect(sampleEnv).toContain('# TRADE_SDK_MAINTENANCE_ENABLE_DETECTION=false');

      // Should NOT contain uncommented optional defaults (they should all be commented)
      expect(sampleEnv).not.toContain('\nTRADE_SDK_LOGGER_TYPE=winston\n');
      expect(sampleEnv).not.toContain('\nTRADE_SDK_ENABLE_MD_SOCKET=true\n');
      expect(sampleEnv).not.toContain('\nTRADE_SDK_SOCKET_ENABLE_MULTIPLEXING=true\n');

      // Should contain proper section headers
      expect(sampleEnv).toContain('# Optional: Logging Configuration');
      expect(sampleEnv).toContain('# Optional: Feature Flags');
      expect(sampleEnv).toContain('# Optional: Socket Configuration');
      expect(sampleEnv).toContain('# Optional: REST Configuration');
      expect(sampleEnv).toContain('# Optional: Health & Reconnection Configuration');
      expect(sampleEnv).toContain('# Optional: Rate Limiting Configuration');
      expect(sampleEnv).toContain('# Optional: Message Queue Configuration');
      expect(sampleEnv).toContain('# Optional: Maintenance Configuration');
    });
  });
});
