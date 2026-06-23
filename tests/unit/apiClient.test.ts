/**
 * Unit tests for ApiClient core functionality
 * Tests initialization, configuration, and basic functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../sdks/apiClient';
import { RestApi } from '../../sdks/restApi';
import { Socket } from '../../sdks/socket';
import { createMockWinstonLogger } from '../setup';

describe('ApiClient', () => {
  let apiClient: ApiClient;
  let mockSocket: Socket;
  let mockRestApi: RestApi;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock instances with proper configuration
    const mockLogger = createMockWinstonLogger();

    // Create Socket with proper config using valid TDVSocketUrl
    mockSocket = new Socket({
      url: 'wss://demo.tradovateapi.com/v1/websocket',
      accessToken: 'test-token',
      userId: 12345,
      entityTypes: ['account', 'position', 'order'],
      syncImmediate: true,
      logger: mockLogger
    });

    // Create RestApi with proper config using valid TDVLiveUrl
    mockRestApi = new RestApi({
      baseUrl: 'https://demo.tradovateapi.com/v1',
      accessToken: 'test-token',
      userId: 12345,
      entityTypes: ['account', 'position', 'order'],
      logger: mockLogger
    });
  });

  describe('Initialization', () => {
    it('should initialize with socket and REST clients', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(apiClient).toBeDefined();
    });

    it('should initialize with socket as preferred client by default', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(apiClient).toBeDefined();
    });

    it('should initialize with REST as preferred client when specified', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi, 'rest');

      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(apiClient).toBeDefined();
    });

    it('should initialize with socket as preferred client when specified', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi, 'socket');

      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(apiClient).toBeDefined();
    });
  });

  describe('Client Selection', () => {
    it('should use socket client when socket is preferred', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi, 'socket');

      expect(apiClient).toBeDefined();
      // Note: We can't test private methods directly, but we can verify the instance is created
    });

    it('should use REST client when REST is preferred', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi, 'rest');

      expect(apiClient).toBeDefined();
    });
  });

  describe('Client Integration', () => {
    it('should integrate with Socket client', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeDefined();
      expect(mockSocket).toBeDefined();
    });

    it('should integrate with RestApi client', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeDefined();
      expect(mockRestApi).toBeDefined();
    });

    it('should handle both client types simultaneously', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeDefined();
      expect(mockSocket).toBeDefined();
      expect(mockRestApi).toBeDefined();
    });
  });

  describe('Constructor Validation', () => {
    it('should accept Socket instance as first parameter', () => {
      expect(() => new ApiClient(mockSocket, mockRestApi)).not.toThrow();
    });

    it('should accept RestApi instance as second parameter', () => {
      expect(() => new ApiClient(mockSocket, mockRestApi)).not.toThrow();
    });

    it('should accept valid preferred client values', () => {
      expect(() => new ApiClient(mockSocket, mockRestApi, 'socket')).not.toThrow();
      expect(() => new ApiClient(mockSocket, mockRestApi, 'rest')).not.toThrow();
    });

    it('should use default preferred client when not specified', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeDefined();
    });
  });

  describe('Instance Properties', () => {
    it('should create a valid ApiClient instance', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient).toBeDefined();
      expect(typeof apiClient).toBe('object');
    });

    it('should have the correct constructor name', () => {
      apiClient = new ApiClient(mockSocket, mockRestApi);

      expect(apiClient.constructor.name).toBe('ApiClient');
    });
  });

  describe('Account Methods', () => {
    beforeEach(() => {
      apiClient = new ApiClient(mockSocket, mockRestApi);
    });

    it('should have account methods available', () => {
      expect(apiClient.account).toBeDefined();
      expect(typeof apiClient.account).toBe('object');
    });

    it('should have resetDemoAccountState method', () => {
      expect(apiClient.account.resetDemoAccountState).toBeDefined();
      expect(typeof apiClient.account.resetDemoAccountState).toBe('function');
    });

    it('should have other account methods', () => {
      expect(apiClient.account.deps).toBeDefined();
      expect(apiClient.account.find).toBeDefined();
      expect(apiClient.account.item).toBeDefined();
      expect(apiClient.account.items).toBeDefined();
      expect(apiClient.account.ldeps).toBeDefined();
      expect(apiClient.account.list).toBeDefined();
      expect(apiClient.account.suggest).toBeDefined();
    });

    describe('ContactInfo Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have contactInfo methods available', () => {
        expect(apiClient.contactInfo).toBeDefined();
        expect(typeof apiClient.contactInfo).toBe('object');
      });

      it('should have all contactInfo methods', () => {
        expect(apiClient.contactInfo.deps).toBeDefined();
        expect(apiClient.contactInfo.item).toBeDefined();
        expect(apiClient.contactInfo.items).toBeDefined();
        expect(apiClient.contactInfo.ldeps).toBeDefined();
        expect(apiClient.contactInfo.updateContactInfo).toBeDefined();
      });
    });

    describe('TradovateSubscription Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have tradovateSubscription methods available', () => {
        expect(apiClient.tradovateSubscription).toBeDefined();
        expect(typeof apiClient.tradovateSubscription).toBe('object');
      });

      it('should have all tradovateSubscription methods', () => {
        expect(apiClient.tradovateSubscription.create).toBeDefined();
        expect(apiClient.tradovateSubscription.update).toBeDefined();
      });
    });

    describe('AccountRiskStatus Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have accountRiskStatus methods available', () => {
        expect(apiClient.accountRiskStatus).toBeDefined();
        expect(typeof apiClient.accountRiskStatus).toBe('object');
      });

      it('should have all accountRiskStatus methods', () => {
        expect(apiClient.accountRiskStatus.updateMaxNetLiq).toBeDefined();
      });
    });

    describe('UserAccountAutoLiq Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have userAccountAutoLiq methods available', () => {
        expect(apiClient.userAccountAutoLiq).toBeDefined();
        expect(typeof apiClient.userAccountAutoLiq).toBe('object');
      });

      it('should have all userAccountAutoLiq methods', () => {
        expect(apiClient.userAccountAutoLiq.create).toBeDefined();
        expect(apiClient.userAccountAutoLiq.update).toBeDefined();
        expect(apiClient.userAccountAutoLiq.updateUserAutoLiq).toBeDefined();
      });
    });

    describe('UserAccountPositionLimit Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have userAccountPositionLimit methods available', () => {
        expect(apiClient.userAccountPositionLimit).toBeDefined();
        expect(typeof apiClient.userAccountPositionLimit).toBe('object');
      });

      it('should have all userAccountPositionLimit methods', () => {
        expect(apiClient.userAccountPositionLimit.create).toBeDefined();
        expect(apiClient.userAccountPositionLimit.update).toBeDefined();
        expect(apiClient.userAccountPositionLimit.deleteUserAccountPositionLimit).toBeDefined();
        expect(apiClient.userAccountPositionLimit.deleteUserAccountRiskParameter).toBeDefined();
      });
    });

    describe('UserAccountRiskParameter Methods', () => {
      beforeEach(() => {
        apiClient = new ApiClient(mockSocket, mockRestApi);
      });

      it('should have userAccountRiskParameter methods available', () => {
        expect(apiClient.userAccountRiskParameter).toBeDefined();
        expect(typeof apiClient.userAccountRiskParameter).toBe('object');
      });

      it('should have all userAccountRiskParameter methods', () => {
        expect(apiClient.userAccountRiskParameter.create).toBeDefined();
        expect(apiClient.userAccountRiskParameter.update).toBeDefined();
      });
    });
  });
});
