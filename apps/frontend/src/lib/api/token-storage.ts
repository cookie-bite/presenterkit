import { jwtDecode } from 'jwt-decode';

import type { JwtPayload } from './types';

// In-memory access token storage
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

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
