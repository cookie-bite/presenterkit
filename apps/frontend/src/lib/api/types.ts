// API Request DTOs
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface VerifyRequest {
  email: string;
  otp: string;
}

// API Response Types
export interface AuthResponse {
  success: true;
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface InfoResponse {
  success: true;
  info: string;
}

export interface RefreshResponse {
  success: true;
  accessToken: string;
}

export interface SuccessResponse {
  success: true;
}

// Union type for all possible responses
export type ApiResponse<
  T = AuthResponse | ErrorResponse | InfoResponse | RefreshResponse | SuccessResponse,
> = T;

// JWT Payload type
export interface JwtPayload {
  sub: number; // user ID
  exp: number; // expiration timestamp
  iat?: number; // issued at timestamp
}
