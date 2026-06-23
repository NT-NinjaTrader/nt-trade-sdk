import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient } from '../../sdks/apiClient';
import { ConfigError } from '../../api/errors';
import type { Socket } from '../../sdks/socket';
import type { RestApi } from '../../sdks/restApi';
import type { MdApiClient } from '../../sdks/mdApiClient';

describe('ApiClient.createOpenPLCalculator', () => {
  let mockSocket: Socket;
  let mockRest: RestApi;
  let mockMdClient: MdApiClient;

  beforeEach(() => {
    // Create minimal mock objects
    mockSocket = {
      updateAccessToken: vi.fn(),
      subscribe: vi.fn()
    } as any;

    mockRest = {
      updateAccessToken: vi.fn(),
      get: vi.fn(),
      post: vi.fn()
    } as any;

    mockMdClient = {
      quote: {
        subscribe: vi.fn().mockResolvedValue({ symbol: 'ESZ5' }),
        unsubscribe: vi.fn()
      },
      listen: vi.fn().mockReturnValue({ unlisten: vi.fn() })
    } as any;
  });

  it('should throw ConfigError when market data client is not available', async () => {
    const mockSdk = {} as any;
    const apiClient = new ApiClient(
      mockSocket,
      mockRest,
      'socket',
      undefined,
      undefined,
      undefined,
      'sim',
      mockSdk
    );

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow(ConfigError);

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow(
      'Market data client is required for P&L calculator'
    );
  });

  it('should throw ConfigError when mode is not set', async () => {
    const mockSdk = { live: {}, sim: {}, md: mockMdClient } as any;
    const apiClient = new ApiClient(
      mockSocket,
      mockRest,
      'socket',
      undefined,
      undefined,
      mockMdClient,
      undefined, // No mode parameter
      mockSdk
    );

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow(ConfigError);

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow(
      'ApiClient mode must be set'
    );
  });

  it('should throw ConfigError when SDK reference is not set', async () => {
    const apiClient = new ApiClient(
      mockSocket,
      mockRest,
      'socket',
      undefined,
      undefined,
      mockMdClient,
      'sim'
      // No SDK reference
    );

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow(ConfigError);

    await expect(apiClient.createOpenPLCalculator({})).rejects.toThrow('SDK reference must be set');
  });

  it('should have the createOpenPLCalculator method defined', () => {
    const mockSdk = {} as any;
    const apiClient = new ApiClient(
      mockSocket,
      mockRest,
      'socket',
      undefined,
      undefined,
      mockMdClient,
      'sim',
      mockSdk
    );

    expect(apiClient.createOpenPLCalculator).toBeDefined();
    expect(typeof apiClient.createOpenPLCalculator).toBe('function');
  });
});
