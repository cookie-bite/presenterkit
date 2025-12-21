'use client';

import { Icon } from '../Icon';
import { InputContainer, InputField, InputIcon } from './Input.styled';
import type { InputProps } from './Input.types';

export function Input({ hasError, showErrorIcon = true, style, ...props }: InputProps) {
  const paddingRight = hasError && showErrorIcon ? 30 : 10;

  return (
    <InputContainer>
      <InputField
        {...props}
        $hasError={hasError}
        style={{
          ...style,
          paddingRight,
        }}
      />
      {hasError && showErrorIcon && (
        <InputIcon>
          <Icon name='alert-circle-outline' size={20} color='accent.red' />
        </InputIcon>
      )}
    </InputContainer>
  );
}

