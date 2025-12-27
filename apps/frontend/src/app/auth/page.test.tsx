import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test-utils';

import AuthPage from './page';

// Mock the auth hooks
const mockLoginMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockRegisterMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockVerifyMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockGoogleLoginMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock('@/lib/hooks/useAuth', () => ({
  useLogin: () => mockLoginMutation,
  useRegister: () => mockRegisterMutation,
  useVerify: () => mockVerifyMutation,
  useGoogleLogin: () => mockGoogleLoginMutation,
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginMutation.isPending = false;
    mockRegisterMutation.isPending = false;
    mockVerifyMutation.isPending = false;
    mockGoogleLoginMutation.isPending = false;
  });

  it('renders login form by default', () => {
    render(<AuthPage />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders segment switcher', () => {
    render(<AuthPage />);

    expect(screen.getByRole('tab', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('switches between SignIn and SignUp segments', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    // Initially shows login form
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();

    // Click Sign up segment
    const signUpSegment = screen.getByText('Sign up');
    await user.click(signUpSegment);

    // Should show register form
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    // Click Sign in segment
    const signInSegment = screen.getByText('Sign in');
    await user.click(signInSegment);

    // Should show login form again
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
    });
  });

  it('resets forms when switching segments', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    // Fill in login form
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'test@example.com');

    // Switch to register
    await user.click(screen.getByText('Sign up'));

    // Switch back to login
    await user.click(screen.getByText('Sign in'));

    // Form should be reset
    await waitFor(() => {
      const resetEmailInput = screen.getByPlaceholderText('Email');
      expect(resetEmailInput).toHaveValue('');
    });
  });

  it('handles login flow successfully', async () => {
    const user = userEvent.setup();
    mockLoginMutation.mutateAsync.mockResolvedValue({
      success: true,
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    render(<AuthPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles login flow with error', async () => {
    const user = userEvent.setup();
    mockLoginMutation.mutateAsync.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    render(<AuthPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles register flow and shows OTP UI', async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mutateAsync.mockResolvedValue({
      success: true,
      info: 'OTP sent',
    });

    render(<AuthPage />);

    // Switch to register
    await user.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      });
    });

    // Should show OTP verification UI
    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('handles register flow with error', async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mutateAsync.mockResolvedValue({
      success: false,
      error: 'Email already exists',
    });

    render(<AuthPage />);

    // Switch to register
    await user.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('handles OTP verification flow successfully', async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mutateAsync.mockResolvedValue({
      success: true,
      info: 'OTP sent',
    });
    mockVerifyMutation.mutateAsync.mockResolvedValue({
      success: true,
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    render(<AuthPage />);

    // Register first
    await user.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    // Wait for OTP UI
    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
    });

    // Fill OTP (simulated - actual OTP input would need more complex interaction)
    const otpInputs = screen.getAllByRole('textbox');
    for (let i = 0; i < 6; i++) {
      await user.type(otpInputs[i], String(i + 1));
    }

    // Submit OTP
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    await waitFor(() => {
      expect(mockVerifyMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('handles OTP verification with error', async () => {
    const user = userEvent.setup();
    mockRegisterMutation.mutateAsync.mockResolvedValue({
      success: true,
      info: 'OTP sent',
    });
    mockVerifyMutation.mutateAsync.mockResolvedValue({
      success: false,
      error: 'Invalid OTP code',
    });

    render(<AuthPage />);

    // Register first
    await user.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    // Wait for OTP UI
    await waitFor(() => {
      expect(screen.getByText('Verification Code')).toBeInTheDocument();
    });

    // Fill OTP
    const otpInputs = screen.getAllByRole('textbox');
    for (let i = 0; i < 6; i++) {
      await user.type(otpInputs[i], '0');
    }

    // Submit OTP
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid OTP code')).toBeInTheDocument();
    });
  });

  it('displays loading state during login', async () => {
    mockLoginMutation.isPending = true;

    render(<AuthPage />);

    // When loading, the button shows a spinner instead of text, so we find it by role and disabled state
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find(
      button => (button as HTMLButtonElement).disabled && button.getAttribute('role') !== 'tab',
    );
    expect(submitButton).toBeDefined();
    expect(submitButton).toBeDisabled();
  });

  it('displays loading state during registration', async () => {
    mockRegisterMutation.isPending = true;

    render(<AuthPage />);

    // Switch to register
    const signUpSegment = screen.getByRole('tab', { name: 'Sign up' });
    await userEvent.click(signUpSegment);

    await waitFor(() => {
      // When loading, the button shows a spinner instead of text, so we find it by role and disabled state
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(
        button => (button as HTMLButtonElement).disabled && button.getAttribute('role') !== 'tab',
      );
      expect(submitButton).toBeDefined();
      expect(submitButton).toBeDisabled();
    });
  });

  it('renders Google sign-in button', async () => {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';

    render(<AuthPage />);

    await waitFor(() => {
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });
  });

  it('clears error message when switching segments', async () => {
    const user = userEvent.setup();
    mockLoginMutation.mutateAsync.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    render(<AuthPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Switch to register
    await user.click(screen.getByText('Sign up'));

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });
});
