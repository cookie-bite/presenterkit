import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { DefaultTheme } from 'styled-components';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isPending?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'text';
  spinnerColor?: string | ((theme: DefaultTheme) => string);
}
