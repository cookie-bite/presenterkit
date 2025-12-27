'use client';

import { useEffect, useRef } from 'react';

import { OTPContainer, OTPInput as StyledOTPInput } from './styled';

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (value: string[]) => void;
  hasError?: boolean;
}

export function OTPInput({ value, onChange, onComplete, hasError }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const otpValue = value || new Array(6).fill('');

  const handleFocus = (index: number) => {
    // Find the first empty index before the clicked index
    const firstEmptyIndex = otpValue.findIndex(val => !val);

    if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
      // Focus the first empty input
      setTimeout(() => {
        inputRefs.current[firstEmptyIndex]?.focus();
      }, 0);
      return;
    }

    // Clear all inputs from the clicked index onwards
    const newValue = [...otpValue];
    for (let i = index; i < 6; i++) {
      newValue[i] = '';
    }
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Extract only digits from pasted text
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newValue = new Array(6).fill('');
      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newValue[i] = digits[i];
      }
      onChange(newValue);

      // If all 6 digits are filled, trigger completion and blur all inputs
      if (digits.length === 6 && newValue.every(val => val !== '')) {
        setTimeout(() => {
          // Blur all inputs
          inputRefs.current.forEach(ref => ref?.blur());
          onComplete?.(newValue);
        }, 0);
      } else {
        // Focus the next empty input or the last one
        const nextEmptyIndex = newValue.findIndex(val => !val);
        const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
        setTimeout(() => {
          inputRefs.current[focusIndex]?.focus();
        }, 0);
      }
    }
  };

  const handleChange = (index: number, text: string) => {
    // Handle single character input
    if (text && /^\d$/.test(text)) {
      const newValue = [...otpValue];
      newValue[index] = text;
      onChange(newValue);

      // Check if all 6 digits are filled
      const isComplete = newValue.every(val => val !== '') && newValue.length === 6;

      if (isComplete) {
        // All digits filled - blur all inputs and trigger completion
        setTimeout(() => {
          inputRefs.current.forEach(ref => ref?.blur());
          onComplete?.(newValue);
        }, 0);
      } else if (index < 5) {
        // Move to next input if not the last one
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    } else if (text === '') {
      // Handle backspace: clear current input
      const newValue = [...otpValue];
      newValue[index] = '';
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const newValue = [...otpValue];
      newValue[index - 1] = '';
      onChange(newValue);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 0);
    }
  };

  return (
    <OTPContainer>
      {Array.from({ length: 6 }).map((_, i) => (
        <StyledOTPInput
          key={i}
          ref={el => {
            inputRefs.current[i] = el;
          }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={otpValue[i] || ''}
          $hasError={hasError}
          onFocus={() => handleFocus(i)}
          onChange={e => handleChange(i, e.target.value)}
          onPaste={handlePaste}
          onKeyDown={e => handleKeyDown(e, i)}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </OTPContainer>
  );
}
