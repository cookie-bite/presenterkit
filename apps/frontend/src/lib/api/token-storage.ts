import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

import type { JwtPayload } from './types';

// In-memory access token storage
let accessToken: string | null = null;

/**
 * Get the current access token from in-memory storage
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Set the access token in in-memory storage
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Clear the access token from in-memory storage
 */
export function clearAccessToken(): void {
  accessToken = null;
}

/**
 * Check if the access token is expired or will expire soon (within 8 seconds)
 * Returns true if token is missing, expired, or expiring soon
 */
export function isAccessTokenExpiringSoon(): boolean {
  if (!accessToken) {
    return true;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // Token is expiring soon if less than 8 seconds remaining
    return timeUntilExpiry < 8000;
  } catch (error) {
    // If token is malformed, consider it expired
    console.error('Error decoding access token:', error);
    return true;
  }
}

/**
 * Get the refresh token from cookies
 * Cookie name: 'refreshToken' (backend will set this)
 */
export function getRefreshToken(): string | null {
  return Cookies.get('refreshToken') || null;
}

/**
 * Clear the refresh token cookie
 * Note: Backend will handle actual deletion, this just clears the cookie on client
 */
export function clearRefreshToken(): void {
  Cookies.remove('refreshToken');
}

/**
 * Clear all tokens (both access and refresh)
 */
export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}

