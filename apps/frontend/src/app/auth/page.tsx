'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useLogin, useRegister, useVerify } from '@/lib/hooks/useAuth';
import { ErrorMessage, Segment } from '@/ui';

import { Banner } from './partials/Banner';
import { GoogleSignIn } from './partials/GoogleSignIn';
import { Login } from './partials/Login';
import { OTPVerification } from './partials/OTPVerification';
import { Register } from './partials/Register';
import {
  type LoginFormData,
  loginSchema,
  type RegisterFormData,
  registerSchema,
  type VerifyFormData,
  verifyFormSchema,
} from './schemas';
import {
  Card,
  Container,
  Divider,
  ErrorMessageWrapper,
  Form,
  Logo,
  LogoImage,
  LogoTitle,
  SubmitButton,
} from './styled';

export default function AuthPage() {
  const [activeSegment, setActiveSegment] = useState<'SignIn' | 'SignUp'>('SignIn');
  const [showOTPUI, setShowOTPUI] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailForOTP, setEmailForOTP] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyMutation = useVerify();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      email: emailForOTP,
      otp: new Array(6).fill(''),
    },
  });

  const handleSegmentChange = (value: string) => {
    if (value === 'SignIn' || value === 'SignUp') {
      setActiveSegment(value);
      setApiError('');
      // Reset forms when switching
      loginForm.reset();
      registerForm.reset();
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setApiError('');
    try {
      const result = await loginMutation.mutateAsync(data);
      if (!result.success) {
        setApiError((result as { error: string }).error);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setApiError('');
    try {
      const result = await registerMutation.mutateAsync(data);
      console.log('result', result);
      if (result.success) {
        setEmailForOTP(data.email);
        verifyForm.setValue('email', data.email);
        setShowOTPUI(true);
        setApiError('');
      } else {
        setApiError((result as { error: string }).error);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleVerify = async (data: VerifyFormData) => {
    setApiError('');
    try {
      const otpString = Array.isArray(data.otp) ? data.otp.join('') : data.otp;
      const result = await verifyMutation.mutateAsync({
        email: data.email,
        otp: otpString,
      });
      if (!result.success) {
        setApiError((result as { error: string }).error);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const password = useWatch({ control: registerForm.control, name: 'password' });
  const isSignIn = activeSegment === 'SignIn';
  const actionLabel = isSignIn ? 'Sign in' : 'Sign up';
  const handleSubmitAction = isSignIn
    ? loginForm.handleSubmit(handleLogin)
    : registerForm.handleSubmit(handleRegister);
  const isAuthPending = isSignIn ? loginMutation.isPending : registerMutation.isPending;

  return (
    <Container>
      <Card>
        <Form>
          <Logo>
            <LogoImage src='/images/logo.svg' alt='logo' />
            <LogoTitle>PresenterKit</LogoTitle>
          </Logo>

          {showOTPUI ? (
            <OTPVerification
              form={verifyForm}
              onSubmit={handleVerify}
              isPending={verifyMutation.isPending || loginMutation.isPending}
              apiError={apiError}
              email={emailForOTP}
            />
          ) : (
            <>
              <Segment
                segments={['SignIn', 'SignUp']}
                labels={['Sign in', 'Sign up']}
                value={activeSegment}
                onChange={handleSegmentChange}
              />

              <ErrorMessageWrapper>
                <ErrorMessage>{apiError}</ErrorMessage>
              </ErrorMessageWrapper>

              {isSignIn ? (
                <Login form={loginForm} onSubmit={handleLogin} />
              ) : (
                <Register form={registerForm} onSubmit={handleRegister} password={password} />
              )}

              <SubmitButton
                onClick={handleSubmitAction}
                disabled={isAuthPending}
                isPending={isAuthPending}
              >
                {actionLabel}
              </SubmitButton>

              <Divider>or</Divider>

              <GoogleSignIn onError={setApiError} label='Continue with Google' />
            </>
          )}
        </Form>
        <Banner />
      </Card>
    </Container>
  );
}
