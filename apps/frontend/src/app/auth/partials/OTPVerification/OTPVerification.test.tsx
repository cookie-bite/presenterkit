import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { OTPVerification } from './OTPVerification';
import type { VerifyFormData } from '../../schemas';

describe('OTPVerification', () => {
  const mockOnSubmit = vi.fn();
  const testEmail = 'test@example.com';

  const TestWrapper = () => {
    const form = useForm<VerifyFormData>({
      defaultValues: {
        email: testEmail,
        otp: ['', '', '', '', '', ''],
      },
    });

    return (
      <OTPVerification
        form={form}
        onSubmit={mockOnSubmit}
        isPending={false}
        apiError=''
        email={testEmail}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders OTP input', () => {
    render(<TestWrapper />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('displays email address', () => {
    render(<TestWrapper />);

    expect(screen.getByText(/Please enter the code sent/)).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
  });

  it('displays verification code title', () => {
    render(<TestWrapper />);

    expect(screen.getByText('Verification Code')).toBeInTheDocument();
  });

  it('shows API error when provided', () => {
    const TestWrapperWithError = () => {
      const form = useForm<VerifyFormData>({
        defaultValues: {
          email: testEmail,
          otp: ['', '', '', '', '', ''],
        },
      });

      return (
        <OTPVerification
          form={form}
          onSubmit={mockOnSubmit}
          isPending={false}
          apiError='Invalid OTP code'
          email={testEmail}
        />
      );
    };

    render(<TestWrapperWithError />);

    expect(screen.getByText('Invalid OTP code')).toBeInTheDocument();
  });

  it('does not show error message when apiError is empty', () => {
    render(<TestWrapper />);

    // Error message wrapper should be empty or not visible
    const errorElements = screen.queryAllByText(/Invalid|Error/i);
    expect(errorElements.length).toBe(0);
  });

  it('renders verify button', () => {
    render(<TestWrapper />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeInTheDocument();
  });

  it('disables verify button when isPending is true', () => {
    const TestWrapperPending = () => {
      const form = useForm<VerifyFormData>({
        defaultValues: {
          email: testEmail,
          otp: ['', '', '', '', '', ''],
        },
      });

      return (
        <OTPVerification
          form={form}
          onSubmit={mockOnSubmit}
          isPending={true}
          apiError=''
          email={testEmail}
        />
      );
    };

    render(<TestWrapperPending />);

    // When loading, the button shows a spinner instead of text, so we find it by role and disabled state
    const buttons = screen.getAllByRole('button');
    const verifyButton = buttons.find(button => (button as HTMLButtonElement).disabled);
    expect(verifyButton).toBeDefined();
    expect(verifyButton).toBeDisabled();
  });

  it('enables verify button when isPending is false', () => {
    render(<TestWrapper />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).not.toBeDisabled();
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const TestWrapperWithOTP = () => {
      const form = useForm<VerifyFormData>({
        defaultValues: {
          email: testEmail,
          otp: ['1', '2', '3', '4', '5', '6'],
        },
      });

      return (
        <OTPVerification
          form={form}
          onSubmit={mockOnSubmit}
          isPending={false}
          apiError=''
          email={testEmail}
        />
      );
    };

    render(<TestWrapperWithOTP />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    // onSubmit should be called with the OTP data
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
