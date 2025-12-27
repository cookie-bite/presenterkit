'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { googleLogin, login, logout, register, verify } from '@/lib/api/auth.api';
import { clearAllTokens } from '@/lib/api/token-storage';
import type {
  AuthResponse,
  ErrorResponse,
  GoogleLoginRequest,
  InfoResponse,
  LoginRequest,
  RegisterRequest,
  SuccessResponse,
  VerifyRequest,
} from '@/lib/api/types';

/**
 * Hook for user registration
 */
export function useRegister() {
  return useMutation<InfoResponse | ErrorResponse, Error, RegisterRequest>({
    mutationFn: register,
  });
}

/**
 * Hook for OTP verification after registration
 */
export function useVerify() {
  const router = useRouter();

  return useMutation<AuthResponse | ErrorResponse, Error, VerifyRequest>({
    mutationFn: verify,
    onSuccess: data => {
      if (data.success && 'accessToken' in data) {
        // Redirect to dashboard on successful verification
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();

  return useMutation<AuthResponse | ErrorResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: data => {
      if (data.success && 'accessToken' in data) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for Google sign-in
 */
export function useGoogleLogin() {
  const router = useRouter();

  return useMutation<AuthResponse | ErrorResponse, Error, GoogleLoginRequest>({
    mutationFn: googleLogin,
    onSuccess: data => {
      if (data.success && 'accessToken' in data) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();

  return useMutation<SuccessResponse | ErrorResponse, Error, void>({
    mutationFn: async () => {
      await logout();
      clearAllTokens();
      return { success: true } as SuccessResponse;
    },
    onSuccess: () => {
      // Redirect to auth page on logout
      router.push('/auth');
    },
  });
}
