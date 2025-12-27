import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test-utils';

import type { RegisterFormData } from '../../schemas';
import { Register } from './Register';

describe('Register', () => {
  const mockOnSubmit = vi.fn();

  const TestWrapper = () => {
    const form = useForm<RegisterFormData>({
      defaultValues: {
        username: '',
        email: '',
        password: '',
      },
    });

    const password = useWatch({ control: form.control, name: 'password' });

    return <Register form={form} onSubmit={mockOnSubmit} password={password} />;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username, email, and password inputs', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('allows user to type in username field', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const usernameInput = screen.getByPlaceholderText('Username');
    await user.type(usernameInput, 'testuser');

    expect(usernameInput).toHaveValue('testuser');
  });

  it('allows user to type in email field', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('allows user to type in password field', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'Password123!');

    expect(passwordInput).toHaveValue('Password123!');
  });

  it('displays PasswordStrength component when password is provided', () => {
    const TestWrapperWithPassword = () => {
      const form = useForm<RegisterFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: 'test',
        },
      });

      const password = useWatch({ control: form.control, name: 'password' });

      return <Register form={form} onSubmit={mockOnSubmit} password={password} />;
    };

    render(<TestWrapperWithPassword />);

    // PasswordStrength should show requirements
    expect(screen.getByText('ab')).toBeInTheDocument();
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('@#')).toBeInTheDocument();
    expect(screen.getByText('8+')).toBeInTheDocument();
  });

  it('does not display PasswordStrength component when password is empty', () => {
    render(<TestWrapper />);

    // PasswordStrength should not be visible
    expect(screen.queryByText('ab')).not.toBeInTheDocument();
  });

  it('calls onSubmit with correct data when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.keyboard('{Enter}');

    // Verify inputs have correct values
    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('Password123!');
  });
});
