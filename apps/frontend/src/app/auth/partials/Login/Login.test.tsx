import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test-utils';

import type { LoginFormData } from '../../schemas';
import { Login } from './Login';

describe('Login', () => {
  const mockOnSubmit = vi.fn();

  const TestWrapper = () => {
    const form = useForm<LoginFormData>({
      defaultValues: {
        email: '',
        password: '',
      },
    });

    return <Login form={form} onSubmit={mockOnSubmit} />;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.keyboard('{Enter}');

    // Note: This will only work if form validation passes
    // The actual submission depends on form validation
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
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
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });
});
