import ky, { type KyInstance } from 'ky';

import {
  clearAllTokens,
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpiringSoon,
  setAccessToken,
} from './token-storage';
import type { ErrorResponse, RefreshRequest, RefreshResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Request queue for handling concurrent requests during token refresh
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh the access token using the refresh token from cookies
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await ky
      .post(`${API_URL}/auth/refresh`, {
        json: { token: refreshToken } as RefreshRequest,
        timeout: 20000,
      })
      .json<RefreshResponse | ErrorResponse>();

    if (!response.success) {
      throw new Error((response as ErrorResponse).error || 'Token refresh failed');
    }

    const { accessToken } = response as RefreshResponse;
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    clearAllTokens();
    throw error;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * Uses a promise queue to prevent concurrent refresh calls
 */
async function getValidAccessToken(): Promise<string | null> {
  const currentToken = getAccessToken();

  // If no token or token is expiring soon, refresh it
  if (!currentToken || isAccessTokenExpiringSoon()) {
    // If refresh is already in progress, wait for it
    if (refreshPromise) {
      try {
        return await refreshPromise;
      } catch {
        // If refresh failed, try again
        refreshPromise = null;
      }
    }

    // Start new refresh
    refreshPromise = refreshAccessToken();
    try {
      const newToken = await refreshPromise;
      refreshPromise = null;
      return newToken;
    } catch (error) {
      refreshPromise = null;
      throw error;
    }
  }

  return currentToken;
}

/**
 * Create and configure the ky HTTP client instance
 */
export const apiClient: KyInstance = ky.create({
  prefixUrl: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async request => {
        // Skip token attachment for auth endpoints
        const url = new URL(request.url);
        if (
          url.pathname.includes('/auth/register') ||
          url.pathname.includes('/auth/login') ||
          url.pathname.includes('/auth/verify') ||
          url.pathname.includes('/auth/google')
        ) {
          return;
        }

        // For other endpoints, get valid access token
        try {
          const token = await getValidAccessToken();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        } catch (error) {
          console.error('Error getting access token:', error);
          // Continue without token, let the server respond with 401
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // Handle 401 Unauthorized - clear tokens
        // Note: Proactive refresh in beforeRequest should handle most cases
        // This is a fallback for edge cases
        if (response.status === 401) {
          const url = new URL(request.url);

          // Don't clear tokens for refresh endpoint (it might be a legitimate failure)
          if (!url.pathname.includes('/auth/refresh')) {
            // Clear tokens on 401 to force re-authentication
            clearAllTokens();
          }
        }

        return response;
      },
    ],
    beforeError: [
      async error => {
        // Handle network errors and timeouts
        if (error.name === 'TimeoutError') {
          error.message = 'Request timeout. Please try again.';
          return error;
        }

        if (error.name === 'HTTPError') {
          // Try to parse error response
          try {
            const errorBody = (await error.response.json()) as ErrorResponse;
            if (errorBody.error) {
              error.message = errorBody.error;
            }
          } catch {
            // If parsing fails, keep original error message
          }
        }

        return error;
      },
    ],
  },
});
