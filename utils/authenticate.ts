import { AuthError, NetworkError, ValidationError } from '../api/errors';
import type { AccessTokenResponse } from '../api/types';
import { URLS } from '../data/constants';
import type { Credentials, TdvStage } from '../types/common';

export type ValidatedAuthResponse = AccessTokenResponse &
  Required<Pick<AccessTokenResponse, 'accessToken' | 'expirationTime' | 'userId'>>;

export default async function authenticate(
  credentials: Credentials,
  stage: TdvStage
): Promise<ValidatedAuthResponse> {
  const url = URLS[stage].live + '/auth/accesstokenrequest';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok && response.status !== 200) {
    throw new NetworkError(`Auth request failed with HTTP ${response.status}`, {
      statusCode: response.status,
      context: { stage, url }
    });
  }

  const authData = (await response.json()) as AccessTokenResponse;

  if (!authData) {
    throw new AuthError('Authentication failed - the server returned an empty response.', {
      context: { stage, reason: 'no_response' }
    });
  }

  if (authData.errorText) {
    throw new AuthError(authData.errorText, {
      context: { stage, reason: 'server_error', userStatus: authData.userStatus }
    });
  }

  if (!authData.accessToken || !authData.expirationTime || !authData.userId) {
    throw new ValidationError('Authentication response missing required fields.', {
      context: {
        stage,
        reason: 'incomplete_response',
        hasAccessToken: !!authData.accessToken,
        hasExpirationTime: !!authData.expirationTime,
        hasUserId: !!authData.userId,
        userStatus: authData.userStatus,
        name: authData.name,
        responseKeys: Object.keys(authData)
      }
    });
  }

  return authData as ValidatedAuthResponse;
}
