import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'hasError'> {
  hasError?: boolean;
  showErrorIcon?: boolean;
}

