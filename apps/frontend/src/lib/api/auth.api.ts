import { apiClient } from './client';
import { getRefreshToken, setAccessToken } from './token-storage';
import type {
  AuthResponse,
  ErrorResponse,
  GoogleLoginRequest,
  InfoResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  SuccessResponse,
  VerifyRequest,
} from './types';

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<InfoResponse | ErrorResponse> {
  return apiClient.post('auth/register', { json: data }).json<InfoResponse | ErrorResponse>();
}

/**
 * Verify OTP after registration
 */
export async function verify(data: VerifyRequest): Promise<AuthResponse | ErrorResponse> {
  const response = await apiClient.post('auth/verify', { json: data }).json<AuthResponse | ErrorResponse>();

  // If successful, store the access token (refresh token is set by backend via cookie)
  if (response.success && 'accessToken' in response) {
    setAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<AuthResponse | ErrorResponse> {
  const response = await apiClient.post('auth/login', { json: data }).json<AuthResponse | ErrorResponse>();

  // If successful, store the access token (refresh token is set by backend via cookie)
  if (response.success && 'accessToken' in response) {
    setAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Refresh the access token using refresh token from cookie
 */
export async function refreshToken(): Promise<RefreshResponse | ErrorResponse> {
  const refreshTokenValue = getRefreshToken();

  if (!refreshTokenValue) {
    return {
      success: false,
      error: 'No refresh token available',
    } as ErrorResponse;
  }

  const response = await apiClient
    .post('auth/refresh', { json: { token: refreshTokenValue } as RefreshRequest })
    .json<RefreshResponse | ErrorResponse>();

  // If successful, store the new access token
  if (response.success && 'accessToken' in response) {
    setAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Login with Google ID token
 */
export async function googleLogin(data: GoogleLoginRequest): Promise<AuthResponse | ErrorResponse> {
  const response = await apiClient
    .post('auth/google', { json: data })
    .json<AuthResponse | ErrorResponse>();

  // If successful, store the access token (refresh token is set by backend via cookie)
  if (response.success && 'accessToken' in response) {
    setAccessToken(response.accessToken);
  }

  return response;
}

/**
 * Logout - invalidate refresh token
 */
export async function logout(): Promise<SuccessResponse | ErrorResponse> {
  const refreshTokenValue = getRefreshToken();

  if (!refreshTokenValue) {
    return {
      success: false,
      error: 'No refresh token available',
    } as ErrorResponse;
  }

  return apiClient
    .post('auth/logout', { json: { token: refreshTokenValue } as LogoutRequest })
    .json<SuccessResponse | ErrorResponse>();
}

