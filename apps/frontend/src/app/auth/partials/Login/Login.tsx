'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';

import type { LoginFormData } from '../../schemas';
import { Input } from '@/ui';
import { Inputs } from './styled';

interface LoginProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
}

export function Login({ form, onSubmit }: LoginProps) {
  const passwordError = form.formState.errors.password;

  return (
    <Inputs>
      <Controller
        control={form.control}
        name='email'
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Email'
            type='email'
            hasError={!!form.formState.errors.email}
          />
        )}
      />

      <Controller
        control={form.control}
        name='password'
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Password'
            type='password'
            hasError={!!passwordError}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.code === 'Enter') {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          />
        )}
      />
    </Inputs>
  );
}

