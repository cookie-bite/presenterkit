'use client';

import { Spinner, StyledButton } from './Button.styled';
import type { ButtonProps } from './Button.types';

export function Button({ children, isPending, disabled, ...props }: ButtonProps) {
  return (
    <StyledButton {...props} disabled={disabled || isPending}>
      {isPending ? <Spinner aria-hidden="true" /> : children}
    </StyledButton>
  );
}

