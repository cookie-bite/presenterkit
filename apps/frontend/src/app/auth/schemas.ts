import { z } from 'zod';

// Password validation regex (matches backend)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).{8,}$/;

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form schema
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .refine((val) => /^.{3,30}$/.test(val), 'Invalid username'),
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password must be at most 30 characters')
    .refine((val) => /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
    .refine((val) => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
    .refine((val) => /[0-9]/.test(val), 'Password must contain at least one digit')
    .refine((val) => /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val), 'Password must contain at least one special character')
    .refine((val) => passwordRegex.test(val), 'Password does not meet requirements'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Verify OTP schema (for form - OTP is array)
 */
export const verifyFormSchema = z.object({
  email: z.email('Invalid email format'),
  otp: z
    .array(z.string())
    .length(6, 'OTP must be 6 digits')
    .refine((arr) => arr.every((digit) => /^\d$/.test(digit)), 'OTP must contain only digits')
    .refine((arr) => arr.join('').length === 6, 'OTP must be 6 digits'),
});

/**
 * Verify OTP schema (for API - OTP is string)
 */
export const verifySchema = z.object({
  email: z.email('Invalid email format'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .refine((val) => /^\d{6}$/.test(val), 'OTP must be 6 digits'),
});

export type VerifyFormData = z.infer<typeof verifyFormSchema>;
export type VerifyRequestData = z.infer<typeof verifySchema>;

// Password validation helpers for real-time feedback
export const passwordValidators = {
  lowercase: (password: string) => /[a-z]/.test(password),
  uppercase: (password: string) => /[A-Z]/.test(password),
  digit: (password: string) => /[0-9]/.test(password),
  specialChar: (password: string) => /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
  length: (password: string) => password.length >= 8 && password.length <= 30,
};

