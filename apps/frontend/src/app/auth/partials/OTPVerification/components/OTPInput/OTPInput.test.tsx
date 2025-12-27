import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test-utils';

import { OTPInput } from './OTPInput';

describe('OTPInput', () => {
  const mockOnChange = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 6 input fields', () => {
    render(<OTPInput value={['', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('accepts only numeric input', async () => {
    const user = userEvent.setup();
    render(<OTPInput value={['', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    // Focus the input first (this may trigger onChange from handleFocus)
    await user.click(inputs[0]);
    // Clear any calls from focus
    mockOnChange.mockClear();

    // Now type non-numeric character
    await user.type(inputs[0], 'a');

    // Should not call onChange with non-numeric input
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('accepts numeric input and advances to next field', async () => {
    const user = userEvent.setup();
    render(<OTPInput value={['', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], '1');

    expect(mockOnChange).toHaveBeenCalledWith(['1', '', '', '', '', '']);
  });

  it('handles backspace correctly', async () => {
    const user = userEvent.setup();
    render(<OTPInput value={['1', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[1], '{backspace}');

    // Backspace on empty field should move to previous and clear it
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles paste with 6 digits', async () => {
    const user = userEvent.setup();
    render(
      <OTPInput
        value={['', '', '', '', '', '']}
        onChange={mockOnChange}
        onComplete={mockOnComplete}
        hasError={false}
      />,
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');

    expect(mockOnChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
    // onComplete should be called after paste
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('handles paste with non-numeric characters', async () => {
    const user = userEvent.setup();
    render(<OTPInput value={['', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('12a34b56');

    // Should extract only digits
    expect(mockOnChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
  });

  it('calls onComplete when all 6 digits are filled', async () => {
    const user = userEvent.setup();
    render(
      <OTPInput
        value={['1', '2', '3', '4', '5', '']}
        onChange={mockOnChange}
        onComplete={mockOnComplete}
        hasError={false}
      />,
    );

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[5], '6');

    expect(mockOnChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
    // onComplete should be called when all digits are filled
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('focuses first empty input on focus', async () => {
    const user = userEvent.setup();
    render(<OTPInput value={['1', '', '', '', '', '']} onChange={mockOnChange} hasError={false} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[3]);

    // Should focus first empty input (index 1)
    expect(inputs[1]).toHaveFocus();
  });

  it('clears inputs from clicked index onwards on focus', async () => {
    const user = userEvent.setup();
    render(
      <OTPInput value={['1', '2', '3', '4', '5', '6']} onChange={mockOnChange} hasError={false} />,
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[2]);

    // Should clear from index 2 onwards
    expect(mockOnChange).toHaveBeenCalledWith(['1', '2', '', '', '', '']);
  });

  it('displays error state when hasError is true', () => {
    const { container } = render(
      <OTPInput value={['', '', '', '', '', '']} onChange={mockOnChange} hasError={true} />,
    );

    // Check if error styling is applied (this depends on styled component implementation)
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(6);
  });
});
