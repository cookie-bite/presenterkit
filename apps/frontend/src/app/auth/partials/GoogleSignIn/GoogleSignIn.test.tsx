import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';

import { GoogleSignIn } from './GoogleSignIn';

// Mock useGoogleLogin hook
const mockMutateAsync = vi.fn();
const mockUseGoogleLogin = vi.fn(() => ({
  mutateAsync: mockMutateAsync,
  isPending: false,
}));

vi.mock('@/lib/hooks/useAuth', () => ({
  useGoogleLogin: () => mockUseGoogleLogin(),
}));

describe('GoogleSignIn', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.google
    delete (window as any).google;
    // Reset environment variable
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';
  });

  it('does not render when Google client ID is not available', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const { container } = render(<GoogleSignIn onError={mockOnError} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders button when Google client ID is available', async () => {
    render(<GoogleSignIn onError={mockOnError} label='Continue with Google' />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toBeInTheDocument();
    });
  });

  it('displays custom label', async () => {
    render(<GoogleSignIn onError={mockOnError} label='Sign in with Google' />);

    await waitFor(() => {
      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });
  });

  it('displays default label when not provided', async () => {
    render(<GoogleSignIn onError={mockOnError} />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('displays Google logo', async () => {
    render(<GoogleSignIn onError={mockOnError} />);

    await waitFor(() => {
      const logo = screen.getByAltText('Google');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/logo-google.svg');
    });
  });

  it('is disabled when Google script is not loaded', () => {
    render(<GoogleSignIn onError={mockOnError} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('becomes enabled when Google script is loaded', async () => {
    // Mock window.google
    (window as any).google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
        },
      },
    };

    render(<GoogleSignIn onError={mockOnError} />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  it('is disabled when mutation is pending', async () => {
    mockUseGoogleLogin.mockReturnValueOnce({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    (window as any).google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
        },
      },
    };

    render(<GoogleSignIn onError={mockOnError} />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  it('initializes Google Sign-In on button click', async () => {
    const mockInitialize = vi.fn();
    const mockRenderButton = vi.fn();

    (window as any).google = {
      accounts: {
        id: {
          initialize: mockInitialize,
          renderButton: mockRenderButton,
        },
      },
    };

    const user = userEvent.setup();
    render(<GoogleSignIn onError={mockOnError} />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'test-client-id',
          callback: expect.any(Function),
        }),
      );
    });
  });
});
