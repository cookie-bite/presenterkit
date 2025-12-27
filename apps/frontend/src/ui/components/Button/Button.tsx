'use client';

import { Spinner, StyledButton } from './Button.styled';
import type { ButtonProps } from './Button.types';

export function Button({ children, isPending, disabled, spinnerColor, ...props }: ButtonProps) {
  return (
    <StyledButton {...props} disabled={disabled || isPending}>
      {isPending ? <Spinner aria-hidden='true' $spinnerColor={spinnerColor} /> : children}
    </StyledButton>
  );
}
