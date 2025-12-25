import { describe, it, expect } from 'vitest';

import {
  loginSchema,
  registerSchema,
  verifyFormSchema,
  verifySchema,
  passwordValidators,
  type LoginFormData,
  type RegisterFormData,
  type VerifyFormData,
} from './schemas';

describe('loginSchema', () => {
  it('validates correct email and password', () => {
    const validData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };
    expect(() => loginSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    };
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });

  it('rejects empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    };
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });

  it('rejects missing password', () => {
    const invalidData = {
      email: 'test@example.com',
    };
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });
});

describe('registerSchema', () => {
  it('validates correct registration data', () => {
    const validData: RegisterFormData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };
    expect(() => registerSchema.parse(validData)).not.toThrow();
  });

  it('rejects username shorter than 3 characters', () => {
    const invalidData = {
      username: 'ab',
      email: 'test@example.com',
      password: 'Password123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects username longer than 30 characters', () => {
    const invalidData = {
      username: 'a'.repeat(31),
      email: 'test@example.com',
      password: 'Password123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      username: 'testuser',
      email: 'not-an-email',
      password: 'Password123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password shorter than 8 characters', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Pass1!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password longer than 30 characters', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'P'.repeat(31) + 'ass123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password without lowercase letter', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'PASSWORD123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password without uppercase letter', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password without digit', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password!',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });

  it('rejects password without special character', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    };
    expect(() => registerSchema.parse(invalidData)).toThrow();
  });
});

describe('verifyFormSchema', () => {
  it('validates correct OTP array', () => {
    const validData: VerifyFormData = {
      email: 'test@example.com',
      otp: ['1', '2', '3', '4', '5', '6'],
    };
    expect(() => verifyFormSchema.parse(validData)).not.toThrow();
  });

  it('rejects OTP array with wrong length', () => {
    const invalidData = {
      email: 'test@example.com',
      otp: ['1', '2', '3', '4', '5'],
    };
    expect(() => verifyFormSchema.parse(invalidData)).toThrow();
  });

  it('rejects OTP array with non-numeric characters', () => {
    const invalidData = {
      email: 'test@example.com',
      otp: ['1', '2', '3', '4', '5', 'a'],
    };
    expect(() => verifyFormSchema.parse(invalidData)).toThrow();
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      otp: ['1', '2', '3', '4', '5', '6'],
    };
    expect(() => verifyFormSchema.parse(invalidData)).toThrow();
  });
});

describe('verifySchema', () => {
  it('validates correct OTP string', () => {
    const validData = {
      email: 'test@example.com',
      otp: '123456',
    };
    expect(() => verifySchema.parse(validData)).not.toThrow();
  });

  it('rejects OTP string with wrong length', () => {
    const invalidData = {
      email: 'test@example.com',
      otp: '12345',
    };
    expect(() => verifySchema.parse(invalidData)).toThrow();
  });

  it('rejects OTP string with non-numeric characters', () => {
    const invalidData = {
      email: 'test@example.com',
      otp: '12345a',
    };
    expect(() => verifySchema.parse(invalidData)).toThrow();
  });
});

describe('passwordValidators', () => {
  const validPassword = 'Password123!';

  it('validates lowercase letter', () => {
    expect(passwordValidators.lowercase(validPassword)).toBe(true);
    expect(passwordValidators.lowercase('PASSWORD123!')).toBe(false);
  });

  it('validates uppercase letter', () => {
    expect(passwordValidators.uppercase(validPassword)).toBe(true);
    expect(passwordValidators.uppercase('password123!')).toBe(false);
  });

  it('validates digit', () => {
    expect(passwordValidators.digit(validPassword)).toBe(true);
    expect(passwordValidators.digit('Password!')).toBe(false);
  });

  it('validates special character', () => {
    expect(passwordValidators.specialChar(validPassword)).toBe(true);
    expect(passwordValidators.specialChar('Password123')).toBe(false);
  });

  it('validates length', () => {
    expect(passwordValidators.length(validPassword)).toBe(true);
    expect(passwordValidators.length('Pass1!')).toBe(false); // Too short
    expect(passwordValidators.length('P'.repeat(31) + 'ass123!')).toBe(false); // Too long
    expect(passwordValidators.length('Password123!')).toBe(true); // Valid length
  });
});
