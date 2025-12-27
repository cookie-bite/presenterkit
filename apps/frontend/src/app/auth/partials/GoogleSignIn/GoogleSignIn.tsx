'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useRef, useState } from 'react';

import { useGoogleLogin } from '@/lib/hooks/useAuth';

import { GoogleButton } from './styled';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, config: object) => void;
        };
      };
    };
  }
}

interface GoogleSignInProps {
  onError?: (error: string) => void;
  label?: string;
}

export function GoogleSignIn({ onError, label }: GoogleSignInProps) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  const googleLoginMutation = useGoogleLogin();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSignIn = async (credential: string) => {
    try {
      const result = await googleLoginMutation.mutateAsync({ idToken: credential });
      if (!result.success) {
        onError?.((result as { error: string }).error);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleClick = () => {
    if (!isGoogleLoaded || !window.google || !googleClientId) return;

    if (!isInitialized) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: response => handleGoogleSignIn(response.credential),
        });

        if (hiddenButtonRef.current) {
          window.google.accounts.id.renderButton(hiddenButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: 300,
          });
        }

        setIsInitialized(true);
        setTimeout(() => {
          hiddenButtonRef.current?.querySelector<HTMLElement>('div[role="button"]')?.click();
        }, 100);
      } catch (error) {
        console.warn('Google Sign-In initialization warning:', error);
      }
    } else {
      hiddenButtonRef.current?.querySelector<HTMLElement>('div[role="button"]')?.click();
    }
  };

  if (!googleClientId) return null;

  return (
    <>
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='lazyOnload'
        onLoad={() => setIsGoogleLoaded(true)}
      />
      <div
        ref={hiddenButtonRef}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
        aria-hidden='true'
      />
      <GoogleButton
        type='button'
        onClick={handleClick}
        disabled={!isGoogleLoaded}
        isPending={googleLoginMutation.isPending}
      >
        <Image src='/images/logo-google.svg' alt='Google' width={16} height={16} />
        {label}
      </GoogleButton>
    </>
  );
}
