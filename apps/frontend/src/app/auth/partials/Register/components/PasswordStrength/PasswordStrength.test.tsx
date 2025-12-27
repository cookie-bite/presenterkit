import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test-utils';

import { PasswordStrength } from './PasswordStrength';

describe('PasswordStrength', () => {
  it('does not render when password is empty', () => {
    const { container } = render(<PasswordStrength password='' />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when password is provided', () => {
    render(<PasswordStrength password='test' />);

    // Should show all 5 requirements
    expect(screen.getByText('ab')).toBeInTheDocument();
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('@#')).toBeInTheDocument();
    expect(screen.getByText('8+')).toBeInTheDocument();
  });

  it('shows valid state for lowercase requirement when password has lowercase', () => {
    render(<PasswordStrength password='a' />);

    const lowercaseItem = screen.getByText('ab').closest('div');
    expect(lowercaseItem).toBeInTheDocument();
  });

  it('shows invalid state for lowercase requirement when password lacks lowercase', () => {
    render(<PasswordStrength password='A' />);

    const lowercaseItem = screen.getByText('ab').closest('div');
    expect(lowercaseItem).toBeInTheDocument();
    // Tooltip should be visible for invalid requirements
    expect(screen.getByText('Add lowercase letter')).toBeInTheDocument();
  });

  it('shows valid state for uppercase requirement when password has uppercase', () => {
    render(<PasswordStrength password='A' />);

    const uppercaseItem = screen.getByText('AB').closest('div');
    expect(uppercaseItem).toBeInTheDocument();
  });

  it('shows invalid state for uppercase requirement when password lacks uppercase', () => {
    render(<PasswordStrength password='a' />);

    expect(screen.getByText('Add uppercase letter')).toBeInTheDocument();
  });

  it('shows valid state for digit requirement when password has digit', () => {
    render(<PasswordStrength password='1' />);

    const digitItem = screen.getByText('12').closest('div');
    expect(digitItem).toBeInTheDocument();
  });

  it('shows invalid state for digit requirement when password lacks digit', () => {
    render(<PasswordStrength password='a' />);

    expect(screen.getByText('Add digit')).toBeInTheDocument();
  });

  it('shows valid state for special character requirement when password has special char', () => {
    render(<PasswordStrength password='!' />);

    const specialCharItem = screen.getByText('@#').closest('div');
    expect(specialCharItem).toBeInTheDocument();
  });

  it('shows invalid state for special character requirement when password lacks special char', () => {
    render(<PasswordStrength password='a' />);

    expect(screen.getByText('Add special character')).toBeInTheDocument();
  });

  it('shows valid state for length requirement when password is 8+ characters', () => {
    render(<PasswordStrength password='12345678' />);

    const lengthItem = screen.getByText('8+').closest('div');
    expect(lengthItem).toBeInTheDocument();
  });

  it('shows invalid state for length requirement when password is too short', () => {
    render(<PasswordStrength password='123' />);

    expect(screen.getByText(/Add minimum \d+ character/)).toBeInTheDocument();
  });

  it('updates validation state in real-time', () => {
    const { rerender } = render(<PasswordStrength password='a' />);

    // Initially missing uppercase, digit, special char, and length
    expect(screen.getByText('Add uppercase letter')).toBeInTheDocument();

    // Add uppercase
    rerender(<PasswordStrength password='aA' />);
    expect(screen.queryByText('Add uppercase letter')).not.toBeInTheDocument();

    // Add digit
    rerender(<PasswordStrength password='aA1' />);
    expect(screen.queryByText('Add digit')).not.toBeInTheDocument();

    // Add special char
    rerender(<PasswordStrength password='aA1!' />);
    expect(screen.queryByText('Add special character')).not.toBeInTheDocument();

    // Add length
    rerender(<PasswordStrength password='aA1!5678' />);
    expect(screen.queryByText(/Add minimum/)).not.toBeInTheDocument();
  });

  it('shows correct remaining characters in tooltip', () => {
    render(<PasswordStrength password='123' />);

    // Should show "Add minimum 5 characters"
    expect(screen.getByText('Add minimum 5 characters')).toBeInTheDocument();
  });

  it('shows singular form for 1 remaining character', () => {
    render(<PasswordStrength password='1234567' />);

    // Should show "Add minimum 1 character" (singular)
    expect(screen.getByText('Add minimum 1 character')).toBeInTheDocument();
  });
});
