'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';

import { OTPInput } from './components/OTPInput';
import type { VerifyFormData } from '../../schemas';
import { Button, ErrorMessage } from '@/ui';
import {
  ErrorMessageWrapper,
  OTP,
  OTPHeader,
  OTPHeaderTitle,
  OTPHeaderSubtitle,
  OTPHeaderEmail,
} from './styled';

interface OTPVerificationProps {
  form: UseFormReturn<VerifyFormData>;
  onSubmit: (data: VerifyFormData) => void;
  isPending: boolean;
  apiError: string;
  email: string;
}

export function OTPVerification({
  form,
  onSubmit,
  isPending,
  apiError,
  email,
}: OTPVerificationProps) {
  return (
    <OTP>
      <OTPHeader>
        <OTPHeaderTitle>Verification Code</OTPHeaderTitle>
        <OTPHeaderSubtitle>
          Please enter the code sent
          <br />
          to <OTPHeaderEmail>{email}</OTPHeaderEmail>
        </OTPHeaderSubtitle>
      </OTPHeader>

      {apiError && (
        <ErrorMessageWrapper>
          <ErrorMessage>{apiError}</ErrorMessage>
        </ErrorMessageWrapper>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Controller
          control={form.control}
          name='otp'
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              onComplete={(value) => {
                field.onChange(value);
                // Auto-submit when complete
                setTimeout(() => {
                  form.handleSubmit(onSubmit)();
                }, 100);
              }}
              hasError={!!form.formState.errors.otp}
            />
          )}
        />

        <Button type='submit' disabled={isPending} isPending={isPending}>
          Verify
        </Button>
      </form>
    </OTP>
  );
}

