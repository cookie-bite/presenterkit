'use client';

import { AnimatePresence } from 'framer-motion';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { PasswordStrength } from './components/PasswordStrength';
import type { RegisterFormData } from '../../schemas';
import { Input } from '@/ui';
import { Inputs } from './styled';

interface RegisterProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  password: string;
}

export function Register({ form, onSubmit, password }: RegisterProps) {
  const passwordError = form.formState.errors.password;
  const usernameError = form.formState.errors.username;

  return (
    <Inputs>
      <Controller
        control={form.control}
        name='username'
        render={({ field }) => (
          <Input {...field} placeholder='Username' type='text' hasError={!!usernameError} />
        )}
      />

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

      {password && (
        <AnimatePresence>
          <PasswordStrength password={password} />
        </AnimatePresence>
      )}
    </Inputs>
  );
}
